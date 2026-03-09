import bcrypt from 'bcryptjs';
import { prisma } from './utils/prisma';

async function main() {
    const email = 'admin@magicallysocial.com';
    // Use the exact password from the screenshot or the user's instructions if provided. 
    // They are literally trying to log in right now. I will reset it to password123 as they didn't specify.
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if a superadmin exists
    let superAdmin = await prisma.user.findFirst({
        where: { role: 'SUPER_ADMIN', email: email }
    });

    if (superAdmin) {
        // Update password
        await prisma.user.update({
            where: { id: superAdmin.id },
            data: { passwordHash }
        });
        console.log(`Updated Super Admin: ${email} -> ${password}`);
    } else {
        // Find existing user with that email just in case
        const existing = await prisma.user.findFirst({
            where: { email: email }
        });
        if (existing) {
            await prisma.user.update({
                where: { id: existing.id },
                data: { passwordHash, role: 'SUPER_ADMIN' }
            });
            console.log(`Updated Existing User to Super Admin: ${email} -> ${password}`);
        } else {
            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    role: 'SUPER_ADMIN',
                    firstName: 'Super',
                    lastName: 'Admin'
                }
            });
            console.log(`Created new Super Admin: ${email} -> ${password}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
