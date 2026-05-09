"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, LockKeyhole, ShieldCheck, Sparkles, UserRound, CheckCircle2 } from "lucide-react";

import Link from "next/link";
import { useGetSkillPostByIdQuery } from "@/redux/api/skillPostApi";
import { useGetMyTradesQuery } from "@/redux/api/tradeApi";
import { useAppSelector } from "@/redux/hooks";
import { getCategoryVisual } from "./SkillCard";
import { PurchaseModal } from "./PurchaseModal";
import { AIInsights } from "./AIInsights";
import { ReviewSection } from "./ReviewSection";
import { Button } from "@/components/UI/button";
import { Skeleton } from "@/components/UI/skeleton";
import { cn } from "@/lib/utils";

export function SkillVaultPage({ id }: { id: string }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  
  const { data: post, isLoading, isError } = useGetSkillPostByIdQuery(id);
  const { data: tradesData, isLoading: tradesLoading } = useGetMyTradesQuery(undefined, { skip: !user });
  
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const accessState = useMemo(() => {
    if (!user) return "locked";
    if (post && user.id === post.creatorId) return "owned";
    
    const isPurchased = tradesData?.learningTrades.some(
      (trade) => trade.postId === id && trade.status === "COMPLETED"
    );
    
    return isPurchased ? "purchased" : "locked";
  }, [user, post, tradesData, id]);

  const hasAccess = accessState === "purchased" || accessState === "owned";
  
  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Vault Not Found</h2>
        <p className="mt-2 text-zinc-500">The skill post you are looking for does not exist or was removed.</p>
        <Button variant="outline" className="mt-6 rounded-full" onClick={() => router.push("/bazaar")}>
          Return to Bazaar
        </Button>
      </div>
    );
  }

  if (isLoading || !post) {
    return <VaultSkeleton />;
  }

  const visual = getCategoryVisual(post.category);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8 dark:bg-zinc-950">
      {/* Background ambient light based on category */}
      <div 
        className={cn(
          "pointer-events-none absolute left-0 right-0 top-0 h-[500px] opacity-20 blur-[100px] mix-blend-screen dark:opacity-10",
          visual.glow
        )} 
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            Home
          </Link>
          <span className="select-none">/</span>
          <Link href="/bazaar" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            Bazaar
          </Link>
          <span className="select-none">/</span>
          <span className="text-zinc-900 dark:text-white">{post.category}</span>
        </nav>

        {/* Hero Section */}
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                {post.category}
              </span>
              {hasAccess && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5" />
                  Unlocked
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              {post.title}
            </h1>
            
            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              {post.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Creator Card */}
          <div className="w-full shrink-0 rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 md:w-80">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-inner">
                <UserRound className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Created by</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{post.creator.name}</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-zinc-100/50 p-4 dark:bg-zinc-950/50">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-zinc-500">Reputation</span>
                <span className="mt-1 flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-white">
                  <ShieldCheck className="size-4 text-cyan-500" />
                  {post.creator.reputationScore?.toFixed(1) ?? "4.8"}
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex flex-col items-end">
                <span className="text-xs uppercase tracking-wider text-zinc-500">Reviews</span>
                <span className="mt-1 font-semibold text-zinc-900 dark:text-white">
                  {post._count?.reviews ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mt-8">
          <AIInsights postId={post.id} />
        </div>

        {/* Content Vault Section */}
        <div className="mt-12">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            <Sparkles className="size-6 text-blue-500 dark:text-cyan-400" />
            The Vault
          </h2>

          <AnimatePresence mode="wait">
            {hasAccess ? (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="overflow-hidden rounded-[2.5rem] border border-blue-500/20 bg-white p-8 shadow-2xl dark:border-cyan-400/20 dark:bg-zinc-950"
              >
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  {/* Using dangerouslySetInnerHTML if it's HTML, or just text if it's string. Assuming string for now */}
                  <div className="whitespace-pre-wrap text-lg leading-relaxed">
                    {typeof post.lockedContent === 'string' ? post.lockedContent : JSON.stringify(post.lockedContent, null, 2)}
                  </div>
                  
                  {!post.lockedContent && (
                    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <p className="text-zinc-500">The creator hasn't added the locked content yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-zinc-100 p-1 shadow-xl dark:border-white/10 dark:bg-zinc-900/50"
              >
                {/* Blurred placeholder content */}
                <div className="pointer-events-none relative h-80 select-none bg-white/40 p-8 opacity-40 blur-sm dark:bg-zinc-950/40">
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <div className="h-4 w-full rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <div className="h-4 w-5/6 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <div className="mt-8 h-32 w-full rounded-2xl bg-zinc-300 dark:bg-zinc-700" />
                  </div>
                </div>

                {/* Glassmorphic Overlay Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md dark:bg-zinc-950/20">
                  <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/80 p-8 text-center shadow-2xl dark:border-white/10 dark:bg-zinc-900/80">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400">
                      <LockKeyhole className="size-8" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Content Locked</h3>
                    <p className="mt-2 max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
                      Unlock this premium skill to access the vault contents.
                    </p>
                    <Button 
                      onClick={() => setIsPurchaseModalOpen(true)}
                      disabled={tradesLoading}
                      className="mt-6 rounded-full bg-blue-600 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
                    >
                      Unlock for {post.tokenPrice} KT
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Review Section — only visible to purchasers */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ReviewSection postId={post.id} hasAccess={hasAccess} />
      </div>

      <PurchaseModal 
        post={post} 
        isOpen={isPurchaseModalOpen} 
        onOpenChange={setIsPurchaseModalOpen}
        onSuccess={() => {
          // The query will automatically re-fetch because of tags, 
          // but we can trigger any local success events here if needed.
        }}
      />
    </div>
  );
}

function VaultSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-32 rounded-full" />
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-12 w-3/4 rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-48 w-full rounded-[2rem] md:w-80" />
        </div>
        <div className="mt-12">
          <Skeleton className="mb-6 h-8 w-40 rounded-full" />
          <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
