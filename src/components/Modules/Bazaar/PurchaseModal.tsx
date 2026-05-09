"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowRight, Wallet, CheckCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { useExecuteTokenTradeMutation } from "@/redux/api/tradeApi";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { ISkillPost } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseModalProps {
  post: ISkillPost;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PurchaseModal({
  post,
  isOpen,
  onOpenChange,
  onSuccess,
}: PurchaseModalProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [executeTrade, { isLoading }] = useExecuteTokenTradeMutation();
  const [isSuccessState, setIsSuccessState] = useState(false);

  const balance = user?.ktBalance ?? 0;
  const newBalance = balance - post.tokenPrice;
  const isInsufficient = newBalance < 0;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setIsSuccessState(false), 300);
    }
  }, [isOpen]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase this skill.");
      return;
    }

    if (isInsufficient) {
      toast.error("Insufficient KT balance. Earn more tokens to unlock!");
      return;
    }

    try {
      await executeTrade({ postId: post.id }).unwrap();
      setIsSuccessState(true);
      
      // Delay to show success animation
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        toast.success(`Successfully unlocked ${post.title}!`);
      }, 1500);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to execute trade.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
      <DialogContent className="sm:max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white/90 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/95">
        <AnimatePresence mode="wait">
          {!isSuccessState ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-semibold">Unlock Skill Vault</DialogTitle>
                <DialogDescription>
                  You are about to use your Knowledge Tokens to unlock high-value content.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="rounded-2xl border border-blue-500/10 bg-blue-50/50 p-4 dark:border-cyan-400/10 dark:bg-cyan-950/20">
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</h4>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    By {post.creator.name}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm dark:border-white/5 dark:bg-zinc-900/50">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Current Balance</span>
                    <span className="mt-1 flex items-center gap-1.5 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      <Wallet className="size-4 text-blue-500 dark:text-cyan-400" />
                      {balance} KT
                    </span>
                  </div>
                  <ArrowRight className="size-5 text-zinc-300 dark:text-zinc-700" />
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">New Balance</span>
                    <span className={`mt-1 flex items-center gap-1.5 text-lg font-medium ${isInsufficient ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {newBalance} KT
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-full">
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePurchase}
                    disabled={isLoading || isInsufficient}
                    className="rounded-full bg-blue-600 px-6 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      `Spend ${post.tokenPrice} KT`
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                className="mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-500/10"
              >
                <CheckCircle className="size-10 text-emerald-500" />
              </motion.div>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Skill Unlocked!
              </h3>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                The vault is opening for you...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
