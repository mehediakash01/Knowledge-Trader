"use client";

import { useState } from "react";
import { 
  ExternalLink, 
  Copy, 
  Check, 
  LockKeyhole, 
  FileText, 
  Globe
} from "lucide-react";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VaultRendererProps {
  content: any;
  isLocked?: boolean;
  onUnlock?: () => void;
  tokenPrice?: number;
}

type VaultItem = {
  type?: string;
  title?: string;
  value?: unknown;
  url?: string;
  content?: unknown;
};

const toVaultItems = (input: any): VaultItem[] => {
  const parsedContent = (() => {
    if (typeof input === "string") {
      try {
        return JSON.parse(input);
      } catch {
        return [{ type: "text", value: input }];
      }
    }

    return input;
  })();

  const items = Array.isArray(parsedContent) ? parsedContent : [parsedContent];

  return items
    .filter((item): item is VaultItem => item !== null && item !== undefined)
    .map((item) => {
      if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
        return { type: "text", value: String(item) };
      }

      return item as VaultItem;
    });
};

export function VaultRenderer({ content, isLocked, onUnlock, tokenPrice }: VaultRendererProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderContent = () => {
    const items = toVaultItems(content);

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item: any, index: number) => {
          const id = `item-${index}`;
          const value = item?.value;
          const url = typeof item?.url === "string" ? item.url : typeof value === "string" ? value : "";
          const valueText = typeof value === "string" ? value : value != null ? String(value) : "";
          const isUrl = typeof value === "string" && (value.startsWith("http") || item?.type === "url");
          
          if ((isUrl || item?.type === "url" || item?.type === "link") && url) {
            return (
              <Card key={id} className="group overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-400">
                      <Globe className="size-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                        {item?.title || "External Resource"}
                      </p>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {url}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-2 rounded-lg border-zinc-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:border-zinc-800"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={id} className="group overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400">
                    <FileText className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {item?.title || "Instruction"}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleCopy(valueText || JSON.stringify(item), id)}
                  >
                    {copiedId === id ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                  </Button>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {valueText || JSON.stringify(item)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className={cn(
        "transition-all duration-700",
        isLocked && "select-none blur-xl grayscale opacity-30 pointer-events-none"
      )}>
        {renderContent()}
      </div>

      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[2.5rem] bg-white/20 backdrop-blur-md dark:bg-zinc-950/20">
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/80 p-10 text-center shadow-2xl dark:border-white/10 dark:bg-zinc-900/80">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
              <div className="relative flex size-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <LockKeyhole className="size-10" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Premium Content</h3>
            <p className="mt-3 max-w-xs text-zinc-600 dark:text-zinc-400">
              This vault contains exclusive resources. Unlock it to gain full access.
            </p>
            
            <div className="mt-8 flex flex-col gap-3 w-full">
              <Button 
                onClick={onUnlock}
                className="w-full rounded-2xl bg-blue-600 py-7 text-lg font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Unlock for {tokenPrice} KT
              </Button>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Secure transaction guaranteed by Knowledge Trader Escrow
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
