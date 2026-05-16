"use client";

import { BookOpen, PenTool, Plus } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";

export default function TeachingDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          My Knowledge Assets
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your purchased skills and create new listings to earn Knowledge Tokens.
        </p>
      </div>

      <Tabs defaultValue="teaching" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2 rounded-full border border-white/60 bg-white/70 p-1 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
          <TabsTrigger value="learning" className="rounded-full px-6 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-cyan-500 dark:data-[state=active]:text-zinc-950">
            <BookOpen className="mr-2 size-4" />
            My Purchases
          </TabsTrigger>
          <TabsTrigger value="teaching" className="rounded-full px-6 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-cyan-500 dark:data-[state=active]:text-zinc-950">
            <PenTool className="mr-2 size-4" />
            My Listings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="learning" className="mt-0">
          <Card className="flex min-h-64 items-center justify-center rounded-[2rem] border-dashed border-white/60 bg-white/40 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
            <p className="text-zinc-500">Your purchased skills will appear here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="teaching" className="mt-0 space-y-6">
          <Card className="flex flex-col items-center justify-center min-h-[300px] rounded-[2rem] border-white/60 bg-white/70 p-6 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50 dark:bg-cyan-900/30">
              <PenTool className="size-8 text-blue-600 dark:text-cyan-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">Ready to share your expertise?</h2>
            <p className="mb-6 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              Use our new 4-Step Elite Course Architect to build a high-fidelity learning experience.
            </p>
            <Link 
              href="/dashboard/teaching/create"
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
            >
              <Plus className="size-4" />
              Create Elite Skill
            </Link>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
