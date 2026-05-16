import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/lib/Providers";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knowledge Trader - Skill Exchange Marketplace",
  description: "A reputation-backed skill marketplace with AI-driven discovery, real-time notifications, and tokenized knowledge exchange.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-zinc-950 dark:bg-zinc-950 dark:text-slate-50" suppressHydrationWarning>
        <NextTopLoader color="#0ea5e9" showSpinner={false} />
        {/* Subtle Noise Overlay */}
        <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.03] mix-blend-overlay dark:opacity-[0.02]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
