import { Router } from 'express';
import { SuperAdminController } from '../controllers/SuperAdminController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const superAdminController = new SuperAdminController();

// Basic super admin role check dummy middleware
const superAdminMiddlewareDummy = (req: any, res: any, next: any) => {
    // Normally this checks if user.role === 'SUPER_ADMIN'
    next();
};

router.use(superAdminMiddlewareDummy);

router.get('/companies', asyncErrorWrapper((req, res) => superAdminController.getCompanies(req, res) as any));
router.post('/companies', asyncErrorWrapper((req, res) => superAdminController.createCompany(req, res) as any));
router.put('/companies/:companyId/subscription', asyncErrorWrapper((req, res) => superAdminController.updateSubscription(req, res) as any));

export default router;
