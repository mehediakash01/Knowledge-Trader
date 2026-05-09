"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/UI/dialog";
import { Input } from "@/components/UI/input";
import { Checkbox } from "@/components/UI/checkbox";
import { ScrollArea } from "@/components/UI/scroll-area";
import { Slider } from "@/components/UI/slider";
import { Skeleton } from "@/components/UI/skeleton";
import { Button } from "@/components/UI/button";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllSkillPostsQuery,
  useGetCategoriesQuery,
} from "@/redux/api/skillPostApi";
import { useGetMyTradesQuery } from "@/redux/api/tradeApi";
import type { BazaarFilterState } from "./bazaarFilters";
import {
  BAZAAR_DEFAULT_LIMIT,
  BAZAAR_MAX_PRICE,
  buildBazaarQueryParams,
  parseBazaarSearchParams,
} from "./bazaarFilters";
import { SkillCard } from "./SkillCard";

const PAGE_ANIMATION = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const ITEM_ANIMATION = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function filterStateFromQuery(searchParams: ReturnType<typeof useSearchParams>) {
  return parseBazaarSearchParams(Object.fromEntries(searchParams.entries()));
}

export function BazaarPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);

  const querySignature = searchParams.toString();
  const parsedFilters = useMemo(
    () => filterStateFromQuery(searchParams),
    [querySignature],
  );

  const [searchInput, setSearchInput] = useState(parsedFilters.searchTerm);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [debouncedSearch] = useDebounce(searchInput, 350);

  useEffect(() => {
    setSearchInput(parsedFilters.searchTerm);
  }, [querySignature, parsedFilters.searchTerm]);

  const queryParams = useMemo(
    () => ({
      searchTerm: parsedFilters.searchTerm || undefined,
      category: parsedFilters.categories.length
        ? parsedFilters.categories.join(",")
        : undefined,
      minPrice: parsedFilters.minPrice,
      maxPrice: parsedFilters.maxPrice,
      page: parsedFilters.page,
      limit: parsedFilters.limit,
    }),
    [parsedFilters],
  );

  const skillPostQuery = useGetAllSkillPostsQuery(queryParams);
  const categoriesQuery = useGetCategoriesQuery();
  const tradesQuery = useGetMyTradesQuery(undefined, { skip: !user });

  const purchasedPostIds = useMemo(() => {
    const completedTrades = tradesQuery.data?.learningTrades.filter(
      (trade) => trade.status === "COMPLETED",
    );

    return new Set(completedTrades?.map((trade) => trade.postId) ?? []);
  }, [tradesQuery.data]);

  useEffect(() => {
    if (debouncedSearch === parsedFilters.searchTerm) {
      return;
    }

    const nextFilters: BazaarFilterState = {
      ...parsedFilters,
      searchTerm: debouncedSearch,
      page: 1,
    };

    router.replace(`${pathname}?${buildBazaarQueryParams(nextFilters)}`, {
      scroll: false,
    });
  }, [debouncedSearch, parsedFilters, pathname, router]);

  const updateFilters = (
    nextFilters: BazaarFilterState,
    navigation: "replace" | "push" = "replace",
  ) => {
    const url = `${pathname}?${buildBazaarQueryParams(nextFilters)}`;

    if (navigation === "push") {
      router.push(url, { scroll: false });
      return;
    }

    router.replace(url, { scroll: false });
  };

  const toggleCategory = (category: string) => {
    const nextCategories = parsedFilters.categories.includes(category)
      ? parsedFilters.categories.filter((item) => item !== category)
      : [...parsedFilters.categories, category];

    updateFilters(
      {
        ...parsedFilters,
        categories: nextCategories,
        page: 1,
      },
      "replace",
    );
  };

  const handlePriceChange = (value: number[]) => {
    const [minPrice = 0, maxPrice = BAZAAR_MAX_PRICE] = value;

    updateFilters(
      {
        ...parsedFilters,
        minPrice,
        maxPrice: Math.max(minPrice, maxPrice),
        page: 1,
      },
      "replace",
    );
  };

  const handleClearAll = () => {
    setSearchInput("");
    updateFilters(
      {
        searchTerm: "",
        categories: [],
        minPrice: 0,
        maxPrice: BAZAAR_MAX_PRICE,
        page: 1,
        limit: BAZAAR_DEFAULT_LIMIT,
      },
      "replace",
    );
  };

  const handlePageChange = (page: number) => {
    updateFilters(
      {
        ...parsedFilters,
        page,
      },
      "push",
    );
  };

  const accessStateForPost = (postId: string, creatorId: string) => {
    if (!user) {
      return "locked" as const;
    }

    if (user.id === creatorId) {
      return "owned" as const;
    }

    if (tradesQuery.isLoading) {
      return "checking" as const;
    }

    if (purchasedPostIds.has(postId)) {
      return "purchased" as const;
    }

    return "locked" as const;
  };

  const totalPages = Math.max(
    1,
    Math.ceil((skillPostQuery.data?.meta.total ?? 0) / parsedFilters.limit),
  );

  const hasActiveFilters =
    parsedFilters.searchTerm.trim().length > 0 ||
    parsedFilters.categories.length > 0 ||
    parsedFilters.minPrice > 0 ||
    parsedFilters.maxPrice < BAZAAR_MAX_PRICE ||
    parsedFilters.page > 1;

  return (
    <section className="relative overflow-hidden bg-slate-50 py-8 text-zinc-950 dark:bg-zinc-950 dark:text-slate-50 lg:py-10">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/70 to-transparent" />
      <div className="absolute left-1/2 top-0 size-112 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-cyan-400/10" />

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <FilterPanel
            categories={categoriesQuery.data ?? []}
            filters={parsedFilters}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onClearAll={handleClearAll}
            onCategoryToggle={toggleCategory}
            onPriceChange={handlePriceChange}
            onSearchImmediate={(value) => setSearchInput(value)}
          />
        </aside>

        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                  <Sparkles className="size-3.5" />
                  Immersive Skill Bazaar
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Discover high-trust expertise with a Sapphire Blue filter grid.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:text-base">
                  Search, refine, and share a fully URL-synced skill marketplace.
                  The filter state persists in the link, so your curated view is
                  always one copy-paste away.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden rounded-full border-blue-500/15 bg-white/70 px-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70"
                    >
                      <SlidersHorizontal className="size-4" />
                      Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    showCloseButton={false}
                    className="left-3 top-3 h-[calc(100vh-1.5rem)] max-w-none translate-x-0 translate-y-0 overflow-hidden rounded-[2rem] border border-white/20 bg-white/90 p-0 shadow-2xl backdrop-blur-2xl dark:bg-zinc-950/95 sm:w-88"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                      <DialogTitle className="text-base font-semibold">
                        Filter Bazaar
                      </DialogTitle>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDrawerOpen(false)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div className="h-[calc(100%-4rem)] p-4">
                      <FilterPanel
                        categories={categoriesQuery.data ?? []}
                        filters={parsedFilters}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        onClearAll={handleClearAll}
                        onCategoryToggle={toggleCategory}
                        onPriceChange={handlePriceChange}
                        onSearchImmediate={(value) => setSearchInput(value)}
                        compact
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                  <LayoutGrid className="size-4" />
                  {skillPostQuery.data?.meta.total ?? 0} listings
                </div>
              </div>
            </div>

            {hasActiveFilters ? (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Active:</span>
                {parsedFilters.searchTerm ? (
                  <FilterChip label={`Search: ${parsedFilters.searchTerm}`} />
                ) : null}
                {parsedFilters.categories.map((category) => (
                  <FilterChip key={category} label={category} />
                ))}
                {parsedFilters.minPrice > 0 || parsedFilters.maxPrice < BAZAAR_MAX_PRICE ? (
                  <FilterChip
                    label={`${parsedFilters.minPrice} KT - ${parsedFilters.maxPrice} KT`}
                  />
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto rounded-full"
                  onClick={handleClearAll}
                >
                  <RefreshCcw className="size-4" />
                  Clear all
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            {skillPostQuery.isLoading ? (
              <motion.div
                variants={PAGE_ANIMATION}
                initial="hidden"
                animate="visible"
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <motion.div key={index} variants={ITEM_ANIMATION}>
                    <SkillCardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : skillPostQuery.data?.data.length ? (
              <>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    variants={PAGE_ANIMATION}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {skillPostQuery.data.data.map((post) => (
                      <motion.div key={post.id} variants={ITEM_ANIMATION}>
                        <SkillCard
                          post={post}
                          accessState={accessStateForPost(post.id, post.creatorId)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                <BazaarPagination
                  page={skillPostQuery.data.meta.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState onClearAll={handleClearAll} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterPanel({
  categories,
  filters,
  searchInput,
  setSearchInput,
  onCategoryToggle,
  onPriceChange,
  onClearAll,
  onSearchImmediate,
  compact = false,
}: {
  categories: string[];
  filters: BazaarFilterState;
  searchInput: string;
  setSearchInput: (value: string) => void;
  onCategoryToggle: (category: string) => void;
  onPriceChange: (value: number[]) => void;
  onClearAll: () => void;
  onSearchImmediate: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "sticky top-24 rounded-[2rem] border border-white/60 bg-white/65 p-5 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60",
        compact && "sticky top-0 h-full border-0 bg-transparent p-0 shadow-none",
      )}
    >
      <div className="space-y-5">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-cyan-300">
                Filters
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                Refine your search
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              <X className="size-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                onSearchImmediate(event.target.value);
              }}
              placeholder="Search by title, tag, or category"
              className="h-11 rounded-2xl border-white/60 bg-white/80 pl-10 text-sm shadow-sm dark:border-white/10 dark:bg-zinc-950/70"
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Price range
            </h3>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {filters.minPrice} - {filters.maxPrice} KT
            </span>
          </div>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            min={0}
            max={BAZAAR_MAX_PRICE}
            step={1}
            onValueChange={onPriceChange}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Categories
            </h3>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {filters.categories.length} selected
            </span>
          </div>

          <ScrollArea className={compact ? "h-[calc(100vh-22rem)]" : "h-72 pr-3"}>
            <div className="space-y-2 pr-2">
              {categories.length ? (
                categories.map((category) => {
                  const checked = filters.categories.includes(category);

                  return (
                      <div
                        key={category}
                      role="button"
                      tabIndex={0}
                      onClick={() => onCategoryToggle(category)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onCategoryToggle(category);
                        }
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition-all",
                        checked
                          ? "border-blue-500/20 bg-blue-500/10 text-blue-700 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200"
                          : "border-white/60 bg-white/70 hover:border-blue-500/20 hover:bg-blue-500/5 dark:border-white/10 dark:bg-zinc-950/60",
                      )}
                    >
                      <span>{category}</span>
                      <Checkbox checked={checked} />
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/60 bg-white/60 px-4 py-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-400">
                  Loading categories...
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-blue-500/15 bg-blue-500/8 px-3 py-1 text-xs font-medium text-blue-700 dark:border-cyan-300/15 dark:bg-cyan-300/10 dark:text-cyan-200">
      {label}
    </span>
  );
}

function SkillCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/80 shadow-[0_16px_42px_-24px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-zinc-950/70">
      <Skeleton className="aspect-16/10 rounded-none bg-slate-200/70 dark:bg-zinc-800" />
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-24 rounded-full bg-slate-200/70 dark:bg-zinc-800" />
          <Skeleton className="h-5 w-20 rounded-full bg-slate-200/70 dark:bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-full rounded-full bg-slate-200/70 dark:bg-zinc-800" />
          <Skeleton className="h-5 w-5/6 rounded-full bg-slate-200/70 dark:bg-zinc-800" />
          <Skeleton className="h-5 w-4/6 rounded-full bg-slate-200/70 dark:bg-zinc-800" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full bg-slate-200/70 dark:bg-zinc-800" />
          <Skeleton className="h-6 w-20 rounded-full bg-slate-200/70 dark:bg-zinc-800" />
          <Skeleton className="h-6 w-14 rounded-full bg-slate-200/70 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClearAll }: { onClearAll: () => void }) {
  return (
    <div className="flex min-h-120 items-center justify-center rounded-[2rem] border border-dashed border-blue-500/20 bg-white/60 px-6 py-16 text-center shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-cyan-300/20 dark:bg-zinc-950/50">
      <div className="max-w-md">
        <NoResultsIllustration />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">
          No results found
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          These filters are too specific for the current skill inventory. Try a
          broader category or relax the price range.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            onClick={onClearAll}
            className="rounded-full bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-400 dark:text-zinc-950 dark:hover:bg-cyan-300"
          >
            Clear all filters
          </Button>
        </div>
      </div>
    </div>
  );
}

function NoResultsIllustration() {
  return (
    <div className="mx-auto flex size-36 items-center justify-center rounded-[2rem] border border-white/60 bg-linear-to-br from-blue-500/10 via-cyan-300/10 to-slate-200/50 shadow-[0_15px_40px_-24px_rgba(15,23,42,0.45)] dark:border-white/10 dark:from-cyan-300/10 dark:via-blue-500/10 dark:to-zinc-900/70">
      <svg viewBox="0 0 144 144" className="size-24" aria-hidden="true">
        <defs>
          <linearGradient id="noResultsGlow" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <circle cx="72" cy="58" r="30" fill="url(#noResultsGlow)" opacity="0.16" />
        <rect x="40" y="40" width="64" height="44" rx="16" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5" />
        <path d="M51 58h42" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M58 68h24" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 92c8-12 18-18 28-18 10 0 20 6 28 18" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M102 95l10 10" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="108" cy="101" r="7" fill="none" stroke="#22d3ee" strokeWidth="3" />
      </svg>
    </div>
  );
}

function BazaarPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (candidate) =>
      candidate === 1 ||
      candidate === totalPages ||
      Math.abs(candidate - page) <= 1,
  );

  const displayPages: (number | "ellipsis")[] = [];

  pages.forEach((candidate, index) => {
    const previous = pages[index - 1];

    if (typeof previous === "number" && candidate - previous > 1) {
      displayPages.push("ellipsis");
    }

    displayPages.push(candidate);
  });

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border border-white/60 bg-white/75 px-4 py-4 shadow-[0_16px_42px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/65 sm:flex-row sm:px-5">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Page {page} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-full border-blue-500/15 bg-white/80 dark:border-white/10 dark:bg-zinc-950/70"
        >
          <ChevronLeft className="size-4" />
          Prev
        </Button>

        {displayPages.map((candidate, index) =>
          candidate === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-zinc-400">
              ...
            </span>
          ) : (
            <Button
              key={candidate}
              variant={candidate === page ? "default" : "outline"}
              size="icon-sm"
              onClick={() => onPageChange(candidate)}
              className={cn(
                "rounded-full",
                candidate === page
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 dark:bg-cyan-400 dark:text-zinc-950"
                  : "border-blue-500/15 bg-white/80 dark:border-white/10 dark:bg-zinc-950/70",
              )}
            >
              {candidate}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-full border-blue-500/15 bg-white/80 dark:border-white/10 dark:bg-zinc-950/70"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
