import { PrismaClient, User } from '@prisma/client';
import { sign } from 'jsonwebtoken';

import Password from '../providers/Password';
import Config from '../config';

const prisma = new PrismaClient();

export default class AuthService {
  async execute({ password, username }: Request): Promise<Response> {
    if (!password || !username) {
      throw new Error('Password and username is required');
    }

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return {
        authenticated: false,
        message: 'Wrong email or password',
      };
    }

    const verify = Password.comparePassword(password, user.passwordHash);

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
      user,
    };
  }
}

export type Request = {
  username: string;
  password: string;
};
export type Response = {
  token?: string;
  authenticated: boolean;
  message: string;
  user?: User;
};

export type UserDTO = Omit<User, 'id' | 'password_hash'> & {
  password: string;
};
