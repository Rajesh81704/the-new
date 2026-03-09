import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'admin@magicallysocial.com';
    const password = 'MagicSuper@2026';

    const existing = await prisma.user.findFirst({
        where: { email, role: 'SUPER_ADMIN' },
    });

    if (existing) {
        console.log('✅ Super admin already exists:', email);
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            firstName: 'Magically',
            lastName: 'Super',
            role: 'SUPER_ADMIN',
        },
    });

    console.log('🎉 Super admin created successfully!');
    console.log('📧 Email:   ', email);
    console.log('🔒 Password:', password);
    console.log('🆔 User ID: ', user.id);
}

main()
    .catch(e => { console.error('❌ Error:', e.message); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); await pool.end(); });
