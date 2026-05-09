"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/hooks";
import { getAccessToken } from "@/services/auth.service";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken && !getAccessToken()) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [accessToken, pathname, router, allowedRoles, user?.role]);

  if (!accessToken && !getAccessToken()) {
    return null;
  }

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
