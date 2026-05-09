import { withCommonLayout } from "@/components/Layouts/withCommonLayout";
import { Scale } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Knowledge Trader",
};

 function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 shadow-inner dark:bg-cyan-500/10 dark:text-cyan-400">
            <Scale className="size-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Privacy Policy</h1>
          <p className="mt-4 text-zinc-500">Last updated: May 9, 2026</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 sm:p-12">
          <h2>1. Introduction</h2>
          <p>
            At Knowledge Trader, we respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website 
            and tell you about your privacy rights.
          </p>

          <h2>2. The Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address.</li>
            <li><strong>Transaction Data</strong> includes details about payments (Knowledge Tokens) to and from you and other details of vaults you have purchased from us.</li>
            <li><strong>Profile Data</strong> includes your purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., executing an atomic trade).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where our AI Matchmaker requires semantic processing to suggest relevant mentors and skills. Note: Your profile data is anonymized before being processed by the AI engine.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. 
            All trades are processed using secure atomic database transactions to ensure absolute data integrity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default withCommonLayout(PrivacyPage);
