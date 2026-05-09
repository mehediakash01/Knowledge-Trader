import { withCommonLayout } from "@/components/Layouts/withCommonLayout";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Knowledge Trader",
};

 function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 shadow-inner dark:bg-fuchsia-500/20 dark:text-fuchsia-400">
            <FileText className="size-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Terms of Service</h1>
          <p className="mt-4 text-zinc-500">Effective Date: May 9, 2026</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 sm:p-12">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using Knowledge Trader (the "Platform"), you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, then you may not access the Platform.
          </p>

          <h2>2. Knowledge Tokens (KT)</h2>
          <p>
            The Platform utilizes "Knowledge Tokens" (KT) as an internal accounting mechanism for the exchange of digital content. 
            KT are not a cryptocurrency, hold no cash value outside the Platform, and cannot be redeemed for fiat currency by the Platform. 
            Upon registration, users are granted an initial balance of KT.
          </p>

          <h2>3. Content & Vaults</h2>
          <p>
            Users may create "Skill Vaults" containing locked content. You retain all rights to the content you create. 
            By posting content, you grant us the right to store, display, and process your content using our AI Smart Reviewer system to generate summaries.
          </p>
          <p>
            You agree not to post content that is illegal, infringes on intellectual property rights, or violates our community guidelines.
          </p>

          <h2>4. Atomic Trades & Refunds</h2>
          <p>
            All trades on the platform are final. Our systems utilize atomic database transactions to ensure that KT is only deducted when vault access is successfully granted. 
            Because digital access cannot be returned, we do not offer refunds. We encourage users to rely on the AI-generated reviews and reputation scores before completing a trade.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            Knowledge Trader is provided on an "as is" and "as available" basis. We make no warranties regarding the accuracy or quality of the content provided by users in their vaults.
          </p>
        </div>
      </div>
    </div>
  );
}
export default withCommonLayout(TermsPage);
