import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, getUserById } from '../services/auth.service';

// EXTENSIÓN DE INTERFACES GLOBAL: Integración limpia con los tipos nativos de Express y Passport
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name?: string;
    }
    interface Request {
      userId?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'No autorizado',
        message: 'Debes iniciar sesión para acceder a este recurso',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No autorizado', message: 'Token no proporcionado' });
      return;
    }

    const payload = verifyAccessToken(token);
    const user = await getUserById(payload.sub);

    if (!user) {
      res.status(401).json({ error: 'No autorizado', message: 'Usuario no encontrado' });
      return;
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'TokenExpiredError'
        ? 'Tu sesión expiró. Vuelve a iniciar sesión.'
        : 'Token inválido o expirado';
    res.status(401).json({ error: 'No autorizado', message });
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const payload = verifyAccessToken(token);
        const user = await getUserById(payload.sub);
        if (user) {
          req.user = user;
          req.userId = user.id;
        }
      }
    }
  } catch {
    // ignore
  }
  next();
}
