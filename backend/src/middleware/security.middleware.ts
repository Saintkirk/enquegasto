import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config/env';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  // Evita romper redirecciones OAuth
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
});

function buildAllowedOrigins(): string[] {
  const list = new Set<string>([
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ]);
  if (env.CORS_ORIGINS) {
    env.CORS_ORIGINS.split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((o) => list.add(o));
  }
  return [...list].filter(Boolean);
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Requests sin Origin (mobile apps, curl, same-origin)
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowed = buildAllowedOrigins();

    if (allowed.includes(origin)) {
      callback(null, true);
      return;
    }

    // Previews de Vercel: https://xxx.vercel.app
    try {
      const host = new URL(origin).hostname;
      if (host.endsWith('.vercel.app') || host === 'vercel.app') {
        callback(null, true);
        return;
      }
    } catch {
      // ignore
    }

    console.warn('CORS bloqueado para origin:', origin, '| permitidos:', allowed);
    callback(new Error('No permitido por CORS'));
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
  max: 30,
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
        req.body[key] = req.body[key].replace(/[<>]/g, '').trim();
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
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
}
