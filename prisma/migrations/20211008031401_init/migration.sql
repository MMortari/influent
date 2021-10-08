-- CreateEnum
CREATE TYPE "TypeUser" AS ENUM ('INFLUENCER', 'COMPANY');

-- CreateEnum
CREATE TYPE "Interest" AS ENUM ('CARRO', 'ANIMAL', 'VIAGEM', 'TECNOLOGIA', 'MUSICA', 'JOGOS');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('IN_NEGOCIATION', 'WAITING_CREATE_PROJECT', 'REPROVED', 'APPROVED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fistName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "type" "TypeUser" NOT NULL,
    "interests" "Interest"[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialNetwork" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER,
    "main" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "contractProvider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "influencerDelivery" TEXT NOT NULL,
    "companyDelivery" TEXT,
    "influencerPayment" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ProposalStatus" NOT NULL DEFAULT E'IN_NEGOCIATION',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalNegotiation" (
    "id" SERIAL NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "message" TEXT,
    "influencerDelivery" TEXT NOT NULL,
    "companyDelivery" TEXT,
    "influencerPayment" TEXT NOT NULL,
    "approvedByInfluencer" BOOLEAN,
    "approvedByCompany" BOOLEAN,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialNetwork" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD FOREIGN KEY ("influencerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD FOREIGN KEY ("companyId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD FOREIGN KEY ("influencerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD FOREIGN KEY ("companyId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalNegotiation" ADD FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
