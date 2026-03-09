import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../utils/prisma';
import { unifiedConfig } from '../config/unifiedConfig';
import { emailService } from './emailService';

export class AuthService {
    async register(data: any) {
        const existingUser = await prisma.user.findFirst({
            where: { email: data.email, companyId: data.companyId || null },
        });

        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            unifiedConfig.auth.jwtSecret as jwt.Secret,
            { expiresIn: unifiedConfig.auth.jwtExpiresIn as any }
        );

        return { user, token };
    }

    async login(data: any) {
        let user;
        if (data.companyCode) {
            const company = await prisma.company.findUnique({
                where: { companyCode: data.companyCode }
            });
            if (!company) {
                throw new Error('Invalid company code');
            }
            user = await prisma.user.findUnique({
                where: { email_companyId: { email: data.email, companyId: company.id } },
            });
        } else {
            // Assume super admin login attempts will omit companyCode
            user = await prisma.user.findFirst({
                where: { email: data.email, role: 'SUPER_ADMIN' },
            });
        }

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(data.password, user.passwordHash);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, companyId: user.companyId },
            unifiedConfig.auth.jwtSecret as jwt.Secret,
            { expiresIn: unifiedConfig.auth.jwtExpiresIn as any }
        );

        const { passwordHash, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }

    async forgotPassword(data: any) {
        let user;
        if (data.companyCode) {
            const company = await prisma.company.findUnique({
                where: { companyCode: data.companyCode }
            });
            if (company) {
                user = await prisma.user.findUnique({
                    where: { email_companyId: { email: data.email, companyId: company.id } },
                });
            }
        } else {
            user = await prisma.user.findFirst({
                where: { email: data.email, role: 'SUPER_ADMIN' },
            });
        }

        if (!user) {
            // we do not throw an error to prevent user enumeration
            return { message: 'If that email is registered, a password reset link has been sent.' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry: tokenExpiry,
            },
        });

        // Determine if user is company admin based on role or companyId existence
        const isCompanyAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

        await emailService.sendPasswordResetEmail(user.email, resetToken, isCompanyAdmin);

        return { message: 'If that email is registered, a password reset link has been sent.' };
    }

    async resetPassword(data: any) {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: data.token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return { message: 'Password has been reset successfully' };
    }
}
