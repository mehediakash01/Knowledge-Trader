import httpStatus from "http-status";
import { prisma } from "../../../../lib/prisma";
import AppError from "../../../errors/AppError";

const executeTokenTrade = async (learnerId: string, postId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const skillPost = await tx.skillPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        tokenPrice: true,
        creatorId: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!skillPost) {
      throw new AppError(httpStatus.NOT_FOUND, "Skill post not found");
    }

    if (skillPost.creatorId === learnerId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot buy your own skill post",
      );
    }

    const existingCompletedTrade = await tx.trade.findFirst({
      where: {
        postId,
        learnerId,
        status: "COMPLETED",
      },
      select: {
        id: true,
      },
    });

    if (existingCompletedTrade) {
      throw new AppError(
        httpStatus.CONFLICT,
        "You have already purchased this skill post",
      );
    }

    const learner = await tx.user.findUnique({
      where: {
        id: learnerId,
      },
      select: {
        id: true,
        tokenBalance: true,
      },
    });

    if (!learner) {
      throw new AppError(httpStatus.NOT_FOUND, "Learner not found");
    }

    if (learner.tokenBalance < skillPost.tokenPrice) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient token balance");
    }

    await tx.user.update({
      where: {
        id: learnerId,
      },
      data: {
        tokenBalance: {
          decrement: skillPost.tokenPrice,
        },
      },
    });

    await tx.user.update({
      where: {
        id: skillPost.creatorId,
      },
      data: {
        tokenBalance: {
          increment: skillPost.tokenPrice,
        },
      },
    });

    const trade = await tx.trade.create({
      data: {
        postId,
        learnerId,
        teacherId: skillPost.creatorId,
        status: "COMPLETED",
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            tokenPrice: true,
          },
        },
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        userId: learnerId,
        tradeId: trade.id,
        amount: skillPost.tokenPrice,
        type: "DEBIT",
      },
    });

    const notification = await tx.notification.create({
      data: {
        userId: skillPost.creatorId,
        title: "New token trade completed",
        message: `${trade.learner.name} purchased "${skillPost.title}" for ${skillPost.tokenPrice} tokens.`,
      },
    });

    return {
      trade,
      transaction,
      notification,
    };
  });

  return result;
};

const getMyTrades = async (userId: string) => {
  const [learningTrades, teachingTrades] = await Promise.all([
    prisma.trade.findMany({
      where: {
        learnerId: userId,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            tokenPrice: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transaction: true,
      },
    }),
    prisma.trade.findMany({
      where: {
        teacherId: userId,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            tokenPrice: true,
          },
        },
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transaction: true,
      },
    }),
  ]);

  return {
    learningTrades,
    teachingTrades,
  };
};

export const TradeServices = {
  executeTokenTrade,
  getMyTrades,
};
