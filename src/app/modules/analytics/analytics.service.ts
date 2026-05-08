import { prisma } from "../../../../lib/prisma";

const getAdminStats = async () => {
  const [totalUsers, totalSkillPosts, tokenAggregate, totalTrades, totalReviews] =
    await Promise.all([
      prisma.user.count(),
      prisma.skillPost.count(),
      prisma.user.aggregate({
        _sum: {
          tokenBalance: true,
        },
      }),
      prisma.trade.count(),
      prisma.review.count(),
    ]);

  return {
    totalUsers,
    totalSkillPosts,
    totalTokensInCirculation: tokenAggregate._sum.tokenBalance || 0,
    totalTrades,
    totalReviews,
  };
};

const getTradeAnalytics = async (groupBy: "date" | "category" = "date") => {
  const trades = await prisma.trade.findMany({
    where: {
      status: "COMPLETED",
    },
    include: {
      post: {
        select: {
          category: true,
          tokenPrice: true,
        },
      },
      transaction: {
        select: {
          amount: true,
          createdAt: true,
        },
      },
    },
  });

  const chartMap = new Map<
    string,
    { label: string; trades: number; tokenVolume: number }
  >();

  trades.forEach((trade) => {
    const label =
      groupBy === "category"
        ? trade.post.category
        : (trade.transaction?.createdAt || new Date())
            .toISOString()
            .slice(0, 10);
    const current = chartMap.get(label) || {
      label,
      trades: 0,
      tokenVolume: 0,
    };

    current.trades += 1;
    current.tokenVolume += trade.transaction?.amount || trade.post.tokenPrice;
    chartMap.set(label, current);
  });

  return Array.from(chartMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
};

export const AnalyticsServices = {
  getAdminStats,
  getTradeAnalytics,
};
