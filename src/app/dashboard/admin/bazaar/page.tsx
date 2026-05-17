"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AdminColumn,
  AdminDataTable,
  AdminPageHeader,
  SortOrder,
} from "@/components/Modules/Admin/AdminShared";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  AdminPost,
  useGetAdminBazaarPostsQuery,
  useModerateAdminPostMutation,
} from "@/redux/features/admin/adminApi";

const limit = 10;

export default function AdminBazaarPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const { data, isLoading, isError } = useGetAdminBazaarPostsQuery({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });
  const [moderatePost, { isLoading: isMutating }] = useModerateAdminPostMutation();

  const applyAction = async (id: string, action: "CLEAR" | "TAKE_DOWN") => {
    try {
      await moderatePost({ id, action }).unwrap();
      toast.success(action === "CLEAR" ? "Flag cleared" : "Post taken down");
    } catch {
      toast.error("Moderation action failed");
    }
  };

  const columns: Array<AdminColumn<AdminPost>> = [
    {
      key: "title",
      label: "Skill Post",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-black text-zinc-950 dark:text-zinc-50">{row.title}</p>
          <p className="text-xs text-zinc-500">{row.creator?.name} - {row.creator?.email}</p>
        </div>
      ),
    },
    { key: "category", label: "Category", sortable: true, render: (row) => row.category },
    { key: "tokenPrice", label: "Price", sortable: true, render: (row) => `${row.tokenPrice} KT` },
    { key: "moderationStatus", label: "Status", sortable: true, render: (row) => <Badge variant="outline">{row.moderationStatus}</Badge> },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" disabled={isMutating} onClick={() => applyAction(row.id, "CLEAR")}>
            Clear Flag
          </Button>
          <Button size="sm" variant="destructive" disabled={isMutating} onClick={() => applyAction(row.id, "TAKE_DOWN")}>
            Take Down
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Content Integrity"
        title="Bazaar Content Moderation"
        description="Moderate flagged skill posts with server-backed search, sorting, and pagination that stays responsive on compact screens."
      />
      <AdminDataTable
        columns={columns}
        rows={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        page={page}
        limit={limit}
        total={data?.meta?.total ?? 0}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(key) => {
          setSortBy(key);
          setSortOrder((current) => (sortBy === key && current === "asc" ? "desc" : "asc"));
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
