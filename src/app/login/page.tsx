import { LoginForm } from "@/components/Modules/Auth/LoginForm";
import { AuthScene } from "@/components/Modules/Auth/AuthScene";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";

interface LoginPageContentProps {
  redirectTo: string;
}

function LoginPageContent({ redirectTo }: LoginPageContentProps) {
  return (
    <AuthScene
      eyebrow="Trusted entry point"
      title="Return to the exchange."
      description="Sign in once and the app restores your access tokens, profile state, and dashboard context without any friction."
      highlights={[
        {
          title: "Instant session restore",
          copy: "Stored credentials hydrate the Redux session as soon as the page mounts.",
        },
        {
          title: "Social or email",
          copy: "Use Google for speed or your existing password for direct access.",
        },
        {
          title: "Premium focus",
          copy: "Sharp borders, tactile inputs, and a high-contrast layout keep the form readable.",
        },
      ]}
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthScene>
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
