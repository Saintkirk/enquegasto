import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  me,
} from '../controllers/auth.controller';
import {
  googleAuth,
  googleCallback,
  appleAuth,
  appleCallback,
} from '../controllers/social.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { authLimiter } from '../middleware/security.middleware';
import { registerSchema, loginSchema, refreshSchema } from '../schemas/auth.schema';
import { env, isGoogleConfigured } from '../config/env';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema, 'body'), register);
router.post('/login', authLimiter, validate(loginSchema, 'body'), login);
router.post('/refresh', validate(refreshSchema, 'body'), refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

/** Diagnóstico OAuth (sin secretos) — útil en Render */
router.get('/oauth-status', (_req, res) => {
  res.json({
    google: isGoogleConfigured(),
    apple: Boolean(env.APPLE_CLIENT_ID && env.APPLE_TEAM_ID && env.APPLE_KEY_ID),
    frontendUrl: env.FRONTEND_URL,
    googleCallbackUrl: env.GOOGLE_CALLBACK_URL,
    nodeEnv: env.NODE_ENV,
  });
});

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/apple', appleAuth);
router.post('/apple/callback', appleCallback);

export default router;
