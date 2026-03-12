import { Router } from 'express';
import { PublicController } from '../controllers/PublicController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const publicController = new PublicController();

router.post('/company-application', asyncErrorWrapper((req, res) => publicController.submitCompanyApplication(req, res) as any));

export default router;
