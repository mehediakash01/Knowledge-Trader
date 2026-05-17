"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { cn } from "@/lib/utils";

export type SortOrder = "asc" | "desc";

export type AdminColumn<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => ReactNode;
};

export function AdminPageHeader({
  title,
  eyebrow,
  description,
}: {
  title: string;
  eyebrow: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {description}
      </p>
    </div>
  );
}

export function EmptyState({ message = "No records match your selected filtering rules" }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-white p-8 text-center text-sm font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
      {message}
    </div>
  );
}

export function AdminDataTable<T extends { id: string }>({
  columns,
  rows,
  isLoading,
  isError,
  search,
  onSearchChange,
  page,
  limit,
  total,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
}: {
  columns: Array<AdminColumn<T>>;
  rows: T[];
  isLoading: boolean;
  isError: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  limit: number;
  total: number;
  sortBy: string;
  sortOrder: SortOrder;
  onSortChange: (key: string) => void;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="overflow-hidden rounded-lg border-2 border-zinc-800 bg-white shadow-[8px_8px_0_#18181b] dark:bg-zinc-950 dark:shadow-[8px_8px_0_#3f3f46]">
      <div className="flex flex-col gap-3 border-b-2 border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search records"
            className="h-11 border-2 border-zinc-800 pl-10 font-semibold"
          />
        </label>
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
          {total} records
        </div>
      </div>

      {isError ? (
        <div className="p-4">
          <EmptyState />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase tracking-[0.16em] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className={cn("px-4 py-3", column.className)}>
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSortChange(column.key)}
                        className="inline-flex items-center gap-1 font-black"
                      >
                        {column.label}
                        {sortBy === column.key && sortOrder === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : sortBy === column.key ? (
                          <ArrowDown className="size-3" />
                        ) : null}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td colSpan={columns.length} className="px-4 py-4">
                      <div className="h-5 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    </td>
                  </tr>
                ))
              ) : rows.length ? (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-zinc-200 align-top dark:border-zinc-800">
                    {columns.map((column) => (
                      <td key={column.key} className={cn("px-4 py-4", column.className)}>
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-4">
                    <EmptyState />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t-2 border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
