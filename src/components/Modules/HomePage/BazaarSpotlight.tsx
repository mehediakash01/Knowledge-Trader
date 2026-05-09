"use client";

import { motion } from "framer-motion";
import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";
import { Card } from "@/components/UI/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const mockLiveSkills = [
  {
    id: "1",
    title: "Advanced Next.js Architecture",
    category: "Development",
    price: 150,
    rating: 4.9,
    reviews: 124,
    creator: "Alice Dev",
    glow: "from-blue-500 via-cyan-400 to-sky-400",
    delay: 0.1,
  },
  {
    id: "2",
    title: "UX Design Systems Masterclass",
    category: "Design",
    price: 80,
    rating: 4.8,
    reviews: 89,
    creator: "Bob UI",
    glow: "from-fuchsia-500 via-indigo-400 to-cyan-400",
    delay: 0.2,
  },
  {
    id: "3",
    title: "Growth Hacking for Startups",
    category: "Business",
    price: 120,
    rating: 4.7,
    reviews: 56,
    creator: "Charlie CEO",
    glow: "from-emerald-500 via-teal-400 to-cyan-300",
    delay: 0.3,
  },
];

export function BazaarSpotlight() {
  return (
    <section id="spotlight" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Live from the <span className="text-blue-600 dark:text-cyan-400">Bazaar</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Discover the most highly-rated knowledge assets currently trending on our network. 
            Verified by AI and backed by the community.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {mockLiveSkills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: skill.delay, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative h-full"
            >
              <Link href={`/bazaar`} className="absolute inset-0 z-10" aria-label={`View ${skill.title}`} />
              <Card className="h-full overflow-hidden border-white/60 bg-white/80 p-0 shadow-xl ring-1 ring-blue-950/5 backdrop-blur-xl transition-all dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-[0_0_40px_-15px_rgba(34,211,238,0.3)]">
                <div className="relative aspect-video overflow-hidden">
                  <div className={cn("absolute inset-0 bg-linear-to-br opacity-80 mix-blend-screen", skill.glow)} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_28%)]" />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                  
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {skill.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 ring-1 ring-blue-300/30 backdrop-blur-md">
                      <BadgeCheck className="size-3.5" />
                      AI-Verified
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight">{skill.price}</span>
                        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-md">
                          KT
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-zinc-900/60 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                      <ShieldCheck className="size-3.5 text-cyan-400" />
                      {skill.rating} ({skill.reviews})
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-zinc-900 dark:text-white">
                    {skill.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>By {skill.creator}</span>
                    <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-cyan-400">
                      <LockKeyhole className="size-3.5" /> Unlock
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
