import { z } from "zod";

const jsonSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(z.string(), jsonSchema),
  ]),
);

const createSkillPostValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    category: z.string().min(1, "Category is required"),
    tags: z.array(z.string().min(1)).default([]),
    shortDescription: z.string().min(1, "Short description is required"),
    longDescription: z.string().min(1, "Long description is required"),
    previewContent: jsonSchema,
    lockedContent: jsonSchema,
    tokenPrice: z
      .number()
      .int("Token price must be an integer")
      .positive("Token price must be a positive integer"),
    images: z.array(z.string().url()).default([]),
  }),
});

const updateSkillPostValidationSchema = z.object({
  body: createSkillPostValidationSchema.shape.body.partial(),
});

export const SkillPostValidation = {
  createSkillPostValidationSchema,
  updateSkillPostValidationSchema,
};
