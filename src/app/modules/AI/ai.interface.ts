import { z } from "zod";

export type TAIProviderName = "gemini" | "groq" | "openrouter" | "mock";

export type TAIGatewayResponse<T> = {
  success: true;
  provider: TAIProviderName;
  data: T;
};

export type TAIStructuredSchema<T> = z.ZodType<T>;

export type TSkillMatchRequest = {
  interests?: string[];
};

export type TCourseArchitectRequest = {
  title: string;
};

export type TConsultantRequest = {
  goal?: string;
  trends?: string[];
};
