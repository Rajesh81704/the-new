import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { SuperAdminService } from '../services/superAdminService';
import { SubscriptionStatus } from '@prisma/client';

export class SuperAdminController extends BaseController {
    private superAdminService: SuperAdminService;

    constructor() {
        super();
        this.superAdminService = new SuperAdminService();
    }

    async getCompanies(req: Request, res: Response): Promise<void> {
        try {
            const companies = await this.superAdminService.getCompanies();
            this.handleSuccess(res, companies);
        } catch (error) {
            this.handleError(error, res, 'SuperAdminController.getCompanies');
        }
    }

    async createCompany(req: Request, res: Response): Promise<void> {
        try {
            const { name, subdomain, customDomain, adminEmail, adminPassword } = req.body;
            const company = await this.superAdminService.createCompany({ name, subdomain, customDomain, adminEmail, adminPassword });
            this.handleSuccess(res, company, 201);
        } catch (error) {
            this.handleError(error, res, 'SuperAdminController.createCompany');
        }
    }

    async updateSubscription(req: Request, res: Response): Promise<void> {
        try {
            const { companyId } = req.params;
            const { status, planName, expiresAt } = req.body;

            const subscription = await this.superAdminService.updateSubscription(
                companyId as string,
                status as SubscriptionStatus,
                planName,
                new Date(expiresAt)
            );
            this.handleSuccess(res, subscription);
        } catch (error) {
            this.handleError(error, res, 'SuperAdminController.updateSubscription');
        }
    }

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.superAdminService.getStats();
            this.handleSuccess(res, stats);
        } catch (error) {
            this.handleError(error, res, 'SuperAdminController.getDashboardStats');
        }
    }

    async getApplications(req: Request, res: Response): Promise<void> {
        try {
            const applications = await this.superAdminService.getApplications();
            this.handleSuccess(res, applications);
        } catch (error) {
            this.handleError(error, res, 'SuperAdminController.getApplications');
        }
    }

    async updateApplicationStatus(req: Request, res: Response): Promise<void> {
        try {
            const applicationId = req.params.applicationId as string;
            const { status } = req.body;
            const application = await this.superAdminService.updateApplicationStatus(applicationId, status);
            this.handleSuccess(res, application);
        } catch (error) {
            this.handleError(error, res, 'SuperAdminController.updateApplicationStatus');
        }
    }
}
