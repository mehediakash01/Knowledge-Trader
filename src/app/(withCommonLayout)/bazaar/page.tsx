import { Suspense } from "react";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";
import { BazaarPage } from "@/components/Modules/Bazaar/BazaarPage";

const BazaarPageWithLayout = withCommonLayout(BazaarPage);

export default function BazaarRoutePage() {
  return (
    <Suspense fallback={<BazaarRouteSkeleton />}>
      <BazaarPageWithLayout />
    </Suspense>
  );
}

function BazaarRouteSkeleton() {
  return (
    <div className="bg-slate-50 py-8 dark:bg-zinc-950 lg:py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8">
        <aside className="hidden rounded-[2rem] border border-white/60 bg-white/65 p-5 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-zinc-950/60 lg:block">
          <div className="space-y-5">
            <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-11 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-11 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        </aside>
        <main className="space-y-5">
          <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 dark:border-white/10 dark:bg-zinc-950/60">
            <div className="h-6 w-48 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-5 h-10 w-full max-w-xl animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/80 dark:border-white/10 dark:bg-zinc-950/70">
                <div className="aspect-16/10 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-4 p-4">
                  <div className="flex justify-between gap-3">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <div className="h-5 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-5 w-5/6 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
