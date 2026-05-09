"use client";

import { motion } from "framer-motion";
import { Coins, ArrowRightLeft, Key } from "lucide-react";
import { Card } from "@/components/UI/card";

export function EconomyBento() {
  return (
    <section id="economy" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            The <span className="text-blue-600 dark:text-cyan-400">Knowledge Token</span> Economy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            A frictionless ecosystem where your expertise has intrinsic value. Trade directly, unlock securely, and grow your wealth.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {/* Box 1: 10 KT Startup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="md:col-span-1"
          >
            <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Coins className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">10 KT Startup</h3>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Every new user is granted 10 Knowledge Tokens (KT) upon registration. Use it to unlock your first skills and jumpstart your journey.
              </p>
              <div className="mt-auto pt-8">
                <div className="flex h-32 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-950/50">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-black text-amber-500">+10</span>
                    <span className="text-xl font-bold text-zinc-400">KT</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Box 2: Zero-Fee Exchange */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="md:col-span-1"
          >
            <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <ArrowRightLeft className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Zero-Fee Exchange</h3>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                When you trade a skill, 100% of the KT goes directly to the creator. No middlemen. No platform taxes. Pure peer-to-peer exchange.
              </p>
              <div className="mt-auto pt-8">
                <div className="flex h-32 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-950/50">
                  <div className="flex items-center gap-6">
                    <div className="flex size-12 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">🧑</div>
                    <ArrowRightLeft className="size-6 text-zinc-400" />
                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-xl dark:bg-cyan-900/40">👩‍🏫</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Box 3: Instant Unlocking */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="md:col-span-1"
          >
            <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Key className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Instant Unlocking</h3>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Purchased a skill? The transaction uses atomic database commits. The vault is instantly decrypted and permanently added to your assets.
              </p>
              <div className="mt-auto pt-8">
                <div className="flex h-32 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-950/50">
                  <div className="relative">
                    <Key className="size-12 animate-pulse text-emerald-500" />
                    <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
