import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Exception:', err);

    // In production, this should go to Sentry
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};
