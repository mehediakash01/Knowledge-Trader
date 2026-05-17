"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useGetMeQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const cachedUser = useAppSelector((state) => state.auth.user);
  const { data: liveUser, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !cachedUser,
  });
  const role = liveUser?.role ?? cachedUser?.role;

  useEffect(() => {
    if (!isLoading && !isFetching && role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isLoading, isFetching, role, router]);

  if (isLoading || isFetching || role !== "ADMIN") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent dark:border-zinc-100" />
      </div>
    );
  }

  return <>{children}</>;
}
