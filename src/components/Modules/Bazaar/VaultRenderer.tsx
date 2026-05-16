"use client";

import { useState } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  LockKeyhole,
  FileText,
  Globe,
  Link as LinkIcon,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VaultRendererProps {
  content: {
    longDescription?: string;
    resourceLinks?: string[];
    lockedContent?: any; // Legacy / Fallback
  };
  isLocked?: boolean;
  onUnlock?: () => void;
  tokenPrice?: number;
}

export function VaultRenderer({ content, isLocked, onUnlock, tokenPrice }: VaultRendererProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderNewContent = () => {
    // The new 4-step wizard stores the vault layout strictly in `content.lockedContent`
    const lockedData = content.lockedContent || {};
    
    const vaultContentType = lockedData.vaultContentType || "TEXT";
    const longDescription = lockedData.longDescription || content.longDescription;
    const resourceLinks = lockedData.resourceLinks || content.resourceLinks || [];
    const vaultVideo = lockedData.vaultVideo || "";
    const vaultPdf = lockedData.vaultPdf || "";
    const vaultCodeLink = lockedData.vaultCodeLink || "";
    const vaultCodeDescription = lockedData.vaultCodeDescription || "";

    return (
      <div className="space-y-8">
        
        {/* TEXT FORMAT */}
        {(vaultContentType === "TEXT" || (!vaultContentType && longDescription)) && longDescription && (
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
                <FileText className="size-5 text-blue-500" />
                The Strategy & Methodology
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(longDescription, "long-desc")}
                className="text-xs text-zinc-400"
              >
                {copiedId === "long-desc" ? <Check className="size-4 mr-1 text-emerald-500" /> : <Copy className="size-4 mr-1" />}
                Copy Text
              </Button>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {longDescription}
            </div>
          </div>
        )}

        {/* VIDEO FORMAT */}
        {vaultContentType === "VIDEO" && vaultVideo && (
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
              <ShieldCheck className="size-5 text-blue-500" />
              Video Masterclass
            </h3>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-950">
              <video 
                src={vaultVideo} 
                controls 
                controlsList="nodownload"
                className="h-full w-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* PDF FORMAT */}
        {vaultContentType === "PDF" && vaultPdf && (
           <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
              <FileText className="size-5 text-blue-500" />
              Document Vault
            </h3>
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
               <FileText className="size-12 text-blue-500 mb-4" />
               <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Your PDF is ready for viewing</h4>
               <Button asChild className="rounded-full bg-blue-600 font-bold text-white hover:bg-blue-700">
                 <a href={vaultPdf} target="_blank" rel="noreferrer">Open PDF</a>
               </Button>
            </div>
           </div>
        )}

        {/* CODE FORMAT */}
        {vaultContentType === "CODE" && vaultCodeLink && (
           <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
              <Globe className="size-5 text-blue-500" />
              Technical Repository
            </h3>
            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
               <p className="truncate font-mono text-sm text-blue-600 dark:text-cyan-400">
                 {vaultCodeLink}
               </p>
               <Button asChild variant="outline" size="sm" className="rounded-full">
                 <a href={vaultCodeLink} target="_blank" rel="noreferrer">
                   <ExternalLink className="mr-2 size-4" /> Open Repo
                 </a>
               </Button>
            </div>
            
            {vaultCodeDescription && (
               <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                 <h4 className="mb-4 text-sm font-bold text-zinc-900 dark:text-zinc-300">Code Documentation</h4>
                 <div className="prose prose-zinc dark:prose-invert max-w-none font-mono text-sm leading-relaxed text-zinc-700 dark:text-zinc-400 whitespace-pre-wrap">
                   {vaultCodeDescription}
                 </div>
               </div>
            )}
           </div>
        )}

        {/* Private Resources */}
        {resourceLinks && resourceLinks.length > 0 && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
              <LinkIcon className="size-5 text-blue-500" />
              Private Assets & Links
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {resourceLinks.map((link: string, idx: number) => (
                <Card key={idx} className="group overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400">
                        <Globe className="size-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                          Private Resource {idx + 1}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {link}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 rounded-lg border-zinc-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:border-zinc-800"
                      asChild
                    >
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!longDescription && !vaultVideo && !vaultPdf && !vaultCodeLink && (!resourceLinks || resourceLinks.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
             <ShieldAlert className="size-12 text-zinc-300 mb-4" />
             <p className="text-zinc-500">Vault content is being prepared by the expert.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className={cn(
        "transition-all duration-700",
        isLocked && "select-none blur-2xl grayscale opacity-30 pointer-events-none"
      )}>
        {renderNewContent()}
      </div>

      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[2.5rem] bg-white/20 backdrop-blur-md dark:bg-zinc-950/20">
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-white/60 bg-white/80 p-10 text-center shadow-2xl dark:border-white/10 dark:bg-zinc-900/80 sm:p-14">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/10" />
              <div className="relative flex size-24 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                <LockKeyhole className="size-12" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Strategy Vault Locked</h3>
            <p className="mt-4 max-w-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Unlock the expert's battle-tested methodology and private resources for <strong>{tokenPrice} KT</strong>.
            </p>

            <div className="mt-10 flex flex-col gap-4 w-full">
              <Button
                onClick={onUnlock}
                className="w-full rounded-2xl bg-blue-600 py-8 text-xl font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Unlock Vault Access
              </Button>
              <p className="text-xs font-medium text-zinc-500 flex items-center justify-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                Verified expert content
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
