"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Sparkles, X, Plus, GripVertical, Building2, Link as LinkIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useUpdateMyProfileMutation } from "@/redux/api/userApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import type { IUser } from "@/types/auth";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Card } from "@/components/UI/card";
import { Textarea } from "@/components/UI/textarea";
import { Badge } from "@/components/UI/badge";
import { uploadToCloudinary } from "@/lib/cloudinary";

const profileSchema = z.object({
  bio: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  socialLinks: z.array(z.object({
    platform: z.string().min(1, "Platform required"),
    url: z.string().url("Must be a valid URL")
  })).optional(),
  experience: z.array(z.object({
    title: z.string().min(1, "Title required"),
    company: z.string().min(1, "Company required"),
    duration: z.string().min(1, "Duration required")
  })).optional(),
  expertise: z.array(z.object({
    name: z.string().min(1, "Skill required"),
    level: z.enum(["Beginner", "Intermediate", "Expert"])
  })).optional(),
  learningPath: z.array(z.object({
    name: z.string().min(1, "Topic required"),
    priority: z.number().min(1)
  })).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const mapUserToProfileForm = (user?: IUser | null): ProfileFormValues => ({
  bio: user?.bio ?? "",
  tagline: user?.tagline ?? "",
  image: user?.image ?? "",
  socialLinks: Array.isArray(user?.socialLinks) ? user?.socialLinks : [],
  experience: Array.isArray(user?.experience) ? user?.experience : [],
  expertise: Array.isArray(user?.expertise) ? user?.expertise : [],
  learningPath: Array.isArray(user?.learningPath) ? user?.learningPath : [],
});

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: liveUser, isFetching: isMeFetching } = useGetMeQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });
  const personaSource = liveUser ?? user;
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  const [uploadingImage, setUploadingImage] = useState(false);

  const formValues = useMemo(() => mapUserToProfileForm(personaSource), [personaSource]);

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: formValues,
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control, name: "socialLinks" });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });
  const { fields: expertiseFields, append: appendExpertise, remove: removeExpertise } = useFieldArray({ control, name: "expertise" });
  const { fields: diffFields, append: appendLearning, remove: removeLearning } = useFieldArray({ control, name: "learningPath" });

  useEffect(() => {
    reset(formValues);
  }, [formValues, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      try {
        const res = await uploadToCloudinary(e.target.files[0]);
        setValue("image", res.secure_url);
        toast.success("Image uploaded!");
      } catch (err) {
        toast.error("Failed to upload image.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const normalizePersonaArray = <T,>(value: T[] | undefined | null): T[] => (Array.isArray(value) ? value : []);

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Submitting Data:", data);

    const normalizedPayload = {
      bio: data.bio?.trim() || "",
      tagline: data.tagline?.trim() || "",
      image: data.image?.trim() ? data.image.trim() : null,
      socialLinks: normalizePersonaArray(data.socialLinks).map((link) => ({
        platform: link.platform?.trim() || "",
        url: link.url?.trim() || "",
      })).filter((link) => link.platform || link.url),
      experience: normalizePersonaArray(data.experience).map((item) => ({
        title: item.title?.trim() || "",
        company: item.company?.trim() || "",
        duration: item.duration?.trim() || "",
      })).filter((item) => item.title || item.company || item.duration),
      expertise: normalizePersonaArray(data.expertise).map((item) => ({
        name: item.name?.trim() || "",
        level: item.level,
      })).filter((item) => item.name),
      learningPath: normalizePersonaArray(data.learningPath).map((item) => ({
        name: item.name?.trim() || "",
        priority: Number(item.priority) || 1,
      })).filter((item) => item.name),
    };

    if ((normalizedPayload.expertise?.length ?? 0) === 0 || (normalizedPayload.learningPath?.length ?? 0) === 0) {
      toast.error("Add at least one expertise and learning path item to achieve Elite status!");
    }

    try {
      const result = await updateProfile(normalizedPayload).unwrap();
      console.log("Profile update response:", result);
      dispatch(setCredentials({ user: { ...(user ?? {}), ...result } as IUser }));
      localStorage.setItem("kt-profile-updated-at", Date.now().toString());
      toast.success("Profile synchronized! Opening Matchmaker...");
      router.push("/dashboard/matchmaker");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "Expert": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "Intermediate": return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
      default: return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Professional Persona</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Build your identity. Help the Reciprocal AI Matchmaker connect you with the right opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* PUBLIC PROFILE */}
        <Card className="rounded-[2rem] border border-zinc-300 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900/60 transition focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600">
          <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">Public Profile</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-zinc-100 flex items-center justify-center relative group cursor-pointer">
                {watch("image") ? (
                  <img src={watch("image") || ""} alt="Avatar" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-zinc-400">No Image</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">{uploadingImage ? "Uploading..." : "Change"}</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tagline</label>
                <Input {...register("tagline")} placeholder="e.g. Senior Frontend Engineer | UI/UX Enthusiast" className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
                  <span className="text-xs text-zinc-500">{watch("bio")?.length || 0}/500</span>
                </div>
                <Textarea 
                  {...register("bio")} 
                  placeholder="Tell us a little bit about yourself..." 
                  maxLength={500}
                  className="min-h-30 border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* EXPERTISE MATRIX */}
        <Card className="rounded-[2rem] border border-zinc-300 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900/60 transition focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Expertise Matrix</h2>
                <p className="text-sm text-zinc-500">What skills can you offer to others?</p>
              </div>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => appendExpertise({ name: "", level: "Beginner" })}
              className="rounded-xl border-zinc-300 bg-white hover:bg-zinc-50"
            >
              <Plus className="mr-2 size-4" /> Add Skill
            </Button>
          </div>

          <div className="space-y-4">
            {expertiseFields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700 relative">
                <div className="flex-1 w-full relative">
                  <Input 
                    {...register(`expertise.${index}.name`)} 
                    placeholder="Skill Name (e.g. React.js)" 
                    className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" 
                  />
                  {errors.expertise?.[index]?.name && <span className="text-xs text-red-500 absolute -bottom-5">{errors.expertise[index]?.name?.message}</span>}
                </div>
                <div className="w-full sm:w-48">
                  <select 
                    {...register(`expertise.${index}.level`)} 
                    className="w-full h-10 px-3 rounded-md border border-zinc-300 bg-white text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div className="hidden sm:block w-24">
                  <Badge variant="outline" className={`w-full justify-center ${getLevelColor(watch(`expertise.${index}.level`) ?? "Beginner")}`}>
                    {watch(`expertise.${index}.level`) ?? "Beginner"}
                  </Badge>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeExpertise(index)}
                  className="text-zinc-400 hover:text-red-500 absolute sm:static top-2 right-2"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            {expertiseFields.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm border-2 border-dashed border-zinc-200 rounded-xl">
                No expertise added yet. Add skills to improve your matchmaking score.
              </div>
            )}
          </div>
        </Card>

        {/* LEARNING ROADMAP */}
        <Card className="rounded-[2rem] border border-zinc-300 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900/60 transition focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <BookOpen className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Learning Roadmap</h2>
                <p className="text-sm text-zinc-500">Topics you want to learn next</p>
              </div>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => appendLearning({ name: "", priority: diffFields.length + 1 })}
              className="rounded-xl border-zinc-300 bg-white hover:bg-zinc-50"
            >
              <Plus className="mr-2 size-4" /> Add Topic
            </Button>
          </div>

          <div className="space-y-4">
            {diffFields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700">
                <GripVertical className="size-4 text-zinc-400 cursor-grab" />
                <div className="flex-1 relative">
                  <Input 
                    {...register(`learningPath.${index}.name`)} 
                    placeholder="Topic Name (e.g. Next.js App Router)" 
                    className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" 
                  />
                  {errors.learningPath?.[index]?.name && <span className="text-xs text-red-500 absolute -bottom-5">{errors.learningPath[index]?.name?.message}</span>}
                </div>
                <div className="w-24">
                  <Input 
                    type="number" 
                    min={1}
                    {...register(`learningPath.${index}.priority`, { valueAsNumber: true })} 
                    placeholder="Priority" 
                    className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" 
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeLearning(index)}
                  className="text-zinc-400 hover:text-red-500"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            {diffFields.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm border-2 border-dashed border-zinc-200 rounded-xl">
                Your learning path is empty. What's next on your journey?
              </div>
            )}
          </div>
        </Card>

        {/* EXPERIENCE */}
        <Card className="rounded-[2rem] border border-zinc-300 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900/60 transition focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <Building2 className="size-5" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Experience</h2>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => appendExp({ title: "", company: "", duration: "" })}
              className="rounded-xl border-zinc-300 bg-white hover:bg-zinc-50"
            >
              <Plus className="mr-2 size-4" /> Add Role
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {expFields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-3 bg-zinc-50 p-5 rounded-xl border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700 relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeExp(index)}
                  className="text-zinc-400 hover:text-red-500 absolute top-2 right-2"
                >
                  <X className="size-4" />
                </Button>
                
                <div className="pr-8 relative">
                  <label className="text-xs font-medium text-zinc-500 mb-1 block">Job Title</label>
                  <Input 
                    {...register(`experience.${index}.title`)} 
                    placeholder="e.g. Frontend Developer" 
                    className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" 
                  />
                  {errors.experience?.[index]?.title && <span className="text-xs text-red-500 absolute -bottom-5">{errors.experience[index]?.title?.message}</span>}
                </div>
                
                <div className="relative">
                  <label className="text-xs font-medium text-zinc-500 mb-1 block">Company</label>
                  <Input 
                    {...register(`experience.${index}.company`)} 
                    placeholder="e.g. Acme Corp" 
                    className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" 
                  />
                  {errors.experience?.[index]?.company && <span className="text-xs text-red-500 absolute -bottom-5">{errors.experience[index]?.company?.message}</span>}
                </div>
                
                <div className="relative">
                  <label className="text-xs font-medium text-zinc-500 mb-1 block">Duration</label>
                  <Input 
                    {...register(`experience.${index}.duration`)} 
                    placeholder="e.g. 2021 - Present" 
                    className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" 
                  />
                  {errors.experience?.[index]?.duration && <span className="text-xs text-red-500 absolute -bottom-5">{errors.experience[index]?.duration?.message}</span>}
                </div>
              </div>
            ))}
          </div>
          {expFields.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-sm border-2 border-dashed border-zinc-200 rounded-xl">
              No experience added.
            </div>
          )}
        </Card>

        {/* SOCIAL LINKS */}
        <Card className="rounded-[2rem] border border-zinc-300 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900/60 transition focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-600">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <LinkIcon className="size-5" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Social Links</h2>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => appendSocial({ platform: "", url: "" })}
              className="rounded-xl border-zinc-300 bg-white hover:bg-zinc-50"
            >
              <Plus className="mr-2 size-4" /> Add Link
            </Button>
          </div>

          <div className="space-y-4">
            {socialFields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700 relative">
                <div className="w-full sm:w-1/3 relative">
                  <Input 
                    {...register(`socialLinks.${index}.platform`)} 
                    placeholder="Platform (e.g. GitHub)" 
                    className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" 
                  />
                  {errors.socialLinks?.[index]?.platform && <span className="text-xs text-red-500 absolute -bottom-5">{errors.socialLinks[index]?.platform?.message}</span>}
                </div>
                <div className="flex-1 relative pr-8 sm:pr-0">
                  <Input 
                    {...register(`socialLinks.${index}.url`)} 
                    placeholder="https://..." 
                    className="border-zinc-300 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition" 
                  />
                  {errors.socialLinks?.[index]?.url && <span className="text-xs text-red-500 absolute -bottom-5">{errors.socialLinks[index]?.url?.message}</span>}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeSocial(index)}
                  className="text-zinc-400 hover:text-red-500 absolute sm:static top-4 right-4 sm:ml-auto"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            {socialFields.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm border-2 border-dashed border-zinc-200 rounded-xl">
                No social links added.
              </div>
            )}
          </div>
        </Card>

        {/* SAVE BUTTON */}
        <div className="flex justify-end sticky bottom-8 pt-4">
          <Button
            type="submit"
            disabled={isLoading || uploadingImage}
            className="rounded-full bg-blue-600 px-10 py-6 text-lg font-bold text-white shadow-xl hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent mr-3" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-5" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
