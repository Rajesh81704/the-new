import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { unifiedConfig } from '../config/unifiedConfig';

export class AuthService {
    async register(data: any) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
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
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

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
}
