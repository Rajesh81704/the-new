import { Request, Response } from 'express';

export abstract class BaseController {
    protected handleSuccess(res: Response, data: any, statusCode = 200): void {
        res.status(statusCode).json({
            success: true,
            data,
        });
    }

    protected handleError(error: unknown, res: Response, context?: string): void {
        console.error(`Error in ${context || 'BaseController'}:`, error);

        const message = error instanceof Error ? error.message : 'An unexpected error occurred';

        let statusCode = 500;
        if (message.includes('Invalid credentials') || message.includes('Unauthorized') || message.includes('Invalid company code')) {
            statusCode = 401;
        } else if (message.includes('already exists') || message.includes('not found')) {
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            message,
        });
    }
}
