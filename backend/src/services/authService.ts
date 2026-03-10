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
        let user: any;
        let company: any = null;

        // Super admins should be able to log in without any tenant context.
        // If credentials match a super admin account, we return early regardless
        // of companyCode/domain provided by the client.
        const superAdminCandidate = await prisma.user.findFirst({
            where: { email: data.email, role: 'SUPER_ADMIN' },
        });

        if (superAdminCandidate) {
            const superAdminPasswordMatch = await bcrypt.compare(data.password, superAdminCandidate.passwordHash);
            if (superAdminPasswordMatch) {
                const token = jwt.sign(
                    { userId: superAdminCandidate.id, role: superAdminCandidate.role, companyId: superAdminCandidate.companyId },
                    unifiedConfig.auth.jwtSecret as jwt.Secret,
                    { expiresIn: unifiedConfig.auth.jwtExpiresIn as any }
                );

                const { passwordHash, ...userWithoutPassword } = superAdminCandidate;

                return {
                    user: userWithoutPassword,
                    token,
                    company: null,
                };
            }
        }

        if (data.companyCode) {
            company = await prisma.company.findUnique({
                where: { companyCode: data.companyCode }
            });
            if (!company) {
                throw new Error('Invalid company code');
            }
            user = await prisma.user.findUnique({
                where: { email_companyId: { email: data.email, companyId: company.id } },
            });
        } else if (data.domain) {
            company = await prisma.company.findUnique({
                where: { customDomain: data.domain }
            });
            if (!company) {
                throw new Error('Invalid custom domain or company not found');
            }
            user = await prisma.user.findUnique({
                where: { email_companyId: { email: data.email, companyId: company.id } },
            });
        } else if (data.subdomain) {
            company = await prisma.company.findUnique({
                where: { subdomain: data.subdomain }
            });
            if (!company) {
                throw new Error('Company not found for this subdomain');
            }
            user = await prisma.user.findUnique({
                where: { email_companyId: { email: data.email, companyId: company.id } },
            });
        } else {
            user = null;
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

        return {
            user: userWithoutPassword,
            token,
            company: company ? { name: company.name, logoUrl: company.logoUrl, activeModules: company.activeModules } : null
        };
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
        } else if (data.domain) {
            const company = await prisma.company.findUnique({
                where: { customDomain: data.domain }
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

    async impersonate({ token, targetUserId }: { token: string, targetUserId: string }) {
        const decoded: any = jwt.verify(token, unifiedConfig.auth.jwtSecret as jwt.Secret);
        const requesterId = decoded.userId;
        const requesterRole = decoded.role;
        const requesterCompanyId = decoded.companyId;

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            include: { company: true }
        });

        if (!targetUser) throw new Error('Target user not found');

        // Authorization checks
        if (requesterRole === 'SUPER_ADMIN') {
            // Super admins can impersonate company admins (or basically anyone)
        } else if (requesterRole === 'ADMIN') {
            // Admins can only impersonate members in their own company
            if (targetUser.companyId !== requesterCompanyId) {
                throw new Error('Unauthorized to impersonate this user');
            }
        } else {
            throw new Error('Unauthorized');
        }

        const impersonatedToken = jwt.sign(
            { userId: targetUser.id, role: targetUser.role, companyId: targetUser.companyId },
            unifiedConfig.auth.jwtSecret as jwt.Secret,
            { expiresIn: unifiedConfig.auth.jwtExpiresIn as any }
        );

        const { passwordHash, ...userWithoutPassword } = targetUser;

        return {
            user: userWithoutPassword,
            token: impersonatedToken,
            company: targetUser.company ? {
                name: targetUser.company.name,
                logoUrl: targetUser.company.logoUrl,
                activeModules: targetUser.company.activeModules
            } : null
        };
    }

    async adminResetPassword({ token, targetUserId }: { token: string, targetUserId: string }) {
        const decoded: any = jwt.verify(token, unifiedConfig.auth.jwtSecret as jwt.Secret);
        const requesterRole = decoded.role;
        const requesterCompanyId = decoded.companyId;

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            include: { company: true }
        });

        if (!targetUser) throw new Error('Target user not found');

        // Authorization checks
        if (requesterRole === 'SUPER_ADMIN') {
            // Super admins can reset company admins
        } else if (requesterRole === 'ADMIN') {
            // Admins can reset users in their own company
            if (targetUser.companyId !== requesterCompanyId) {
                throw new Error('Unauthorized to reset this user');
            }
        } else {
            throw new Error('Unauthorized');
        }

        // Generate a password based on details
        const prefix = targetUser.company?.name ? targetUser.company.name.replace(/\s+/g, '') : (targetUser.firstName || 'User');
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random
        const generatedPassword = `${prefix}@${randomNum}`;

        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        await prisma.user.update({
            where: { id: targetUser.id },
            data: { passwordHash: hashedPassword }
        });

        return {
            message: 'Password reset successfully',
            generatedPassword
        };
    }
}
