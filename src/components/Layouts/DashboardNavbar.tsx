"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { cn } from "@/lib/utils";
import { useGetMeQuery } from "@/redux/api/authApi";
import { baseApi } from "@/redux/api/baseApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const getInitials = (name?: string, email?: string) => {
  const source = name || email || "KT";
  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

type DashboardNavbarProps = {
  onOpenMobileMenu?: () => void;
};

export function DashboardNavbar({ onOpenMobileMenu }: DashboardNavbarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);

  const { data: liveUser } = useGetMeQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });

  const persona = liveUser ?? user;
  const primaryExpertise = persona?.expertise?.[0];
  const expertiseLabel = primaryExpertise
    ? `${primaryExpertise.level} - ${primaryExpertise.name}`
    : "Unranked";

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        profileOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b-2 border-zinc-800 bg-white text-zinc-950 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-zinc-800 bg-white px-3 py-2 text-sm font-bold tracking-[0.08em] text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 md:hidden"
            aria-label="Go to home"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-zinc-950 text-[0.65rem] font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
              KT
            </span>
            <span className="truncate">Knowledge Trader</span>
          </Link>

          <Link
            href="/"
            className="hidden min-h-11 items-center gap-2 rounded-xl border-2 border-zinc-800 bg-white px-3 py-2 text-sm font-bold tracking-[0.08em] text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 md:inline-flex"
            aria-label="Go to home"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-zinc-950 text-[0.65rem] font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
              KT
            </span>
            <span>Knowledge Trader</span>
          </Link>

          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-zinc-800 bg-white px-3 py-2 text-sm font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 md:hidden"
            aria-label="Open dashboard menu"
          >
            <Menu className="size-5" />
          </button>
        </div>

        <div className="relative flex items-center justify-end gap-2">
          <button
            ref={profileButtonRef}
            type="button"
            onClick={() => setProfileOpen((current) => !current)}
            className="hidden min-h-11 max-w-56 items-center gap-2 rounded-xl border-2 border-zinc-800 bg-white px-2 py-2 text-left text-sm font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 sm:max-w-64 md:inline-flex"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            <Avatar className="size-9 shrink-0 border border-zinc-800/10">
              <AvatarImage src={persona?.image || undefined} alt={persona?.name || "User"} />
              <AvatarFallback className="bg-zinc-900 text-xs font-semibold text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950">
                {getInitials(persona?.name, persona?.email)}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 text-left">
              <span className="block truncate text-sm leading-4">{persona?.name || "Profile"}</span>
              <span className="block truncate text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                {persona?.email || "Signed in"}
              </span>
            </span>
            <ChevronDown className={cn("size-4 shrink-0 text-zinc-500 transition-transform", profileOpen && "rotate-180")} />
          </button>

          {profileOpen ? (
            <div
              ref={profileMenuRef}
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border-2 border-zinc-800 bg-white p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] dark:bg-zinc-950"
            >
              <div className="rounded-xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
                <p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {persona?.name || "Profile"}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {persona?.email || "No email available"}
                </p>
                <p className="mt-1 truncate text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-zinc-600 dark:text-zinc-300">
                  {expertiseLabel}
                </p>
              </div>

              <div className="my-2 border-t border-zinc-800" />

              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  role="menuitem"
                >
                  <Settings className="size-4" />
                  Profile Settings
                </Link>
                {persona?.role === "ADMIN" ? (
                  <Link
                    href="/dashboard/admin/overview"
                    onClick={() => setProfileOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
                    role="menuitem"
                  >
                    <ShieldCheck className="size-4" />
                    Admin Console
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                  role="menuitem"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
