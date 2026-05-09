import dynamic from "next/dynamic";
import { withCommonLayout } from "@/components/Layouts/withCommonLayout";
import { HeroSection } from "@/components/Modules/HomePage/HeroSection";

// Lazy load below-the-fold sections for fast LCP
const BazaarSpotlight = dynamic(() => import("@/components/Modules/HomePage/BazaarSpotlight").then(m => m.BazaarSpotlight));
const AIMatchmaker = dynamic(() => import("@/components/Modules/HomePage/AIMatchmaker").then(m => m.AIMatchmaker));
const EconomyBento = dynamic(() => import("@/components/Modules/HomePage/EconomyBento").then(m => m.EconomyBento));
const AtomicTrust = dynamic(() => import("@/components/Modules/HomePage/AtomicTrust").then(m => m.AtomicTrust));
const CreatorShowcase = dynamic(() => import("@/components/Modules/HomePage/CreatorShowcase").then(m => m.CreatorShowcase));
const AIInsightsPreview = dynamic(() => import("@/components/Modules/HomePage/AIInsightsPreview").then(m => m.AIInsightsPreview));
const CategoryCloud = dynamic(() => import("@/components/Modules/HomePage/CategoryCloud").then(m => m.CategoryCloud));
const FinalCTA = dynamic(() => import("@/components/Modules/HomePage/FinalCTA").then(m => m.FinalCTA));

function Home() {
  return (
    <div className="bg-slate-50 dark:bg-zinc-950">
      <HeroSection />
      <BazaarSpotlight />
      <AIMatchmaker />
      <EconomyBento />
      <AtomicTrust />
      <CreatorShowcase />
      <AIInsightsPreview />
      <CategoryCloud />
      <FinalCTA />
    </div>
  );
}

export default withCommonLayout(Home);
