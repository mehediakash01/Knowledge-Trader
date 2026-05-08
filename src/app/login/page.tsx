import { LoginForm } from "@/components/Modules/Auth/LoginForm";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";

interface LoginPageContentProps {
  redirectTo: string;
}

function LoginPageContent({ redirectTo }: LoginPageContentProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 dark:bg-zinc-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
      <div className="absolute left-1/2 top-20 size-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <LoginForm redirectTo={redirectTo} />
    </section>
  );
}

const LoginPageWithLayout = withCommonLayout(LoginPageContent);

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return <LoginPageWithLayout redirectTo={redirect || "/"} />;
}
