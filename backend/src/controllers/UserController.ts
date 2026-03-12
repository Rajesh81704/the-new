import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../services/userService';

export class UserController extends BaseController {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    async getMe(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const profile = await this.userService.getProfile(userId);
            this.handleSuccess(res, profile);
        } catch (error) {
            this.handleError(error, res, 'UserController.getMe');
        }
    }

    async getMembers(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user.companyId;
            const members = await this.userService.getMembers(companyId);
            this.handleSuccess(res, members);
        } catch (error) {
            this.handleError(error, res, 'UserController.getMembers');
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const profile = await this.userService.getProfile(userId as string);
            this.handleSuccess(res, profile);
        } catch (error) {
            this.handleError(error, res, 'UserController.getProfile');
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const updatedProfile = await this.userService.updateProfile(userId, req.body);
            this.handleSuccess(res, updatedProfile);
        } catch (error) {
            this.handleError(error, res, 'UserController.updateProfile');
        }
    }

    async getBusinessCards(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const cards = await this.userService.getBusinessCards(userId);
            this.handleSuccess(res, cards);
        } catch (error) {
            this.handleError(error, res, 'UserController.getBusinessCards');
        }
    }

    async createBusinessCard(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const card = await this.userService.createBusinessCard(userId, req.body);
            this.handleSuccess(res, card, 201);
        } catch (error) {
            this.handleError(error, res, 'UserController.createBusinessCard');
        }
    }

    async updateBusinessCard(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const id = req.params.id as string;
            const card = await this.userService.updateBusinessCard(userId, id, req.body);
            this.handleSuccess(res, card);
        } catch (error) {
            this.handleError(error, res, 'UserController.updateBusinessCard');
        }
    }

    async deleteBusinessCard(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const id = req.params.id as string;
            const result = await this.userService.deleteBusinessCard(userId, id);
            this.handleSuccess(res, result);
        } catch (error) {
            this.handleError(error, res, 'UserController.deleteBusinessCard');
        }
    }

    async getEvents(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user.companyId;
            const events = await this.userService.getEvents(companyId);
            this.handleSuccess(res, events);
        } catch (error) {
            this.handleError(error, res, 'UserController.getEvents');
        }
    }

    async getPodcasts(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user.companyId;
            const podcasts = await this.userService.getPodcasts(companyId);
            this.handleSuccess(res, podcasts);
        } catch (error) {
            this.handleError(error, res, 'UserController.getPodcasts');
        }
    }

    async getBlogs(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user.companyId;
            const blogs = await this.userService.getBlogs(companyId);
            this.handleSuccess(res, blogs);
        } catch (error) {
            this.handleError(error, res, 'UserController.getBlogs');
        }
    }

    async getResources(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user.companyId;
            const resources = await this.userService.getResources(companyId);
            this.handleSuccess(res, resources);
        } catch (error) {
            this.handleError(error, res, 'UserController.getResources');
        }
    }

    async getFriends(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const friends = await this.userService.getFriends(userId);
            this.handleSuccess(res, friends);
        } catch (error) {
            this.handleError(error, res, 'UserController.getFriends');
        }
    }

    async getPendingRequests(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const requests = await this.userService.getPendingRequests(userId);
            this.handleSuccess(res, requests);
        } catch (error) {
            this.handleError(error, res, 'UserController.getPendingRequests');
        }
    }

    async sendFriendRequest(req: Request, res: Response): Promise<void> {
        try {
            const requesterId = (req as any).user.userId;
            const { receiverId } = req.body;
            const result = await this.userService.sendFriendRequest(requesterId, receiverId);
            this.handleSuccess(res, result);
        } catch (error) {
            this.handleError(error, res, 'UserController.sendFriendRequest');
        }
    }

    async handleFriendRequest(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const { targetUserId, action } = req.body; // action: 'ACCEPT' | 'REJECT'
            const result = await this.userService.handleFriendRequest(userId, targetUserId, action);
            this.handleSuccess(res, result);
        } catch (error) {
            this.handleError(error, res, 'UserController.handleFriendRequest');
        }
    }

    async removeFriendship(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const targetUserId = req.params.targetUserId as string;
            const result = await this.userService.removeFriendship(userId, targetUserId);
            this.handleSuccess(res, result);
        } catch (error) {
            this.handleError(error, res, 'UserController.removeFriendship');
        }
    }
}
