"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, BadgeCheck, BrainCircuit, Sparkles, TrendingUp, Zap } from "lucide-react";

import { useGetAIMatchesQuery } from "@/redux/api/aiApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import { Progress } from "@/components/UI/progress";
import { Skeleton } from "@/components/UI/skeleton";

function getProfileStrength(
  user:
    | {
        image?: string | null;
        bio?: string | null;
        tagline?: string | null;
        socialLinks?: Array<{ platform: string; url: string }>;
        experience?: Array<{ title: string; company: string; duration: string }>;
        expertise?: Array<{ name: string; level: "Beginner" | "Intermediate" | "Expert" }>;
        learningPath?: Array<{ name: string; priority: number }>;
      }
    | null
    | undefined,
) {
  if (!user) return 0;

  let score = 0;
  if (user.image) score += 15;
  if (user.bio?.trim()) score += 15;
  if (user.tagline?.trim()) score += 10;
  if (user.socialLinks?.length) score += 10;
  if (user.experience?.length) score += 15;
  if (user.expertise?.length) score += 20;
  if (user.learningPath?.length) score += 15;
  return Math.min(100, score);
}

function getStrengthLabel(score: number, ready: boolean) {
  if (!ready) return "Persona incomplete";
  if (score >= 80) return "Elite";
  if (score >= 55) return "Strong";
  return "Building";
}

function getStrengthTone(score: number, ready: boolean) {
  if (!ready) {
    return "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300";
  }

  if (score >= 80) {
    return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300";
  }

  if (score >= 55) {
    return "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300";
  }

  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300";
}

export default function MatchmakerPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [pulseText, setPulseText] = useState("Scanning your Persona for perfect trades...");
  const [matchProgress, setMatchProgress] = useState(0);
  const { data: liveUser, isFetching: isMeFetching, refetch: refetchMe } = useGetMeQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });
  const activeUser = liveUser ?? user;
  const profileStrength = useMemo(() => getProfileStrength(activeUser), [activeUser]);
  const hasExpertise = (activeUser?.expertise?.length ?? 0) > 0;
  const hasLearningPath = (activeUser?.learningPath?.length ?? 0) > 0;
  const personaReady = hasExpertise && hasLearningPath;
  const isPersonaHydrating = Boolean(user) && isMeFetching && !liveUser;
  const eliteEligible = personaReady && profileStrength >= 80;

  console.log("Matchmaker Check - Expertise:", activeUser?.expertise);

  const { data, isLoading, isError, isSuccess, refetch } = useGetAIMatchesQuery(undefined, {
    skip: !activeUser || !personaReady || isPersonaHydrating,
    refetchOnMountOrArgChange: true,
  });
  const topMatches = data?.matches?.slice(0, 6) ?? [];

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("kt-profile-updated-at")) {
      localStorage.removeItem("kt-profile-updated-at");
      refetchMe();
    }
  }, [refetchMe]);

  useEffect(() => {
    if (!isLoading) return;

    const progressInterval = setInterval(() => {
      setMatchProgress((prev) => {
        if (prev >= 92) return 92;
        return Math.min(92, prev + 4);
      });
    }, 120);

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;

    const texts = [
      "Scanning your Persona for perfect trades...",
      "Reading your expertise matrix...",
      "Cross-checking seller learning paths...",
      "Ranking reciprocal match scores...",
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setPulseText(texts[index]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleMatch = () => {
    setMatchProgress(0);
    refetch();
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
          <Sparkles className="size-4" />
          Reciprocal Intelligence
        </div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-4xl">
          <BrainCircuit className="size-8 text-blue-600 dark:text-cyan-400" />
          Perfect Match Grid
        </h1>
        <p className="max-w-3xl text-zinc-600 dark:text-zinc-400">
          The matchmaker now reads your structured persona, ranks reciprocal trade opportunities, and falls back to trending skills only when the database has no true two-way match.
        </p>
      </div>

      <Card className="rounded-[2rem] border border-zinc-300 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-zinc-900/60">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`rounded-full px-3 py-1 text-xs font-semibold ${getStrengthTone(profileStrength, personaReady)}`}>
                {getStrengthLabel(profileStrength, personaReady)}
              </Badge>
              {eliteEligible ? (
                <Badge className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600">
                  Elite status unlocked
                </Badge>
              ) : null}
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Profile Strength</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                The stronger your persona, the sharper the reciprocal ranking.
              </p>
            </div>
          </div>

          <div className="w-full max-w-xl space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-300">
              <span>{profileStrength}% complete</span>
              <span>{personaReady ? "Ready for matching" : "Complete expertise + learning path first"}</span>
            </div>
            <Progress value={profileStrength} className="h-2 bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="rounded-full border border-zinc-200 px-2.5 py-1 dark:border-zinc-700">Persona Check</span>
              <span className="rounded-full border border-zinc-200 px-2.5 py-1 dark:border-zinc-700">Reciprocal Search</span>
              <span className="rounded-full border border-zinc-200 px-2.5 py-1 dark:border-zinc-700">Trending Fallback</span>
            </div>
          </div>
        </div>
      </Card>

      {!user ? (
        <Card className="overflow-hidden rounded-[2rem] border-white/60 bg-linear-to-br from-amber-500/10 to-orange-400/5 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:from-amber-900/20 dark:to-orange-900/10">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner dark:bg-amber-900/40 dark:text-orange-400">
              <Sparkles className="size-10" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Complete your persona first</h2>
            <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
              Add expertise and a learning roadmap in Settings so the reciprocal engine can rank true two-way trades.
            </p>
            <Button
              onClick={() => router.push("/dashboard/settings")}
              size="lg"
              className="mt-8 h-14 rounded-full bg-amber-600 px-10 text-base font-semibold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 dark:bg-orange-500 dark:text-zinc-950 dark:hover:bg-orange-400"
            >
              Complete Persona
            </Button>
          </div>
        </Card>
      ) : null}

      {isLoading ? (
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[2rem] border border-zinc-300 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900/60">
            <div className="flex min-h-65 flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-xl"
              >
                <Sparkles className="size-10" />
              </motion.div>
              <motion.h3
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="mt-8 text-xl font-semibold tracking-tight text-blue-600 dark:text-cyan-400"
              >
                {pulseText}
              </motion.h3>
              <div className="mt-6 w-full max-w-sm space-y-2">
                <Progress value={matchProgress} className="h-2 bg-blue-100 dark:bg-blue-950" />
                <p className="text-right text-xs font-medium text-zinc-500">{Math.round(isLoading ? matchProgress : 0)}%</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="rounded-[2rem] border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950/70">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {isPersonaHydrating || isLoading || isMeFetching ? (
        <Card className="rounded-[2rem] border border-blue-200 bg-blue-50 p-8 shadow-xl dark:border-blue-900/60 dark:bg-blue-950/20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              <Sparkles className="size-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-200">Refreshing profile state</h3>
              <p className="mt-2 max-w-lg text-sm text-blue-600 dark:text-blue-300">
                Your latest persona is being synced from the server before the reciprocal scan runs.
              </p>
            </div>
          </div>
        </Card>
      ) : !personaReady ? (
        <Card className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 shadow-xl dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
              <AlertCircle className="size-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-700 dark:text-amber-200">Profile Incomplete</h3>
              <p className="mt-2 max-w-lg text-sm text-amber-600 dark:text-amber-300">
                Add at least one expertise item and one learning path entry in Settings before running the reciprocal scan.
              </p>
            </div>
            <Button asChild className="rounded-full bg-amber-600 text-white hover:bg-amber-700">
              <Link href="/dashboard/settings">Go to Settings</Link>
            </Button>
          </div>
        </Card>
      ) : isError ? (
        <Card className="rounded-[2rem] border border-red-200 bg-red-50 p-8 shadow-xl dark:border-red-950/60 dark:bg-red-950/20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300">
              <AlertCircle className="size-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-700 dark:text-red-200">Matchmaker scan failed</h3>
              <p className="mt-2 max-w-lg text-sm text-red-600 dark:text-red-300">
                The reciprocal engine could not complete this pass. Try again once your profile and network data are synced.
              </p>
            </div>
            <Button onClick={handleMatch} className="rounded-full bg-red-600 text-white hover:bg-red-700">
              Retry Scan
            </Button>
          </div>
        </Card>
      ) : null}

      {isSuccess && data ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Perfect Match Grid
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Top {Math.min(6, topMatches.length)} results ranked by direct tag overlap, reciprocal seller demand, and expert-level alignment.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {data.isTrendingFallback ? (
                <Badge className="rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-600">
                  Trending fallback
                </Badge>
              ) : (
                <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600">
                  Reciprocal matches found
                </Badge>
              )}
              <Button variant="outline" onClick={handleMatch} className="rounded-full border-zinc-300 bg-white hover:bg-zinc-50">
                Refresh Scan
              </Button>
            </div>
          </div>

          {data.isTrendingFallback ? (
            <Card className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
              No reciprocal overlap was found, so the grid is filled with high-signal trending skills related to your broader persona.
            </Card>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {topMatches.map((match, index) => (
              <motion.article
                key={match.post.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group relative h-full"
              >
                <Card className="relative h-full overflow-hidden rounded-[2rem] border border-zinc-300 bg-white p-5 shadow-[0_16px_42px_-20px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-950/70">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="rounded-full border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                          {match.post.category}
                        </Badge>
                        {match.isPriorityMatch || index < 2 ? (
                          <Badge className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600">
                            Priority 1 boost
                          </Badge>
                        ) : null}
                      </div>
                      <h3 className="line-clamp-2 text-lg font-bold text-zinc-900 dark:text-white">
                        {match.post.title}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
                        <Zap className="size-3.5" />
                        Score {match.score}
                      </div>
                      {match.hasReciprocalMatch ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                          <BadgeCheck className="size-3.5" />
                          Reciprocal
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {match.reason}
                    </p>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
                      Seller: {match.post.creator.name} · Reputation {(match.post.creator.reputationScore ?? 0).toFixed(1)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match.post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {match.post.tokenPrice} KT
                    </div>
                    <Button asChild className="rounded-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400">
                      <Link href={`/bazaar/${match.post.id}`}>
                        View Vault
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.article>
            ))}
          </div>

          {topMatches.length === 0 ? (
            <Card className="rounded-[2rem] border border-dashed border-zinc-200 bg-white/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                <TrendingUp className="size-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-700 dark:text-zinc-300">No matches returned</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                The marketplace does not currently have entries that line up with your persona.
              </p>
            </Card>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
}
