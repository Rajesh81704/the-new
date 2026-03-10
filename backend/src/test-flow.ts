require('dotenv').config();
import { SuperAdminService } from './services/superAdminService';
import { AuthService } from './services/authService';
import { prisma } from './utils/prisma';

async function test() {
    const sa = new SuperAdminService();
    const auth = new AuthService();

    try {
        console.log("Creating test company...");
        const comp = await sa.createCompany({
            name: "Debug Company " + Date.now(),
            adminEmail: "debug@test.com",
            adminPassword: "password123"
        });
        console.log("Created:", comp.companyCode);

        console.log("Attempting login...");
        const loginRes = await auth.login({
            email: "debug@test.com",
            password: "password123",
            companyCode: comp.companyCode
        });
        console.log("Login successful!", loginRes.user.email);
    } catch (err: any) {
        console.error("Test failed:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}
test();
