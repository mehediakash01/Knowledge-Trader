"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { cn } from "@/lib/utils";
import { useGetAllSkillPostsQuery } from "@/redux/api/skillPostApi";
import type { ISkillPost } from "@/types";
import { getCategoryVisual } from "@/components/Modules/Bazaar/SkillCard";

export function BazaarSpotlight() {
  const { data, isLoading, isError } = useGetAllSkillPostsQuery({
    page: 1,
    limit: 3,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const liveSkills = data?.data ?? [];

  return (
    <section id="spotlight" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-5 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left"
        >
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
              <Sparkles className="size-3.5" />
              Live inventory
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Live from the <span className="text-blue-600 dark:text-cyan-400">Bazaar</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Fresh skills pulled directly from the marketplace, with open thumbnails so learners can inspect the craft before they unlock the vault.
            </p>
          </div>

          <Button asChild variant="outline" className="mx-auto rounded-full border-blue-500/20 bg-white/70 px-5 dark:border-white/10 dark:bg-zinc-950/70 lg:mx-0">
            <Link href="/bazaar">
              Explore Bazaar
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>

        {isError ? (
          <div className="mt-16 rounded-[2rem] border border-dashed border-zinc-300 bg-white/70 p-10 text-center text-sm font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
            Bazaar skills could not be loaded right now.
          </div>
        ) : (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <SpotlightSkeleton key={index} />)
              : liveSkills.map((skill, index) => (
                  <SpotlightCard key={skill.id} skill={skill} delay={index * 0.08} />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SpotlightCard({ skill, delay }: { skill: ISkillPost; delay: number }) {
  const visual = getCategoryVisual(skill.category);
  const thumbnail = skill.thumbnail || skill.images?.[0];
  const rating = Math.min(5, Math.max(0, skill.creator.reputationScore ?? 4.8));
  const reviews = skill._count?.reviews ?? 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group relative h-full"
    >
      <Link href={`/bazaar/${skill.id}`} className="absolute inset-0 z-10" aria-label={`View ${skill.title}`} />
      <Card className="h-full overflow-hidden rounded-[1.75rem] border-white/60 bg-white/85 p-0 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-blue-950/5 backdrop-blur-xl transition-all group-hover:shadow-[0_26px_70px_-30px_rgba(37,99,235,0.55)] dark:border-white/10 dark:bg-zinc-900/80">
        <div className="relative aspect-16/10 overflow-hidden bg-zinc-900">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`${skill.title} thumbnail`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={cn("absolute inset-0 bg-linear-to-br", visual.accent)}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.22),transparent_25%)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/15 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {skill.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-blue-300/30 backdrop-blur-md">
              <BadgeCheck className="size-3.5" />
              Preview Open
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight">{skill.tokenPrice}</span>
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-md">
                  KT
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-zinc-900/60 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="size-3.5 text-cyan-400" />
              {rating.toFixed(1)} ({reviews})
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            <span>{skill.creator?.name || "Knowledge Trader"}</span>
            <span>{skill.tags?.[0] || "Skill"}</span>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-zinc-900 dark:text-white">
            {skill.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {skill.shortDescription}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-cyan-300">
            View live skill
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </motion.article>
  );
}

function SpotlightSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-zinc-900/80">
      <div className="aspect-16/10 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-4 p-5">
        <div className="flex justify-between gap-3">
          <div className="h-4 w-28 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-5 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-5/6 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
