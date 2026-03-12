import { prisma } from '../utils/prisma';
import { Role, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class SuperAdminService {
    async getCompanies() {
        return prisma.company.findMany({
            include: {
                subscription: true,
                users: {
                    where: { role: 'ADMIN' },
                    select: { id: true, email: true, firstName: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createCompany(data: { name: string; subdomain?: string; customDomain?: string; adminEmail?: string; adminPassword?: string }) {
        let baseCode = data.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() + new Date().getFullYear();
        let companyCode = baseCode;

        // Ensure uniqueness (simple fallback)
        let isUnique = false;
        let counter = 1;
        while (!isUnique) {
            const existing = await prisma.company.findUnique({ where: { companyCode } });
            if (!existing) {
                isUnique = true;
            } else {
                companyCode = `${baseCode}${counter}`;
                counter++;
            }
        }

        const tempPassword = data.adminPassword
            ? await bcrypt.hash(data.adminPassword, 10)
            : await bcrypt.hash('Admin@123', 10);

        const adminEmail = data.adminEmail || `admin@${companyCode.toLowerCase()}.com`;

        return prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: data.name,
                    companyCode,
                    subdomain: data.subdomain,
                    customDomain: data.customDomain,
                    subscriptionStatus: 'ACTIVE',
                    activeModules: ["friends", "events", "members", "podcasts", "blogs", "resources"],
                },
            });

            await tx.subscription.create({
                data: {
                    companyId: company.id,
                    planName: 'Generated Plan', // We'll let the update subscription endpoint handle the actual plan details if provided later
                    expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                }
            });

            await tx.user.create({
                data: {
                    email: adminEmail,
                    passwordHash: tempPassword,
                    role: Role.ADMIN,
                    firstName: 'Company',
                    lastName: 'Admin',
                    companyId: company.id,
                }
            });

            return company;
        });
    }

    async updateSubscription(companyId: string, status: SubscriptionStatus, planName: string, expiresAt: Date) {
        const company = await prisma.company.update({
            where: { id: companyId },
            data: { subscriptionStatus: status },
            include: { subscription: true }
        });

        if (company.subscription) {
            return prisma.subscription.update({
                where: { companyId },
                data: { planName, expiresAt },
            });
        } else {
            return prisma.subscription.create({
                data: {
                    companyId,
                    planName,
                    expiresAt,
                },
            });
        }
    }

    async getStats() {
        const totalCompanies = await prisma.company.count();
        const totalUsers = await prisma.user.count();
        return {
            stats: [
                { label: "Total Companies", value: totalCompanies.toString() },
                { label: "Total Members", value: totalUsers.toString() },
                { label: "Monthly Revenue", value: "₹0" },
                { label: "Active Rate", value: "100%" },
            ],
            recentCompanies: []
        };
    }

    async getApplications() {
        return prisma.companyApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateApplicationStatus(id: string, status: string) {
        return prisma.companyApplication.update({
            where: { id },
            data: { status }
        });
    }
}
