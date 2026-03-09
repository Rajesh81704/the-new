import { prisma } from '../utils/prisma';
import { SubscriptionStatus } from '@prisma/client';

export class SuperAdminService {
    async getCompanies() {
        return prisma.company.findMany({
            include: {
                subscription: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createCompany(data: { name: string; subdomain?: string; customDomain?: string }) {
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

        return prisma.company.create({
            data: {
                name: data.name,
                companyCode,
                subdomain: data.subdomain,
                customDomain: data.customDomain,
            },
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
}
