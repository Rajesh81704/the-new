import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { unifiedConfig } from '../config/unifiedConfig';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, unifiedConfig.auth.jwtSecret as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, () => {
        const user = (req as any).user;
        if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Admin access required' });
        }
    });
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, () => {
        const user = (req as any).user;
        if (user && user.role === 'SUPER_ADMIN') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Super admin access required' });
        }
    });
};
