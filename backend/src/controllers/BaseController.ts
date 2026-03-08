import { Request, Response } from 'express';

export abstract class BaseController {
    protected handleSuccess(res: Response, data: any, statusCode = 200): void {
        res.status(statusCode).json({
            success: true,
            data,
        });
    }

    protected handleError(error: unknown, res: Response, context?: string): void {
        // In production, send to Sentry here.
        console.error(`Error in ${context || 'BaseController'}:`, error);

        const message = error instanceof Error ? error.message : 'An unexpected error occurred';

        res.status(500).json({
            success: false,
            message,
        });
    }
}
