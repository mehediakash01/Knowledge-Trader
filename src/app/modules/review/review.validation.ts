import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    postId: z.string().uuid("Invalid skill post id"),
    rating: z
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
    comment: z.string().min(3, "Comment must be at least 3 characters"),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
