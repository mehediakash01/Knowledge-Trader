"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, BrainCircuit, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useMatchSkillsMutation } from "@/redux/api/aiApi";
import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/card";
import { Progress } from "@/components/UI/progress";
import { Input } from "@/components/UI/input";

export default function MatchmakerPage() {
  const [matchSkills, { data, isLoading, isError, isSuccess }] = useMatchSkillsMutation();
  const [pulseText, setPulseText] = useState("Scanning your learning profile...");
  const [topic, setTopic] = useState("");

  const handleMatch = () => {
    // We could pass the topic to the backend if the API supports it, 
    // but the prompt says "/ai/match endpoint to suggest skills based on the user's profile."
    // So we just call it. We'll pass void.
    matchSkills();

    const texts = [
      "Analyzing your interests...",
      "Scanning market trends...",
      "Finding high-value skills...",
      "Calculating match scores..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setPulseText(texts[i]);
    }, 1200);

    // Clean up interval when loading stops (handled naturally if component unmounts, but simple hack is ok for demo)
    setTimeout(() => clearInterval(interval), 5000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          <Sparkles className="size-8 text-blue-600 dark:text-cyan-400" />
          AI Matchmaker
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Let our intelligence engine find the perfect skills for your next career move.
        </p>
      </div>

      {!isSuccess && !isLoading && (
        <Card className="overflow-hidden rounded-[2rem] border-white/60 bg-linear-to-br from-blue-500/10 to-cyan-400/5 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:from-blue-900/20 dark:to-cyan-900/10">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner dark:bg-blue-900/40 dark:text-cyan-400">
              <BrainCircuit className="size-10" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Discover Hidden Potential</h2>
            <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
              Our AI analyzes your platform activity, purchased skills, and reviews to find the most valuable knowledge for you.
            </p>
            
            <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
              <Button 
                onClick={handleMatch}
                size="lg"
                className="h-14 w-full rounded-full bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                <Search className="mr-2 size-5" />
                Find My Matches
              </Button>
            </div>
            
            {isError && (
              <p className="mt-4 text-sm font-medium text-red-500">
                Failed to generate matches. Please try again.
              </p>
            )}
          </div>
        </Card>
      )}

      {isLoading && (
        <Card className="flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border-white/60 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/30">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-xl"
          >
            <Sparkles className="size-10" />
          </motion.div>
          <motion.h3 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-8 text-xl font-semibold tracking-tight text-blue-600 dark:text-cyan-400"
          >
            {pulseText}
          </motion.h3>
          <div className="mt-6 w-64">
            <Progress value={undefined} className="h-1 bg-blue-100 dark:bg-blue-950" />
          </div>
        </Card>
      )}

      {isSuccess && data && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your Top Matches</h2>
            <Button variant="ghost" onClick={handleMatch} className="rounded-full">
              Refresh Matches
            </Button>
          </div>

          <div className="grid gap-6">
            {data.matches.map((match, idx) => (
              <motion.div 
                key={match.post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="group overflow-hidden rounded-[2rem] border-white/60 bg-white/70 p-1 shadow-md transition-all hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/60">
                  <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center">
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                          {match.post.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="size-4" />
                          {match.score}% Match
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {match.post.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-300">Why it fits: </span>
                        {match.reason}
                      </p>
                    </div>
                    
                    <div className="flex shrink-0 flex-col items-end justify-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">{match.post.tokenPrice}</span>
                        <span className="ml-1 text-sm font-semibold text-zinc-500">KT</span>
                      </div>
                      <Link href={`/bazaar/${match.post.id}`} className="inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400">
                        View Vault <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {data.matches.length === 0 && (
              <div className="py-12 text-center text-zinc-500">
                No new matches found at the moment.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
