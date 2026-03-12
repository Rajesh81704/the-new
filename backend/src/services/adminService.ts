import { prisma } from '../utils/prisma';
import { ContentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class AdminService {
    async getDefaultCompanyId(): Promise<string> {
        let company = await prisma.company.findFirst({ orderBy: { createdAt: 'asc' } });

        if (!company) {
            company = await prisma.company.create({
                data: {
                    name: 'Magically Social',
                    subdomain: 'magicallysocial',
                    customDomain: 'magicallysocial.cloud',
                    companyCode: 'MAGICALLY_SOCIAL', // <-- Add this line
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

    async updateEvent(companyId: string, eventId: string, data: { title: string; description: string; eventDate: Date; location: string }) {
        const event = await prisma.event.findFirst({ where: { id: eventId, companyId } });
        if (!event) throw new Error("Event not found");
        return prisma.event.update({
            where: { id: eventId },
            data: {
                title: data.title,
                description: data.description,
                eventDate: data.eventDate,
                location: data.location,
            }
        });
    }

    async deleteEvent(companyId: string, eventId: string) {
        const event = await prisma.event.findFirst({ where: { id: eventId, companyId } });
        if (!event) throw new Error("Event not found");
        return prisma.event.delete({ where: { id: eventId } });
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

    async updateBlog(companyId: string, blogId: string, data: { title: string; description: string; content: string; status?: ContentStatus }) {
        const blog = await prisma.blog.findFirst({ where: { id: blogId, companyId } });
        if (!blog) throw new Error("Blog not found");
        return prisma.blog.update({
            where: { id: blogId },
            data: {
                title: data.title,
                description: data.description,
                content: data.content,
                status: data.status || 'PUBLISHED',
            }
        });
    }

    async deleteBlog(companyId: string, blogId: string) {
        const blog = await prisma.blog.findFirst({ where: { id: blogId, companyId } });
        if (!blog) throw new Error("Blog not found");
        return prisma.blog.delete({ where: { id: blogId } });
    }

    async getPodcasts(companyId: string) {
        return prisma.podcast.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
    }

    async createPodcast(companyId: string, data: { title: string; description: string; url: string; status?: ContentStatus }) {
        return prisma.podcast.create({
            data: { companyId, title: data.title, description: data.description, url: data.url, status: data.status || 'PUBLISHED' }
        });
    }

    async updatePodcast(companyId: string, podcastId: string, data: { title: string; description: string; url: string; status?: ContentStatus }) {
        const podcast = await prisma.podcast.findFirst({ where: { id: podcastId, companyId } });
        if (!podcast) throw new Error("Podcast not found");
        return prisma.podcast.update({
            where: { id: podcastId },
            data: { title: data.title, description: data.description, url: data.url, status: data.status }
        });
    }

    async deletePodcast(companyId: string, podcastId: string) {
        const podcast = await prisma.podcast.findFirst({ where: { id: podcastId, companyId } });
        if (!podcast) throw new Error("Podcast not found");
        return prisma.podcast.delete({ where: { id: podcastId } });
    }

    async getResources(companyId: string) {
        return prisma.resource.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
    }

    async createResource(companyId: string, data: { title: string; description: string; url: string; status?: ContentStatus }) {
        return prisma.resource.create({
            data: { companyId, title: data.title, description: data.description, url: data.url, status: data.status || 'PUBLISHED' }
        });
    }

    async updateResource(companyId: string, resourceId: string, data: { title: string; description: string; url: string; status?: ContentStatus }) {
        const resource = await prisma.resource.findFirst({ where: { id: resourceId, companyId } });
        if (!resource) throw new Error("Resource not found");
        return prisma.resource.update({
            where: { id: resourceId },
            data: { title: data.title, description: data.description, url: data.url, status: data.status }
        });
    }

    async deleteResource(companyId: string, resourceId: string) {
        const resource = await prisma.resource.findFirst({ where: { id: resourceId, companyId } });
        if (!resource) throw new Error("Resource not found");
        return prisma.resource.delete({ where: { id: resourceId } });
    }

    async getMembers(companyId: string) {
        return prisma.user.findMany({
            where: { companyId },
            select: { id: true, email: true, firstName: true, lastName: true, role: true, avatarUrl: true, createdAt: true },
        });
    }

    async createMember(companyId: string, data: { email: string; firstName?: string; lastName?: string; role?: string; password?: string }) {
        const existing = await prisma.user.findFirst({
            where: { email: data.email, companyId }
        });
        if (existing) {
            throw new Error("User with this email already exists in this company.");
        }
        const pwdToHash = data.password || 'Member@123';
        const tempPassword = await bcrypt.hash(pwdToHash, 10);
        return prisma.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: (data.role as any) || 'MEMBER',
                passwordHash: tempPassword,
                companyId
            }
        });
    }

    async updateMember(companyId: string, memberId: string, data: { email?: string; firstName?: string; lastName?: string; role?: string }) {
        // Ensure user belongs to company
        const user = await prisma.user.findFirst({ where: { id: memberId, companyId } });
        if (!user) throw new Error("Member not found");

        return prisma.user.update({
            where: { id: memberId },
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role ? (data.role as any) : undefined
            }
        });
    }

    async deleteMember(companyId: string, memberId: string) {
        const user = await prisma.user.findFirst({ where: { id: memberId, companyId } });
        if (!user) throw new Error("Member not found");

        return prisma.user.delete({
            where: { id: memberId }
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
