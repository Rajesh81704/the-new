import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  const comps = await prisma.company.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify({users, comps}, null, 2));
}

run().catch(console.error).finally(()=>prisma.$disconnect());
