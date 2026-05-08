import { ProtectedRoute } from "@/components/Shared/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-slate-50">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-blue-600 dark:text-cyan-300">
            Protected
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Your protected trading workspace will live here.
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
