import { prisma } from '../utils/prisma';
import { ContentStatus } from '@prisma/client';

export class AdminService {
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
}
