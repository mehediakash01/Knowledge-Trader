"use client";

import { motion } from "framer-motion";
import { Code, Palette, BrainCircuit, Briefcase, Music, LayoutTemplate, Shield, Database } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Development", icon: Code, color: "text-blue-500", bg: "hover:bg-blue-500/10", border: "hover:border-blue-500/30", shadow: "hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]" },
  { name: "Design", icon: Palette, color: "text-fuchsia-500", bg: "hover:bg-fuchsia-500/10", border: "hover:border-fuchsia-500/30", shadow: "hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.3)]" },
  { name: "AI & ML", icon: BrainCircuit, color: "text-cyan-500", bg: "hover:bg-cyan-500/10", border: "hover:border-cyan-500/30", shadow: "hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]" },
  { name: "Business", icon: Briefcase, color: "text-emerald-500", bg: "hover:bg-emerald-500/10", border: "hover:border-emerald-500/30", shadow: "hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]" },
  { name: "Music", icon: Music, color: "text-purple-500", bg: "hover:bg-purple-500/10", border: "hover:border-purple-500/30", shadow: "hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]" },
  { name: "Marketing", icon: LayoutTemplate, color: "text-amber-500", bg: "hover:bg-amber-500/10", border: "hover:border-amber-500/30", shadow: "hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]" },
  { name: "Security", icon: Shield, color: "text-red-500", bg: "hover:bg-red-500/10", border: "hover:border-red-500/30", shadow: "hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]" },
  { name: "Data Science", icon: Database, color: "text-sky-500", bg: "hover:bg-sky-500/10", border: "hover:border-sky-500/30", shadow: "hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.3)]" },
];

export function CategoryCloud() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Explore the <span className="text-blue-600 dark:text-cyan-400">Knowledge Cloud</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Whatever you want to master, the experts are already here.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
            >
              <Link 
                href="/bazaar" 
                className={cn(
                  "group flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-md backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-zinc-900/60",
                  cat.bg, cat.border, cat.shadow
                )}
              >
                <div className={cn("transition-transform duration-300 group-hover:scale-110", cat.color)}>
                  <cat.icon className="size-8 sm:size-10" />
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
