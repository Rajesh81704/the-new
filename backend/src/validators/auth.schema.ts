import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    companyCode: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
    companyCode: z.string().optional(),
});

export const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(6),
});
