import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';
import { upload } from '../middleware/upload';

const router = Router();
const adminController = new AdminController();

// Basic admin role check dummy middleware
const adminMiddlewareDummy = (req: any, res: any, next: any) => {
    // Normally this checks if user.role === 'ADMIN'
    next();
};

router.use(adminMiddlewareDummy);

router.get('/events', asyncErrorWrapper((req, res) => adminController.getEvents(req, res) as any));
router.post('/events', asyncErrorWrapper((req, res) => adminController.createEvent(req, res) as any));

router.get('/blogs', asyncErrorWrapper((req, res) => adminController.getBlogs(req, res) as any));
router.post('/blogs', asyncErrorWrapper((req, res) => adminController.createBlog(req, res) as any));

router.get('/members', asyncErrorWrapper((req, res) => adminController.getMembers(req, res) as any));
router.get('/stats', asyncErrorWrapper((req, res) => adminController.getDashboardStats(req, res) as any));

router.post('/settings/logo', upload.single('logo'), asyncErrorWrapper((req, res) => adminController.uploadLogo(req, res) as any));

export default router;
