"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

export function AtomicTrust() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] bg-zinc-950 px-6 py-20 sm:px-16 sm:py-24 lg:px-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Atomic Trust & Integrity
              </h2>
              <p className="mt-6 text-lg text-zinc-400">
                Every trade on the Knowledge Trader platform is executed using atomic database transactions. This guarantees that tokens are only transferred if the vault is successfully unlocked, ensuring absolute data integrity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Minimalist Diagram */}
              <div className="flex flex-col gap-6">
                <Step 
                  icon={<Lock className="size-5" />} 
                  title="1. Lock Funds" 
                  desc="Buyer's KT is temporarily held." 
                  color="text-zinc-400" 
                  bg="bg-zinc-800" 
                  delay={0.2} 
                />
                <div className="ml-8 h-8 w-px border-l-2 border-dashed border-zinc-700" />
                <Step 
                  icon={<CheckCircle2 className="size-5" />} 
                  title="2. Verification" 
                  desc="AI verifies access rights and status." 
                  color="text-blue-400" 
                  bg="bg-blue-900/40 border border-blue-500/30" 
                  delay={0.4} 
                />
                <div className="ml-8 h-8 w-px border-l-2 border-dashed border-zinc-700" />
                <Step 
                  icon={<Unlock className="size-5" />} 
                  title="3. Atomic Unlock" 
                  desc="Tokens transfer & Vault unlocks simultaneously." 
                  color="text-emerald-400" 
                  bg="bg-emerald-900/40 border border-emerald-500/30 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]" 
                  delay={0.6} 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ icon, title, desc, color, bg, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn("flex items-center gap-6 rounded-2xl p-4 transition-all hover:scale-105", bg)}
    >
      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full bg-zinc-950", color)}>
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold text-white">{title}</h4>
        <p className="text-sm text-zinc-400">{desc}</p>
      </div>
    </motion.div>
  );
}
