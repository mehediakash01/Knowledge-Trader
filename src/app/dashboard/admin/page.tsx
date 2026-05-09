"use client";

import { useGetAdminStatsQuery, useGetTradeAnalyticsQuery } from "@/redux/api/analyticsApi";
import { Card } from "@/components/UI/card";
import { Users, BookOpen, ArrowRightLeft, Coins } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ProtectedRoute } from "@/components/Shared/ProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: analytics, isLoading: analyticsLoading } = useGetTradeAnalyticsQuery();

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers ?? 0} 
          icon={<Users className="size-5" />} 
          loading={statsLoading} 
        />
        <StatCard 
          title="Active Posts" 
          value={stats?.totalPosts ?? 0} 
          icon={<BookOpen className="size-5" />} 
          loading={statsLoading} 
        />
        <StatCard 
          title="Total Trades" 
          value={stats?.totalTrades ?? 0} 
          icon={<ArrowRightLeft className="size-5" />} 
          loading={statsLoading} 
        />
        <StatCard 
          title="KT in Circulation" 
          value={stats?.totalTokensInCirculation ?? 0} 
          icon={<Coins className="size-5" />} 
          loading={statsLoading} 
        />
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Transaction Volume (KT)</h2>
          <p className="text-sm text-zinc-500">Volume of tokens traded over the past 7 days</p>
        </div>
        
        <div className="h-80 w-full">
          {analyticsLoading ? (
            <div className="flex h-full items-center justify-center text-zinc-500">Loading chart data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '1rem', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    backgroundColor: 'rgba(9, 9, 11, 0.9)', 
                    color: '#fff',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#0f52ba" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#22d3ee' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
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
