"use client";

import { useState } from "react";
import { Bell, BellRing, CheckCheck, Loader2, ShoppingBag, Star, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/UI/popover";
import { Button } from "@/components/UI/button";
import { useGetMyNotificationsQuery, useMarkAllAsReadMutation } from "@/redux/api/notificationApi";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";

const notifIcon = (type: string) => {
  if (type === "TRADE") return <ShoppingBag className="size-4 text-blue-500" />;
  if (type === "REVIEW") return <Star className="size-4 text-amber-500" />;
  return <AlertCircle className="size-4 text-zinc-500" />;
};

export function NotificationBell() {
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetMyNotificationsQuery(undefined, {
    skip: !user,
    pollingInterval: 30000, // fallback polling every 30s
  });

  const [markAllAsRead, { isLoading: marking }] = useMarkAllAsReadMutation();

  const unreadCount = data?.unreadCount ?? 0;
  const notifications = data?.notifications ?? [];

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-full border-white/20 bg-white/60 backdrop-blur-xl dark:bg-zinc-900/60"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <AnimatePresence mode="wait">
            {unreadCount > 0 ? (
              <motion.span key="ringing" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <BellRing className="size-4" />
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Bell className="size-4" />
              </motion.span>
            )}
          </AnimatePresence>

          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow dark:bg-cyan-500 dark:text-zinc-950"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 rounded-[1.5rem] border border-white/20 bg-white/90 p-0 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/90"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              disabled={marking}
              className="h-7 gap-1.5 rounded-full px-2 text-xs text-blue-600 hover:bg-blue-50 dark:text-cyan-400 dark:hover:bg-cyan-950/30"
            >
              {marking ? <Loader2 className="size-3 animate-spin" /> : <CheckCheck className="size-3" />}
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="size-5 animate-spin text-zinc-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell className="mb-3 size-8 text-zinc-300 dark:text-zinc-600" />
              <p className="text-sm text-zinc-500">You&apos;re all caught up!</p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors",
                    !notif.isRead && "bg-blue-50/60 dark:bg-blue-950/20"
                  )}
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    {notifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm leading-snug text-zinc-800 dark:text-zinc-200", !notif.isRead && "font-medium")}>
                      {notif.message}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500 dark:bg-cyan-400" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
