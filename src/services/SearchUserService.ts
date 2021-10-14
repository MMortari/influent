import { PrismaClient, Interest, TypeUser } from '@prisma/client';

const prisma = new PrismaClient();

export default class SearchUserService {
  async execute({ filters, pagination, type }: Request): Promise<Response> {
    const { page, pageSize } = pagination;

    const followers_filter = filters.follower ? [filters.follower - 1000, filters.follower + 1000] : undefined;
    const interests_filter = filters.interest
      ? {
          has: filters.interest,
        }
      : undefined;

    const search = await prisma.user.findMany({
      where: {
        type,
        socialNetwork: {
          some: {
            followers: {
              in: followers_filter,
            },
            id: {
              equals: filters.social_network,
            },
          },
        },
        interests: interests_filter,
      },
      skip: page && pageSize ? (page - 1) * pageSize : undefined,
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
  type: TypeUser;

  pagination: {
    page: number;
    pageSize: number;
  };
  filters: {
    follower?: number;
    social_network?: number;
    interest?: Interest;
  };
};
export type Response = {
  page: number;
  pageSize: number;
  data: any[];
};
