"use client";

import { useEffect, useState } from "react";
import { Sparkles, ThumbsUp, ThumbsDown, BrainCircuit, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { useSummarizeReviewsMutation } from "@/redux/api/aiApi";
import { Button } from "@/components/UI/button";
import { AIActionInfo } from "@/components/Shared/AIActionInfo";

interface AIInsightsProps {
  postId: string;
}

export function AIInsights({ postId }: AIInsightsProps) {
  const [summarizeReviews, { data, isLoading, isError, isSuccess }] = useSummarizeReviewsMutation();
  const [pulseText, setPulseText] = useState("Analyzing Market Trends...");
  const [isModelBusy, setIsModelBusy] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const texts = ["Scanning Reviews...", "Extracting Key Insights...", "Synthesizing Data...", "Finalizing Summary..."];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setPulseText(texts[i]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setIsModelBusy(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsModelBusy(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!data && !isLoading && !isSuccess) {
    return (
      <div className="rounded-[2rem] border border-blue-500/20 bg-linear-to-br from-blue-500/5 to-cyan-400/5 p-6 dark:border-cyan-400/20 dark:from-blue-900/10 dark:to-cyan-900/10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400">
            <BrainCircuit className="size-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">AI Smart Reviewer</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
            Our AI can read all reviews and generate a concise pros/cons summary to help you decide.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button 
              onClick={() => summarizeReviews(postId)}
              className="rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
            >
              <Sparkles className="mr-2 size-4" />
              Generate Insights
            </Button>
            <AIActionInfo
              title="Smart Reviewer"
              description="Reads marketplace reviews and summarizes the strongest pros, cons, and key purchase insights."
            />
          </div>
          {isError && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-xs font-medium text-red-500">Failed to generate insights. Please try again.</p>
              <Button variant="outline" size="sm" onClick={() => summarizeReviews(postId)} className="rounded-full">
                Try Again
              </Button>
            </div>
          )}
          {isModelBusy && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-300">
                <AlertCircle className="size-3.5" />
                Model Busy. Review summary timed out after 30 seconds.
              </p>
              <Button variant="outline" size="sm" onClick={() => summarizeReviews(postId)} className="rounded-full">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-blue-500/20 bg-linear-to-br from-blue-500/5 to-cyan-400/5 p-8 text-center dark:border-cyan-400/20">
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-cyan-400"
          >
            <Sparkles className="size-6" />
          </motion.div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm font-medium text-blue-600 dark:text-cyan-400"
          >
            {pulseText}
          </motion.p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-blue-500/20 bg-white p-6 shadow-lg dark:border-cyan-400/20 dark:bg-zinc-900/50"
    >
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <Sparkles className="size-5 text-blue-500 dark:text-cyan-400" />
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">AI Insights</h3>
      </div>
      
      <p className="mb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {data.summary}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-400">
            <ThumbsUp className="size-4" /> Pros
          </h4>
          <ul className="space-y-2">
            {data.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/20">
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-rose-800 dark:text-rose-400">
            <ThumbsDown className="size-4" /> Cons
          </h4>
          <ul className="space-y-2">
            {data.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-rose-700 dark:text-rose-300">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-500" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
