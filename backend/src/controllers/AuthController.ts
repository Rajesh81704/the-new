import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AuthService } from '../services/authService';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.schema';

export class AuthController extends BaseController {
    private authService: AuthService;

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const data = registerSchema.parse(req.body);
            const result = await this.authService.register(data);
            this.handleSuccess(res, result, 201);
        } catch (error) {
            this.handleError(error, res, 'AuthController.register');
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const data = loginSchema.parse(req.body);
            const result = await this.authService.login(data);
            this.handleSuccess(res, result);
        } catch (error) {
            this.handleError(error, res, 'AuthController.login');
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const data = forgotPasswordSchema.parse(req.body);
            const result = await this.authService.forgotPassword(data);
            this.handleSuccess(res, result);
        } catch (error) {
            this.handleError(error, res, 'AuthController.forgotPassword');
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const data = resetPasswordSchema.parse(req.body);
            const result = await this.authService.resetPassword(data);
            this.handleSuccess(res, result);
        } catch (error) {
            this.handleError(error, res, 'AuthController.resetPassword');
        }
    }
}
