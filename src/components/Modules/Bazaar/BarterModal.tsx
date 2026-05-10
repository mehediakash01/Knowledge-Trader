"use client";

import { useState, useMemo } from "react";
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
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BarterModalProps {
  targetSkill: ISkillPost;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BarterModal({ targetSkill, isOpen, onOpenChange }: BarterModalProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  
  const { data: mySkills, isLoading } = useGetAllSkillPostsQuery({
    creatorId: user?.id,
    limit: 50,
  }, { skip: !user || !isOpen });

  const [createBarter, { isLoading: isCreating }] = useCreateBarterRequestMutation();

  const selectedSkill = useMemo(() => {
    return mySkills?.data.find(s => s.id === selectedSkillId);
  }, [mySkills, selectedSkillId]);

  const fairness = useMemo(() => {
    if (!selectedSkill) return null;
    
    const ratio = selectedSkill.tokenPrice / targetSkill.tokenPrice;
    if (ratio >= 1) return { label: "Elite Value", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: Sparkles };
    if (ratio >= 0.7) return { label: "Fair Trade", color: "text-blue-500", bg: "bg-blue-500/10", icon: Info };
    return { label: "Low Match", color: "text-amber-500", bg: "bg-amber-500/10", icon: AlertCircle };
  }, [selectedSkill, targetSkill]);

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

  const Icon = fairness?.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] border-zinc-200 bg-white p-0 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <DialogHeader>
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <ArrowLeftRight className="size-6" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">Propose a Knowledge Swap</DialogTitle>
            <DialogDescription className="text-blue-100">
              Exchange your skills for "{targetSkill.title}". No tokens needed, just pure value.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Your Skills</h3>
          
          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
                ))}
              </div>
            ) : mySkills?.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 size-20 animate-pulse rounded-full bg-blue-500/10" />
                  <div className="relative flex size-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                    <Sparkles className="size-10" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Knowledge Needed</h4>
                <p className="mt-2 max-w-[280px] text-sm text-zinc-500">
                  You need to share knowledge to barter knowledge. Create your first skill to start swapping!
                </p>
                <Button 
                  onClick={() => {
                    onOpenChange(false);
                    router.push("/dashboard/assets");
                  }}
                  className="mt-6 rounded-full bg-blue-600 px-8 text-white hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
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
                        <p className="text-xs text-zinc-500">{skill.tokenPrice} KT Value</p>
                      </div>
                    </div>
                    <ChevronRight className={cn("size-5 transition-colors", selectedSkillId === skill.id ? "text-blue-500" : "text-zinc-300")} />
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {selectedSkill && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("mt-6 flex items-center justify-between rounded-2xl p-4", fairness?.bg)}
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className={cn("size-5", fairness?.color)} />}
                <span className={cn("text-sm font-bold", fairness?.color)}>{fairness?.label}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Offering {selectedSkill.tokenPrice} KT for {targetSkill.tokenPrice} KT
              </p>
            </motion.div>
          )}
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
            disabled={!selectedSkillId || isCreating}
            onClick={handlePropose}
            className="rounded-xl bg-blue-600 px-8 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
          >
            {isCreating ? "Sending..." : "Confirm Proposal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
