"use client";

import { useState } from "react";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCreateReviewMutation } from "@/redux/api/reviewApi";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  postId: string;
  hasAccess: boolean;
  hasReviewed?: boolean;
}

export function ReviewSection({ postId, hasAccess, hasReviewed }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [createReview, { isLoading, isError }] = useCreateReviewMutation();

  if (!hasAccess) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;
    try {
      await createReview({ postId, rating, comment }).unwrap();
      setSubmitted(true);
    } catch {
      // error handled via isError
    }
  };

  const isAlreadyReviewed = submitted || hasReviewed;

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {isAlreadyReviewed ? "Your Review" : "Leave a Review"}
      </h2>

      <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <AnimatePresence mode="wait">
          {isAlreadyReviewed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Review Submitted!</h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {hasReviewed ? "You have already reviewed this skill. Thank you for your feedback!" : "Your review helps others in the community. Thank you!"}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Star Rating */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Your Rating
                </label>
                <div className="flex gap-1.5" onMouseLeave={() => setHovered(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHovered(star)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={cn(
                          "size-8 transition-colors",
                          (hovered || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-300 dark:text-zinc-600"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Your Thoughts
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you learn? Would you recommend this skill to others?"
                  className="min-h-[100px] resize-none rounded-2xl bg-white/80 dark:bg-zinc-950/50"
                />
              </div>

              {isError && (
                <p className="text-sm font-medium text-red-500">
                  Failed to submit review. You may have already reviewed this skill.
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || rating === 0 || !comment.trim()}
                  className="rounded-full bg-blue-600 px-8 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 size-4" />
                  )}
                  Submit Review
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
