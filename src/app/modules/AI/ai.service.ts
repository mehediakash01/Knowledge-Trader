import httpStatus from "http-status";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import AppError from "../../../errors/AppError";
import { aiGateway } from "./ai.gateway";
import {
  TConsultantRequest,
  TCourseArchitectRequest,
  TSkillMatchRequest,
} from "./ai.interface";

const skillMatchSchema = z.object({
  matches: z.array(
    z.object({
      postId: z.string(),
      title: z.string(),
      score: z.number().min(0).max(100),
      reason: z.string(),
    }),
  ),
});

const courseArchitectSchema = z.object({
  longDescription: z.string(),
  specifications: z.array(z.string()),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  estimatedDuration: z.string(),
});

const reviewSummarySchema = z.object({
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  summary: z.string(),
});

const consultantSchema = z.object({
  roadmap: z.array(
    z.object({
      step: z.number(),
      title: z.string(),
      focus: z.string(),
      recommendedSkills: z.array(z.string()),
    }),
  ),
  rationale: z.string(),
});

const skillMatchmaker = async (
  userId: string,
  payload: TSkillMatchRequest,
) => {
  const [user, skills] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        interests: true,
        expertise: true,
      },
    }),
    prisma.skillPost.findMany({
      take: 20,
      orderBy: { tokenPrice: "asc" },
      select: {
        id: true,
        title: true,
        category: true,
        tags: true,
        shortDescription: true,
        tokenPrice: true,
      },
    }),
  ]);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const interests = payload.interests?.length ? payload.interests : user.interests;
  const fallbackData = {
    matches: skills.slice(0, 5).map((skill, index) => ({
      postId: skill.id,
      title: skill.title,
      score: Math.max(90 - index * 7, 60),
      reason: `Matches interests in ${[skill.category, ...skill.tags].join(", ")}.`,
    })),
  };

  return aiGateway.generateStructured(
    `Rank these skills for a learner.
Learner interests: ${JSON.stringify(interests)}
Learner expertise: ${JSON.stringify(user.expertise)}
Skills: ${JSON.stringify(skills)}
Return JSON with matches array containing postId, title, score, reason.`,
    skillMatchSchema,
    fallbackData,
  );
};

const generateCourseContent = async (payload: TCourseArchitectRequest) => {
  const fallbackData = {
    longDescription: `A practical course plan for ${payload.title}, covering core concepts, guided practice, and real-world application.`,
    specifications: [
      "Structured lessons",
      "Hands-on exercises",
      "Project-based learning",
      "Assessment checkpoints",
    ],
    difficulty: "INTERMEDIATE" as const,
    estimatedDuration: "4 weeks",
  };

  return aiGateway.generateStructured(
    `Create course content for title: ${payload.title}.
Return JSON with longDescription, specifications, difficulty, estimatedDuration.`,
    courseArchitectSchema,
    fallbackData,
  );
};

const summarizeReviews = async (postId: string) => {
  const reviews = await prisma.review.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      rating: true,
      comment: true,
    },
  });

  if (!reviews.length) {
    return {
      success: true,
      provider: "mock" as const,
      data: {
        pros: ["No review patterns available yet"],
        cons: ["Not enough learner feedback"],
        summary: "This skill post does not have enough reviews to summarize.",
      },
    };
  }

  const fallbackData = {
    pros: reviews
      .filter((review) => review.rating >= 4)
      .slice(0, 3)
      .map((review) => review.comment),
    cons: reviews
      .filter((review) => review.rating <= 3)
      .slice(0, 3)
      .map((review) => review.comment),
    summary: `Summarized ${reviews.length} review comments.`,
  };

  return aiGateway.generateStructured(
    `Summarize these reviews into pros, cons, and one summary.
Reviews: ${JSON.stringify(reviews)}
Return JSON with pros array, cons array, summary string.`,
    reviewSummarySchema,
    fallbackData,
  );
};

const tradeConsultant = async (
  userId: string,
  payload: TConsultantRequest,
) => {
  const [user, learningTrades, availableSkills] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        interests: true,
        expertise: true,
        tokenBalance: true,
      },
    }),
    prisma.trade.findMany({
      where: {
        learnerId: userId,
        status: "COMPLETED",
      },
      take: 10,
      include: {
        post: {
          select: {
            title: true,
            category: true,
            tags: true,
          },
        },
      },
    }),
    prisma.skillPost.findMany({
      take: 12,
      orderBy: { tokenPrice: "asc" },
      select: {
        title: true,
        category: true,
        tags: true,
        tokenPrice: true,
      },
    }),
  ]);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const trends = payload.trends?.length
    ? payload.trends
    : ["AI automation", "Backend scalability", "Cloud deployment"];
  const fallbackData = {
    roadmap: [
      {
        step: 1,
        title: "Strengthen fundamentals",
        focus: "Close gaps in the user's stated interests and current expertise.",
        recommendedSkills: availableSkills.slice(0, 3).map((skill) => skill.title),
      },
      {
        step: 2,
        title: "Build marketable project depth",
        focus: "Use trending topics to choose applied learning paths.",
        recommendedSkills: availableSkills.slice(3, 6).map((skill) => skill.title),
      },
    ],
    rationale: "Generated from profile interests, completed trades, and current platform supply.",
  };

  return aiGateway.generateStructured(
    `Act as a trade consultant for a skill marketplace.
Goal: ${payload.goal || "Build a high-value learning roadmap"}
User: ${JSON.stringify(user)}
Completed learning trades: ${JSON.stringify(learningTrades)}
Available skills: ${JSON.stringify(availableSkills)}
Trends: ${JSON.stringify(trends)}
Return JSON with roadmap array and rationale.`,
    consultantSchema,
    fallbackData,
  );
};

export const AIServices = {
  skillMatchmaker,
  generateCourseContent,
  summarizeReviews,
  tradeConsultant,
};
