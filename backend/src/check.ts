require('dotenv').config();
import { prisma } from './utils/prisma';
async function main() {
    const c = await prisma.company.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
    console.log("Comps:", JSON.stringify(c, null, 2));
    const u = await prisma.user.findMany({ where: { role: 'ADMIN' }, take: 3, orderBy: { createdAt: 'desc' } });
    console.log("Users:", JSON.stringify(u, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
