"use client";

import { useState } from "react";
import { Link2, Plus, X, Eye, FileText, Video, File, Code, ShieldCheck } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { CreateSkillFormData } from "../CreateSkillForm";
import { CloudinaryUploader } from "@/components/Shared/CloudinaryUploader";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  { id: "TEXT", label: "Text", icon: FileText, desc: "Written strategy & guides" },
  { id: "VIDEO", label: "Video", icon: Video, desc: "In-depth tutorials & walkthrus" },
  { id: "PDF", label: "PDF / Doc", icon: File, desc: "Handouts, sheets, or manuals" },
  { id: "CODE", label: "Code", icon: Code, desc: "Repos & script references" },
];

export function Step4Vault() {
  const [linkInput, setLinkInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { register, watch, setValue, formState: { errors } } = useFormContext<CreateSkillFormData>();

  const contentType = watch("vaultContentType") || "TEXT";
  const longDescription = watch("longDescription") || "";
  const vaultVideo = watch("vaultVideo") || "";
  const vaultPdf = watch("vaultPdf") || "";
  const vaultCodeLink = watch("vaultCodeLink") || "";
  const vaultCodeDescription = watch("vaultCodeDescription") || "";
  const resourceLinks = watch("resourceLinks") || [];
  
  const title = watch("title");
  const category = watch("category");
  const tokenPrice = watch("tokenPrice");
  const roadmapType = watch("roadmapType");
  const syllabusLength = watch("syllabus")?.length || 0;
  const teaserAsset = watch("teaserAsset");
  const thumbnail = watch("thumbnail");

  // Dynamic Validation Stats
  let charCount = 0;
  let validationMet = false;
  let vaultScore = 0; // 0 to 100
  let nicheLabel = "";
  
  if (contentType === "TEXT") {
    charCount = longDescription.length;
    validationMet = charCount >= 500;
    vaultScore = Math.min(100, Math.floor((charCount / 500) * 100));
    nicheLabel = "Written Strategy";
  } else if (contentType === "VIDEO") {
    validationMet = !!vaultVideo;
    vaultScore = validationMet ? 100 : 0;
    nicheLabel = "Video Masterclass";
  } else if (contentType === "PDF") {
    validationMet = !!vaultPdf;
    vaultScore = validationMet ? 100 : 0;
    nicheLabel = "Document Vault";
  } else if (contentType === "CODE") {
    charCount = vaultCodeDescription.length;
    validationMet = !!vaultCodeLink && vaultCodeLink.startsWith("http") && charCount >= 200;
    const linkScore = vaultCodeLink.startsWith("http") ? 50 : 0;
    const descScore = Math.min(50, Math.floor((charCount / 200) * 50));
    vaultScore = linkScore + descScore;
    nicheLabel = "Technical Repo";
  }
  
  if (resourceLinks.length > 0) {
    vaultScore = Math.min(100, vaultScore + (resourceLinks.length * 10));
  }

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed && !resourceLinks.includes(trimmed)) {
      try {
        new URL(trimmed);
        setValue("resourceLinks", [...resourceLinks, trimmed], { shouldValidate: true });
        setLinkInput("");
      } catch {
        // ignore invalid URLs
      }
    }
  };

  const removeLink = (url: string) => {
    setValue("resourceLinks", resourceLinks.filter((l) => l !== url), { shouldValidate: true });
  };

  const getMeterColor = () => {
    if (vaultScore < 40) return "bg-red-500 shadow-red-500/50";
    if (vaultScore < 80) return "bg-amber-500 shadow-amber-500/50";
    if (vaultScore < 100) return "bg-blue-500 shadow-blue-500/50";
    return "bg-emerald-500 shadow-emerald-500/50";
  };

  const getMeterLabel = () => {
    if (vaultScore < 40) return "Low Value";
    if (vaultScore < 80) return "Good Baseline";
    if (vaultScore < 100) return "High Value";
    return "Elite Quality 🏆";
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/70 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-blue-600 dark:text-cyan-400" />
          <p className="font-bold text-zinc-900 dark:text-white">Strategy Vault</p>
        </div>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          This is the core content buyers pay for. Choose your primary format below to build your vault.
        </p>
      </div>

      {/* Content Type Selector Tracker */}
      <div>
        <label className="mb-3 block text-sm font-bold text-zinc-900 dark:text-white">Primary Content Format</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CONTENT_TYPES.map((type) => {
            const isSelected = contentType === type.id;
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setValue("vaultContentType", type.id as any, { shouldValidate: true })}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 p-4 text-center rounded-2xl border-2 transition-all duration-200 outline-none",
                  isSelected 
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.15)] dark:border-cyan-500 dark:bg-cyan-950/20 dark:text-cyan-400" 
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <Icon className={cn("size-6", isSelected && "animate-pulse")} />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">{type.label}</p>
                  <p className="text-[10px] opacity-80">{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Inputs Based on Selection */}
      <div className="rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        
        {contentType === "TEXT" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-zinc-900 dark:text-white">Written Strategy Content</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview((p) => !p)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400"
                >
                  <Eye className="size-3" /> {showPreview ? "Edit" : "Preview"}
                </button>
                <div className="text-right">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    charCount >= 500 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {charCount.toLocaleString()} / 500+ chars
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Share your methodologies, mental models, and step-by-step written tutorials.</p>
            
            {showPreview ? (
              <div className="min-h-[280px] rounded-xl border border-zinc-300 bg-zinc-50 p-5 text-sm leading-7 text-zinc-700 whitespace-pre-wrap dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 shadow-sm">
                {longDescription || <span className="text-zinc-400 italic">Nothing yet…</span>}
              </div>
            ) : (
              <textarea
                {...register("longDescription")}
                rows={12}
                placeholder="Module 1: The Foundation...&#10;Module 2: The Action Plan...&#10;Pro Tips and Checklists..."
                className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500 resize-none font-mono text-sm leading-relaxed"
              />
            )}
            
            {errors.longDescription && (
              <p className="text-sm text-red-500 font-medium">{(errors.longDescription.message as string) || "Text strategy must be at least 500 characters."}</p>
            )}
          </div>
        )}

        {contentType === "VIDEO" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <label className="block font-semibold text-zinc-900 dark:text-white">Video Masterclass</label>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Upload your core training video (1+ minute recommended).</p>
            <CloudinaryUploader
              id="vaultVideoUploader"
              label="Upload Video"
              accept="video/*"
              currentUrl={vaultVideo}
              onUploaded={(url) => setValue("vaultVideo", url, { shouldValidate: true })}
            />
            {errors.vaultVideo && (
              <p className="text-sm font-medium text-red-500">{errors.vaultVideo.message as string}</p>
            )}
            <div className="flex items-center text-xs font-medium">
              <span className={validationMet ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}>
                Status: {validationMet ? "Video Uploaded ✓" : "Awaiting Upload"}
              </span>
            </div>
          </div>
        )}

        {contentType === "PDF" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <label className="block font-semibold text-zinc-900 dark:text-white">PDF / Document Assets</label>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Upload handbooks, cheat sheets, or manuals.</p>
            <CloudinaryUploader
              id="vaultPdfUploader"
              label="Upload PDF"
              accept=".pdf,application/pdf"
              currentUrl={vaultPdf}
              onUploaded={(url) => setValue("vaultPdf", url, { shouldValidate: true })}
            />
            {errors.vaultPdf && (
              <p className="text-sm font-medium text-red-500">{errors.vaultPdf.message as string}</p>
            )}
            <div className="flex items-center text-xs font-medium">
              <span className={validationMet ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}>
                Status: {validationMet ? "Document Uploaded ✓" : "Awaiting Upload"}
              </span>
            </div>
          </div>
        )}

        {contentType === "CODE" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <label className="mb-2 block font-semibold text-zinc-900 dark:text-white">Repository Link</label>
              <input
                {...register("vaultCodeLink")}
                type="url"
                placeholder="https://github.com/username/repo"
                className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500"
              />
              {errors.vaultCodeLink && (
                <p className="mt-1 text-sm font-medium text-red-500">{errors.vaultCodeLink.message as string}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-semibold text-zinc-900 dark:text-white">Code Documentation</label>
              <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">Minimum 200 characters explaining the setup and structure.</p>
              <textarea
                {...register("vaultCodeDescription")}
                rows={6}
                placeholder="This repo uses Next.js and Prisma. To run it, you first need to..."
                className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500 resize-none font-mono text-sm leading-relaxed"
              />
              {errors.vaultCodeDescription && (
                <p className="mt-1 text-sm font-medium text-red-500">{errors.vaultCodeDescription.message as string}</p>
              )}
              <div className="mt-2 flex items-center justify-between text-xs font-medium">
                <span className={charCount >= 200 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}>
                  {charCount} / 200 chars {charCount >= 200 ? "✓" : ""}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Value Meter */}
      <div>
        <div className="mb-2 flex items-end justify-between">
          <label className="text-sm font-bold text-zinc-900 dark:text-white">Vault Value Meter</label>
          <span className="text-xs font-bold text-zinc-500">{getMeterLabel()}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={cn("h-full transition-all duration-700 ease-out", getMeterColor())}
            style={{ width: `${vaultScore}%` }}
          />
        </div>
      </div>

      {/* Additional Resource Links */}
      <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-1">
          <Link2 className="inline size-4 mr-1 text-blue-500" /> Additional Resources <span className="font-normal text-zinc-500">(Optional)</span>
        </label>
        <p className="mb-4 text-xs text-zinc-500">Add supplementary links (Notion templates, Figma files, etc.)</p>

        <div className="flex gap-2">
          <input
            type="url"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
            placeholder="https://..."
            className="flex-1 rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={addLink}
            className="flex items-center gap-1 rounded-xl bg-zinc-900 px-5 font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="size-5" />
          </button>
        </div>

        {resourceLinks.length > 0 && (
          <ul className="mt-4 space-y-2">
            {resourceLinks.map((link) => (
              <li key={link} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <Link2 className="size-4 shrink-0 text-blue-500" />
                <a href={link} target="_blank" rel="noreferrer" className="flex-1 truncate text-sm font-medium text-zinc-700 hover:text-blue-600 hover:underline dark:text-zinc-300 dark:hover:text-cyan-400">
                  {link}
                </a>
                <button type="button" onClick={() => removeLink(link)}>
                  <X className="size-4 text-zinc-400 hover:text-red-500 transition-colors" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Final Review Summary Polish */}
      <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50/50 p-6 dark:border-cyan-900/30 dark:bg-cyan-950/20 space-y-4">
        <p className="font-bold text-blue-900 dark:text-cyan-300">📋 Final Review & Niche Status</p>
        
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Title", value: title },
            { label: "Category", value: category },
            { label: "Price", value: `${tokenPrice} KT` },
            { label: "Roadmap", value: roadmapType?.replace("_", " ") },
            { label: "Content Niche", value: nicheLabel },
            { label: "Vault Validation", value: validationMet ? "Passed ✓" : "Pending ✗", isSuccess: validationMet },
          ].map(({ label, value, isSuccess }) => (
            <div key={label} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm shadow-sm dark:bg-zinc-900/50">
              <span className="text-zinc-500 font-medium">{label}</span>
              <span className={cn(
                "font-bold",
                isSuccess === true ? "text-emerald-600" : isSuccess === false ? "text-red-500" : "text-zinc-900 dark:text-white"
              )}>
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
