"use client";

import { Sparkles, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { CreateSkillFormData } from "../CreateSkillForm";
import type { RoadmapType } from "@/types";

interface Props {
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
}

const ROADMAP_OPTIONS: { value: RoadmapType; label: string; desc: string; modules: number }[] = [
  { value: "HOURLY", label: "Hourly Sprint", desc: "6 modules — ideal for micro-skills", modules: 6 },
  { value: "DAILY", label: "1-Day Intensive", desc: "4 modules — rapid deep-dive", modules: 4 },
  { value: "SEVEN_DAY", label: "7-Day Roadmap", desc: "7 modules — most popular", modules: 7 },
  { value: "THIRTY_DAY", label: "30-Day Deep-Dive", desc: "12 modules — full transformation", modules: 12 },
];

export function Step3Roadmap({ onGenerate, isGenerating }: Props) {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  
  const { register, watch, setValue, control } = useFormContext<CreateSkillFormData>();
  const roadmapType = watch("roadmapType");
  const outcomes = watch("outcomes") || [];
  const title = watch("title");

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "syllabus"
  });

  const addModule = () => {
    append({
      moduleNumber: fields.length + 1,
      title: "",
      description: "",
      topics: [],
      estimatedTime: "",
    });
    setExpandedModule(fields.length);
  };

  const removeModule = (index: number) => {
    remove(index);
    // Re-number modules
    const currentSyllabus = watch("syllabus") || [];
    currentSyllabus.forEach((_, i) => {
      setValue(`syllabus.${i}.moduleNumber`, i + 1);
    });
    if (expandedModule === index) setExpandedModule(null);
  };

  return (
    <div className="space-y-6">
      {/* Duration selection */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white">Roadmap Duration *</label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {ROADMAP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("roadmapType", opt.value, { shouldValidate: true })}
              className={cn(
                "flex flex-col items-start rounded-xl border p-4 text-left transition-all shadow-sm",
                roadmapType === opt.value
                  ? "border-blue-600 bg-blue-50 dark:border-cyan-500 dark:bg-cyan-900/30 ring-2 ring-blue-500/20"
                  : "border-zinc-300 bg-white hover:border-blue-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900",
              )}
            >
              <span className="font-semibold text-zinc-900 dark:text-white">{opt.label}</span>
              <span className="text-xs text-zinc-500">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Generate */}
      <div className="mb-6 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-sm dark:border-cyan-400/20 dark:from-blue-950/30 dark:to-cyan-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">AI Architect</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Generate a full module-by-module syllabus, learning outcomes, target audience, and value prop instantly.
            </p>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || !title}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-60 dark:bg-cyan-500 dark:text-zinc-950"
          >
            {isGenerating ? (
              <><Loader2 className="size-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="size-4" /> Generate</>
            )}
          </button>
        </div>
        {outcomes.length > 0 && (
          <div className="mt-4 border-t border-blue-200/60 pt-4 dark:border-cyan-400/20">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Learning Outcomes</p>
            <ul className="space-y-1">
              {outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-700 dark:text-cyan-300">{i + 1}</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Module list */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="mb-0 block font-semibold text-zinc-900 dark:text-white">Syllabus Modules ({fields.length})</label>
          <button
            type="button"
            onClick={addModule}
            className="flex items-center gap-1 rounded-xl border border-blue-600 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-cyan-500 dark:bg-cyan-900/30 dark:text-cyan-300"
          >
            <Plus className="size-3" /> Add Module
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((mod, idx) => (
            <div key={mod.id} className="rounded-2xl border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white dark:bg-cyan-500 dark:text-zinc-950">
                    {watch(`syllabus.${idx}.moduleNumber`) || idx + 1}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white line-clamp-1">
                    {watch(`syllabus.${idx}.title`) || `Module ${idx + 1}`}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {watch(`syllabus.${idx}.estimatedTime`) && (
                    <span className="text-xs text-zinc-400">{watch(`syllabus.${idx}.estimatedTime`)}</span>
                  )}
                  {expandedModule === idx ? <ChevronUp className="size-4 text-zinc-400" /> : <ChevronDown className="size-4 text-zinc-400" />}
                </span>
              </button>

              {expandedModule === idx && (
                <div className="border-t border-zinc-200 bg-white px-4 pb-4 pt-4 space-y-4 dark:border-zinc-700 dark:bg-zinc-900">
                  <input
                    {...register(`syllabus.${idx}.title` as const)}
                    type="text"
                    placeholder="Module title"
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500"
                  />
                  <textarea
                    {...register(`syllabus.${idx}.description` as const)}
                    rows={2}
                    placeholder="Module description"
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500 resize-none"
                  />
                  <input
                    {...register(`syllabus.${idx}.estimatedTime` as const)}
                    type="text"
                    placeholder="Estimated time (e.g. Day 1, 2h)"
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500"
                  />
                  <input
                    value={(watch(`syllabus.${idx}.topics`) || []).join(", ")}
                    onChange={(e) => {
                      setValue(`syllabus.${idx}.topics`, e.target.value.split(",").map(t => t.trim()).filter(Boolean), { shouldValidate: true });
                    }}
                    type="text"
                    placeholder="Topics (comma-separated)"
                    className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeModule(idx)}
                    className="flex w-fit items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="size-3" /> Remove module
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white">Target Audience</label>
        <textarea
          {...register("targetAudience")}
          rows={3}
          className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500 resize-none"
        />
      </div>

      {/* Prerequisites */}
      <div className="mb-6">
        <label className="mb-2 block font-semibold text-zinc-900 dark:text-white" htmlFor="prereqs">Prerequisites <span className="text-zinc-400 font-normal">(optional)</span></label>
        <input
          {...register("prerequisites")}
          id="prereqs"
          type="text"
          placeholder="e.g. Basic JavaScript knowledge, no prior experience needed"
          className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-cyan-500"
        />
      </div>
    </div>
  );
}
