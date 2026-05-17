"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCreateSkillPostMutation } from "@/redux/api/skillPostApi";
import { useGenerateSyllabusMutation } from "@/redux/api/aiApi";
import { Step1Identity } from "./steps/Step1Identity";
import { Step2Teaser } from "./steps/Step2Teaser";
import { Step3Roadmap } from "./steps/Step3Roadmap";
import { Step4Vault } from "./steps/Step4Vault";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
const moduleSchema = z.object({
  moduleNumber: z.number(),
  title: z.string().min(1, "Title required"),
  description: z.string(),
  topics: z.array(z.string()),
  estimatedTime: z.string()
});

export const formSchema = z.object({
  // Step 1
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(1),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).max(8),
  tokenPrice: z.number().min(1, "Price must be at least 1"),
  thumbnail: z.string().min(1, "Thumbnail image is required"),
  images: z.array(z.string()),
  // Step 2
  shortDescription: z.string().min(20, "Short description must be at least 20 characters").max(200),
  valueProp: z.string(),
  teaserAsset: z.string().min(1, "A teaser asset is mandatory"),
  // Step 3
  roadmapType: z.enum(["HOURLY", "DAILY", "SEVEN_DAY", "THIRTY_DAY"]),
  syllabus: z.array(moduleSchema).min(1, "Generate or add at least one syllabus module"),
  outcomes: z.array(z.string()),
  targetAudience: z.string(),
  prerequisites: z.string(),
  // Step 4
  vaultContentType: z.enum(["TEXT", "VIDEO", "PDF", "CODE"]),
  longDescription: z.string().optional(),
  vaultVideo: z.string().optional(),
  vaultPdf: z.string().optional(),
  vaultCodeLink: z.string().optional(),
  vaultCodeDescription: z.string().optional(),
  resourceLinks: z.array(z.string()),
}).superRefine((data, ctx) => {
  if (data.vaultContentType === "TEXT") {
    if (!data.longDescription || data.longDescription.length < 500) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["longDescription"],
        message: "Your strategy must be at least 500 characters",
      });
    }
  } else if (data.vaultContentType === "VIDEO") {
    if (!data.vaultVideo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vaultVideo"],
        message: "Your video must be uploaded",
      });
    }
  } else if (data.vaultContentType === "PDF") {
    if (!data.vaultPdf) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vaultPdf"],
        message: "Please upload your PDF or Document",
      });
    }
  } else if (data.vaultContentType === "CODE") {
    if (!data.vaultCodeLink || !data.vaultCodeLink.startsWith("http")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vaultCodeLink"],
        message: "Please provide a valid GitHub or Repo link",
      });
    }
    if (!data.vaultCodeDescription || data.vaultCodeDescription.length < 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vaultCodeDescription"],
        message: "Code documentation must be at least 200 characters",
      });
    }
  }
});

export type CreateSkillFormData = z.infer<typeof formSchema>;

const STEPS = [
  { label: "Identity", description: "Title, category & thumbnail", fields: ["title", "category", "tokenPrice", "thumbnail"] },
  { label: "Hook", description: "Teaser & value proposition", fields: ["shortDescription", "teaserAsset"] },
  { label: "Roadmap", description: "Syllabus & AI generation", fields: ["syllabus", "roadmapType"] },
  { label: "Vault", description: "Secret sauce & resources", fields: ["vaultContentType", "longDescription", "vaultVideo", "vaultPdf", "vaultCodeLink", "vaultCodeDescription"] },
] as const;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 280, damping: 28 } },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.18 } }),
};

export function CreateSkillForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [createSkillPost, { isLoading: isSubmitting }] = useCreateSkillPostMutation();
  const [generateSyllabus, { isLoading: isGenerating }] = useGenerateSyllabusMutation();

  const methods = useForm<CreateSkillFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      tags: [],
      tokenPrice: 5,
      thumbnail: "",
      images: [],
      shortDescription: "",
      valueProp: "",
      teaserAsset: "",
      roadmapType: "SEVEN_DAY",
      syllabus: [],
      outcomes: [],
      targetAudience: "",
      prerequisites: "",
      vaultContentType: "TEXT",
      longDescription: "",
      vaultVideo: "",
      vaultPdf: "",
      vaultCodeLink: "",
      vaultCodeDescription: "",
      resourceLinks: [],
    }
  });

  const { trigger, handleSubmit, getValues, setValue, formState: { errors } } = methods;
  
  const goNext = async () => {
    const fields = STEPS[step].fields;
    const isStepValid = await trigger(fields);
    
    if (!isStepValid) return;
    
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleGenerateSyllabus = async () => {
    const currentTitle = getValues("title");

    if (!currentTitle) {
      methods.setError("title", { type: "manual", message: "Enter a title in Step 1 first." });
      setDirection(-1);
      setStep(0);
      return;
    }
    try {
      const data = getValues();
      const result = await generateSyllabus({
        title: data.title,
        roadmapType: data.roadmapType,
        category: data.category,
        shortDescription: data.shortDescription,
      }).unwrap();
      
      setValue("syllabus", result.syllabus, { shouldValidate: true });
      setValue("outcomes", result.outcomes || []);
      setValue("targetAudience", result.targetAudience || "");
      setValue("valueProp", data.valueProp || result.valueProp || "");
    } catch {
      methods.setError("syllabus", { type: "manual", message: "AI generation failed. Please try again." });
    }
  };

  const onSubmit = async (data: CreateSkillFormData) => {
    setGlobalError(null);
    try {
      const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const result = await createSkillPost({
        ...data,
        slug,
        lockedContent: {
          vaultContentType: data.vaultContentType,
          longDescription: data.longDescription || "",
          vaultVideo: data.vaultVideo || "",
          vaultPdf: data.vaultPdf || "",
          vaultCodeLink: data.vaultCodeLink || "",
          vaultCodeDescription: data.vaultCodeDescription || "",
          resourceLinks: data.resourceLinks || []
        },
      }).unwrap();
      router.push("/dashboard/my-skills");
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Failed to publish skill. Please try again.";
      setGlobalError(msg);
    }
  };

  const isLastStep = step === STEPS.length - 1;
  const currentErrors = Object.values(errors).filter(e => e?.message);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Step Indicator */}
      <div className="relative">
        <div className="absolute inset-x-0 top-5 h-0.5 bg-zinc-200 dark:bg-zinc-800" />
        <ol className="relative flex justify-between">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={async () => { 
                  if (i < step) { 
                    setDirection(-1); 
                    setStep(i); 
                  }
                }}
                className={cn(
                  "relative z-10 flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                  i < step
                    ? "border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-zinc-950 cursor-pointer"
                    : i === step
                      ? "border-blue-600 bg-white text-blue-600 shadow-lg shadow-blue-600/20 dark:border-cyan-400 dark:bg-zinc-950 dark:text-cyan-400"
                      : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900",
                )}
              >
                {i < step ? <Check className="size-4" /> : <span>{i + 1}</span>}
              </button>
              <div className="hidden text-center sm:block">
                <p className={cn("text-xs font-semibold", i === step ? "text-blue-600 dark:text-cyan-400" : "text-zinc-500")}>
                  {s.label}
                </p>
                <p className="text-[11px] text-zinc-400">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Step Panel */}
      <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
        <div className="border-b border-zinc-100 px-8 py-5 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-cyan-400">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {STEPS[step].label} — <span className="font-normal text-zinc-500">{STEPS[step].description}</span>
          </h2>
        </div>

        <div className="relative min-h-115 overflow-hidden px-8 py-6">
          <FormProvider {...methods}>
            <form id="create-skill-form" onSubmit={handleSubmit(onSubmit)} className="w-full">
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  {step === 0 && <Step1Identity />}
                  {step === 1 && <Step2Teaser />}
                  {step === 2 && (
                    <Step3Roadmap
                      onGenerate={handleGenerateSyllabus}
                      isGenerating={isGenerating}
                    />
                  )}
                  {step === 3 && <Step4Vault />}
                </motion.div>
              </AnimatePresence>
            </form>
          </FormProvider>
        </div>

        {/* Errors */}
        {(currentErrors.length > 0 || globalError) && (
          <div className="mx-8 mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div className="flex flex-col">
              {globalError && <span>{globalError}</span>}
              {currentErrors.map((err, i) => (
                <span key={i}>{String(err?.message)}</span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-8 py-5 dark:border-zinc-800">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
          >
            <ChevronLeft className="size-4" /> Back
          </button>

          {isLastStep ? (
            <button
              type="submit"
              form="create-skill-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60 dark:shadow-cyan-500/20"
            >
              {isSubmitting ? (
                <><Loader2 className="size-4 animate-spin" /> Publishing…</>
              ) : (
                <><Sparkles className="size-4" /> Publish Skill</>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
            >
              Continue <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
