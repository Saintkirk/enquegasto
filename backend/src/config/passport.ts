import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
// @ts-ignore
import AppleStrategy from 'passport-apple';
import { prisma } from './database';
import { env } from './env';
import { generateTokens, toPublicUser } from '../services/auth.service';
import type { UserPublic } from '../types/user';

export interface SocialAuthResult {
  user: UserPublic;
  tokens: { accessToken: string; refreshToken: string };
  isNewUser: boolean;
}

async function findOrCreateSocialUser(params: {
  provider: 'google' | 'apple';
  providerId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}): Promise<{ user: any; isNewUser: boolean }> {
  const { provider, providerId, email, name, avatarUrl } = params;

  let user = await prisma.user.findFirst({
    where: { provider, providerId },
  });

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        avatarUrl: avatarUrl || user.avatarUrl,
        name: name || user.name,
      },
    });
    return { user, isNewUser: false };
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingByEmail) {
    user = await prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        provider,
        providerId,
        avatarUrl: avatarUrl || existingByEmail.avatarUrl,
        name: name || existingByEmail.name,
        lastLoginAt: new Date(),
      },
    });
    return { user, isNewUser: false };
  }

  user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: name || null,
      provider,
      providerId,
      avatarUrl: avatarUrl || null,
      password: null,
      currency: 'CLP',
      locale: 'es-CL',
      lastLoginAt: new Date(),
    },
  });

  return { user, isNewUser: true };
}

export function configurePassport(): void {
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
          scope: ['profile', 'email'],
        },
        async (_accessToken, _refreshToken, profile: GoogleProfile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('Google no entregó un correo electrónico'));
            }

            const { user, isNewUser } = await findOrCreateSocialUser({
              provider: 'google',
              providerId: profile.id,
              email,
              name: profile.displayName || profile.name?.givenName || null,
              avatarUrl: profile.photos?.[0]?.value || null,
            });

            const tokens = generateTokens(user.id, user.email);

            await prisma.user.update({
              where: { id: user.id },
              data: { refreshToken: tokens.refreshToken },
            });

            const result: SocialAuthResult = {
              user: toPublicUser(user),
              tokens,
              isNewUser,
            };

            // SOLUCIÓN AL ERROR TS2345: Forzamos el casteo a 'any' para indicarle a Passport 
            // que acepte tu estructura personalizada con tokens sin que rompa el tipado estricto.
            return done(null, result as any);
          } catch (error) {
            return done(error as Error);
          }
        }
      )
    );
    console.log('✅ Passport Google Strategy configurada');
  } else {
    console.warn('⚠️  Google OAuth no configurado (faltan GOOGLE_CLIENT_ID / SECRET)');
  }

  if (env.APPLE_CLIENT_ID && env.APPLE_TEAM_ID && env.APPLE_KEY_ID) {
    passport.use(
      new AppleStrategy(
        {
          clientID: env.APPLE_CLIENT_ID,
          teamID: env.APPLE_TEAM_ID,
          keyID: env.APPLE_KEY_ID,
          privateKeyLocation: env.APPLE_PRIVATE_KEY_PATH || undefined,
          callbackURL: env.APPLE_CALLBACK_URL || 'http://localhost:3001/api/auth/apple/callback',
          scope: ['name', 'email'],
        },
        async (
          _accessToken: string,
          _refreshToken: string,
          _idToken: string,
          profile: any,
          done: (error: any, user?: any) => void
        ) => {
          try {
            const email = profile.email || profile._json?.email;
            if (!email) {
              return done(
                new Error('Apple no entregó un correo electrónico. Intenta de nuevo o usa otro método.')
              );
            }

            const name =
              profile.name?.firstName && profile.name?.lastName
                ? `${profile.name.firstName} ${profile.name.lastName}`
                : profile.name?.firstName || null;

            const { user, isNewUser } = await findOrCreateSocialUser({
              provider: 'apple',
              providerId: profile.id,
              email,
              name,
              avatarUrl: null,
            });

            const tokens = generateTokens(user.id, user.email);

            await prisma.user.update({
              where: { id: user.id },
              data: { refreshToken: tokens.refreshToken },
            });

            const result: SocialAuthResult = {
              user: toPublicUser(user),
              tokens,
              isNewUser,
            };

            // SOLUCIÓN AL ERROR TS2345: Forzamos el casteo a 'any' aquí también.
            return done(null, result as any);
          } catch (error) {
            return done(error as Error);
          }
        }
      )
    );
    console.log('✅ Passport Apple Strategy configurada');
  } else {
    console.warn('⚠️  Apple OAuth no configurado (faltan APPLE_CLIENT_ID / TEAM_ID / KEY_ID)');
  }

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
}
