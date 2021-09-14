import { PrismaClient, User } from '@prisma/client';
import { sign } from 'jsonwebtoken';

import Password from '../providers/Password';
import Config from '../config';

const prisma = new PrismaClient();

export default class AuthService {
  async execute({ password, email }: Request): Promise<Response> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        authenticated: false,
        message: 'Wrong email or password',
      };
    }

    const verify = Password.comparePassword(password, user.password_hash);

    if (!verify) {
      return {
        authenticated: false,
        message: 'Wrong email or password',
      };
    }

    const token = sign(
      {
        user,
      },
      Config.jwt,
      {
        expiresIn: '7d',
      }
    );

    return {
      token,
      authenticated: true,
      message: 'User authenticated',
    };
  }
}

export type Request = {
  email: string;
  password: string;
};
export type Response = {
  token?: string;
  authenticated: boolean;
  message: string;
};

export type UserDTO = Omit<User, 'id' | 'password_hash'> & {
  password: string;
};
