"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, PenTool, BarChart3, Users, Settings, Sparkles } from "lucide-react";

import { useAppSelector } from "@/redux/hooks";
import { ProtectedRoute } from "@/components/Shared/ProtectedRoute";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  isHighlight?: boolean;
}

const userNavItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/assets", label: "My Assets", icon: BookOpen },
  { href: "/dashboard/matchmaker", label: "AI Matchmaker", icon: Sparkles, isHighlight: true },
];

const adminNavItems: NavItem[] = [
  { href: "/dashboard/admin", label: "Platform Stats", icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  
  const isAdmin = user?.role === "ADMIN" || user?.role === "admin";
  const navItems = isAdmin ? [...adminNavItems, ...userNavItems] : userNavItems;

  return (
    <ProtectedRoute>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50 dark:bg-zinc-950 md:flex-row">
        <aside className="w-full shrink-0 border-r border-white/60 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60 md:w-64 lg:w-72">
          <div className="flex flex-col space-y-2">
            <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Control Center
            </h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:bg-cyan-500 dark:text-zinc-950 dark:shadow-cyan-500/20"
                        : item.isHighlight
                          ? "bg-linear-to-r from-blue-500/10 to-cyan-400/10 text-blue-700 hover:from-blue-500/20 hover:to-cyan-400/20 dark:text-cyan-300"
                          : "text-zinc-600 hover:bg-white/80 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
