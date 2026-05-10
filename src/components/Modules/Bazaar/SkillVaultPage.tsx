"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  LockKeyhole, 
  ShieldCheck, 
  Sparkles, 
  UserRound, 
  CheckCircle2,
  ArrowLeftRight,
  Zap,
  BookOpen,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Coins,
  History
} from "lucide-react";

import Link from "next/link";
import { useGetSkillPostByIdQuery } from "@/redux/api/skillPostApi";
import { useGetMyTradesQuery, useExecuteTokenTradeMutation } from "@/redux/api/tradeApi";
import { useAppSelector } from "@/redux/hooks";
import { getCategoryVisual } from "./SkillCard";
import { PurchaseModal } from "./PurchaseModal";
import { BarterModal } from "./BarterModal";
import { VaultRenderer } from "./VaultRenderer";
import { ReviewSection } from "./ReviewSection";
import { Button } from "@/components/UI/button";
import { Skeleton } from "@/components/UI/skeleton";
import { Badge } from "@/components/UI/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SkillVaultPage({ id }: { id: string }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  
  const { data: post, isLoading, isError } = useGetSkillPostByIdQuery(id);
  const { data: tradesData, isLoading: tradesLoading } = useGetMyTradesQuery(undefined, { skip: !user });
  
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);

  // All hooks must be called before any early returns
  const accessState = useMemo(() => {
    if (!user) return "locked";
    if (post && (post.isOwned || user.id === post.creatorId)) return "owned";
    
    const isPurchased = post?.isAccessible || tradesData?.learningTrades.some(
      (trade) => trade.postId === id && trade.status === "COMPLETED"
    );
    
    return isPurchased ? "purchased" : "locked";
  }, [user, post, tradesData, id]);

  // Parsing Syllabus from JSON - hook must be called unconditionally
  const syllabus = useMemo(() => {
    if (!post?.previewContent) return [];
    try {
      return typeof post.previewContent === 'string' 
        ? JSON.parse(post.previewContent) 
        : post.previewContent;
    } catch (e) {
      return [{ title: "Introduction", value: post.previewContent }];
    }
  }, [post?.previewContent]);

  // Early returns come AFTER all hooks
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
  const hasAccess = post.isAccessible || accessState === "purchased" || accessState === "owned";
  const insufficientTokens = user && post && (user.ktBalance ?? 0) < post.tokenPrice;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-zinc-900 py-16 text-white dark:bg-black">
        <div 
          className={cn(
            "absolute inset-0 opacity-30 blur-[120px]",
            visual.glow
          )} 
        />
        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <nav className="flex items-center space-x-2 text-sm font-medium text-zinc-400">
              <Link href="/bazaar" className="transition-colors hover:text-white">Bazaar</Link>
              <span className="select-none">/</span>
              <span className="text-zinc-100">{post.category}</span>
            </nav>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {post.title}
            </h1>
            
            <p className="text-xl text-zinc-400 leading-relaxed">
              {post.shortDescription}
            </p>

            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/10 text-zinc-300 hover:bg-white/20 border-none px-4 py-1.5 rounded-full backdrop-blur-md">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-12 lg:grid-cols-12 lg:px-8">
        {/* Left Column: Content */}
        <div className="space-y-16 lg:col-span-8">
          
          {/* About Section */}
          <section id="about" className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">About this Skill</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {post.longDescription || "No detailed description provided."}
            </div>
          </section>

          {/* Roadmap Visual */}
          <section className="relative rounded-[2.5rem] bg-white p-8 shadow-sm dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800">
            <h3 className="mb-8 flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
              <History className="size-5 text-blue-500" />
              Learning Journey
            </h3>
            <div className="relative">
              <div className="absolute left-6 top-0 h-full w-0.5 bg-linear-to-b from-blue-500 to-transparent opacity-20" />
              <div className="space-y-8">
                {["Fundamentals", "Intermediate Techniques", "Expert Implementation", "Project Delivery"].map((milestone, idx) => (
                  <div key={milestone} className="relative flex items-center gap-6">
                    <div className={cn(
                      "z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-lg ring-4 ring-white dark:ring-zinc-950",
                      idx === 0 ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                    )}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{milestone}</p>
                      <p className="text-sm text-zinc-500">Milestone Phase {idx + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Syllabus Section (Preview Content) */}
          <section id="syllabus" className="space-y-6">
            <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              <BookOpen className="size-8 text-blue-500" />
              What you will learn
            </h2>
            
            <div className="relative">
              <div className={cn(
                "grid gap-6",
                !hasAccess && "max-h-[500px] overflow-hidden"
              )}>
                {Array.isArray(syllabus) ? syllabus.map((item: any, i: number) => (
                  <div key={i} className="group relative flex gap-6 rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:border-blue-500/30 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400">
                      {i % 2 === 0 ? <Zap className="size-6" /> : <GraduationCap className="size-6" />}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{item.title}</h4>
                      <p className="text-zinc-600 dark:text-zinc-400">{item.value || item.content || "Deep dive into this module."}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-zinc-500">Preview content not available.</p>
                )}
              </div>

              {!hasAccess && (
                <div className="absolute inset-x-0 bottom-0 flex h-64 items-end justify-center bg-linear-to-t from-slate-50 via-slate-50/80 to-transparent pb-8 dark:from-zinc-950 dark:via-zinc-950/80">
                  <div className="text-center">
                    <p className="mb-4 font-bold text-zinc-500">Read more after unlocking...</p>
                    <Button 
                      onClick={() => setIsPurchaseModalOpen(true)}
                      variant="outline" 
                      className="rounded-full bg-white dark:bg-zinc-900"
                    >
                      Show all {Array.isArray(syllabus) ? syllabus.length : 0} modules
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* The Vault Section */}
          <section id="vault" className="space-y-8 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                <LockKeyhole className="size-8 text-blue-500" />
                The Knowledge Vault
              </h2>
              {hasAccess && (
                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-4 py-1.5 rounded-full">
                  <CheckCircle2 className="size-4 mr-2" />
                  Unlocked Access
                </Badge>
              )}
            </div>

            <VaultRenderer 
              content={post.lockedContent} 
              isLocked={!hasAccess} 
              tokenPrice={post.tokenPrice}
              onUnlock={() => setIsPurchaseModalOpen(true)}
            />
          </section>

          {/* Review Section */}
          <section id="reviews" className="pt-12">
            <ReviewSection 
              postId={post.id} 
              hasAccess={hasAccess} 
              hasReviewed={post.hasReviewed}
            />
          </section>
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-4">
          <aside className="sticky top-24 space-y-8">
            
            {/* Pricing Card */}
            <div className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-white shadow-2xl ring-1 ring-zinc-200 dark:border-white/10 dark:bg-zinc-900 dark:ring-zinc-800">
              <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Full Access Price</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-black">{post.tokenPrice}</span>
                  <span className="text-xl font-bold opacity-80">KT</span>
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                <Button 
                  onClick={() => setIsPurchaseModalOpen(true)}
                  disabled={hasAccess || tradesLoading || insufficientTokens}
                  className={cn(
                    "w-full rounded-2xl py-8 text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                    hasAccess 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 cursor-default" 
                      : insufficientTokens 
                        ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
                  )}
                >
                  {hasAccess ? (
                    <span className="flex items-center gap-2"><CheckCircle2 className="size-6" /> Already Owned</span>
                  ) : insufficientTokens ? (
                    `Insufficient KT Balance`
                  ) : (
                    "Buy Now with Tokens"
                  )}
                </Button>

                {insufficientTokens && !hasAccess && (
                  <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-900/20">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                      Need {post.tokenPrice - (user?.ktBalance || 0)} more KT
                    </p>
                    <Link href="/dashboard/tasks" className="mt-1 inline-flex items-center text-xs font-bold text-amber-600 underline decoration-2 underline-offset-2">
                      Earn Tokens <ArrowRight className="size-3 ml-1" />
                    </Link>
                  </div>
                )}

                {!hasAccess && (
                  <Button 
                    variant="outline"
                    onClick={() => setIsBarterModalOpen(true)}
                    className="w-full rounded-2xl border-2 border-zinc-200 py-8 text-lg font-bold text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800"
                  >
                    <ArrowLeftRight className="size-5 mr-3 text-blue-500" />
                    Propose a Barter
                  </Button>
                )}

                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                    <span>Lifetime access to vault</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                    <span>Direct chat with creator</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                    <span>Verified resource quality</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Sidebar Card */}
            <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-zinc-500">The Expert</h4>
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                  <UserRound className="size-8" />
                </div>
                <div>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">{post.creator.name}</p>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <span className="text-sm font-medium">{post.creator.reputationScore?.toFixed(1) || "4.9"} Expert Rating</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-8 w-full rounded-xl" asChild>
                <Link href={`/profile/${post.creator.id}`}>View Full Profile</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <PurchaseModal 
        post={post} 
        isOpen={isPurchaseModalOpen} 
        onOpenChange={setIsPurchaseModalOpen}
        onSuccess={() => {
          toast.success("Skill unlocked successfully!");
        }}
      />

      <BarterModal 
        targetSkill={post}
        isOpen={isBarterModalOpen}
        onOpenChange={setIsBarterModalOpen}
      />
    </div>
  );
}

function VaultSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="h-[300px] w-full animate-pulse bg-zinc-200 dark:bg-zinc-900" />
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-12 lg:grid-cols-12 lg:px-8">
        <div className="space-y-8 lg:col-span-8">
          <Skeleton className="h-20 w-3/4 rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
