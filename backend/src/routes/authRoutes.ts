import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const authController = new AuthController();

router.post('/register', asyncErrorWrapper((req, res) => authController.register(req, res) as any));
router.post('/login', asyncErrorWrapper((req, res) => authController.login(req, res) as any));
router.post('/forgot-password', asyncErrorWrapper((req, res) => authController.forgotPassword(req, res) as any));
router.post('/reset-password', asyncErrorWrapper((req, res) => authController.resetPassword(req, res) as any));
router.post('/impersonate', asyncErrorWrapper((req, res) => authController.impersonate(req, res) as any));
router.post('/admin-reset-password', asyncErrorWrapper((req, res) => authController.adminResetPassword(req, res) as any));

export default router;
