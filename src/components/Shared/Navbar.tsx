"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenText, ChevronDown, Menu, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Button } from "@/components/UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { ThemeToggle } from "@/components/Shared/ThemeToggle";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const navItems = [
  { href: "/bazaar", label: "Bazaar" },
  { href: "#skills", label: "Explore" },
  { href: "#trades", label: "Trades" },
  { href: "#reviews", label: "Reviews" },
];

const getInitials = (name?: string, email?: string) => {
  const source = name || email || "KT";
  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const ktBalance = user?.ktBalance ?? 0;

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-slate-50/75 backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 dark:bg-cyan-400 dark:text-zinc-950 dark:shadow-cyan-400/20">
            <BookOpenText className="size-5" />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            Knowledge Trader
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-300 dark:hover:text-cyan-300"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full border border-blue-500/20 bg-blue-600/10 px-3 py-1 text-sm font-semibold text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                {ktBalance.toLocaleString()} KT
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 gap-2 rounded-full border-white/20 bg-white/60 px-2 pr-3 backdrop-blur-xl dark:bg-zinc-900/60"
                  >
                    <Avatar className="size-7">
                      <AvatarImage src={user.image} alt={user.name || "User"} />
                      <AvatarFallback>
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-28 truncate text-sm">
                      {user.name || "Profile"}
                    </span>
                    <ChevronDown className="size-4 text-zinc-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>User Profile</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>My Trades</DropdownMenuItem>
                  <DropdownMenuItem>Wallet</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-400 dark:text-zinc-950 dark:hover:bg-cyan-300"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DropdownMenuLabel>
                    {ktBalance.toLocaleString()} KT
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserRound className="size-4" />
                    User Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
