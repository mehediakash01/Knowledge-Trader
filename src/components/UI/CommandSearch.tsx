"use client";

import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { cn } from "@/lib/utils";

interface CommandSearchProps {
  className?: string;
}

export function CommandSearch({ className }: CommandSearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    const params = query ? `?search=${encodeURIComponent(query)}` : "";
    router.push(`/dashboard/bazaar${params}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
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
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search skills, mentors, or trade offers..."
          className="h-10 border-0 bg-transparent px-0 text-base shadow-none placeholder:text-zinc-500 focus-visible:ring-0 dark:placeholder:text-zinc-500"
        />
        <div className="hidden items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-500 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:flex">
          <Sparkles className="size-3.5 text-cyan-400" />
          AI
        </div>
        <Button
          type="submit"
          size="sm"
          className="h-10 rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700 dark:bg-cyan-400 dark:text-zinc-950 dark:hover:bg-cyan-300"
        >
          Search
        </Button>
      </div>
    </motion.form>
  );
}
