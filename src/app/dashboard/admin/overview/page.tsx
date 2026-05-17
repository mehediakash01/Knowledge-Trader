"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRightLeft, BookOpen, Coins, Users } from "lucide-react";

import { AdminPageHeader, EmptyState } from "@/components/Modules/Admin/AdminShared";
import { Card } from "@/components/UI/card";
import { useGetAdminOverviewQuery } from "@/redux/features/admin/adminApi";

const kpiConfig = [
  { key: "totalActiveUsers", label: "Total Active Platform Users", icon: Users },
  { key: "totalActiveBazaarSkillPosts", label: "Total Active Bazaar Skill Posts", icon: BookOpen },
  { key: "totalCompletedBarterTransactions", label: "Total Completed Barter Transactions", icon: ArrowRightLeft },
  { key: "totalCirculatingTokenPoolVolume", label: "Total Circulating Token Pool Volume", icon: Coins },
] as const;

export default function AdminOverviewPage() {
  const { data, isLoading, isError } = useGetAdminOverviewQuery();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Admin Infrastructure"
        title="Overview Command Center"
        description="Live operational totals, registration velocity, and the strongest skill categories moving through the Knowledge Trader economy."
      />

      {isError ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpiConfig.map((item) => {
              const Icon = item.icon;
              const value = data?.totals[item.key] ?? 0;

              return (
                <Card
                  key={item.key}
                  className="rounded-lg border-2 border-zinc-800 bg-white p-5 shadow-[6px_6px_0_#18181b] dark:bg-zinc-950 dark:shadow-[6px_6px_0_#3f3f46]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
                      {item.label}
                    </p>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-zinc-950">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  {isLoading ? (
                    <div className="mt-5 h-10 w-28 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  ) : (
                    <div className="mt-5 text-4xl font-black text-zinc-950 dark:text-zinc-50">
                      {value.toLocaleString()}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ChartPanel title="Registration Spikes Over Time">
              {data?.registrationSeries?.length ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={data.registrationSeries}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="registrations" stroke="#059669" strokeWidth={3} dot />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </ChartPanel>

            <ChartPanel title="Top 5 Heavily Bartered Bazaar Categories">
              {data?.topBarteredCategories?.length ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={data.topBarteredCategories}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="barters" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </ChartPanel>
          </div>
        </div>
      )}
    </div>
  );
}

function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-lg border-2 border-zinc-800 bg-white p-5 dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-black text-zinc-950 dark:text-zinc-50">{title}</h2>
      {children}
    </Card>
  );
}
