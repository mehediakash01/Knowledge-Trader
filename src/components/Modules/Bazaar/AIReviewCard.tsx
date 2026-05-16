"use client";

import { CheckCircle2, Loader2, Sparkles, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Skeleton } from "@/components/UI/skeleton";
import { cn } from "@/lib/utils";
import type { ISkillAIReview } from "@/redux/api/aiApi";

interface AIReviewCardProps {
  review: ISkillAIReview | null;
  warning?: string;
  isLoading?: boolean;
  isGenerating?: boolean;
  onGenerate?: () => void;
}

const sentimentCopy = (score: number) => {
  if (score >= 90) return { label: "Exceptional", accent: "emerald" };
  if (score >= 70) return { label: "Solid", accent: "blue" };
  if (score < 50) return { label: "Caution", accent: "rose" };
  return { label: "Mixed", accent: "amber" };
};

const meterTone = (score: number) => {
  if (score >= 90) return "from-emerald-500 via-lime-400 to-cyan-400";
  if (score >= 70) return "from-blue-600 via-cyan-400 to-emerald-400";
  if (score < 50) return "from-rose-500 via-orange-400 to-amber-400";
  return "from-amber-500 via-yellow-400 to-emerald-400";
};

export function AIReviewCard({ review, warning, isLoading, isGenerating, onGenerate }: AIReviewCardProps) {
  if (isLoading && !review) {
    return <AuditSkeleton />;
  }

  if (isGenerating) {
    return <AuditSkeleton />;
  }

  if (!review) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Badge className="absolute right-4 top-4 border border-cyan-300/60 bg-cyan-400/10 text-cyan-700 shadow-sm dark:bg-cyan-400/15 dark:text-cyan-200">
          <Sparkles className="mr-1 size-3.5" />
          AI-Powered
        </Badge>

        <div className="space-y-5 pt-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">AI Auditor</p>
            <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
              Skill Analysis Pending
            </h3>
            <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Run a cached audit to estimate purchase quality, surface strengths, and call out risks before spending tokens.
            </p>
          </div>

          {warning ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <div className="flex items-start gap-2">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <span>{warning}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
              No cached audit exists yet. Generate one once, then reuse it on every visit.
            </div>
          )}

          {onGenerate && !warning && (
            <Button
              onClick={onGenerate}
              className="w-full rounded-full bg-zinc-950 text-white shadow-md shadow-zinc-950/15 hover:bg-zinc-800 dark:bg-cyan-400 dark:text-zinc-950 dark:hover:bg-cyan-300"
            >
              <Sparkles className="mr-2 size-4" />
              Generate Analysis
            </Button>
          )}
        </div>
      </div>
    );
  }

  const tone = sentimentCopy(review.sentimentScore);
  const meterClasses = meterTone(review.sentimentScore);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Badge className="absolute right-4 top-4 border border-cyan-300/60 bg-cyan-400/10 text-cyan-700 shadow-sm dark:bg-cyan-400/15 dark:text-cyan-200">
        <Sparkles className="mr-1 size-3.5" />
        AI-Powered
      </Badge>

      <div className="space-y-5 pt-8">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">AI Auditor</p>
              <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Overall Sentiment</h3>
            </div>
            <div className={cn(
              "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.22em]",
              tone.accent === "emerald" && "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
              tone.accent === "blue" && "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200",
              tone.accent === "rose" && "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200",
              tone.accent === "amber" && "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
            )}>
              {tone.label}
            </div>
          </div>

          <div className="space-y-2 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-end justify-between gap-3">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Overall Sentiment: {review.sentimentScore}%</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{tone.label}</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", meterClasses)}
                style={{ width: `${Math.max(0, Math.min(100, review.sentimentScore))}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">{review.summary}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="size-4" />
              Pros
            </h4>
            <ul className="space-y-2">
              {review.pros.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-rose-800 dark:text-rose-200">
              <TriangleAlert className="size-4 text-amber-600 dark:text-amber-300" />
              Cons
            </h4>
            <ul className="space-y-2">
              {review.cons.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-6 text-rose-900 dark:text-rose-100">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {onGenerate && (
          <div className="flex items-center justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <Button
              variant="outline"
              onClick={onGenerate}
              className="rounded-full border-zinc-200 bg-white/90 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <Sparkles className="mr-2 size-4" />
              Refresh Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function AuditSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Badge className="absolute right-4 top-4 border border-cyan-300/60 bg-cyan-400/10 text-cyan-700 shadow-sm dark:bg-cyan-400/15 dark:text-cyan-200">
        <Sparkles className="mr-1 size-3.5" />
        AI-Powered
      </Badge>

      <div className="space-y-5 pt-8">
        <div className="space-y-3">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-8 w-56 rounded-xl" />
          <div className="space-y-2 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <Skeleton className="h-4 w-52 rounded-full" />
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Loader2 className="size-4 animate-spin text-cyan-500" />
          Scanning Syllabus...
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-emerald-50 p-4 dark:border-zinc-800 dark:bg-emerald-500/10">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <Skeleton className="h-4 w-4/6 rounded-full" />
          </div>
          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-rose-50 p-4 dark:border-zinc-800 dark:bg-rose-500/10">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
