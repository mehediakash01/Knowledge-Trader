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
  AdminDispute,
  useGetAdminDisputesQuery,
  useResolveAdminDisputeMutation,
} from "@/redux/features/admin/adminApi";

const limit = 10;

export default function AdminDisputesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const { data, isLoading, isError } = useGetAdminDisputesQuery({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });
  const [resolveDispute, { isLoading: isMutating }] = useResolveAdminDisputeMutation();

  const applyAction = async (id: string, action: "REFUND" | "RELEASE") => {
    try {
      await resolveDispute({ id, action }).unwrap();
      toast.success(action === "REFUND" ? "Tokens forced back to learner" : "Tokens force released");
    } catch {
      toast.error("Dispute action failed");
    }
  };

  const columns: Array<AdminColumn<AdminDispute>> = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <Badge variant="outline">{row.status}</Badge>,
    },
    {
      key: "sender",
      label: "Learner / Sender",
      render: (row) => (
        <div>
          <p className="font-black">{row.sender.name}</p>
          <p className="text-xs text-zinc-500">{row.sender.email}</p>
        </div>
      ),
    },
    {
      key: "receiver",
      label: "Mentor / Receiver",
      render: (row) => (
        <div>
          <p className="font-black">{row.receiver.name}</p>
          <p className="text-xs text-zinc-500">{row.receiver.email}</p>
        </div>
      ),
    },
    {
      key: "updatedAt",
      label: "Skills",
      sortable: true,
      render: (row) => (
        <div className="space-y-1 text-xs">
          <p><span className="font-bold">Offered:</span> {row.skillOffered.title}</p>
          <p><span className="font-bold">Requested:</span> {row.skillRequested.title}</p>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" disabled={isMutating} onClick={() => applyAction(row.id, "REFUND")}>
            Force Token Refund
          </Button>
          <Button size="sm" disabled={isMutating} onClick={() => applyAction(row.id, "RELEASE")}>
            Force Release Tokens
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Escrow Desk"
        title="Barter Ledger & Escrow Disputes"
        description="Inspect barter records and close contested exchanges with decisive administrative resolution controls."
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
