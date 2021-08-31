import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import CreateUserService from '../services/CreateUserService';

class UserControllers {
  async list(req: Request, res: Response): Promise<Response> {
    const response = await prisma.user.findMany();

    return res.status(200).json(response);
  }
  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const response = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json(response);
  }
  async createUser(req: Request, res: Response): Promise<Response> {
    const service = new CreateUserService();

    const response = await service.execute(req.body);

    return res.status(201).json(response);
  }
}

export default new UserControllers();
