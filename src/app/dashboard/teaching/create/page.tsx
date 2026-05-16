"use client";

import { CreateSkillForm } from "@/components/Modules/CreateSkill/CreateSkillForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CreateSkillPage() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-blue-600 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Create Elite Skill
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Design a high-fidelity learning experience with AI-assisted syllabus generation.
          </p>
        </div>

        <div className="hidden lg:block">
          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-cyan-900/30 dark:bg-cyan-950/20">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-cyan-500 dark:text-zinc-950">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Expert Standard</p>
              <p className="text-xs text-zinc-500">Industry-grade listings sell 4x faster.</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CreateSkillForm />
      </motion.div>
    </div>
  );
}
