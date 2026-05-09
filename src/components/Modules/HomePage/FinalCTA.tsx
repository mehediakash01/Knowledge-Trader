"use client";

import { motion } from "framer-motion";
import { ArrowRight, Hexagon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/UI/button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-32 text-white sm:py-48">
      {/* Star-field / Particle-field background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-zinc-950 to-zinc-950" />
      
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* 3D-styled token representation */}
          <div className="relative mb-8 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute size-32 rounded-full border border-dashed border-cyan-500/50"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute size-24 rounded-full border border-blue-500/50"
            />
            <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 shadow-[0_0_60px_-10px_rgba(34,211,238,0.6)]">
              <Hexagon className="size-10 fill-white/20 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Monetize</span> Your Mind?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-400">
            Join thousands of experts and eager learners in the world's first reputation-backed knowledge exchange. 
            Claim your 10 free KT now.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 rounded-full bg-blue-600 px-8 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.7)]">
              <Link href="/register">
                Start Your Journey <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-lg font-bold text-white backdrop-blur-md hover:bg-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
              <Link href="/bazaar">Explore the Bazaar</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
