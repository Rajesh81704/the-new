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
        return prisma.company.create({
            data: {
                name: data.name,
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
}
