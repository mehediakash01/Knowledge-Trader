"use client";

import { useParams } from "next/navigation";
import { useGetUserProfileQuery } from "@/redux/api/userApi";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";
import { SkillCard } from "@/components/Modules/Bazaar/SkillCard";
import { Skeleton } from "@/components/UI/skeleton";
import { ShieldCheck, UserRound, BookOpen, Star, Globe, Mail } from "lucide-react";
import { Badge } from "@/components/UI/badge";
import { motion } from "framer-motion";

function ProfilePage() {
  const { id } = useParams();
  const { data: profile, isLoading, isError } = useGetUserProfileQuery(id as string);

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !profile) return <div className="p-20 text-center">User not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-zinc-950">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Profile Header */}
        <div className="relative mb-12 overflow-hidden rounded-[3rem] border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 lg:p-12">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-blue-500/10 blur-[100px] dark:bg-cyan-500/5" />
          
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
            <div className="relative">
              <div className="flex size-32 items-center justify-center rounded-[2.5rem] bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-2xl lg:size-40">
                <UserRound className="size-16 lg:size-20" />
              </div>
              <div className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-2xl bg-white p-1 shadow-lg dark:bg-zinc-800">
                <ShieldCheck className="size-6 text-emerald-500" />
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white lg:text-5xl">
                  {profile.name}
                </h1>
                <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">Knowledge Trader & Expert Mentor</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  <Star className="size-5" />
                  <span className="font-bold">{profile.reputationScore.toFixed(1)} Reputation</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-blue-500/10 px-4 py-2 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  <BookOpen className="size-5" />
                  <span className="font-bold">{profile.posts.length} Skills Shared</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {profile.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="rounded-full bg-white px-4 py-1.5 dark:bg-zinc-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="hidden space-y-4 lg:block">
              <div className="flex items-center gap-3 text-zinc-500">
                <Mail className="size-5" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500">
                <Globe className="size-5" />
                <span>Verified Expert</span>
              </div>
            </div>
          </div>
        </div>

        {/* User's Skills Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Shared Knowledge</h2>
            <p className="text-zinc-500">{profile.posts.length} premium skillsets available</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {profile.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SkillCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <Skeleton className="h-64 w-full rounded-[3rem]" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 w-full rounded-[2.5rem]" />)}
        </div>
      </div>
    </div>
  );
}

export default withCommonLayout(ProfilePage);
