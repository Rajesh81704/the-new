import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';
import { upload } from '../middleware/upload';

const router = Router();
const adminController = new AdminController();

import { requireAdmin } from '../middleware/authMiddleware';

router.use(requireAdmin);

router.get('/events', asyncErrorWrapper((req, res) => adminController.getEvents(req, res) as any));
router.post('/events', asyncErrorWrapper((req, res) => adminController.createEvent(req, res) as any));
router.put('/events/:id', asyncErrorWrapper((req, res) => adminController.updateEvent(req, res) as any));
router.delete('/events/:id', asyncErrorWrapper((req, res) => adminController.deleteEvent(req, res) as any));

router.get('/blogs', asyncErrorWrapper((req, res) => adminController.getBlogs(req, res) as any));
router.post('/blogs', asyncErrorWrapper((req, res) => adminController.createBlog(req, res) as any));
router.put('/blogs/:id', asyncErrorWrapper((req, res) => adminController.updateBlog(req, res) as any));
router.delete('/blogs/:id', asyncErrorWrapper((req, res) => adminController.deleteBlog(req, res) as any));

router.get('/members', asyncErrorWrapper((req, res) => adminController.getMembers(req, res) as any));
router.post('/members', asyncErrorWrapper((req, res) => adminController.createMember(req, res) as any));
router.put('/members/:id', asyncErrorWrapper((req, res) => adminController.updateMember(req, res) as any));
router.delete('/members/:id', asyncErrorWrapper((req, res) => adminController.deleteMember(req, res) as any));

router.get('/podcasts', asyncErrorWrapper((req, res) => adminController.getPodcasts(req, res) as any));
router.post('/podcasts', asyncErrorWrapper((req, res) => adminController.createPodcast(req, res) as any));
router.put('/podcasts/:id', asyncErrorWrapper((req, res) => adminController.updatePodcast(req, res) as any));
router.delete('/podcasts/:id', asyncErrorWrapper((req, res) => adminController.deletePodcast(req, res) as any));

router.get('/resources', asyncErrorWrapper((req, res) => adminController.getResources(req, res) as any));
router.post('/resources', asyncErrorWrapper((req, res) => adminController.createResource(req, res) as any));
router.put('/resources/:id', asyncErrorWrapper((req, res) => adminController.updateResource(req, res) as any));
router.delete('/resources/:id', asyncErrorWrapper((req, res) => adminController.deleteResource(req, res) as any));

router.get('/stats', asyncErrorWrapper((req, res) => adminController.getDashboardStats(req, res) as any));

router.post('/settings/logo', upload.single('logo'), asyncErrorWrapper((req, res) => adminController.uploadLogo(req, res) as any));

export default router;
