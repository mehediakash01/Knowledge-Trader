"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BadgeCheck, Eye, ShieldCheck, Sparkles } from "lucide-react";

import { Card } from "@/components/UI/card";
import { cn } from "@/lib/utils";
import type { ISkillPost } from "@/types";

type AccessState = "purchased" | "owned" | "locked" | "checking";

const categoryVisuals: Record<
  string,
  {
    glow: string;
    accent: string;
    pattern: "code" | "mesh" | "diagonal" | "orbit";
  }
> = {
  Development: {
    glow: "from-blue-500 via-cyan-400 to-sky-400",
    accent: "from-blue-950/90 via-blue-900/55 to-cyan-500/25",
    pattern: "code",
  },
  Design: {
    glow: "from-fuchsia-500 via-indigo-400 to-cyan-400",
    accent: "from-slate-950/85 via-fuchsia-950/40 to-cyan-500/20",
    pattern: "mesh",
  },
  Business: {
    glow: "from-emerald-500 via-teal-400 to-cyan-300",
    accent: "from-emerald-950/80 via-emerald-900/45 to-teal-500/20",
    pattern: "diagonal",
  },
  Marketing: {
    glow: "from-amber-500 via-orange-400 to-rose-400",
    accent: "from-orange-950/80 via-amber-900/45 to-rose-500/20",
    pattern: "orbit",
  },
  Data: {
    glow: "from-sky-500 via-blue-400 to-indigo-400",
    accent: "from-slate-950/80 via-blue-900/50 to-sky-500/20",
    pattern: "mesh",
  },
  AI: {
    glow: "from-violet-500 via-sky-400 to-cyan-300",
    accent: "from-violet-950/85 via-slate-900/55 to-cyan-500/20",
    pattern: "orbit",
  },
};

const defaultVisual = {
  glow: "from-blue-500 via-cyan-400 to-sky-400",
  accent: "from-slate-950/85 via-blue-900/55 to-cyan-500/20",
  pattern: "mesh" as const,
};

export function getCategoryVisual(category: string) {
  const normalized = categoryVisuals[category] ?? defaultVisual;

  if (/design/i.test(category)) {
    return {
      glow: categoryVisuals.Design.glow,
      accent: categoryVisuals.Design.accent,
      pattern: "mesh" as const,
    };
  }

  if (/(web|dev|code|engineering|frontend|backend)/i.test(category)) {
    return {
      glow: categoryVisuals.Development.glow,
      accent: categoryVisuals.Development.accent,
      pattern: "code" as const,
    };
  }

  if (/(business|startup|sales|finance)/i.test(category)) {
    return {
      glow: categoryVisuals.Business.glow,
      accent: categoryVisuals.Business.accent,
      pattern: "diagonal" as const,
    };
  }

  return normalized;
}

interface SkillCardProps {
  post: ISkillPost;
  accessState: AccessState;
}

export function SkillCard({ post, accessState }: SkillCardProps) {
  const visual = getCategoryVisual(post.category);
  const rating = Math.min(5, Math.max(0, post.creator.reputationScore ?? 4.8));
  const reviewCount = post._count?.reviews ?? 0;
  const thumbnail = post.thumbnail || post.images?.[0];

  return (
    <motion.article
      layout
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group relative h-full"
    >
      <Link href={`/bazaar/${post.id}`} className="absolute inset-0 z-10" aria-label={`View ${post.title}`} />
      <Card className="h-full overflow-hidden border-white/60 bg-white/85 p-0 shadow-[0_16px_42px_-20px_rgba(15,23,42,0.35)] ring-1 ring-blue-950/5 backdrop-blur-xl transition-shadow dark:border-white/10 dark:bg-zinc-950/70 dark:shadow-[0_20px_60px_-24px_rgba(34,211,238,0.2)]">
        <div className="relative aspect-16/10 overflow-hidden">
          <ThumbnailArt category={post.category} visual={visual} src={thumbnail} title={post.title} />

          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/65 via-zinc-950/10 to-transparent" />
          
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {post.category}
            </span>
            {accessState === "purchased" || accessState === "owned" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/20 backdrop-blur-md">
                <BadgeCheck className="size-3.5" />
                {accessState === "owned" ? "Owned" : "Purchased"}
              </span>
            ) : accessState === "checking" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-md">
                <Sparkles className="size-3.5 animate-pulse" />
                Checking access
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">
                <Eye className="size-3.5" />
                Preview
              </span>
            )}
          </div>

          {/* Hover Affordance - View Vault Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
            <div className="flex translate-y-4 items-center gap-2 rounded-full border border-blue-400/50 bg-blue-600/90 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_40px_-5px_rgba(37,99,235,0.8)] transition-transform duration-300 group-hover:translate-y-0">
              Explore Skill <Sparkles className="size-4" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
            <div className="max-w-[70%]">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Knowledge Token
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-semibold tracking-tight">
                  {post.tokenPrice}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md">
                  KT
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="size-3.5 text-cyan-200" />
              {rating.toFixed(1)} ({reviewCount} reviews)
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1"><BadgeCheck className="size-3.5 text-blue-500" /> Verified</span>
            <div className="flex items-center gap-2">
              <span>{post.durationHours ? `${post.durationHours}h` : "4h"} est.</span>
              <span>•</span>
              <span className="text-zinc-900 dark:text-zinc-200">{post.level || "Intermediate"}</span>
            </div>
          </div>

          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-zinc-950 dark:text-white">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {post.shortDescription}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/bazaar?searchTerm=${encodeURIComponent(tag)}`}
                className="relative z-20 rounded-full border border-blue-500/10 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-cyan-300/10 dark:bg-cyan-300/10 dark:text-cyan-200 dark:hover:bg-cyan-300/20"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </motion.article>
  );
}

function ThumbnailArt({
  category,
  visual,
  src,
  title,
}: {
  category: string;
  visual: ReturnType<typeof getCategoryVisual>;
  src?: string;
  title: string;
}) {
  if (src) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-zinc-900">
        <img
          src={src}
          alt={`${title} thumbnail`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-tr from-zinc-950/10 via-transparent to-white/10" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-linear-to-br",
        visual.accent,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.26),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.18),transparent_30%)]" />
      {visual.pattern === "code" ? <CodePattern /> : null}
      {visual.pattern === "mesh" ? <MeshPattern /> : null}
      {visual.pattern === "diagonal" ? <DiagonalPattern /> : null}
      {visual.pattern === "orbit" ? <OrbitPattern /> : null}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="max-w-[70%] text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
          {category}
        </div>
      </div>
      <div className="absolute inset-0 ring-1 ring-white/10" />
      <div className="absolute inset-0 bg-linear-to-tr from-zinc-950/5 via-transparent to-white/10 opacity-80 mix-blend-screen" />
    </div>
  );
}

function CodePattern() {
  return (
    <div className="absolute inset-0 opacity-80">
      <span className="absolute left-7 top-8 text-5xl font-black text-white/10">{"{"}</span>
      <span className="absolute right-7 top-8 text-5xl font-black text-white/10">{"}"}</span>
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/20 bg-white/5 p-4 shadow-2xl shadow-black/15 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="h-2 w-20 rounded-full bg-white/30" />
          <div className="h-2 w-32 rounded-full bg-white/20" />
          <div className="h-2 w-24 rounded-full bg-white/15" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="h-12 rounded-2xl border border-white/15 bg-white/10" />
            <div className="h-12 rounded-2xl border border-white/15 bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MeshPattern() {
  return (
    <div className="absolute inset-0 opacity-90">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(255,255,255,0.22),transparent_22%),radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.14),transparent_20%),radial-gradient(circle_at_70%_75%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_25%_75%,rgba(255,255,255,0.12),transparent_24%)]" />
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(45deg,rgba(255,255,255,0.08)_1px,transparent_1px)]"
        style={{ backgroundSize: "42px 42px" }}
      />
      <div className="absolute inset-x-10 top-8 h-24 rounded-[2rem] border border-white/10 bg-white/5 blur-3xl" />
    </div>
  );
}

function DiagonalPattern() {
  return (
    <div className="absolute inset-0 opacity-85">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.11)_0,rgba(255,255,255,0.11)_12px,transparent_12px,transparent_26px)]" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 shadow-2xl shadow-black/10" />
    </div>
  );
}

function OrbitPattern() {
  return (
    <div className="absolute inset-0 opacity-90">
      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
      <div className="absolute inset-8 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.2),transparent_22%)]" />
      <div className="absolute left-12 top-12 size-5 rounded-full bg-white/50 blur-sm" />
      <div className="absolute right-12 bottom-10 size-7 rounded-full bg-cyan-200/70 blur-sm" />
    </div>
  );
}
