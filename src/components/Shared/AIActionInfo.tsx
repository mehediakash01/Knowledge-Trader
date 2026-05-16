"use client";

import { Info } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from "@/components/UI/popover";
import { Button } from "@/components/UI/button";

interface AIActionInfoProps {
  title: string;
  description: string;
  className?: string;
}

export function AIActionInfo({ title, description, className }: AIActionInfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`What does ${title} do?`}
          className={className ?? "size-9 rounded-full border border-zinc-200 text-zinc-500 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white"}
        >
          <Info className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 rounded-2xl p-4">
        <PopoverHeader>
          <PopoverTitle>{title}</PopoverTitle>
          <PopoverDescription>{description}</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
