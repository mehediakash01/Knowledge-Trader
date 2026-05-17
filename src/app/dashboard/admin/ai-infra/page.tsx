"use client";

import { Bot, Cpu, Gauge, Sparkles, WalletCards } from "lucide-react";

import { AdminPageHeader, EmptyState } from "@/components/Modules/Admin/AdminShared";
import { Card } from "@/components/UI/card";
import { Progress } from "@/components/UI/progress";
import { useGetAdminAiInfraQuery } from "@/redux/features/admin/adminApi";

const metricCards = [
  { key: "reviewedPosts", label: "AI Reviewed Skill Posts", icon: Sparkles },
  { key: "pendingPosts", label: "Pending Review Queue", icon: Bot },
  { key: "tokenEvents", label: "Tracked Token Events", icon: Cpu },
  { key: "trackedTokenVolume", label: "Tracked Token Volume", icon: WalletCards },
] as const;

export default function AdminAiInfraPage() {
  const { data, isLoading, isError } = useGetAdminAiInfraQuery();
  const sentiment = data?.averageAiSentiment ?? 0;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Model Operations"
        title="AI Metrics & Token Tracker"
        description="Monitor cached AI review activity, sentiment scoring, and token event volume without losing dashboard state while moving between admin tabs."
      />

      {isError ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((item) => {
              const Icon = item.icon;
              const value = data?.[item.key] ?? 0;

              return (
                <Card key={item.key} className="rounded-lg border-2 border-zinc-800 bg-white p-5 dark:bg-zinc-950">
                  <Icon className="size-6 text-emerald-600" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-zinc-950 dark:text-zinc-50">
                    {isLoading ? "..." : value.toLocaleString()}
                  </p>
                </Card>
              );
            })}
          </div>

          <Card className="rounded-lg border-2 border-zinc-800 bg-white p-6 dark:bg-zinc-950">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Gauge className="size-5 text-amber-500" />
                  <h2 className="text-xl font-black text-zinc-950 dark:text-zinc-50">
                    Average AI Sentiment Confidence
                  </h2>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  A compact health readout from the cached review sentiment pipeline.
                </p>
              </div>
              <span className="text-4xl font-black text-zinc-950 dark:text-zinc-50">{sentiment}%</span>
            </div>
            <Progress value={sentiment} className="mt-6 h-3" />
          </Card>
        </div>
      )}
    </div>
  );
}
