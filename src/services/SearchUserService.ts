import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class SearchUserService {
  async execute({ filters, pagination, type }: Request): Promise<Response> {
    const { page, pageSize } = pagination;

    const followers_filter = filters.follower ? [filters.follower - 1000, filters.follower + 1000] : undefined;

    const search = await prisma.user.findMany({
      where: {
        type,
        SocialNetwork: {
          some: {
            followers: {
              in: followers_filter,
            },
            id: filters.social_network,
          },
        },
        UserInterest: {
          some: {
            interestId: filters.interest,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      page,
      pageSize,
      data: search,
    };
  }
}

export type Request = {
  type: string;

  pagination: {
    page: number;
    pageSize: number;
  };
  filters: {
    follower?: number;
    social_network?: number;
    interest?: number;
  };
};
export type Response = {
  page: number;
  pageSize: number;
  data: any[];
};
