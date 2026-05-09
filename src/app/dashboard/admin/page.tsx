"use client";

import dynamic from "next/dynamic";
import { useGetAdminStatsQuery, useGetTradeAnalyticsQuery } from "@/redux/api/analyticsApi";
import { Card } from "@/components/UI/card";
import { Users, BookOpen, ArrowRightLeft, Coins } from "lucide-react";
import { ProtectedRoute } from "@/components/Shared/ProtectedRoute";
import { ErrorBoundary } from "@/components/Shared/ErrorBoundary";

// Heavy charting library — loaded only when admin page mounts
const AdminChart = dynamic(() => import("./AdminChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center text-zinc-500">
      Loading chart...
    </div>
  ),
});

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: analytics } = useGetTradeAnalyticsQuery();

  const mockAnalytics = [
    { date: "Mon", volume: 120 },
    { date: "Tue", volume: 210 },
    { date: "Wed", volume: 150 },
    { date: "Thu", volume: 380 },
    { date: "Fri", volume: 290 },
    { date: "Sat", volume: 420 },
    { date: "Sun", volume: 510 },
  ];

  const chartData = analytics && analytics.length > 0 ? analytics : mockAnalytics;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Platform Overview
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          High-level statistics and transaction volume across the network.
        </p>
      </div>

      <ErrorBoundary label="Stats service unavailable">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<Users className="size-5" />} loading={statsLoading} />
          <StatCard title="Active Posts" value={stats?.totalPosts ?? 0} icon={<BookOpen className="size-5" />} loading={statsLoading} />
          <StatCard title="Total Trades" value={stats?.totalTrades ?? 0} icon={<ArrowRightLeft className="size-5" />} loading={statsLoading} />
          <StatCard title="KT in Circulation" value={stats?.totalTokensInCirculation ?? 0} icon={<Coins className="size-5" />} loading={statsLoading} />
        </div>
      </ErrorBoundary>

      <Card className="overflow-hidden rounded-[2rem] border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Transaction Volume (KT)</h2>
          <p className="text-sm text-zinc-500">Tokens traded over the past 7 days</p>
        </div>
        <div className="h-80 w-full">
          <ErrorBoundary label="Chart service unavailable">
            <AdminChart data={chartData} />
          </ErrorBoundary>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, loading }: { title: string, value: number | string, icon: React.ReactNode, loading: boolean }) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-[2rem] border-white/60 bg-white/70 p-6 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400">
          {icon}
        </div>
        <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        ) : (
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{value}</span>
        )}
      </div>
    </Card>
  );
}
