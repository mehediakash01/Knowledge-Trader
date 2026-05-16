"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart2,
  BarChart3,
  BookOpen,
  LogOut,
  X,
  Home,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/Shared/ProtectedRoute";
import { ErrorBoundary } from "@/components/Shared/ErrorBoundary";
import { DashboardNavbar } from "@/components/Layouts/DashboardNavbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { cn } from "@/lib/utils";
import { baseApi } from "@/redux/api/baseApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type DashboardSidebarItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  highlight?: boolean;
};

const dashboardSidebarItems: DashboardSidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/bazaar", label: "Bazaar", icon: BookOpen },
  { href: "/dashboard/assets", label: "My Assets", icon: BookOpen },
  { href: "/dashboard/trades", label: "My Trades", icon: ArrowLeftRight },
  { href: "/dashboard/matchmaker", label: "AI Matchmaker", icon: Sparkles, highlight: true },
  { href: "/dashboard/analytics", label: "AI Analytics", icon: BarChart2, highlight: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/admin", label: "Platform Stats", icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getInitials = (name?: string, email?: string) => {
    const source = name || email || "KT";
    return source
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleMobileLogout = () => {
    setMobileMenuOpen(false);
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);
  
  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="size-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent dark:border-cyan-400" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50 dark:bg-zinc-950">
        <DashboardNavbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <div
          className={cn(
            "fixed inset-0 z-40 bg-zinc-950/45 transition-opacity md:hidden",
            mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 h-screen w-[min(21rem,88vw)] border-r-2 border-zinc-800 bg-white p-4 transition-transform duration-300 ease-in-out dark:bg-zinc-950 md:hidden",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-xl border-2 border-zinc-800 bg-white px-3 py-2 text-sm font-bold tracking-[0.08em] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-zinc-950 text-[0.65rem] font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
                  KT
                </span>
                <span>Dashboard</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-zinc-800 bg-white px-3 py-2 text-zinc-950 transition-all hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                aria-label="Close dashboard menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-zinc-800 bg-white px-3 py-2 text-sm font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Home className="size-4" />
              <span>Navigate Home</span>
            </Link>

            <h2 className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Control Center
            </h2>

            <nav className="space-y-1">
              {dashboardSidebarItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "border-zinc-800 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                        : item.highlight
                          ? "border-transparent bg-linear-to-r from-blue-500/10 to-cyan-400/10 text-blue-700 dark:text-cyan-300"
                          : "border-transparent text-zinc-700 hover:border-zinc-800 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border-2 border-zinc-800 bg-zinc-100 p-3 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 shrink-0 border border-zinc-800/10">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-zinc-900 text-xs font-semibold text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950">
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {user?.name || "Profile"}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {user?.email || "Signed in"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleMobileLogout}
                className="mt-3 flex min-h-11 w-full items-center gap-3 rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col md:flex-row">
          <aside className="hidden w-full shrink-0 border-r-2 border-zinc-800 bg-white p-4 dark:bg-zinc-950 md:block md:w-64 md:p-6 lg:w-72">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-zinc-800 bg-white px-3 py-2 text-sm font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <Home className="size-4" />
                <span>Navigate Home</span>
              </Link>

              <div className="hidden md:block">
                <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Control Center
                </h2>
                <nav className="space-y-1">
                  {dashboardSidebarItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-xl border-2 border-transparent px-3 py-2.5 text-sm font-medium transition-all",
                        item.highlight
                          ? "bg-linear-to-r from-blue-500/10 to-cyan-400/10 text-blue-700 dark:text-cyan-300"
                          : "text-zinc-700 hover:border-zinc-800 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
