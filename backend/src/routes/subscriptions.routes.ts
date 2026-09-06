import { Router } from 'express';
import {
  create,
  list,
  getOne,
  update,
  remove,
  dashboard,
  setSalary,
} from '../controllers/subscriptions.controller';
import {
  getZombies,
  detectZombies,
  toggleZombie,
  logUsage,
  getAlertMessage,
} from '../controllers/zombie.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from '../schemas/subscription.schema';

const router = Router();

router.use(requireAuth);

router.get('/metrics/dashboard', dashboard);
router.patch('/salary', setSalary);

router.get('/zombies', getZombies);
router.post('/zombies/detect', detectZombies);
router.get('/zombies/alert-message', getAlertMessage);

router.post('/', validate(createSubscriptionSchema, 'body'), create);
router.get('/', list);

router.get('/:id', getOne);
router.patch('/:id', validate(updateSubscriptionSchema, 'body'), update);
router.delete('/:id', remove);

router.patch('/:id/zombie', toggleZombie);
router.post('/:id/usage', logUsage);

export default router;
