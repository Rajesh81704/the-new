import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const authController = new AuthController();

router.post('/register', asyncErrorWrapper((req, res) => authController.register(req, res) as any));
router.post('/login', asyncErrorWrapper((req, res) => authController.login(req, res) as any));

export default router;
