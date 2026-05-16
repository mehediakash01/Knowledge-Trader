"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { useGetAllSkillPostsQuery } from "@/redux/api/skillPostApi";
import { useCreateBarterRequestMutation } from "@/redux/api/tradeApi";
import { useAssessTradeValueMutation } from "@/redux/api/aiApi";
import { useAppSelector } from "@/redux/hooks";
import { ISkillPost } from "@/types";
import { ScrollArea } from "@/components/UI/scroll-area";
import { cn } from "@/lib/utils";
import { 
  ArrowLeftRight, 
  Check, 
  Info, 
  Sparkles, 
  AlertCircle,
  Coins,
  ChevronRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BarterModalProps {
  targetSkill: ISkillPost;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const VERDICT_CONFIG = {
  GREAT_DEAL: {
    label: "Great Deal!",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: TrendingUp,
  },
  FAIR_TRADE: {
    label: "Fair Trade",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    icon: Info,
  },
  UPGRADE_NEEDED: {
    label: "Upgrade Needed",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    icon: AlertCircle,
  },
};

export function BarterModal({ targetSkill, isOpen, onOpenChange }: BarterModalProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  
  const { data: mySkills, isLoading } = useGetAllSkillPostsQuery({
    creatorId: user?.id,
    limit: 50,
  }, { skip: !user || !isOpen });

  const [createBarter, { isLoading: isCreating }] = useCreateBarterRequestMutation();
  const [assessTradeValue, { data: tradeAssessment, isLoading: isAssessing, reset }] = useAssessTradeValueMutation();

  const selectedSkill = useMemo(() => {
    return mySkills?.data.find(s => s.id === selectedSkillId);
  }, [mySkills, selectedSkillId]);

  // AI assessment triggers automatically when a skill is selected
  useEffect(() => {
    if (selectedSkillId && targetSkill.id) {
      reset();
      assessTradeValue({
        offeredSkillId: selectedSkillId,
        requestedSkillId: targetSkill.id,
      });
    }
  }, [selectedSkillId, targetSkill.id]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSkillId(null);
      reset();
    }
  }, [isOpen]);

  const verdictConfig = tradeAssessment
    ? VERDICT_CONFIG[tradeAssessment.verdict]
    : null;

  const handlePropose = async () => {
    if (!selectedSkillId) return;

    try {
      await createBarter({
        receiverId: targetSkill.creatorId,
        skillRequestedId: targetSkill.id,
        skillOfferedId: selectedSkillId,
      }).unwrap();
      
      toast.success("Barter proposal sent!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send proposal");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] border-zinc-200 bg-white p-0 dark:border-zinc-800 dark:bg-zinc-950">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <DialogHeader>
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <ArrowLeftRight className="size-6" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">Propose a Knowledge Swap</DialogTitle>
            <DialogDescription className="text-blue-100">
              Exchange your skills for &quot;{targetSkill.title}&quot;. No tokens needed, just pure value.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Your Skills</h3>
          
          <ScrollArea className="h-[260px] pr-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
                ))}
              </div>
            ) : mySkills?.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                  <Sparkles className="size-8" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Knowledge Needed</h4>
                <p className="mt-2 max-w-[280px] text-sm text-zinc-500">
                  You need to share knowledge to barter knowledge. Create your first skill to start swapping!
                </p>
                <Button 
                  onClick={() => { onOpenChange(false); router.push("/dashboard/assets"); }}
                  className="mt-6 rounded-full bg-blue-600 px-8 text-white hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950"
                >
                  Create Your First Skill
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {mySkills?.data.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl border p-4 transition-all hover:scale-[1.01] active:scale-[0.99]",
                      selectedSkillId === skill.id 
                        ? "border-blue-500 bg-blue-50 dark:border-cyan-500 dark:bg-cyan-500/10" 
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-xl",
                        selectedSkillId === skill.id ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                      )}>
                        {selectedSkillId === skill.id ? <Check className="size-5" /> : <Coins className="size-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{skill.title}</p>
                        <p className="text-xs text-zinc-500">{skill.tokenPrice} KT • {skill.category}</p>
                      </div>
                    </div>
                    <ChevronRight className={cn("size-5 transition-colors", selectedSkillId === skill.id ? "text-blue-500" : "text-zinc-300")} />
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* AI Trade Value Advisor Panel */}
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 8, height: 0 }}
                className="mt-5 overflow-hidden"
              >
                {isAssessing ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <Loader2 className="size-5 animate-spin text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        AI is analyzing trade fairness...
                      </p>
                      <p className="text-xs text-zinc-500">Evaluating skill value &amp; category alignment</p>
                    </div>
                  </div>
                ) : tradeAssessment && verdictConfig ? (
                  <div className={cn("rounded-2xl border p-4", verdictConfig.bg, verdictConfig.border)}>
                    {/* Verdict Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-blue-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          AI Trade Advisor
                        </span>
                      </div>
                      <span className={cn("rounded-full px-3 py-1 text-xs font-bold", verdictConfig.bg, verdictConfig.color, "border", verdictConfig.border)}>
                        {tradeAssessment.label}
                      </span>
                    </div>

                    {/* Value Bars */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="mb-1 text-xs font-medium text-zinc-500 truncate">Your Offer</p>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${tradeAssessment.offeredScore}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full bg-blue-500"
                          />
                        </div>
                        <p className="mt-1 text-right text-xs font-bold text-blue-600">{tradeAssessment.offeredScore}/100</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium text-zinc-500 truncate">Requested</p>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${tradeAssessment.requestedScore}%` }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                            className="h-full rounded-full bg-indigo-500"
                          />
                        </div>
                        <p className="mt-1 text-right text-xs font-bold text-indigo-600">{tradeAssessment.requestedScore}/100</p>
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {tradeAssessment.reasoning}
                    </p>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="border-t border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            disabled={!selectedSkillId || isCreating || isAssessing}
            onClick={handlePropose}
            className="rounded-xl bg-blue-600 px-8 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
          >
            {isCreating ? (
              <><Loader2 className="mr-2 size-4 animate-spin" />Sending...</>
            ) : (
              "Confirm Proposal"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
