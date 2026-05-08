import { RegisterForm } from "@/components/Modules/Auth/RegisterForm";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";

interface RegisterPageContentProps {
  redirectTo: string;
}

function RegisterPageContent({ redirectTo }: RegisterPageContentProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 dark:bg-zinc-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-600/70 to-transparent dark:via-cyan-400/70" />
      <div className="absolute left-1/2 top-20 size-80 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl dark:bg-cyan-400/10" />
      <RegisterForm redirectTo={redirectTo} />
    </section>
  );
}

const RegisterPageWithLayout = withCommonLayout(RegisterPageContent);

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return <RegisterPageWithLayout redirectTo={redirect || "/"} />;
}
