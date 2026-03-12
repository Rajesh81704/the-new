import { Router } from 'express';
import { SuperAdminController } from '../controllers/SuperAdminController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const superAdminController = new SuperAdminController();

import { requireSuperAdmin } from '../middleware/authMiddleware';

router.use(requireSuperAdmin);

router.get('/companies', asyncErrorWrapper((req, res) => superAdminController.getCompanies(req, res) as any));
router.post('/companies', asyncErrorWrapper((req, res) => superAdminController.createCompany(req, res) as any));
router.put('/companies/:companyId/subscription', asyncErrorWrapper((req, res) => superAdminController.updateSubscription(req, res) as any));
router.get('/stats', asyncErrorWrapper((req, res) => superAdminController.getDashboardStats(req, res) as any));
router.get('/applications', asyncErrorWrapper((req, res) => superAdminController.getApplications(req, res) as any));
router.put('/applications/:applicationId/status', asyncErrorWrapper((req, res) => superAdminController.updateApplicationStatus(req, res) as any));

export default router;
