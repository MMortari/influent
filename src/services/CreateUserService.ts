import { PrismaClient, User, SocialNetwork } from '@prisma/client';

import Password from '../providers/Password';

const prisma = new PrismaClient();

export default class CreateUserService {
  async execute(data: Request): Promise<Response> {
    console.log(data);

    const passwordHash = await Password.generatePassword(data.password);

    if (data.type === 'INFLUENCER' && !data.socialNetwork) {
      throw new Error('Is require to have socialNetwork on influencer');
    }

    const socialNetwork = data.socialNetwork
      ? {
          createMany: {
            data: data.socialNetwork,
          },
        }
      : undefined;

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        passwordHash,
        type: data.type,
        document: data.document,
        interests: data.interests,
        background_img_url: data.background_img_url,
        profile_img_url: data.profile_img_url,
        socialNetwork,
      },
    });

    return {
      message: 'User created',
      success: true,
      userId: user.id,
    };
  }
}

export type Request = UserDTO & {
  socialNetwork?: SocialNetworkDTO[];
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
