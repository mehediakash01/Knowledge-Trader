import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthSceneProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Array<{
    title: string;
    copy: string;
  }>;
  children: ReactNode;
  className?: string;
};

export function AuthScene({
  eyebrow,
  title,
  description,
  highlights,
  children,
  className,
}: AuthSceneProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8 lg:py-14",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle_at_top_left,rgba(63,63,70,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(39,39,42,0.75),transparent_32%),linear-gradient(180deg,#09090b_0%,#111113_52%,#09090b_100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-full -translate-x-1/2"
        style={{
          backgroundImage:
            "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-7 text-zinc-50 shadow-[0_30px_100px_-40px_rgba(0,0,0,0.88)] backdrop-blur-xl sm:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_30%)]" />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950/60 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-zinc-300">
              <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
              {eyebrow}
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                {description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-zinc-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
              <span className="rounded-full border border-white/10 bg-zinc-950/55 px-3 py-1">
                Secure token handoff
              </span>
              <span className="rounded-full border border-white/10 bg-zinc-950/55 px-3 py-1">
                Refresh-cookie sync
              </span>
              <span className="rounded-full border border-white/10 bg-zinc-950/55 px-3 py-1">
                Dashboard ready
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 rounded-[2.25rem] border border-white/10 bg-white/5 blur-xl" />
          <div className="relative">{children}</div>
        </div>
      </div>
    </section>
  );
}