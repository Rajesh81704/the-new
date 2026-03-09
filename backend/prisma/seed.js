const { PrismaClient, Role, ContentStatus, SubscriptionStatus } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const superPasswordHash = await bcrypt.hash('MagicSuper@2026', 10);

  const company = await prisma.company.upsert({
    where: { subdomain: 'magicallysocial' },
    update: {
      name: 'Magically Social',
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
    create: {
      name: 'Magically Social',
      subdomain: 'magicallysocial',
      customDomain: 'magicallysocial.cloud',
      companyCode: 'MAGIC2026',
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@magicallysocial.com' },
    update: {
      role: Role.SUPER_ADMIN,
      companyId: company.id,
      passwordHash: superPasswordHash,
      firstName: 'Magic',
      lastName: 'Superadmin',
    },
    create: {
      email: 'admin@magicallysocial.com',
      passwordHash: superPasswordHash,
      role: Role.SUPER_ADMIN,
      firstName: 'Magic',
      lastName: 'Superadmin',
      companyId: company.id,
    },
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@magicallysocial.cloud' },
    update: {
      role: Role.SUPER_ADMIN,
      companyId: company.id,
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
    },
    create: {
      email: 'superadmin@magicallysocial.cloud',
      passwordHash,
      role: Role.SUPER_ADMIN,
      firstName: 'Super',
      lastName: 'Admin',
      companyId: company.id,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@magicallysocial.cloud' },
    update: {
      role: Role.MEMBER,
      companyId: company.id,
      passwordHash,
      firstName: 'Demo',
      lastName: 'Member',
    },
    create: {
      email: 'member@magicallysocial.cloud',
      passwordHash,
      role: Role.MEMBER,
      firstName: 'Demo',
      lastName: 'Member',
      companyId: company.id,
    },
  });

  const existingPosts = await prisma.post.count({ where: { companyId: company.id } });

  if (existingPosts === 0) {
    await prisma.post.createMany({
      data: [
        {
          companyId: company.id,
          authorId: superAdmin.id,
          content: 'Welcome to Magically Social. This feed is now coming from PostgreSQL.',
        },
        {
          companyId: company.id,
          authorId: member.id,
          content: 'Second post from seeded real data. Create new posts to see live updates.',
        },
      ],
    });
  }

  await prisma.event.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {
      companyId: company.id,
      title: 'Founders Networking Evening',
      description: 'Monthly networking meetup for founders and builders.',
      eventDate: new Date('2026-03-20T18:30:00.000Z'),
      location: 'Bangalore',
    },
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      companyId: company.id,
      title: 'Founders Networking Evening',
      description: 'Monthly networking meetup for founders and builders.',
      eventDate: new Date('2026-03-20T18:30:00.000Z'),
      location: 'Bangalore',
    },
  });

  await prisma.blog.upsert({
    where: { id: '22222222-2222-2222-2222-222222222222' },
    update: {
      companyId: company.id,
      title: 'How To Build Community Engagement',
      description: 'Practical framework to keep members active and retained.',
      content: 'This is seeded blog content coming from PostgreSQL.',
      status: ContentStatus.PUBLISHED,
    },
    create: {
      id: '22222222-2222-2222-2222-222222222222',
      companyId: company.id,
      title: 'How To Build Community Engagement',
      description: 'Practical framework to keep members active and retained.',
      content: 'This is seeded blog content coming from PostgreSQL.',
      status: ContentStatus.PUBLISHED,
    },
  });

  await prisma.subscription.upsert({
    where: { companyId: company.id },
    update: {
      planName: 'Professional',
      expiresAt: new Date('2026-12-31T00:00:00.000Z'),
    },
    create: {
      companyId: company.id,
      planName: 'Professional',
      expiresAt: new Date('2026-12-31T00:00:00.000Z'),
    },
  });

  console.log('Seed complete');
  console.log('Login credentials:');
  console.log('admin@magicallysocial.com / MagicSuper@2026');
  console.log('superadmin@magicallysocial.cloud / Admin@123');
  console.log('member@magicallysocial.cloud / Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
