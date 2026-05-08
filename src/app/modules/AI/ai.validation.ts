import { z } from "zod";

const skillMatchValidationSchema = z.object({
  body: z.object({
    interests: z.array(z.string().min(1)).optional(),
  }),
});

const generateContentValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
  }),
});

const consultantValidationSchema = z.object({
  body: z.object({
    goal: z.string().optional(),
    trends: z.array(z.string().min(1)).optional(),
  }),
});

export const AIValidation = {
  skillMatchValidationSchema,
  generateContentValidationSchema,
  consultantValidationSchema,
};
