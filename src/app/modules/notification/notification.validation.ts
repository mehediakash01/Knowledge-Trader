import { z } from "zod";

const createNotificationValidationSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Invalid user id"),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
  }),
});

const markAsReadValidationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid notification id"),
  }),
});

export const NotificationValidation = {
  createNotificationValidationSchema,
  markAsReadValidationSchema,
};
