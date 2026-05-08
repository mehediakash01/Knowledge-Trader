"use client";

import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/UI/input";
import { cn } from "@/lib/utils";

interface CommandSearchProps {
  className?: string;
}

export function CommandSearch({ className }: CommandSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.55, ease: "easeOut" }}
      className={cn(
        "mx-auto w-full max-w-2xl rounded-2xl border border-sky-400/25 bg-white/85 p-2 shadow-2xl shadow-blue-950/10 backdrop-blur-xl dark:border-cyan-300/20 dark:bg-zinc-900/80 dark:shadow-cyan-950/20",
        className
      )}
    >
      <div className="flex min-h-14 items-center gap-3 rounded-xl border border-zinc-200/80 bg-slate-50 px-3 dark:border-white/10 dark:bg-zinc-950">
        <Search className="size-5 shrink-0 text-blue-600 dark:text-cyan-300" />
        <Input
          aria-label="Search skills"
          placeholder="Search skills, mentors, or trade offers..."
          className="h-10 border-0 bg-transparent px-0 text-base shadow-none placeholder:text-zinc-500 focus-visible:ring-0 dark:placeholder:text-zinc-500"
        />
        <div className="hidden items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-500 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:flex">
          <Sparkles className="size-3.5 text-cyan-400" />
          AI
        </div>
      </div>
    </motion.div>
  );
}
