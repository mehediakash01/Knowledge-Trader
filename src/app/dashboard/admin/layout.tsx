import type { ReactNode } from "react";

import { AdminGuard } from "@/components/Shared/AdminGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
