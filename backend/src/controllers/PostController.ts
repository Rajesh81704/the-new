import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { PostService } from '../services/postService';

export class PostController extends BaseController {
    private postService: PostService;

    constructor() {
        super();
        this.postService = new PostService();
    }

    async getFeed(req: Request, res: Response): Promise<void> {
        try {
            // In reality, this will come from auth middleware setting req.user
            const companyId = (req as any).user?.companyId || 'default-company-id';
            const page = parseInt(req.query.page as string) || 1;

            const feed = await this.postService.getFeed(companyId, page);
            this.handleSuccess(res, feed);
        } catch (error) {
            this.handleError(error, res, 'PostController.getFeed');
        }
    }

    async createPost(req: Request, res: Response): Promise<void> {
        try {
            const companyId = (req as any).user?.companyId || 'default-company-id';
            const authorId = (req as any).user?.userId || 'default-user-id';
            const { content, mediaUrl } = req.body;

            if (!content) {
                throw new Error('Content is required');
            }

            const post = await this.postService.createPost(companyId, authorId, content, mediaUrl);
            this.handleSuccess(res, post, 201);
        } catch (error) {
            this.handleError(error, res, 'PostController.createPost');
        }
    }
}
