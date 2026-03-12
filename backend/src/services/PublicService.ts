import { prisma } from '../utils/prisma';

export class PublicService {
  async submitCompanyApplication(data: any) {
    const application = await prisma.companyApplication.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        industry: data.industry,
        expectedMembers: data.expectedMembers,
        message: data.message,
        status: 'pending',
      }
    });
    return application;
  }
}
