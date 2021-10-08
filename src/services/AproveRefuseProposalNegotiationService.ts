import { PrismaClient, ProposalNegotiation } from '@prisma/client';

export default class AproveRefuseProposalNegotiationService {
  prisma = new PrismaClient();

  async execute({ aproval, id_negotiation, type }: Request): Promise<Response> {
    const data =
      type === 'INFLUENCER'
        ? {
            approvedByInfluencer: aproval,
          }
        : {
            approvedByCompany: aproval,
          };

    const negociation = await this.prisma.proposalNegotiation.update({
      where: {
        id: Number(id_negotiation),
      },
      data,
    });

    if (negociation.approvedByCompany && negociation.approvedByInfluencer) {
      await this.approved(negociation);
    }
    if (negociation.approvedByCompany === false && negociation.approvedByInfluencer === false) {
      await this.repproved(negociation);
    }

    return negociation;
  }

  private async approved(negociation: ProposalNegotiation) {
    if (negociation.approvedByCompany && negociation.approvedByInfluencer) {
      await this.prisma.proposal.update({
        where: {
          id: negociation.id,
        },
        data: {
          status: 'WAITING_CREATE_PROJECT',
        },
      });
    }
  }
  private async repproved(negociation: ProposalNegotiation) {
    await this.prisma.proposal.update({
      where: {
        id: negociation.id,
      },
      data: {
        status: 'REPROVED',
      },
    });
  }
}

export type Request = {
  id_negotiation: number | string;
  type: 'INFLUENCER' | 'COMPANY';
  aproval: boolean;
};
export type Response = ProposalNegotiation;
