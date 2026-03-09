import { prisma } from '../utils/prisma';

export class PostService {
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

    async getDefaultAuthorId(companyId: string): Promise<string> {
        const existingUser = await prisma.user.findFirst({
            where: { companyId },
            orderBy: { createdAt: 'asc' },
        });

        if (existingUser) {
            return existingUser.id;
        }

        const fallbackUser = await prisma.user.create({
            data: {
                email: `member-${Date.now()}@magicallysocial.cloud`,
                passwordHash: 'placeholder',
                role: 'MEMBER',
                firstName: 'Demo',
                lastName: 'User',
                companyId,
            },
        });

        return fallbackUser.id;
    }

    async getFeed(companyId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        // In a real app we might also filter by friends only, etc. This is a generic feed.
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { companyId },
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.post.count({ where: { companyId } })
        ]);

        return {
            posts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async createPost(companyId: string, authorId: string, content: string, mediaUrl?: string) {
        const post = await prisma.post.create({
            data: {
                companyId,
                authorId,
                content,
                mediaUrl,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        return post;
    }
}
