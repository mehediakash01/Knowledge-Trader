"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
  CheckCircle2,
  ArrowLeftRight,
  Zap,
  BookOpen,
  ArrowRight,
  PlayCircle,
  FileText,
  HelpCircle,
  Clock,
  Target,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import {
  useGetSkillPostByIdQuery,
  useAskQuestionMutation,
  useAnswerQuestionMutation,
} from "@/redux/api/skillPostApi";
import {
  useGenerateSkillAIReviewMutation,
  useGetSkillAIReviewQuery,
} from "@/redux/api/aiApi";
import { useGetMyTradesQuery } from "@/redux/api/tradeApi";
import { useAppSelector } from "@/redux/hooks";
import { getCategoryVisual } from "./SkillCard";
import { PurchaseModal } from "./PurchaseModal";
import { BarterModal } from "./BarterModal";
import { VaultRenderer } from "./VaultRenderer";
import { ReviewSection } from "./ReviewSection";
import { AIReviewCard } from "./AIReviewCard";
import { Button } from "@/components/UI/button";
import { Skeleton } from "@/components/UI/skeleton";
import { Badge } from "@/components/UI/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { IQuestion, ISyllabusModule } from "@/types";

export function SkillVaultPage({ id }: { id: string }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const { data: post, isLoading, isError } = useGetSkillPostByIdQuery(id);
  const { data: tradesData } = useGetMyTradesQuery(undefined, { skip: !user });
  const { data: aiReviewData, isFetching: isLoadingAIReview } = useGetSkillAIReviewQuery(id);
  const [generateSkillAIReview, { isLoading: isGeneratingAIReview }] = useGenerateSkillAIReviewMutation();

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [questionBody, setQuestionBody] = useState("");

  const [askQuestion, { isLoading: isAsking }] = useAskQuestionMutation();

  const learnerReviews = post?.reviews ?? [];
  const averageLearnerRating = useMemo(() => {
    if (!learnerReviews.length) return 0;
    return learnerReviews.reduce((sum, review) => sum + review.rating, 0) / learnerReviews.length;
  }, [learnerReviews]);

  const accessState = useMemo(() => {
    if (!user) return "locked";
    if (post && (post.isOwned || user.id === post.creatorId)) return "owned";

    const isPurchased =
      post?.isAccessible ||
      tradesData?.learningTrades.some(
        (trade) => trade.postId === id && trade.status === "COMPLETED"
      );

    return isPurchased ? "purchased" : "locked";
  }, [user, post, tradesData, id]);

  const toggleModule = (num: number) => {
    setExpandedModules((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to ask a question.");
      return;
    }
    if (!questionBody.trim()) return;

    try {
      await askQuestion({ postId: id, body: questionBody }).unwrap();
      setQuestionBody("");
      toast.success("Question submitted!");
    } catch (err) {
      toast.error("Failed to submit question.");
    }
  };

  const handleGenerateAIReview = async () => {
    try {
      await generateSkillAIReview(id).unwrap();
      toast.success("AI analysis generated.");
    } catch {
      toast.error("Failed to generate AI analysis.");
    }
  };

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Vault Not Found</h2>
        <p className="mt-2 text-zinc-500">The skill post you are looking for does not exist or was removed.</p>
        <Button variant="outline" className="mt-6 rounded-full" onClick={() => router.push("/bazaar")}>
          Return to Bazaar
        </Button>
      </div>
    );
  }

  if (isLoading || !post) {
    return <VaultSkeleton />;
  }

  const visual = getCategoryVisual(post.category);
  const hasAccess = Boolean(post.isAccessible || accessState === "purchased" || accessState === "owned");
  const insufficientTokens = Boolean(user && (user.ktBalance ?? 0) < post.tokenPrice);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* ─── Hero Header (Udemy Style) ────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-zinc-900 py-12 text-white dark:bg-black lg:py-16">
        <div className={cn("absolute inset-0 opacity-20 blur-[100px]", visual.glow)} />
        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <nav className="flex items-center space-x-2 text-sm font-medium text-blue-400">
                <Link href="/bazaar" className="transition-colors hover:text-white">Bazaar</Link>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-300">{post.category}</span>
              </nav>

              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              <p className="text-lg text-zinc-300 leading-relaxed sm:text-xl">
                {post.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">
                    {post.creator.reputationScore?.toFixed(1) || "4.8"} Expert Rating
                  </span>
                </div>
                <div className="text-zinc-400">
                  Created by <Link href={`/profile/${post.creator.id}`} className="font-bold text-blue-400 underline decoration-blue-400/30 underline-offset-4 hover:text-blue-300">{post.creator.name}</Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} className="bg-white/10 text-zinc-300 border-none px-4 py-1.5 rounded-full backdrop-blur-md">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Desktop Hero Sidebar Overlay Placeholder (Actual sidebar is below) */}
            <div className="hidden lg:col-span-5 lg:block" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* ─── Main Content ─────────────────────────────────────────────────── */}
          <div className="space-y-16 lg:col-span-8">

            {/* Teaser Player */}
            {post.teaserAsset && (
              <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-100 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative aspect-video w-full bg-black">
                  {post.teaserAsset.includes(".mp4") || post.teaserAsset.includes(".mov") ? (
                    <video
                      src={post.teaserAsset}
                      controls
                      className="h-full w-full object-contain"
                      poster={post.thumbnail}
                    />
                  ) : post.teaserAsset.includes(".pdf") ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-zinc-400">
                      <FileText className="size-16" />
                      <p>Syllabus Preview Document</p>
                      <Button asChild variant="outline" className="rounded-full">
                        <a href={post.teaserAsset} target="_blank" rel="noreferrer">Open PDF Preview</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                       <p className="text-zinc-400 italic">Teaser Content Preview</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Learning Outcomes */}
            {post.outcomes && post.outcomes.length > 0 && (
              <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">What you'll learn</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {post.outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-emerald-500" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* About / Description (Vault Preview) */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Description</h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                {/* Publicly visible part of description or value prop */}
                <p className="text-lg leading-relaxed font-medium text-zinc-900 dark:text-zinc-200">
                  {post.valueProp || "This elite skill provides a structured path to mastery."}
                </p>
                <div className="mt-4">
                  {/* If they have access, show long description here too or just in the vault section */}
                  {!hasAccess && (
                    <p className="italic text-zinc-500">
                      Unlock the Strategy Vault to read the full methodology and access exclusive resources.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Community & Intelligence */}
            <section className="space-y-6 pt-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-cyan-400">
                    Community & Intelligence
                  </p>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Learner Proof + AI Audit</h2>
                </div>
                {learnerReviews.length > 0 && (
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {learnerReviews.length} review{learnerReviews.length === 1 ? "" : "s"} • {averageLearnerRating.toFixed(1)} / 5.0 average
                  </div>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[2rem] border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">What Learners Say</p>
                      <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Real review signals</h3>
                    </div>
                    <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                      Verified Learners
                    </Badge>
                  </div>

                  {learnerReviews.length > 0 ? (
                    <div className="space-y-4">
                      {learnerReviews.map((review) => (
                        <div key={review.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                <UserRound className="size-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-900 dark:text-white">{review.reviewer.name || "Learner"}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                              <span className="text-amber-500">★</span>
                              {review.rating}/5
                            </div>
                          </div>
                          <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
                      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                        <MessageCircle className="size-5" />
                      </div>
                      No learner reviews are available yet. Once a verified learner completes this skill and leaves feedback, the strongest community signals will appear here in full.
                    </div>
                  )}
                </div>

                <AIReviewCard
                  review={aiReviewData?.review ?? null}
                  warning={aiReviewData?.warning}
                  isLoading={isLoadingAIReview}
                  isGenerating={isGeneratingAIReview}
                  onGenerate={handleGenerateAIReview}
                />
              </div>
            </section>

            {/* Syllabus Section (Curriculum) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Curriculum</h2>
                <span className="text-sm text-zinc-500">
                  {post.syllabus?.length || 0} modules • {post.roadmapType?.replace("_", " ")}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-transparent">
                {post.syllabus?.map((module: ISyllabusModule, idx: number) => (
                  <div key={idx} className="border-b border-zinc-100 last:border-none dark:border-zinc-800">
                    <button
                      onClick={() => toggleModule(idx)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
                    >
                      <div className="flex items-center gap-4">
                        {expandedModules.includes(idx) ? <ChevronUp className="size-4 text-zinc-400" /> : <ChevronDown className="size-4 text-zinc-400" />}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Module {module.moduleNumber}</p>
                          <p className="font-bold text-zinc-900 dark:text-white">{module.title}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-zinc-400">{module.estimatedTime}</span>
                    </button>

                    <AnimatePresence>
                      {expandedModules.includes(idx) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-14 pb-6 pt-2 space-y-4">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              {module.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {module.topics.map((topic, ti) => (
                                <span key={ti} className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>

            {/* The Vault Section */}
            <section className="space-y-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  <LockKeyhole className="size-8 text-blue-500" />
                  Strategy Vault
                </h2>
                {hasAccess && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-4 py-1.5 rounded-full">
                    <CheckCircle2 className="size-4 mr-2" />
                    Unlocked Access
                  </Badge>
                )}
              </div>

              <VaultRenderer
                content={{
                  longDescription: post.longDescription,
                  resourceLinks: post.resourceLinks,
                  lockedContent: post.lockedContent
                }}
                isLocked={!hasAccess}
                tokenPrice={post.tokenPrice}
                onUnlock={() => setIsPurchaseModalOpen(true)}
              />
            </section>

            {/* Seller Q&A Section */}
            <section className="space-y-8 pt-12 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-zinc-900 dark:text-white">
                  <HelpCircle className="size-7 text-blue-500" />
                  Seller Q&A
                </h2>
              </div>

              <div className="space-y-6">
                {/* Ask a Question */}
                <form onSubmit={handleAskQuestion} className="relative">
                  <textarea
                    value={questionBody}
                    onChange={(e) => setQuestionBody(e.target.value)}
                    placeholder="Ask the expert anything about this skill..."
                    className="w-full rounded-2xl border border-zinc-200 bg-white p-4 pr-14 text-sm outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/50"
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={isAsking || !questionBody.trim()}
                    className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:opacity-50 dark:bg-cyan-500 dark:text-zinc-950"
                  >
                    {isAsking ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  </button>
                </form>

                {/* Question List */}
                <div className="space-y-4">
                  {post.questions && post.questions.length > 0 ? (
                    post.questions.map((q: IQuestion) => (
                      <QuestionItem key={q.id} question={q} isOwner={post.isOwned} postId={post.id} />
                    ))
                  ) : (
                    <p className="text-center text-sm text-zinc-500 py-8">No questions yet. Be the first to ask!</p>
                  )}
                </div>
              </div>
            </section>

            {/* Review Section */}
            <section id="reviews" className="pt-12 border-t border-zinc-100 dark:border-zinc-900">
              <ReviewSection
                postId={post.id}
                hasAccess={hasAccess}
                hasReviewed={post.hasReviewed}
              />
            </section>
          </div>

          {/* ─── Sticky Sidebar ──────────────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <aside className="sticky top-24 space-y-8">
              {/* Main CTA Card */}
              <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                {/* Course Thumbnail or Teaser Preview */}
                <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
                  <img src={post.thumbnail} alt={post.title} className="h-full w-full object-cover" />
                  {!hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <PlayCircle className="size-16 text-white/90 drop-shadow-2xl" />
                    </div>
                  )}
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-zinc-900 dark:text-white">{post.tokenPrice}</span>
                    <span className="text-xl font-bold text-zinc-500">KT</span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => setIsPurchaseModalOpen(true)}
                      disabled={hasAccess || insufficientTokens}
                      className={cn(
                        "w-full rounded-xl py-7 text-lg font-bold shadow-lg transition-all hover:scale-[1.02]",
                        hasAccess ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950"
                      )}
                    >
                      {hasAccess ? "Owned — Go to Vault" : "Buy with Knowledge Tokens"}
                    </Button>

                    {!hasAccess && (
                      <Button
                        variant="outline"
                        onClick={() => setIsBarterModalOpen(true)}
                        className="w-full rounded-xl py-7 text-lg font-bold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      >
                        <ArrowLeftRight className="size-5 mr-2 text-blue-500" />
                        Propose Barter
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">This skill includes:</p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <Clock className="size-4 text-blue-500" />
                        <span>{post.roadmapType?.replace("_", " ")} learning path</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <Target className="size-4 text-blue-500" />
                        <span>{post.outcomes?.length || 0} learning outcomes</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <BookOpen className="size-4 text-blue-500" />
                        <span>Full Strategy Vault Access</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <Users className="size-4 text-blue-500" />
                        <span>Direct Q&A with {post.creator.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creator Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400">
                    <UserRound className="size-7" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">{post.creator.name}</p>
                    <p className="text-xs text-zinc-500">Reputation: {post.creator.reputationScore?.toFixed(1) || "5.0"}</p>
                  </div>
                </div>
                <Button asChild variant="ghost" className="mt-4 w-full rounded-xl text-xs font-bold text-blue-600 dark:text-cyan-400">
                  <Link href={`/profile/${post.creator.id}`}>View Profile &rarr;</Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <PurchaseModal
        post={post}
        isOpen={isPurchaseModalOpen}
        onOpenChange={setIsPurchaseModalOpen}
        onSuccess={() => toast.success("Skill unlocked successfully!")}
      />

      <BarterModal
        targetSkill={post}
        isOpen={isBarterModalOpen}
        onOpenChange={setIsBarterModalOpen}
      />
    </div>
  );
}

function QuestionItem({ question, isOwner, postId }: { question: IQuestion; isOwner?: boolean; postId: string }) {
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerBody, setAnswerBody] = useState("");
  const [answerQuestion, { isLoading }] = useAnswerQuestionMutation();

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await answerQuestion({ questionId: question.id, answer: answerBody, postId }).unwrap();
      setIsAnswering(false);
      setAnswerBody("");
      toast.success("Answer posted!");
    } catch (err) {
      toast.error("Failed to post answer.");
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 dark:bg-zinc-800">
          <UserRound className="size-4" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs font-bold text-zinc-500">{question.asker.name}</p>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">{question.body}</p>
        </div>
      </div>

      {question.answer ? (
        <div className="mt-4 flex items-start gap-3 border-l-2 border-blue-500/30 pl-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400">
            <Zap className="size-4" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs font-bold text-blue-600 dark:text-cyan-400">Expert Answer</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{question.answer}</p>
          </div>
        </div>
      ) : isOwner ? (
        <div className="mt-4 ml-11">
          {!isAnswering ? (
            <Button size="sm" variant="ghost" onClick={() => setIsAnswering(true)} className="text-blue-600 dark:text-cyan-400">
              Reply to this question
            </Button>
          ) : (
            <form onSubmit={handleAnswer} className="space-y-3">
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                placeholder="Write your expert answer..."
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900"
                rows={2}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isLoading || !answerBody.trim()}>
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Post Answer"}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsAnswering(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p className="mt-3 ml-11 text-xs italic text-zinc-400">Awaiting answer from seller...</p>
      )}
    </div>
  );
}

function VaultSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="h-100 w-full animate-pulse bg-zinc-900 dark:bg-zinc-900" />
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-12 lg:grid-cols-12 lg:px-8">
        <div className="space-y-8 lg:col-span-8">
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-150 w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
