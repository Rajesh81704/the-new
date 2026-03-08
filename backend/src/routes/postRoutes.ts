import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const postController = new PostController();

// Basic middleware dummy to parse user info out of token
const authMiddlewareDummy = (req: any, res: any, next: any) => {
    // Normally this verifies JWT and sets req.user
    next();
};

router.use(authMiddlewareDummy);

router.get('/', asyncErrorWrapper((req, res) => postController.getFeed(req, res) as any));
router.post('/', asyncErrorWrapper((req, res) => postController.createPost(req, res) as any));

export default router;
