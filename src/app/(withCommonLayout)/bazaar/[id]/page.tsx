import { notFound } from "next/navigation";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";
import { SkillVaultPage } from "@/components/Modules/Bazaar/SkillVaultPage";

const SkillVaultPageWithLayout = withCommonLayout(SkillVaultPage);

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SkillVaultRoutePage({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams.id) {
    notFound();
  }

  return <SkillVaultPageWithLayout id={resolvedParams.id} />;
}
