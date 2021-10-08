import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import AproveRefuseProposalNegotiationService from '../services/AproveRefuseProposalNegotiationService';

const prisma = new PrismaClient();

class ProposalControllers {
  async list(req: Request, res: Response): Promise<Response> {
    const proposals = await prisma.proposal.findMany();

    return res.json(proposals);
  }

  async info(req: Request, res: Response): Promise<Response> {
    const { id_proposal } = req.params;

    const proposal = await prisma.proposal.findUnique({
      where: {
        id: Number(id_proposal),
      },
      include: {
        negotiations: true,
        company: true,
        influencer: true,
      },
    });

    return res.json(proposal);
  }

  async createNew(req: Request, res: Response): Promise<Response> {
    const { influencerId, companyId, message, influencerDelivery, influencerPayment, companyDelivery } = req.body;

    const proposal = await prisma.proposal.create({
      data: {
        message,
        influencerId: Number(influencerId),
        companyId: Number(companyId),
        negotiations: {
          create: {
            createdBy: companyId,
            influencerDelivery,
            influencerPayment,
            companyDelivery,
          },
        },
      },
    });

    return res.status(201).json(proposal);
  }

  async aprovalProposal(req: Request, res: Response): Promise<Response> {
    const { id_negotiation } = req.params;
    const { type } = req.body;

    const service = new AproveRefuseProposalNegotiationService();

    const proposal = await service.execute({ id_negotiation, type, aproval: true });

    return res.json(proposal);
  }

  async refuseProposal(req: Request, res: Response): Promise<Response> {
    const { id_negotiation } = req.params;
    const { type } = req.body;

    const service = new AproveRefuseProposalNegotiationService();

    const proposal = await service.execute({ id_negotiation, type, aproval: false });

    return res.json(proposal);
  }

  async negociationProposal(req: Request, res: Response): Promise<Response> {
    const { id_proposal } = req.params;
    const { userId, influencerDelivery, influencerPayment, companyDelivery } = req.body;

    const negotiation = await prisma.proposalNegotiation.create({
      data: {
        proposalId: Number(id_proposal),
        createdBy: userId,
        influencerDelivery,
        influencerPayment,
        companyDelivery,
      },
    });

    return res.status(201).json(negotiation);
  }

  async finishProposal(req: Request, res: Response): Promise<Response> {
    const { id_negotiation } = req.params;

    const negotiation = await prisma.proposalNegotiation.findUnique({
      where: {
        id: Number(id_negotiation),
      },
      include: {
        proposal: true,
      },
    });

    if (!negotiation) {
      throw new Error('Negotiation not found');
    }

    const project = await prisma.project.create({
      data: {
        contractProvider: 'Clicksign',
        influencerDelivery: negotiation.influencerDelivery,
        influencerPayment: negotiation.influencerPayment,
        companyDelivery: negotiation.companyDelivery,
        influencerId: negotiation.proposal.influencerId,
        companyId: negotiation.proposal.companyId,
      },
    });

    return res.status(201).json(project);
  }
}

export default new ProposalControllers();
