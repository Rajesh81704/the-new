import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const companies = await prisma.company.findMany({ take: 5, orderBy: { createdAt: 'desc'} });
    console.log("RECENT COMPANIES:", companies.map(c => ({ id: c.id, code: c.companyCode, subdomain: c.subdomain })));
    
    const users = await prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc'} });
    console.log("RECENT USERS:", users.map(u => ({ id: u.id, email: u.email, role: u.role, companyId: u.companyId })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
