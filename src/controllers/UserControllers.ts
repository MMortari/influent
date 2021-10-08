import { Request, Response } from 'express';
import { PrismaClient, TypeUser } from '@prisma/client';

import CreateUserService from '../services/CreateUserService';
import SearchUserService from '../services/SearchUserService';

const prisma = new PrismaClient();

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
      include: {
        SocialNetwork: true,
      },
    });

    return res.status(200).json(response);
  }
  async createUser(req: Request, res: Response): Promise<Response> {
    const service = new CreateUserService();

    const response = await service.execute(req.body);

    return res.status(201).json(response);
  }
  async searchUser(req: Request, res: Response): Promise<Response> {
    const { type } = req.params;
    const { page, pageSize, follower, social_network, interest } = req.query as { [a: string]: any };

    const service = new SearchUserService();

    const response = await service.execute({
      type: type as TypeUser,
      filters: {
        follower,
        social_network,
        interest,
      },
      pagination: {
        page,
        pageSize,
      },
    });

    return res.status(201).json(response);
  }
}

export default new UserControllers();
