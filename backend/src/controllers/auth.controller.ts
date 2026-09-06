import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getUserById,
} from '../services/auth.service';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body as RegisterInput;
    const result = await registerUser(data);
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
    res.status(201).json({
      message: '¡Cuenta creada con éxito! Bienvenido/a a EnQuéGasto 🎉',
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar';
    if (message.includes('Ya existe')) {
      res.status(409).json({
        error: 'Correo ya registrado',
        message: 'Ya existe una cuenta con este correo. ¿Quieres iniciar sesión?',
      });
      return;
    }
    console.error('Error en register:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'No pudimos crear tu cuenta. Intenta de nuevo más tarde.',
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body as LoginInput;
    const result = await loginUser(data);
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
    res.json({
      message: '¡Bienvenido/a de vuelta! 👋',
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
    if (message.includes('incorrectos')) {
      res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Correo o contraseña incorrectos',
      });
      return;
    }
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'No pudimos iniciar sesión. Intenta de nuevo.',
    });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const token =
      (req.body as { refreshToken?: string })?.refreshToken ||
      (req.cookies as { refreshToken?: string })?.refreshToken;

    if (!token) {
      res.status(401).json({
        error: 'No autorizado',
        message: 'No hay refresh token',
      });
      return;
    }

    const result = await refreshTokens(token);
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
    res.json({
      accessToken: result.tokens.accessToken,
      user: result.user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al refrescar';
    res.status(401).json({ error: 'No autorizado', message });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    if (req.userId) {
      await logoutUser(req.userId);
    }
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ message: 'Sesión cerrada' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ message: 'Sesión cerrada' });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'No autorizado', message: 'Debes iniciar sesión' });
      return;
    }
    const user = await getUserById(req.userId);
    if (!user) {
      res.status(401).json({ error: 'No autorizado', message: 'Usuario no encontrado' });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error('Error en me:', error);
    res.status(500).json({ error: 'Error interno', message: 'No pudimos cargar tu perfil' });
  }
}
