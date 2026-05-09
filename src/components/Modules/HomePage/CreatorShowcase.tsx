"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";

const creators = [
  { name: "Alice Dev", kt: "14,500", rep: 4.9, avatar: "" },
  { name: "Bob UI", kt: "12,200", rep: 4.8, avatar: "" },
  { name: "Charlie CEO", kt: "8,900", rep: 4.7, avatar: "" },
  { name: "Diana Data", kt: "18,100", rep: 5.0, avatar: "" },
  { name: "Eve Engineer", kt: "9,300", rep: 4.6, avatar: "" },
];

export function CreatorShowcase() {
  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Knowledge <span className="text-blue-600 dark:text-cyan-400">Titans</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Join the ranks of our top earners who are monetizing their expertise.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-16 flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Left and Right fades */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-linear-to-r from-slate-50 to-transparent dark:from-zinc-950" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-linear-to-l from-slate-50 to-transparent dark:from-zinc-950" />

        <div className="flex w-[200%] animate-[scroll_40s_linear_infinite]">
          {/* Double the list for seamless loop */}
          {[...creators, ...creators, ...creators].map((creator, i) => (
            <div key={i} className="mx-4 flex w-72 shrink-0 flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
              <Avatar className="size-20 border-2 border-white shadow-md dark:border-zinc-800">
                <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-cyan-900/40 dark:text-cyan-400">
                  {creator.name[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">{creator.name}</h3>
              <div className="mt-2 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                  {creator.kt} KT
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  <ShieldCheck className="size-4 text-cyan-400" />
                  {creator.rep}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}
