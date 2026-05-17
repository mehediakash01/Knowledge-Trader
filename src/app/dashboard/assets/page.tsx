"use client";

import { useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, PenTool, Plus } from "lucide-react";

import { Card } from "@/components/UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { Badge } from "@/components/UI/badge";
import { Skeleton } from "@/components/UI/skeleton";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { useGetMySkillsQuery } from "@/redux/api/skillPostApi";

export default function TeachingDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: mySkills, isLoading } = useGetMySkillsQuery(user?.id ?? "", {
    skip: !user?.id,
  });

  const mySkillsList = mySkills?.data ?? [];
  const recentSkills = useMemo(() => mySkillsList.slice(0, 6), [mySkillsList]);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              My Knowledge Assets
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
              Manage your purchased skills and track your live listings without leaving the dashboard.
            </p>
          </div>
          <Badge className="w-fit rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-600">
            {mySkillsList.length} posted skills
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="teaching" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2 rounded-full border border-zinc-100 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
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
          <Card className="flex min-h-64 items-center justify-center rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <p className="text-zinc-500">Your purchased skills will appear here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="teaching" className="mt-0 space-y-6">
          <Card className="flex min-h-75 flex-col items-center justify-center rounded-[2rem] border border-zinc-100 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
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

          <Card className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recently Posted Skills</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">This list updates as soon as a new skill is published.</p>
              </div>
              <Badge variant="outline" className="rounded-full border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                {mySkillsList.length} total
              </Badge>
            </div>

            <div className="mt-6 grid gap-3">
              {isLoading ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
                  ))}
                </div>
              ) : recentSkills.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {recentSkills.map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/bazaar/${skill.id}`}
                      className={cn(
                        "group rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-200 hover:bg-white hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                            {skill.category}
                          </p>
                          <h4 className="mt-1 line-clamp-1 text-base font-bold text-zinc-900 dark:text-white">
                            {skill.title}
                          </h4>
                        </div>
                        <Badge className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm shadow-emerald-600/20">
                          {skill.tokenPrice} KT
                        </Badge>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {skill.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                        <span>
                          Posted {skill.createdAt ? formatDistanceToNow(new Date(skill.createdAt), { addSuffix: true }) : "recently"}
                        </span>
                        <span className="font-medium text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white">
                          Open listing →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-6 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
                  <p className="text-zinc-500 dark:text-zinc-400">You have not published any skills yet.</p>
                  <Link 
                    href="/dashboard/teaching/create"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
                  >
                    <Plus className="size-4" />
                    Publish your first skill
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
