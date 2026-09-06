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

const router = Router();

router.post('/register', authLimiter, validate(registerSchema, 'body'), register);
router.post('/login', authLimiter, validate(loginSchema, 'body'), login);
router.post('/refresh', validate(refreshSchema, 'body'), refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/apple', appleAuth);
router.post('/apple/callback', appleCallback);

export default router;
