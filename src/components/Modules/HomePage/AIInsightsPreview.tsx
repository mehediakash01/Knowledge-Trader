"use client";

import { motion } from "framer-motion";
import { Sparkles, ThumbsUp, ThumbsDown, Activity } from "lucide-react";
import { Card } from "@/components/UI/card";

export function AIInsightsPreview() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <Card className="relative overflow-hidden rounded-[2rem] border-white/10 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Sparkles className="size-5" />
                  <span className="font-bold tracking-wider">AI Smart Reviewer</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                  <Activity className="size-3.5" />
                  Live Analysis
                </div>
              </div>

              <div className="space-y-6">
                {/* Sentiment Gauge */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Overall Sentiment</span>
                    <span className="font-bold text-emerald-400">92% Positive</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-blue-500 to-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-emerald-400">
                      <ThumbsUp className="size-4" /> Pros
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                      <li>• Exceptional depth on server components</li>
                      <li>• Clean, production-ready code examples</li>
                      <li>• Fast response to questions</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-amber-400">
                      <ThumbsDown className="size-4" /> Cons
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                      <li>• Requires prior React knowledge</li>
                      <li>• Fast-paced pacing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Don't read 100 reviews. <br/>
              <span className="text-cyan-400">Read 1 Insight.</span>
            </h2>
            <p className="mt-6 text-lg text-zinc-400">
              Our AI Smart Reviewer reads every single piece of feedback on a vault and generates a real-time, unbiased summary of Pros and Cons. 
              <br /><br />
              Make confident purchase decisions in seconds, not hours.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
