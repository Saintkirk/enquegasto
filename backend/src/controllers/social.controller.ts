import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { env } from '../config/env';
import type { SocialAuthResult } from '../config/passport';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

function handleSocialSuccess(req: Request, res: Response): void {
  const result = req.user as SocialAuthResult | undefined;

  if (!result || !result.user || !result.tokens) {
    res.redirect(
      `${env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('No se pudo completar el inicio de sesión')}`
    );
    return;
  }

  res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);

  const params = new URLSearchParams({
    accessToken: result.tokens.accessToken,
    isNewUser: String(result.isNewUser),
  });

  res.redirect(`${env.FRONTEND_URL}/auth/callback?${params.toString()}`);
}

function handleSocialError(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error en social login:', err.message);
  const message = encodeURIComponent(
    err.message.includes('correo')
      ? err.message
      : 'No se pudo iniciar sesión con el proveedor. Intenta de nuevo.'
  );
  res.redirect(`${env.FRONTEND_URL}/auth/error?message=${message}`);
}

export function googleAuth(req: Request, res: Response, next: NextFunction): void {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    res.redirect(
      `${env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Google OAuth no está configurado en el servidor')}`
    );
    return;
  }
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })(req, res, next);
}

export function googleCallback(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('No se pudo autenticar con Google')}`,
  })(req, res, (err: unknown) => {
    if (err) return handleSocialError(err as Error, req, res, next);
    handleSocialSuccess(req, res);
  });
}

export function appleAuth(req: Request, res: Response, next: NextFunction): void {
  if (!env.APPLE_CLIENT_ID) {
    res.redirect(
      `${env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Apple Sign In no está configurado en el servidor')}`
    );
    return;
  }
  passport.authenticate('apple', { session: false, scope: ['name', 'email'] })(req, res, next);
}

export function appleCallback(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('apple', {
    session: false,
    failureRedirect: `${env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('No se pudo autenticar con Apple')}`,
  })(req, res, (err: unknown) => {
    if (err) return handleSocialError(err as Error, req, res, next);
    handleSocialSuccess(req, res);
  });
}
