import { prisma } from '../utils/prisma';

export class UserService {
    async getMembers(companyId: string) {
        return prisma.user.findMany({
            where: { companyId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                avatarUrl: true,
                createdAt: true,
                // Add city/category/role specific business info later if needed
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getProfile(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                avatarUrl: true,
                bio: true,
                headline: true,
                city: true,
                category: true,
                website: true,
                metadata: true,
                company: {
                    select: { name: true, logoUrl: true, activeModules: true }
                },
            }
        });
    }

    async updateProfile(userId: string, data: any) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                bio: data.bio,
                headline: data.headline,
                city: data.city,
                category: data.category,
                website: data.website,
                metadata: data.metadata,
            }
        });
    }

    async getBusinessCards(userId: string) {
        return prisma.businessCard.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createBusinessCard(userId: string, data: any) {
        return prisma.businessCard.create({
            data: {
                ...data,
                userId
            }
        });
    }

    async updateBusinessCard(userId: string, cardId: string, data: any) {
        // Ensure the card belongs to the user
        const card = await prisma.businessCard.findUnique({ where: { id: cardId } });
        if (!card || card.userId !== userId) throw new Error("Business card not found or unauthorized");

        return prisma.businessCard.update({
            where: { id: cardId },
            data
        });
    }

    async deleteBusinessCard(userId: string, cardId: string) {
        // Ensure the card belongs to the user
        const card = await prisma.businessCard.findUnique({ where: { id: cardId } });
        if (!card || card.userId !== userId) throw new Error("Business card not found or unauthorized");

        return prisma.businessCard.delete({
            where: { id: cardId }
        });
    }

    async getFriends(userId: string) {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: 'ACCEPTED' },
                    { receiverId: userId, status: 'ACCEPTED' },
                ],
            },
            include: {
                requester: {
                    select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true, headline: true, company: { select: { name: true } } }
                },
                receiver: {
                    select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true, headline: true, company: { select: { name: true } } }
                }
            }
        });

        return friendships.map(f => f.requesterId === userId ? f.receiver : f.requester);
    }

    async getPendingRequests(userId: string) {
        const incoming = await prisma.friendship.findMany({
            where: { receiverId: userId, status: 'PENDING' },
            include: {
                requester: {
                    select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true, headline: true, company: { select: { name: true } } }
                }
            }
        });

        const outgoing = await prisma.friendship.findMany({
            where: { requesterId: userId, status: 'PENDING' },
            include: {
                receiver: {
                    select: { id: true, firstName: true, lastName: true, avatarUrl: true, role: true, headline: true, company: { select: { name: true } } }
                }
            }
        });

        return {
            incoming: incoming.map(i => i.requester),
            outgoing: outgoing.map(o => o.receiver)
        };
    }

    async sendFriendRequest(requesterId: string, receiverId: string) {
        if (requesterId === receiverId) throw new Error("Cannot connect with yourself");
        return prisma.friendship.upsert({
            where: { requesterId_receiverId: { requesterId, receiverId } },
            update: { status: 'PENDING' },
            create: { requesterId, receiverId, status: 'PENDING' }
        });
    }

    async handleFriendRequest(userId: string, targetUserId: string, action: 'ACCEPT' | 'REJECT') {
        const friendship = await prisma.friendship.findFirst({
            where: { requesterId: targetUserId, receiverId: userId, status: 'PENDING' }
        });

        if (!friendship) throw new Error("Friend request not found");

        return prisma.friendship.update({
            where: { id: friendship.id },
            data: { status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED' }
        });
    }

    async removeFriendship(userId: string, targetUserId: string) {
        return prisma.friendship.deleteMany({
            where: {
                OR: [
                    { requesterId: userId, receiverId: targetUserId },
                    { requesterId: targetUserId, receiverId: userId },
                ]
            }
        });
    }

    async getEvents(companyId: string) {
        return prisma.event.findMany({
            where: { companyId },
            orderBy: { eventDate: 'asc' }
        });
    }

    async getPodcasts(companyId: string) {
        return prisma.podcast.findMany({
            where: { companyId, status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getBlogs(companyId: string) {
        return prisma.blog.findMany({
            where: { companyId, status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getResources(companyId: string) {
        return prisma.resource.findMany({
            where: { companyId, status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' }
        });
    }
}
