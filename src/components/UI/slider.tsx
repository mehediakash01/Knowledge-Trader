"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200/90 dark:bg-zinc-800"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-linear-to-r from-blue-600 via-cyan-400 to-sky-400"
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className="block size-4 rounded-full border border-blue-500/30 bg-white shadow-lg shadow-blue-950/20 transition-transform focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-blue-500/30 dark:bg-zinc-50"
      />
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className="block size-4 rounded-full border border-blue-500/30 bg-white shadow-lg shadow-blue-950/20 transition-transform focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-blue-500/30 dark:bg-zinc-50"
      />
    </SliderPrimitive.Root>
  );
}

export { Slider };
