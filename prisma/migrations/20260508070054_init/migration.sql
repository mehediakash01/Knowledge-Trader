-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MANAGER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "tokenBalance" INTEGER NOT NULL DEFAULT 10,
    "reputationScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "expertise" TEXT[],
    "interests" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "previewContent" JSONB NOT NULL,
    "lockedContent" JSONB NOT NULL,
    "tokenPrice" INTEGER NOT NULL,
    "images" TEXT[],
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "SkillPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeId" TEXT,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SkillPost_slug_key" ON "SkillPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_tradeId_key" ON "Transaction"("tradeId");

-- AddForeignKey
ALTER TABLE "SkillPost" ADD CONSTRAINT "SkillPost_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SkillPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
