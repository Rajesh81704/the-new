import { Request, Response } from 'express';
import { PublicService } from '../services/PublicService';

export class PublicController {
  private publicService: PublicService;

  constructor() {
    this.publicService = new PublicService();
  }

  async submitCompanyApplication(req: Request, res: Response) {
    try {
      const data = req.body;
      const application = await this.publicService.submitCompanyApplication(data);
      res.status(201).json({ message: 'Application submitted successfully', data: application });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
