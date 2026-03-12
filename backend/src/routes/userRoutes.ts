import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

router.use(authenticate);

router.get('/members', asyncErrorWrapper((req, res) => userController.getMembers(req, res) as any));
router.get('/profile/:userId', asyncErrorWrapper((req, res) => userController.getProfile(req, res) as any));
router.put('/profile', asyncErrorWrapper((req, res) => userController.updateProfile(req, res) as any));
router.get('/events', asyncErrorWrapper((req, res) => userController.getEvents(req, res) as any));
router.get('/podcasts', asyncErrorWrapper((req, res) => userController.getPodcasts(req, res) as any));
router.get('/blogs', asyncErrorWrapper((req, res) => userController.getBlogs(req, res) as any));
router.get('/resources', asyncErrorWrapper((req, res) => userController.getResources(req, res) as any));

// Business Cards
router.get('/business-cards', asyncErrorWrapper((req, res) => userController.getBusinessCards(req, res) as any));
router.post('/business-cards', asyncErrorWrapper((req, res) => userController.createBusinessCard(req, res) as any));
router.put('/business-cards/:id', asyncErrorWrapper((req, res) => userController.updateBusinessCard(req, res) as any));
router.delete('/business-cards/:id', asyncErrorWrapper((req, res) => userController.deleteBusinessCard(req, res) as any));

// Friendship Routes
router.get('/friends', asyncErrorWrapper((req, res) => userController.getFriends(req, res) as any));
router.get('/requests', asyncErrorWrapper((req, res) => userController.getPendingRequests(req, res) as any));
router.post('/connect', asyncErrorWrapper((req, res) => userController.sendFriendRequest(req, res) as any));
router.post('/request/handle', asyncErrorWrapper((req, res) => userController.handleFriendRequest(req, res) as any));
router.delete('/friends/:targetUserId', asyncErrorWrapper((req, res) => userController.removeFriendship(req, res) as any));

export default router;
