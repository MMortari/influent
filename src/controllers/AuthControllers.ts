import { Request, Response } from 'express';

import AuthService from '../services/AuthService';

class AuthControllers {
  async auth(req: Request, res: Response): Promise<Response> {
    const service = new AuthService();

    const response = await service.execute(req.body);

    return res.status(201).json(response);
  }
}

export default new AuthControllers();
