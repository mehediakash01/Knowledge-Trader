"use client";

import { useState } from "react";
import { useGetMyTradesQuery, useUpdateBarterStatusMutation } from "@/redux/api/tradeApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { Card, CardContent } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { 
  ArrowLeftRight, 
  Check, 
  X, 
  ArrowRight, 
  Clock, 
  History,
  UserRound, 
  Sparkles,
  Inbox,
  Send,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function MyTradesPage() {
  const { data: trades, isLoading } = useGetMyTradesQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBarterStatusMutation();
  const [pendingAction, setPendingAction] = useState<{ barterId: string; action: "ACCEPT" | "DECLINE" } | null>(null);

  const handleAction = async (barterId: string, action: "ACCEPT" | "DECLINE") => {
    try {
      setPendingAction({ barterId, action });
      await updateStatus({ barterId, action }).unwrap();
      toast.success(`Barter ${action === "ACCEPT" ? "accepted" : "declined"} successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Action failed");
    } finally {
      setPendingAction(null);
    }
  };

  if (isLoading) {
    return <TradesPageSkeleton />;
  }

  const receivedPending = trades?.receivedBarters.filter(b => b.status === "PENDING") ?? [];
  const sentPending = trades?.sentBarters.filter(b => b.status === "PENDING") ?? [];
  const allHistory = [
    ...(trades?.learningTrades ?? []),
    ...(trades?.teachingTrades ?? []),
    ...(trades?.receivedBarters.filter(b => b.status !== "PENDING") ?? []),
    ...(trades?.sentBarters.filter(b => b.status !== "PENDING") ?? [])
  ].sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Trade Center</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Manage your skill swaps and view your acquisition history.</p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="mb-8 grid w-full max-w-md grid-cols-3 rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-900">
          <TabsTrigger value="incoming" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">
            Incoming {receivedPending.length > 0 && <Badge className="ml-2 bg-blue-500">{receivedPending.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">
            Outgoing
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">
            History
          </TabsTrigger>
        </TabsList>

        {/* Incoming Barters */}
        <TabsContent value="incoming" className="space-y-4">
          <AnimatePresence mode="wait">
            {receivedPending.length === 0 ? (
              <NoTrades message="No incoming barter requests yet." icon={Inbox} />
            ) : (
              <div className="grid gap-4">
                {receivedPending.map((barter) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={barter.id}
                  >
                    <Card className="overflow-hidden rounded-[2rem] border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <CardContent className="p-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 items-center gap-6">
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white">
                                <UserRound className="size-6" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">Sender</span>
                            </div>
                            
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium text-zinc-500">
                                <span className="font-bold text-zinc-900 dark:text-white">{barter.sender?.name}</span> wants to swap:
                              </p>
                              <div className="flex items-center gap-4">
                                <div className="flex-1 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                                  <p className="text-xs uppercase tracking-widest text-zinc-400">Their Skill</p>
                                  <p className="font-bold text-blue-600 dark:text-cyan-400">{barter.skillOffered.title}</p>
                                </div>
                                <ArrowLeftRight className="size-5 text-zinc-300" />
                                <div className="flex-1 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                                  <p className="text-xs uppercase tracking-widest text-zinc-400">Your Skill</p>
                                  <p className="font-bold text-zinc-900 dark:text-white">{barter.skillRequested.title}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleAction(barter.id, "DECLINE")}
                              disabled={isUpdating}
                              variant="outline" 
                              className="rounded-xl border-rose-600 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-500 dark:text-rose-400 dark:hover:bg-rose-950/40"
                            >
                              {pendingAction?.barterId === barter.id && pendingAction.action === "DECLINE" ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              ) : (
                                <X className="mr-2 size-4" />
                              )}
                              Decline
                            </Button>
                            <Button 
                              onClick={() => handleAction(barter.id, "ACCEPT")}
                              disabled={isUpdating}
                              className="rounded-xl border border-emerald-700 bg-emerald-600 px-6 font-semibold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 focus-visible:ring-emerald-600 dark:border-emerald-500 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
                            >
                              {pendingAction?.barterId === barter.id && pendingAction.action === "ACCEPT" ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 size-4" />
                              )}
                              Accept
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Outgoing Barters */}
        <TabsContent value="outgoing" className="space-y-4">
          {sentPending.length === 0 ? (
            <NoTrades message="You haven't sent any barter requests." icon={Send} />
          ) : (
            <div className="grid gap-4">
              {sentPending.map((barter) => (
                <Card key={barter.id} className="rounded-[2rem] border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400">
                        <Clock className="size-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-500">Waiting for <span className="text-zinc-900 dark:text-white">{barter.receiver?.name}</span></p>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          Offered "{barter.skillOffered.title}" for "{barter.skillRequested.title}"
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400">
                      {barter.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-4">
          {allHistory.length === 0 ? (
            <NoTrades message="No trade history yet." icon={History} />
          ) : (
            <div className="grid gap-3">
              {allHistory.map((item: any) => {
                const isBarter = !!item.skillOffered;
                
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-lg",
                        isBarter ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                      )}>
                        {isBarter ? <ArrowLeftRight className="size-5" /> : <Sparkles className="size-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white">
                          {isBarter 
                            ? `Swap: ${item.skillOffered.title} ↔ ${item.skillRequested.title}`
                            : item.post.title
                          }
                        </h4>
                        <p className="text-xs text-zinc-500">
                          {isBarter 
                            ? `${item.status} Barter` 
                            : `Purchased for ${item.post.tokenPrice} KT`
                          }
                        </p>
                      </div>
                    </div>
                    <Link 
                      href={isBarter ? `/bazaar/${item.skillRequested.id}` : `/bazaar/${item.post.id}`} 
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <ArrowRight className="size-5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TradesPageSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-9 w-56 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="h-11 w-full max-w-md animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-[2rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-6">
                <div className="size-14 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-48 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <div className="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                    <div className="hidden size-5 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800 sm:block" />
                    <div className="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-10 w-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoTrades({ message, icon: Icon }: { message: string, icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-zinc-200 py-16 dark:border-zinc-800">
      <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
        <Icon className="size-8 text-zinc-400" />
      </div>
      <p className="text-zinc-500">{message}</p>
      <Button variant="link" className="mt-2 text-blue-600" asChild>
        <Link href="/bazaar">Explore skills to trade</Link>
      </Button>
    </div>
  );
}
