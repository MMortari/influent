import { PrismaClient, User } from '@prisma/client';

import Password from '../providers/Password';

const prisma = new PrismaClient();

export default class CreateUserService {
  async execute(data: Request): Promise<Response> {
    const passwordHash = await Password.generatePassword(data.user.password);

    const user = await prisma.user.create({
      data: {
        fistName: data.user.fistName,
        lastName: data.user.lastName,
        email: data.user.email,
        username: data.user.username,
        passwordHash,
        type: data.user.type,
        UserInterest: {
          createMany: {
            data: data.interests.map((item) => ({ interestId: item })),
          },
        },
        SocialNetwork: {
          createMany: {
            data: data.socialNetworkUsername,
          },
        },
      },
    });

    return {
      message: 'User created',
      success: true,
      userId: user.id,
    };
  }
}

export type Request = {
  user: UserDTO;
  interests: number[];
  socialNetworkUsername: any[];
};
export type Response = {
  success: boolean;
  message: string;
  userId: number;
};

export type UserDTO = Omit<User, 'id' | 'password_hash'> & {
  password: string;
};
