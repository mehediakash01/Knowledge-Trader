"use client";

import { useState, useRef } from "react";
import { Upload, X, FileCheck, Loader2, AlertCircle, FileVideo, FileText, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadToCloudinary, validateTeaserAsset } from "@/lib/cloudinary";

interface Props {
  id: string;
  label: string;
  accept: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
  enforceMinVideoSeconds?: number;
}

export function CloudinaryUploader({ id, label, accept, currentUrl, onUploaded, enforceMinVideoSeconds }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, (pct) => setProgress(pct));

      // If it's a teaser asset, run strict validation
      if (enforceMinVideoSeconds || accept.includes("video") || accept.includes("pdf")) {
        const validation = validateTeaserAsset(file, result);
        if (!validation.valid) {
          setError(validation.error || "File does not meet quality requirements.");
          setIsUploading(false);
          return;
        }
      }

      onUploaded(result.secure_url);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!currentUrl) return <Upload className="size-5" />;
    if (currentUrl.includes(".mp4") || currentUrl.includes(".mov")) return <FileVideo className="size-5" />;
    if (currentUrl.includes(".pdf")) return <FileText className="size-5" />;
    return <FileCheck className="size-5" />;
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all hover:border-blue-600 hover:bg-blue-50/50 hover:shadow-sm dark:hover:border-cyan-500",
          isUploading ? "border-blue-400 bg-blue-50/50 dark:border-cyan-700 dark:bg-cyan-900/20" :
          currentUrl ? "border-emerald-500 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-900/20" :
          "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
        )}
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-blue-600 dark:text-cyan-400" />
            <div className="text-center">
              <p className="text-sm font-semibold">Uploading asset...</p>
              <p className="text-xs text-zinc-400">{progress}% complete</p>
            </div>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full bg-blue-600 transition-all dark:bg-cyan-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : currentUrl ? (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              {getFileIcon()}
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Upload Successful</p>
              <p className="max-w-[200px] truncate text-xs text-zinc-400">{currentUrl}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onUploaded(""); }}
              className="mt-1 text-xs font-medium text-red-500 hover:underline"
            >
              Remove and replace
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center text-zinc-500">
            <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Upload className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs">Drag and drop or click to browse</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
