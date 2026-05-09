"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/UI/button";

export function AIMatchmaker() {
  return (
    <section id="matchmaker" className="relative overflow-hidden bg-zinc-950 py-32 text-white">
      {/* Background glowing effects */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[800px] rounded-full bg-blue-600/20 opacity-50 blur-[120px] mix-blend-screen" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[400px] w-[500px] rounded-full bg-cyan-400/20 opacity-50 blur-[80px] mix-blend-screen" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-semibold text-cyan-300">
              <Sparkles className="size-4" />
              Intelligence Suite
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AI Matchmaker</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Stop searching blindly. Our proprietary AI analyzes your learning style, current skills, and market demand to instantly connect you with the perfect mentor and knowledge vault. 
              <br /><br />
              Your perfect mentor is just one click away.
            </p>
            
            <div className="mt-10">
              <Button asChild size="lg" className="rounded-full bg-blue-600 text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-500">
                <Link href="/dashboard/matchmaker">Find My Match</Link>
              </Button>
            </div>
          </motion.div>

          {/* Visual "Brain" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex h-[500px] items-center justify-center lg:h-[600px]"
          >
            {/* Center Node */}
            <div className="relative z-10 flex size-32 items-center justify-center rounded-full border border-blue-400/50 bg-zinc-950 shadow-[0_0_60px_-15px_rgba(56,189,248,0.5)]">
              <BrainCircuit className="size-16 text-cyan-400" />
            </div>

            {/* Orbiting / Connecting Nodes */}
            <Node text="TypeScript" top="10%" left="20%" delay={0.2} />
            <Node text="Next.js Mastery" top="20%" right="10%" delay={0.4} />
            <Node text="UI Design" bottom="15%" left="15%" delay={0.6} />
            <Node text="GraphQL" bottom="25%" right="20%" delay={0.8} />

            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
              <motion.line
                x1="50%" y1="50%" x2="20%" y2="10%"
                stroke="#22d3ee" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.line
                x1="50%" y1="50%" x2="90%" y2="20%"
                stroke="#22d3ee" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              />
              <motion.line
                x1="50%" y1="50%" x2="15%" y2="85%"
                stroke="#22d3ee" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
              />
              <motion.line
                x1="50%" y1="50%" x2="80%" y2="75%"
                stroke="#22d3ee" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Node({ text, top, left, right, bottom, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{ top, left, right, bottom }}
      className="absolute z-20 flex items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-300 shadow-xl backdrop-blur-xl"
    >
      <div className="absolute -inset-0.5 -z-10 animate-pulse rounded-2xl bg-gradient-to-r from-blue-500/50 to-cyan-500/50 opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="mr-2 flex size-2 animate-ping rounded-full bg-cyan-400" />
      {text}
    </motion.div>
  );
}
