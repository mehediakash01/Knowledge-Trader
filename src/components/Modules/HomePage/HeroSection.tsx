"use client";

import { ArrowRight, BadgeCheck, Brain, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/hooks";

import { Button } from "@/components/UI/button";
import { CommandSearch } from "@/components/UI/CommandSearch";

const pathTransition = {
  duration: 2.8,
  repeat: Infinity,
  repeatType: "reverse" as const,
  ease: "easeInOut" as const,
};

export function HeroSection() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const getDashboardHref = (path: string) =>
    user ? path : `/login?redirect=${encodeURIComponent(path)}`;

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-zinc-950">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/70 to-transparent" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-600/10 px-3 py-1 text-sm font-medium text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200 lg:mx-0"
          >
            <BadgeCheck className="size-4" />
            Reputation-backed skill exchange
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
            className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-zinc-950 dark:text-slate-50 sm:text-6xl lg:text-7xl"
          >
            Trade Expertise, Not Just Time.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 lg:mx-0"
          >
            Exchange real-world skills through verified offers, transparent
            reputation, and Knowledge Tokens that keep every trade accountable.
          </motion.p>

          <div className="mt-8">
            <CommandSearch />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.5, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button
              type="button"
              size="lg"
              className="h-11 bg-blue-600 px-5 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-400 dark:text-zinc-950 dark:hover:bg-cyan-300"
              onClick={() => router.push(getDashboardHref("/dashboard/trades"))}
            >
              Start Trading
              <ArrowRight className="size-4" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => router.push(getDashboardHref("/dashboard/my-skills"))}
              className="h-11 border-zinc-300 bg-white/70 px-5 backdrop-blur dark:border-white/10 dark:bg-zinc-900/70"
            >
              My Created Skills
            </Button>
          </motion.div>
        </div>

        <KnowledgeFlow />
      </div>
    </section>
  );
}

function KnowledgeFlow() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto aspect-square w-full max-w-140"
      aria-hidden="true"
    >
      <div className="absolute inset-8 rounded-full border border-blue-500/10 bg-white/65 shadow-2xl shadow-blue-950/10 backdrop-blur-2xl dark:border-cyan-300/10 dark:bg-zinc-900/60 dark:shadow-cyan-950/20" />
      <svg
        viewBox="0 0 560 560"
        className="absolute inset-0 h-full w-full"
        role="img"
      >
        <defs>
          <linearGradient id="flowGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="flowGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d="M150 280 C210 110, 350 110, 410 280"
          fill="none"
          stroke="url(#flowGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#flowGlow)"
          initial={{ pathLength: 0.2, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={pathTransition}
        />
        <motion.path
          d="M410 280 C350 450, 210 450, 150 280"
          fill="none"
          stroke="url(#flowGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#flowGlow)"
          initial={{ pathLength: 1, opacity: 0.9 }}
          animate={{ pathLength: 0.2, opacity: 0.35 }}
          transition={pathTransition}
        />
        <motion.circle
          cx="280"
          cy="280"
          r="86"
          fill="none"
          stroke="#22d3ee"
          strokeDasharray="4 12"
          strokeLinecap="round"
          initial={{ rotate: 0, opacity: 0.4 }}
          animate={{ rotate: 360, opacity: 0.7 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "280px 280px" }}
        />
      </svg>

      <FlowNode
        className="left-4 top-1/2 -translate-y-1/2 sm:left-8"
        icon={<GraduationCap className="size-7" />}
        label="Learner"
        metric="Needs React mastery"
      />
      <FlowNode
        className="right-4 top-1/2 -translate-y-1/2 sm:right-8"
        icon={<Brain className="size-7" />}
        label="Teacher"
        metric="Offers system design"
      />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 flex size-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/25 bg-zinc-950 text-center text-sm font-semibold text-slate-50 shadow-2xl shadow-cyan-500/25 dark:bg-slate-50 dark:text-zinc-950"
      >
        Knowledge
        <br />
        Flow
      </motion.div>
    </motion.div>
  );
}

function FlowNode({
  className,
  icon,
  label,
  metric,
}: {
  className: string;
  icon: ReactNode;
  label: string;
  metric: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute flex w-36 flex-col items-center rounded-2xl border border-blue-500/15 bg-white/85 p-4 text-center shadow-xl shadow-blue-950/10 backdrop-blur-xl dark:border-cyan-300/15 dark:bg-zinc-900/85 dark:shadow-cyan-950/20 ${className}`}
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white dark:bg-cyan-400 dark:text-zinc-950">
        {icon}
      </div>
      <div className="mt-3 text-sm font-semibold">{label}</div>
      <div className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {metric}
      </div>
    </motion.div>
  );
}
