import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AdminService } from '../services/adminService';

export class AdminController extends BaseController {
    private adminService: AdminService;

    constructor() {
        super();
        this.adminService = new AdminService();
    }

    async getEvents(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || 'default-company-id';
            const events = await this.adminService.getEvents(companyId);
            this.handleSuccess(res, events);
        } catch (error) {
            this.handleError(error, res, 'AdminController.getEvents');
        }
    }

    async createEvent(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || 'default-company-id';
            const { title, description, eventDate, location } = req.body;
            const event = await this.adminService.createEvent(companyId, {
                title,
                description,
                eventDate: new Date(eventDate),
                location,
            });
            this.handleSuccess(res, event, 201);
        } catch (error) {
            this.handleError(error, res, 'AdminController.createEvent');
        }
    }

    async getBlogs(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || 'default-company-id';
            const blogs = await this.adminService.getBlogs(companyId);
            this.handleSuccess(res, blogs);
        } catch (error) {
            this.handleError(error, res, 'AdminController.getBlogs');
        }
    }

    async createBlog(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || 'default-company-id';
            const { title, description, content, status } = req.body;
            const blog = await this.adminService.createBlog(companyId, {
                title,
                description,
                content,
                status,
            });
            this.handleSuccess(res, blog, 201);
        } catch (error) {
            this.handleError(error, res, 'AdminController.createBlog');
        }
    }

    async getMembers(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || 'default-company-id';
            const members = await this.adminService.getMembers(companyId);
            this.handleSuccess(res, members);
        } catch (error) {
            this.handleError(error, res, 'AdminController.getMembers');
        }
    }

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || 'default-company-id';
            const stats = await this.adminService.getStats(companyId);
            this.handleSuccess(res, stats);
        } catch (error) {
            this.handleError(error, res, 'AdminController.getDashboardStats');
        }
    }

    async uploadLogo(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) {
                res.status(403).json({ success: false, message: 'Company ID missing from token' });
                return;
            }

            if (!req.file) {
                res.status(400).json({ success: false, message: 'No image file uploaded' });
                return;
            }

            // Path to serve the static file: /uploads/[filename]
            const logoUrl = `/uploads/${req.file.filename}`;

            // Update in the DB using the service
            const company = await this.adminService.updateCompanyLogo(companyId, logoUrl);

            this.handleSuccess(res, { logoUrl: company.logoUrl }, 200);
        } catch (error) {
            this.handleError(error, res, 'AdminController.uploadLogo');
        }
    }
}
