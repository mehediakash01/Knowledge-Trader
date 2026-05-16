"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  BookOpen,
  Coins,
  Lightbulb,
  BarChart2,
  RefreshCw,
} from "lucide-react";

import { useGetKnowledgeAnalyticsQuery } from "@/redux/api/aiApi";
import { Card } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { Skeleton } from "@/components/UI/skeleton";
import { Progress } from "@/components/UI/progress";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useGetKnowledgeAnalyticsQuery();
  const [analyticsProgress, setAnalyticsProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setAnalyticsProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setAnalyticsProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + (90 / (30000 / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            <BarChart2 className="size-8 text-blue-600 dark:text-cyan-400" />
            Knowledge Analytics
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            AI-powered insights into your learning growth and knowledge trajectory.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="rounded-full gap-2"
        >
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-6">
          <AnalyticsSkeleton />
          <Card className="rounded-[2rem] border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-xl"
              >
                <Sparkles className="size-10" />
              </motion.div>
              <motion.h3
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xl font-semibold tracking-tight text-blue-600 dark:text-cyan-400"
              >
                Computing your growth metrics...
              </motion.h3>
              <div className="w-96 space-y-2">
                <Progress value={analyticsProgress} className="h-2 bg-blue-100 dark:bg-blue-950" />
                <p className="text-right text-xs font-medium text-zinc-500">{Math.round(analyticsProgress)}%</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {isError && (
        <Card className="flex flex-col items-center justify-center rounded-[2rem] p-12 text-center">
          <p className="text-zinc-500">Failed to load analytics. Please try again.</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4 rounded-full">
            Retry
          </Button>
        </Card>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Headline Banner */}
          <Card className="overflow-hidden rounded-[2rem] border-0 bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl shadow-blue-600/20">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Sparkles className="size-7" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
                  AI Growth Report
                </p>
                <h2 className="mt-1 text-2xl font-bold leading-snug">{data.headline}</h2>
              </div>
            </div>
          </Card>

          {/* Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-[2rem] border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <BookOpen className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Skills Learned</p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white">
                    {data.totalSkillsLearned}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="rounded-[2rem] border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <Coins className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">KT Invested</p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white">
                    {data.totalTokensInvested}
                    <span className="ml-1 text-sm font-semibold text-zinc-400">KT</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Growth Areas */}
          {data.growthAreas.length > 0 ? (
            <Card className="rounded-[2rem] border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
                <TrendingUp className="size-5 text-blue-500" />
                Knowledge Growth by Category
              </h3>
              <div className="space-y-6">
                {data.growthAreas.map((area, idx) => (
                  <motion.div
                    key={area.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {area.category}
                      </span>
                      <span className="font-bold text-blue-600 dark:text-cyan-400">
                        {area.growth}%
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${area.growth}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full",
                          area.growth >= 80
                            ? "bg-linear-to-r from-emerald-500 to-green-400"
                            : area.growth >= 50
                            ? "bg-linear-to-r from-blue-500 to-cyan-400"
                            : "bg-linear-to-r from-amber-500 to-orange-400"
                        )}
                      />
                    </div>
                    <p className="text-xs text-zinc-500">{area.insight}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="rounded-[2rem] border-dashed border-zinc-200 bg-white/50 p-8 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-center">
                <BookOpen className="mx-auto size-12 text-zinc-300 dark:text-zinc-600" />
                <p className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-200">
                  Knowledge Roadmap
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Your AI growth report is warming up. Here is a starter roadmap preview.
                </p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Card className="rounded-2xl border-zinc-200 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
                  <p className="text-sm font-medium text-zinc-500">Skills Gained</p>
                  <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">4 this month</p>
                  <Progress value={45} className="mt-4 h-2" />
                </Card>
                <Card className="rounded-2xl border-zinc-200 bg-white/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
                  <p className="text-sm font-medium text-zinc-500">Tokens Spent</p>
                  <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">120 KT</p>
                  <Progress value={60} className="mt-4 h-2" />
                </Card>
              </div>
            </Card>
          )}

          {/* AI Recommendation */}
          <Card className="rounded-[2rem] border-blue-200/60 bg-linear-to-br from-blue-50 to-cyan-50 p-6 dark:border-blue-900/30 dark:from-blue-950/20 dark:to-cyan-950/20">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-cyan-400">
                <Lightbulb className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-cyan-400">
                  AI Recommendation
                </p>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">{data.topRecommendation}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-32 w-full rounded-[2rem]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-[2rem]" />
        <Skeleton className="h-24 rounded-[2rem]" />
      </div>
      <Skeleton className="h-80 w-full rounded-[2rem]" />
      <Skeleton className="h-20 w-full rounded-[2rem]" />
    </div>
  );
}
