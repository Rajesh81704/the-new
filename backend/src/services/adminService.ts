import { prisma } from '../utils/prisma';
import { ContentStatus } from '@prisma/client';

export class AdminService {
    async getDefaultCompanyId(): Promise<string> {
        let company = await prisma.company.findFirst({ orderBy: { createdAt: 'asc' } });

        if (!company) {
            company = await prisma.company.create({
                data: {
                    name: 'Magically Social',
                    subdomain: 'magicallysocial',
                    customDomain: 'magicallysocial.cloud',
                },
            });
        }

        return company.id;
    }

    async getEvents(companyId: string) {
        return prisma.event.findMany({
            where: { companyId },
            orderBy: { eventDate: 'asc' },
        });
    }

    async createEvent(companyId: string, data: { title: string; description: string; eventDate: Date; location: string }) {
        return prisma.event.create({
            data: {
                companyId,
                title: data.title,
                description: data.description,
                eventDate: data.eventDate,
                location: data.location,
            },
        });
    }

    async getBlogs(companyId: string) {
        return prisma.blog.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createBlog(companyId: string, data: { title: string; description: string; content: string; status?: ContentStatus }) {
        return prisma.blog.create({
            data: {
                companyId,
                title: data.title,
                description: data.description,
                content: data.content,
                status: data.status || 'PUBLISHED',
            },
        });
    }

    async getMembers(companyId: string) {
        return prisma.user.findMany({
            where: { companyId },
            select: { id: true, email: true, firstName: true, lastName: true, role: true, avatarUrl: true, createdAt: true },
        });
    }

    async getStats(companyId: string) {
        const totalMembers = await prisma.user.count({ where: { companyId } });
        const activeEvents = await prisma.event.count({ where: { companyId } });
        const totalBlogs = await prisma.blog.count({ where: { companyId } });
        // Return structured data for the dashboard
        return {
            stats: [
                { label: "Total Members", value: totalMembers.toString() },
                { label: "Active Events", value: activeEvents.toString() },
                { label: "Blog Posts", value: totalBlogs.toString() },
            ],
            recentActivity: [] // Empty for now, no complex activity feed
        };
    }

    async updateCompanyLogo(companyId: string, logoUrl: string) {
        return prisma.company.update({
            where: { id: companyId },
            data: { logoUrl },
        });
    }
}
