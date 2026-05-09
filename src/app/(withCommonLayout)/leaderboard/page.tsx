"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Trophy, Crown, Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Card } from "@/components/UI/card";
import { cn } from "@/lib/utils";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";

const pioneers = [
  { id: "1", name: "Diana Data", ktBalance: 18100, reputation: 5.0, skillsShared: 15, category: "Data Science" },
  { id: "2", name: "Alice Dev", ktBalance: 14500, reputation: 4.9, skillsShared: 12, category: "Development" },
  { id: "3", name: "Bob UI", ktBalance: 12200, reputation: 4.8, skillsShared: 8, category: "Design" },
  { id: "4", name: "Eve Engineer", ktBalance: 9300, reputation: 4.6, skillsShared: 7, category: "Development" },
  { id: "5", name: "Charlie CEO", ktBalance: 8900, reputation: 4.7, skillsShared: 5, category: "Business" },
  { id: "6", name: "Frank Fullstack", ktBalance: 7800, reputation: 4.5, skillsShared: 4, category: "Development" },
];

 function LeaderboardPage() {
  const topThree = pioneers.slice(0, 3);
  const theRest = pioneers.slice(3);

  // Helper to reorder top 3 for podium (2nd, 1st, 3rd)
  const podiumOrder = [topThree[1], topThree[0], topThree[2]];

  return (
    <div className="min-h-screen bg-slate-50 py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
            <Trophy className="size-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Market <span className="text-blue-600 dark:text-cyan-400">Pioneers</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            The elites of the Knowledge Trader ecosystem. Earning tokens by empowering others.
          </p>
        </motion.div>

        {/* Podium */}
        <div className="mt-24 flex items-end justify-center gap-4 sm:gap-8">
          {podiumOrder.map((creator, index) => {
            if (!creator) return null;
            // Original ranking: topThree[0] is 1st, topThree[1] is 2nd, topThree[2] is 3rd
            const rank = index === 0 ? 2 : index === 1 ? 1 : 3;
            
            const podiumStyles = {
              1: {
                height: "h-[320px]",
                scale: 1.1,
                border: "border-amber-400/50",
                glow: "shadow-[0_0_50px_-10px_rgba(251,191,36,0.4)]",
                badge: "bg-gradient-to-br from-amber-300 to-amber-500",
                icon: <Crown className="size-5 text-white" />,
              },
              2: {
                height: "h-[260px]",
                scale: 1,
                border: "border-zinc-300 dark:border-zinc-500",
                glow: "shadow-[0_0_40px_-10px_rgba(161,161,170,0.3)]",
                badge: "bg-gradient-to-br from-zinc-300 to-zinc-500",
                icon: <span className="font-bold text-white">2</span>,
              },
              3: {
                height: "h-[220px]",
                scale: 0.95,
                border: "border-amber-700/50",
                glow: "shadow-[0_0_30px_-10px_rgba(180,83,9,0.3)]",
                badge: "bg-gradient-to-br from-amber-600 to-amber-800",
                icon: <span className="font-bold text-white">3</span>,
              },
            }[rank];

            return (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                className={cn("relative w-1/3 max-w-[240px] z-10", rank === 1 ? "z-20" : "")}
              >
                <motion.div
                  style={{ scale: podiumStyles?.scale }}
                  className={cn(
                    "flex flex-col items-center justify-start rounded-t-3xl border-t-2 border-x-2 bg-white/80 p-6 backdrop-blur-xl dark:bg-zinc-900/80",
                    podiumStyles?.height,
                    podiumStyles?.border,
                    podiumStyles?.glow
                  )}
                >
                  <div className={cn("absolute -top-6 flex size-12 items-center justify-center rounded-full shadow-lg", podiumStyles?.badge)}>
                    {podiumStyles?.icon}
                  </div>
                  
                  <Avatar className={cn("mt-6 border-4 border-white shadow-md dark:border-zinc-800", rank === 1 ? "size-24" : "size-16")}>
                    <AvatarFallback className="bg-blue-100 text-2xl text-blue-700 dark:bg-cyan-900/40 dark:text-cyan-400">
                      {creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className={cn("mt-4 text-center font-bold text-zinc-900 dark:text-white", rank === 1 ? "text-xl" : "text-lg")}>
                    {creator.name}
                  </h3>
                  
                  <span className="mt-2 flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                    {creator.ktBalance.toLocaleString()} KT
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* The List */}
        <div className="mt-12 flex flex-col gap-4">
          {theRest.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group flex items-center justify-between overflow-hidden rounded-[1.5rem] border-white/60 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:bg-white/80 hover:shadow-xl dark:border-white/5 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60">
                <div className="flex items-center gap-6">
                  <div className="flex w-8 justify-center text-lg font-bold text-zinc-400">
                    #{index + 4}
                  </div>
                  <Avatar className="size-12 border-2 border-white shadow-sm dark:border-zinc-800">
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-cyan-900/40 dark:text-cyan-400">
                      {creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">{creator.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="size-4 text-cyan-400" />
                        {creator.reputation.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{creator.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Mock Sparkline */}
                  <div className="hidden h-8 w-24 items-end gap-1 opacity-50 sm:flex">
                    {[4, 7, 3, 8, 5, 9, 6].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h * 10}%` }}
                        className="w-full rounded-t-sm bg-blue-400 dark:bg-cyan-500" 
                      />
                    ))}
                  </div>

                  <div className="text-right">
                    <span className="block font-bold text-blue-600 dark:text-cyan-400">
                      {creator.ktBalance.toLocaleString()} KT
                    </span>
                    <span className="text-xs text-zinc-500">
                      {creator.skillsShared} Vaults
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default withCommonLayout(LeaderboardPage);