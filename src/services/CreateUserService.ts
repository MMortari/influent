import { PrismaClient, User, SocialNetwork } from '@prisma/client';

import Password from '../providers/Password';

const prisma = new PrismaClient();

export default class CreateUserService {
  async execute(data: Request): Promise<Response> {
    console.log(data);

    const passwordHash = await Password.generatePassword(data.user.password);

    const user = await prisma.user.create({
      data: {
        fistName: data.user.fistName,
        lastName: data.user.lastName,
        email: data.user.email,
        username: data.user.username,
        passwordHash,
        type: data.user.type,
        interests: data.user.interests,
        SocialNetwork: {
          createMany: {
            data: data.socialNetwork,
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
  socialNetwork: SocialNetworkDTO[];
};
export type Response = {
  success: boolean;
  message: string;
  userId: number;
};

export type SocialNetworkDTO = Omit<SocialNetwork, 'id' | 'userId'>;
export type UserDTO = Omit<User, 'id' | 'password_hash'> & {
  password: string;
};
