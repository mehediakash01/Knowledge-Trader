"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AdminColumn,
  AdminDataTable,
  AdminPageHeader,
  SortOrder,
} from "@/components/Modules/Admin/AdminShared";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import {
  AdminUser,
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
} from "@/redux/features/admin/adminApi";

const limit = 10;

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const { data, isLoading, isError } = useGetAdminUsersQuery({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });
  const [updateUser, { isLoading: isMutating }] = useUpdateAdminUserMutation();

  const applyAction = async (
    id: string,
    action: {
      role?: "USER" | "ADMIN";
      status?: "ACTIVE" | "SUSPENDED" | "BANNED";
    },
  ) => {
    try {
      await updateUser({ id, role: action.role, status: action.status }).unwrap();
      toast.success("User action applied");
    } catch {
      toast.error("Could not apply user action");
    }
  };

  const columns: Array<AdminColumn<AdminUser>> = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-black text-zinc-950 dark:text-zinc-50">{row.name}</p>
          <p className="text-xs text-zinc-500">{row.email}</p>
        </div>
      ),
    },
    { key: "role", label: "Role", sortable: true, render: (row) => <Badge>{row.role}</Badge> },
    { key: "status", label: "Status", sortable: true, render: (row) => <Badge variant="outline">{row.status}</Badge> },
    { key: "tokenBalance", label: "Tokens", sortable: true, render: (row) => row.tokenBalance ?? row.ktBalance ?? 0 },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" disabled={isMutating} onClick={() => applyAction(row.id, { role: row.role === "ADMIN" ? "USER" : "ADMIN" })}>
            {row.role === "ADMIN" ? "Make User" : "Make Admin"}
          </Button>
          <Button size="sm" variant="outline" disabled={isMutating} onClick={() => applyAction(row.id, { status: "SUSPENDED" })}>
            Suspend
          </Button>
          <Button size="sm" variant="destructive" disabled={isMutating} onClick={() => applyAction(row.id, { status: "BANNED" })}>
            Ban
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Identity Control"
        title="User Management Matrix"
        description="Search accounts, sort operational columns, paginate from the server, and apply role or account state decisions."
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
