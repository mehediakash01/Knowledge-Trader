import httpStatus from "http-status";
import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import AppError from "../../../errors/AppError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import {
  TSkillPostCreateInput,
  TSkillPostFilters,
  TSkillPostUpdateInput,
} from "./skillPost.interface";

type TPaginationOptions = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: string;
};

const createSkillPost = async (
  userId: string,
  payload: TSkillPostCreateInput,
) => {
  const result = await prisma.skillPost.create({
    data: {
      ...payload,
      creatorId: userId,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          reputationScore: true,
        },
      },
    },
  });

  return result;
};

const getAllSkillPosts = async (
  filters: TSkillPostFilters,
  options: TPaginationOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, category, minPrice, maxPrice } = filters;
  const andConditions: Prisma.SkillPostWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: searchTerm,
          },
        },
      ],
    });
  }

  if (category) {
    andConditions.push({
      category: {
        equals: category,
        mode: "insensitive",
      },
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      tokenPrice: {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      },
    });
  }

  const whereConditions: Prisma.SkillPostWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const [data, total] = await Promise.all([
    prisma.skillPost.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            reputationScore: true,
          },
        },
      },
    }),
    prisma.skillPost.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getSingleSkillPost = async (id: string) => {
  const result = await prisma.skillPost.findUnique({
    where: {
      id,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          reputationScore: true,
          expertise: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Skill post not found");
  }

  return result;
};

const updateSkillPost = async (
  id: string,
  userId: string,
  payload: TSkillPostUpdateInput,
) => {
  const skillPost = await prisma.skillPost.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      creatorId: true,
    },
  });

  if (!skillPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Skill post not found");
  }

  if (skillPost.creatorId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own skill posts",
    );
  }

  const result = await prisma.skillPost.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

export const SkillPostServices = {
  createSkillPost,
  getAllSkillPosts,
  getSingleSkillPost,
  updateSkillPost,
};
