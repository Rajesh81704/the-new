import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const postController = new PostController();

import { authenticate } from '../middleware/authMiddleware';

router.use(authenticate);

router.get('/', asyncErrorWrapper((req, res) => postController.getFeed(req, res) as any));
router.post('/', asyncErrorWrapper((req, res) => postController.createPost(req, res) as any));

export default router;
