import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config/env';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowed = [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'production' ? 150 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas solicitudes',
    message: 'Espera un ratito e intenta de nuevo.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos',
    message: 'Espera un ratito e intenta de nuevo. Protegemos tu cuenta.',
  },
});

export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: 'Límite de emails',
    message: 'Ya enviaste varias alertas. Espera un rato antes de enviar otra.',
  },
});

export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/</g, '<').replace(/>/g, '>').trim();
      }
    }
  }
  next();
}

export function blockBadMethods(req: Request, res: Response, next: NextFunction): void {
  const allowed = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
  if (!allowed.includes(req.method)) {
    res.status(405).json({
      error: 'Método no permitido',
      message: `El método ${req.method} no está permitido`,
    });
    return;
  }
  next();
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
}
