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
            const companyId =
                (req as any).user?.companyId ||
                (await this.adminService.getDefaultCompanyId());
            const events = await this.adminService.getEvents(companyId);
            this.handleSuccess(res, events);
        } catch (error) {
            this.handleError(error, res, 'AdminController.getEvents');
        }
    }

    async createEvent(req: Request, res: Response): Promise<void> {
        try {
            const companyId =
                (req as any).user?.companyId ||
                (await this.adminService.getDefaultCompanyId());
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

    async updateEvent(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            const { title, description, eventDate, location } = req.body;
            const event = await this.adminService.updateEvent(companyId, id, {
                title,
                description,
                eventDate: new Date(eventDate),
                location,
            });
            this.handleSuccess(res, event);
        } catch (error) {
            this.handleError(error, res, 'AdminController.updateEvent');
        }
    }

    async deleteEvent(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            await this.adminService.deleteEvent(companyId, id);
            this.handleSuccess(res, { message: "Event deleted successfully" });
        } catch (error) {
            this.handleError(error, res, 'AdminController.deleteEvent');
        }
    }

    async getBlogs(req: Request, res: Response): Promise<void> {
        try {
            const companyId =
                (req as any).user?.companyId ||
                (await this.adminService.getDefaultCompanyId());
            const blogs = await this.adminService.getBlogs(companyId);
            this.handleSuccess(res, blogs);
        } catch (error) {
            this.handleError(error, res, 'AdminController.getBlogs');
        }
    }

    async createBlog(req: Request, res: Response): Promise<void> {
        try {
            const companyId =
                (req as any).user?.companyId ||
                (await this.adminService.getDefaultCompanyId());
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

    async updateBlog(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            const { title, description, content, status } = req.body;
            const blog = await this.adminService.updateBlog(companyId, id, {
                title,
                description,
                content,
                status,
            });
            this.handleSuccess(res, blog);
        } catch (error) {
            this.handleError(error, res, 'AdminController.updateBlog');
        }
    }

    async deleteBlog(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            await this.adminService.deleteBlog(companyId, id);
            this.handleSuccess(res, { message: "Blog deleted successfully" });
        } catch (error) {
            this.handleError(error, res, 'AdminController.deleteBlog');
        }
    }

    async getPodcasts(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || await this.adminService.getDefaultCompanyId();
            const podcasts = await this.adminService.getPodcasts(companyId);
            this.handleSuccess(res, podcasts);
        } catch (error) {
            this.handleError(error, res, 'AdminController.getPodcasts');
        }
    }

    async createPodcast(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || await this.adminService.getDefaultCompanyId();
            const podcast = await this.adminService.createPodcast(companyId, req.body);
            this.handleSuccess(res, podcast, 201);
        } catch (error) {
            this.handleError(error, res, 'AdminController.createPodcast');
        }
    }

    async updatePodcast(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            const podcast = await this.adminService.updatePodcast(companyId, id, req.body);
            this.handleSuccess(res, podcast);
        } catch (error) {
            this.handleError(error, res, 'AdminController.updatePodcast');
        }
    }

    async deletePodcast(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            await this.adminService.deletePodcast(companyId, id);
            this.handleSuccess(res, { message: "Podcast deleted successfully" });
        } catch (error) {
            this.handleError(error, res, 'AdminController.deletePodcast');
        }
    }

    async getResources(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || await this.adminService.getDefaultCompanyId();
            const resources = await this.adminService.getResources(companyId);
            this.handleSuccess(res, resources);
        } catch (error) {
            this.handleError(error, res, 'AdminController.getResources');
        }
    }

    async createResource(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || await this.adminService.getDefaultCompanyId();
            const resource = await this.adminService.createResource(companyId, req.body);
            this.handleSuccess(res, resource, 201);
        } catch (error) {
            this.handleError(error, res, 'AdminController.createResource');
        }
    }

    async updateResource(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            const resource = await this.adminService.updateResource(companyId, id, req.body);
            this.handleSuccess(res, resource);
        } catch (error) {
            this.handleError(error, res, 'AdminController.updateResource');
        }
    }

    async deleteResource(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            await this.adminService.deleteResource(companyId, id);
            this.handleSuccess(res, { message: "Resource deleted successfully" });
        } catch (error) {
            this.handleError(error, res, 'AdminController.deleteResource');
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

    async createMember(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const member = await this.adminService.createMember(companyId, req.body);
            this.handleSuccess(res, member, 201);
        } catch (error) {
            this.handleError(error, res, 'AdminController.createMember');
        }
    }

    async updateMember(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            const updated = await this.adminService.updateMember(companyId, id, req.body);
            this.handleSuccess(res, updated);
        } catch (error) {
            this.handleError(error, res, 'AdminController.updateMember');
        }
    }

    async deleteMember(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId;
            if (!companyId) throw new Error("Unauthorized");
            const id = req.params.id as string;
            await this.adminService.deleteMember(companyId, id);
            this.handleSuccess(res, { message: "Member deleted successfully" });
        } catch (error) {
            this.handleError(error, res, 'AdminController.deleteMember');
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
