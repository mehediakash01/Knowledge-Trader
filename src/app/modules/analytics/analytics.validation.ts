import { z } from "zod";

const tradeAnalyticsValidationSchema = z.object({
  query: z.object({
    groupBy: z.enum(["date", "category"]).optional(),
  }),
});

export const AnalyticsValidation = {
  tradeAnalyticsValidationSchema,
};
