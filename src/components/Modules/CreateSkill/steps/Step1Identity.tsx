"use client";

import { useState } from "react";
import { ImageIcon, Tag, X, DollarSign } from "lucide-react";
import { CloudinaryUploader } from "@/components/Shared/CloudinaryUploader";
import { useFormContext, Controller } from "react-hook-form";
import type { CreateSkillFormData } from "../CreateSkillForm";

const CATEGORIES = [
  "Development", "Design", "Business", "Marketing", "Data",
  "AI", "Finance", "Writing", "Photography", "Music", "Health", "Other",
];

export function Step1Identity() {
  const [tagInput, setTagInput] = useState("");
  const { register, control, watch, setValue } = useFormContext<CreateSkillFormData>();
  
  const tags = watch("tags") || [];
  const thumbnail = watch("thumbnail");
  const slug = watch("slug");
  const category = watch("category");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (tags.length < 8 && !tags.includes(tagInput.trim())) {
        setValue("tags", [...tags, tagInput.trim()], { shouldValidate: true });
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setValue("tags", tags.filter((t) => t !== tag), { shouldValidate: true });
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white" htmlFor="skill-title">Skill Title *</label>
        <input
          {...register("title", {
            onChange: (e) => {
              setValue("slug", generateSlug(e.target.value), { shouldValidate: true });
            }
          })}
          id="skill-title"
          type="text"
          placeholder="e.g. Master TypeScript in 7 Days"
          className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500"
        />
        {slug && (
          <p className="mt-2 text-xs text-zinc-500">Slug: <code className="text-cyan-600 dark:text-cyan-400">/bazaar/{slug}</code></p>
        )}
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white">Category *</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setValue("category", cat, { shouldValidate: true })}
              className={`rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition-all ${
                category === cat
                  ? "border-blue-600 bg-blue-600 text-white dark:border-cyan-500 dark:bg-cyan-500 dark:text-zinc-950"
                  : "border-zinc-300 bg-white text-zinc-600 hover:border-blue-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-cyan-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white" htmlFor="skill-price">Token Price (KT) *</label>
        <div className="relative mt-1">
          <DollarSign className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
          <input
            {...register("tokenPrice", { valueAsNumber: true })}
            id="skill-price"
            type="number"
            min={1}
            max={500}
            className="w-full rounded-xl border border-zinc-300 bg-white p-4 pl-12 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white" htmlFor="skill-tags">
          <Tag className="inline size-4 mr-1" /> Tags <span className="text-zinc-400 font-normal">(up to 8, press Enter)</span>
        </label>
        <div className="mt-1 flex flex-wrap gap-2 rounded-xl border border-zinc-300 bg-white p-4 shadow-sm focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-cyan-500 transition-all">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-cyan-900/30 dark:text-cyan-300">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}><X className="size-3" /></button>
            </span>
          ))}
          <input
            id="skill-tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length < 8 ? "Add tag…" : "Max 8 tags"}
            disabled={tags.length >= 8}
            className="min-w-[120px] flex-1 bg-transparent text-sm placeholder:text-zinc-400 outline-none dark:text-white disabled:opacity-50"
          />
        </div>
      </div>

      {/* Thumbnail */}
      <div className="mb-6">
        <label className="mb-1 block font-semibold text-zinc-900 dark:text-white"><ImageIcon className="inline size-4 mr-1" /> Thumbnail Image *</label>
        <p className="text-xs text-zinc-500 mb-3">This is the main card image buyers see in the marketplace.</p>
        <CloudinaryUploader
          id="thumbnail"
          accept="image/*"
          currentUrl={thumbnail}
          onUploaded={(url) => setValue("thumbnail", url, { shouldValidate: true })}
          label="Upload Thumbnail"
        />
      </div>
    </div>
  );
}
