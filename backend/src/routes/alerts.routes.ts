import { Router } from 'express';
import { sendZombieAlert, emailStatus } from '../controllers/email.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { emailLimiter } from '../middleware/security.middleware';

const router = Router();

router.get('/status', emailStatus);
router.post('/zombie', requireAuth, emailLimiter, sendZombieAlert);

export default router;
