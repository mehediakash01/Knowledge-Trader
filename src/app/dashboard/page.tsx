"use client";

import { useAppSelector } from "@/redux/hooks";
import { useGetMyTradesQuery } from "@/redux/api/tradeApi";
import { Card } from "@/components/UI/card";
import { Wallet, Sparkles, ShoppingBag, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardOverviewPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: trades, isLoading } = useGetMyTradesQuery();

  const completedPurchases = trades?.learningTrades.filter(t => t.status === "COMPLETED") ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Trader'}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Here is what's happening with your knowledge assets today.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border-white/60 bg-linear-to-br from-blue-500/10 to-cyan-400/5 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:from-blue-900/20 dark:to-cyan-900/10">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-cyan-400">
                <Wallet className="size-5" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Token Balance</h3>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">{user?.ktBalance ?? 0}</span>
              <span className="ml-2 font-medium text-zinc-500">KT</span>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ShoppingBag className="size-5" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Skills Unlocked</h3>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">{completedPurchases.length}</span>
              <span className="ml-2 font-medium text-zinc-500">assets</span>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="flex h-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border-dashed border-blue-500/30 bg-blue-50/50 p-6 text-center transition-colors hover:bg-blue-50 dark:border-cyan-400/20 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60">
            <Sparkles className="mb-3 size-8 text-blue-500 dark:text-cyan-400" />
            <h3 className="font-semibold text-zinc-900 dark:text-white">Need inspiration?</h3>
            <Link href="/dashboard/matchmaker" className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-cyan-400">
              Try AI Matchmaker &rarr;
            </Link>
          </Card>
        </motion.div>
      </div>

      <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recently Purchased</h2>
          <Link href="/dashboard/assets" className="text-sm font-medium text-blue-600 hover:underline dark:text-cyan-400">
            View all
          </Link>
        </div>
        
        <div className="mt-4 flex flex-col gap-3">
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading your vault...</p>
          ) : completedPurchases.length > 0 ? (
            completedPurchases.slice(0, 3).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-zinc-950">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-white">{trade.post.title}</h4>
                    <p className="text-sm text-zinc-500">{trade.post.tokenPrice} KT</p>
                  </div>
                </div>
                <Link href={`/bazaar/${trade.post.id}`} className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white">
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">You haven't unlocked any skills yet.</p>
              <Link href="/bazaar" className="mt-4 rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400">
                Explore Bazaar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
