import { z } from "zod";

const executeTokenTradeValidationSchema = z.object({
  body: z.object({
    postId: z.string().uuid("Invalid skill post id"),
  }),
});

export const TradeValidation = {
  executeTokenTradeValidationSchema,
};
