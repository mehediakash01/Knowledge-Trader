"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Coins, Sparkles, LockKeyhole, Trophy, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";

const steps = [
  {
    title: "The Token Grant",
    sub: "Day One Empowerment",
    desc: "We don't believe in paywalls blocking access. When you join Knowledge Trader, you are instantly granted 10 Knowledge Tokens (KT). Use them immediately to unlock a premium skill vault and kickstart your learning journey without spending a single dime.",
    icon: Coins,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-500/10 border-amber-500/20",
    svg: (
      <svg viewBox="0 0 100 100" className="h-full w-full opacity-80" fill="none">
        <motion.circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50% 50%" }} />
        <motion.circle cx="50" cy="50" r="20" fill="currentColor" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      </svg>
    ),
  },
  {
    title: "Finding a Match",
    sub: "AI-Powered Architecture",
    desc: "Our proprietary AI Matchmaker doesn't just show you what's popular; it reads your profile, analyzes your goals, and cross-references them against thousands of vaults to find your absolute perfect mentor.",
    icon: Sparkles,
    color: "from-blue-400 to-cyan-400",
    bg: "bg-blue-500/10 border-cyan-500/20",
    svg: (
      <svg viewBox="0 0 100 100" className="h-full w-full opacity-80" fill="none">
        <path d="M20,50 Q50,10 80,50 T20,50" stroke="currentColor" strokeWidth="2" fill="none">
          <animate attributeName="d" values="M20,50 Q50,10 80,50 T20,50; M20,50 Q50,90 80,50 T20,50; M20,50 Q50,10 80,50 T20,50" dur="5s" repeatCount="indefinite" />
        </path>
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "The Atomic Trade",
    sub: "Absolute Data Integrity",
    desc: "Security isn't an afterthought. Our engine executes 'Atomic Trades', ensuring that your KT only leaves your wallet at the exact millisecond the vault is permanently unlocked for you. Zero risk, 100% trust.",
    icon: LockKeyhole,
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    svg: (
      <svg viewBox="0 0 100 100" className="h-full w-full opacity-80" fill="none">
        <rect x="30" y="40" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M40,40 V30 A10,10 0 0,1 60,30 V40" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="55" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Becoming a Mentor",
    sub: "The Wealth Loop",
    desc: "Knowledge is infinite. Once you master a topic, use our AI Course Architect to draft your own vault. Publish it to the Bazaar, earn KT from eager learners, and reinvest it into your own continuous growth.",
    icon: Trophy,
    color: "from-fuchsia-400 to-purple-500",
    bg: "bg-fuchsia-500/10 border-fuchsia-500/20",
    svg: (
      <svg viewBox="0 0 100 100" className="h-full w-full opacity-80" fill="none">
        <polygon points="50,15 90,85 10,85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <motion.polygon points="50,30 75,75 25,75" fill="currentColor" animate={{ rotateY: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50% 50%" }} />
      </svg>
    ),
  },
];

 function HowItWorksPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  const background = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [
      "radial-gradient(ellipse at top left, rgba(245, 158, 11, 0.15), transparent 50%)",
      "radial-gradient(ellipse at center right, rgba(6, 182, 212, 0.15), transparent 50%)",
      "radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.15), transparent 50%)",
      "radial-gradient(ellipse at center, rgba(217, 70, 239, 0.15), transparent 50%)",
    ]
  );

  return (
    <motion.div ref={containerRef} style={{ background }} className="relative bg-slate-50 transition-colors duration-1000 dark:bg-zinc-950">
      
      {/* Page Header */}
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl">
            The <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">Conversion</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
            How we turn arbitrary tokens into boundless expertise.
          </p>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16 text-zinc-400"
        >
          <ArrowDown className="size-8" />
        </motion.div>
      </div>

      {/* Steps */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 pb-32 sm:px-6 lg:px-8">
        <div className="space-y-48">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "flex flex-col items-center gap-12 lg:gap-24",
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                {/* 3D Abstract Visual */}
                <div className="flex w-full flex-1 items-center justify-center lg:w-1/2">
                  <div className={cn(
                    "relative flex aspect-square w-full max-w-md items-center justify-center rounded-[3rem] border bg-white/40 p-12 shadow-2xl backdrop-blur-3xl dark:bg-zinc-900/40",
                    step.bg,
                  )}>
                    {/* The text color provides currentColor to the SVG */}
                    <div className={cn("h-full w-full", `text-transparent bg-clip-text bg-gradient-to-br ${step.color}`)}>
                      {step.svg}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full flex-1 lg:w-1/2">
                  <div className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold uppercase tracking-widest",
                    step.bg,
                  )}>
                    <step.icon className={cn("size-4 text-zinc-900 dark:text-white")} />
                    <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", step.color)}>
                      Step 0{index + 1}
                    </span>
                  </div>
                  <h2 className="mt-6 text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                    {step.title}
                  </h2>
                  <h3 className={cn("mt-2 text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r", step.color)}>
                    {step.sub}
                  </h3>
                  <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
export default withCommonLayout(HowItWorksPage);