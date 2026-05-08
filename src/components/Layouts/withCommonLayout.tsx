import type { ComponentType } from "react";

import { Footer } from "@/components/Shared/Footer";
import { Navbar } from "@/components/Shared/Navbar";

export function withCommonLayout<TProps extends object>(
  Component: ComponentType<TProps>
) {
  return function CommonLayout(props: TProps) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-zinc-950 dark:bg-zinc-950 dark:text-slate-50">
        <Navbar />
        <main className="flex-1">
          <Component {...props} />
        </main>
        <Footer />
      </div>
    );
  };
}
