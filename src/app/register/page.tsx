import { RegisterForm } from "@/components/Modules/Auth/RegisterForm";
import { AuthScene } from "@/components/Modules/Auth/AuthScene";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";

interface RegisterPageContentProps {
  redirectTo: string;
}

function RegisterPageContent({ redirectTo }: RegisterPageContentProps) {
  return (
    <AuthScene
      eyebrow="Create your profile"
      title="Join the marketplace."
      description="Open an account, verify your identity with Google or email, and start earning credibility the moment you arrive."
      highlights={[
        {
          title: "10 KT starting balance",
          copy: "New accounts begin with enough balance to explore the marketplace immediately.",
        },
        {
          title: "Fast Google onboarding",
          copy: "One click creates a profile if the email is new, then logs the user in right away.",
        },
        {
          title: "Consistency by design",
          copy: "The same token flow and auth persistence are used across every sign-in path.",
        },
      ]}
    >
      <RegisterForm redirectTo={redirectTo} />
    </AuthScene>
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
