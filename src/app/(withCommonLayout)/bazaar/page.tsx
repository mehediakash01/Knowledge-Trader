import { Suspense } from "react";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";
import { BazaarPage } from "@/components/Modules/Bazaar/BazaarPage";

const BazaarPageWithLayout = withCommonLayout(BazaarPage);

export default function BazaarRoutePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Bazaar...</div>}>
      <BazaarPageWithLayout />
    </Suspense>
  );
}
