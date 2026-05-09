"use client";

import { motion } from "framer-motion";
import { LifeBuoy, Search, Shield, Coins, BookOpen, Activity, Server, Zap } from "lucide-react";
import { Input } from "@/components/UI/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/accordion";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";

 function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Expanded System Status */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 grid grid-cols-3 gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/50"
        >
          <div className="flex flex-col items-center justify-center border-r border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              AI Gateway
            </div>
            <span className="text-xs text-zinc-500">Latency: 45ms</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
              <Server className="size-4 text-emerald-500" />
              Redis Cache
            </div>
            <span className="text-xs text-zinc-500">Hit Rate: 99.8%</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
              <Zap className="size-4 text-emerald-500" />
              Socket Heartbeat
            </div>
            <span className="text-xs text-zinc-500">Connected</span>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Knowledge Base & <span className="text-blue-600 dark:text-cyan-400">Reliability</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to navigate the ecosystem securely.
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto mt-10 max-w-lg">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
            <Input 
              placeholder="Search for answers..." 
              className="h-14 w-full rounded-full border-zinc-300 bg-white pl-12 pr-4 text-lg shadow-md transition-all focus-visible:ring-blue-500 dark:border-white/10 dark:bg-zinc-900/80 dark:focus-visible:ring-cyan-400"
            />
          </div>
        </motion.div>

        {/* Categorized FAQ */}
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <Shield className="size-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Security & Trust</h2>
            </div>
            <Accordion type="single" collapsible className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/40">
              <AccordionItem value="sec-1">
                <AccordionTrigger className="text-left font-semibold">Are my trades atomic?</AccordionTrigger>
                <AccordionContent className="text-zinc-500">
                  Yes. Every trade is processed inside a database transaction block. If the vault decryption fails for any reason, the entire transaction is rolled back. You never lose KT without getting the knowledge.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sec-2">
                <AccordionTrigger className="text-left font-semibold">Who can leave reviews?</AccordionTrigger>
                <AccordionContent className="text-zinc-500">
                  Only users who have successfully spent KT to unlock a vault can leave a review. This completely eliminates bot manipulation and review bombing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Coins className="size-5" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Tokens & Economy</h2>
            </div>
            <Accordion type="single" collapsible className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/40">
              <AccordionItem value="tok-1">
                <AccordionTrigger className="text-left font-semibold">Can I buy more KT with fiat?</AccordionTrigger>
                <AccordionContent className="text-zinc-500">
                  No. Knowledge Tokens (KT) cannot be purchased. They must be earned by sharing your expertise or utilized from your initial 10 KT signup grant. This ensures a pure meritocracy.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tok-2">
                <AccordionTrigger className="text-left font-semibold">What is the platform fee?</AccordionTrigger>
                <AccordionContent className="text-zinc-500">
                  Zero. 100% of the KT spent by a learner goes directly to the creator's wallet. We do not take a cut of your intellectual property.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
export default withCommonLayout(SupportPage);