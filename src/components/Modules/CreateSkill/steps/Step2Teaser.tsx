"use client";

import { Upload, CheckCircle2, AlertTriangle, FileVideo, FileText, FileCode } from "lucide-react";
import { CloudinaryUploader } from "@/components/Shared/CloudinaryUploader";
import { useFormContext } from "react-hook-form";
import type { CreateSkillFormData } from "../CreateSkillForm";

export function Step2Teaser() {
  const { register, watch, setValue } = useFormContext<CreateSkillFormData>();
  
  const shortDescription = watch("shortDescription") || "";
  const teaserAsset = watch("teaserAsset");

  return (
    <div className="space-y-6">
      {/* Short Description */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white" htmlFor="short-desc">
          Short Description * <span className="text-zinc-400 font-normal">(public hook, 20–200 chars)</span>
        </label>
        <textarea
          {...register("shortDescription")}
          id="short-desc"
          rows={3}
          maxLength={200}
          placeholder="What will the buyer learn? What problem does this solve? Make it irresistible."
          className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500 resize-none"
        />
        <p className="mt-1 text-right text-xs text-zinc-400">{shortDescription.length}/200</p>
      </div>

      {/* Value Proposition */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white" htmlFor="value-prop">
          Value Proposition <span className="font-normal text-zinc-400">— Why should they buy this?</span>
        </label>
        <textarea
          {...register("valueProp")}
          id="value-prop"
          rows={3}
          placeholder="e.g. Stop wasting time on scattered tutorials. This is a battle-tested 7-day sprint that gets you production-ready."
          className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500 resize-none"
        />
      </div>

      {/* Teaser Asset — mandatory */}
      <div className="mb-6">
        <label className="mb-1 block font-semibold text-zinc-900 dark:text-white">
          <Upload className="inline size-4 mr-1" /> Teaser Asset <span className="text-red-500">*</span>
        </label>
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          This is the public preview that convinces buyers. One of the following is required:
        </p>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: FileVideo, label: "Demo Video", detail: "Min. 15 seconds" },
            { icon: FileText, label: "Sample PDF", detail: "Min. 2 pages" },
            { icon: FileCode, label: "README / Code", detail: ".md or .txt" },
          ].map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <Icon className="size-4 text-blue-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-zinc-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <CloudinaryUploader
          id="teaser-asset"
          accept="video/*,application/pdf,.md,.txt"
          currentUrl={teaserAsset}
          onUploaded={(url) => setValue("teaserAsset", url, { shouldValidate: true })}
          label="Upload Teaser Asset"
          enforceMinVideoSeconds={15}
        />

        {teaserAsset ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" /> Teaser uploaded successfully.
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-4" /> Upload a teaser to proceed.
          </div>
        )}
      </div>
    </div>
  );
}
