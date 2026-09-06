import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { hashPassword, comparePassword } from '../utils/password';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema';
import type { UserPublic } from '../types/user';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function toPublicUser(user: {
  id: string;
  email: string;
  name: string | null;
  provider: string;
  avatarUrl: string | null;
  liquidSalary: number | null;
  currency: string;
  locale: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}): UserPublic {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider,
    avatarUrl: user.avatarUrl,
    liquidSalary: user.liquidSalary,
    currency: user.currency,
    locale: user.locale,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export function generateTokens(userId: string, email: string): TokenPair {
  const accessToken = jwt.sign(
    { sub: userId, email, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  const refreshToken = jwt.sign(
    { sub: userId, email, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): { sub: string; email: string } {
  const payload = jwt.verify(token, env.JWT_SECRET) as {
    sub: string;
    email: string;
    type: string;
  };
  if (payload.type !== 'access') throw new Error('Token inválido');
  return { sub: payload.sub, email: payload.email };
}

export function verifyRefreshToken(token: string): { sub: string; email: string } {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as {
    sub: string;
    email: string;
    type: string;
  };
  if (payload.type !== 'refresh') throw new Error('Refresh token inválido');
  return { sub: payload.sub, email: payload.email };
}

export async function registerUser(
  data: RegisterInput
): Promise<{ user: UserPublic; tokens: TokenPair }> {
  const email = data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Ya existe una cuenta con ese correo');
  }

  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: data.name?.trim() || null,
      provider: 'local',
      liquidSalary: data.liquidSalary ?? null,
      currency: 'CLP',
      locale: 'es-CL',
      lastLoginAt: new Date(),
    },
  });

  const tokens = generateTokens(user.id, user.email);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return { user: toPublicUser(user), tokens };
}

export async function loginUser(
  data: LoginInput
): Promise<{ user: UserPublic; tokens: TokenPair }> {
  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });

  if (!user || !user.password) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const isValid = await comparePassword(data.password, user.password);
  if (!isValid) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const tokens = generateTokens(user.id, user.email);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: tokens.refreshToken,
      lastLoginAt: new Date(),
    },
  });

  return { user: toPublicUser(user), tokens };
}

export async function refreshTokens(
  refreshToken: string
): Promise<{ user: UserPublic; tokens: TokenPair }> {
  let payload: { sub: string; email: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error('Refresh token inválido o expirado');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('Refresh token inválido o revocado');
  }

  const tokens = generateTokens(user.id, user.email);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: tokens.refreshToken,
      lastLoginAt: new Date(),
    },
  });

  return { user: toPublicUser(user), tokens };
}

export async function logoutUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}

export async function getUserById(userId: string): Promise<UserPublic | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return toPublicUser(user);
}
