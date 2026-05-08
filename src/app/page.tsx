import { withCommonLayout } from "@/components/Layouts/withCommonLayout";
import { HeroSection } from "@/components/Modules/HomePage/HeroSection";

function Home() {
  return (
    <div className="bg-slate-50 dark:bg-zinc-950">
      <HeroSection />
    </div>
  );
}

export default withCommonLayout(Home);
