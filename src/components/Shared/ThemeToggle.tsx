"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { Button } from "@/components/UI/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden border-white/20 bg-white/60 backdrop-blur-xl hover:bg-white/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80"
    >
      <motion.span
        layoutId="theme-toggle-icon"
        className="absolute inset-0 flex items-center justify-center"
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      >
        {isDark ? (
          <Moon className="size-4 text-cyan-300" />
        ) : (
          <Sun className="size-4 text-blue-600" />
        )}
      </motion.span>
    </Button>
  );
}
