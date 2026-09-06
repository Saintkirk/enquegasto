import { Router } from 'express';
import {
  listPlatforms,
  getPlatform,
  listCategories,
} from '../controllers/platforms.controller';

const router = Router();

router.get('/', listPlatforms);
router.get('/categories', listCategories);
router.get('/:slug', getPlatform);

export default router;
