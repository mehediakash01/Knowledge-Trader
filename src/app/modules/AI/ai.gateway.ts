import { z } from "zod";
import config from "../../../config";
import {
  TAIGatewayResponse,
  TAIProviderName,
  TAIStructuredSchema,
} from "./ai.interface";

type TProviderConfig = {
  name: Exclude<TAIProviderName, "mock">;
  apiKey?: string;
  call: (prompt: string, signal: AbortSignal) => Promise<string>;
};

export class AIGateway {
  private providers: TProviderConfig[];

  constructor() {
    this.providers = [
      {
        name: "gemini",
        apiKey: config.ai.geminiApiKey,
        call: this.callGemini.bind(this),
      },
      {
        name: "groq",
        apiKey: config.ai.groqApiKey,
        call: this.callGroq.bind(this),
      },
      {
        name: "openrouter",
        apiKey: config.ai.openRouterApiKey,
        call: this.callOpenRouter.bind(this),
      },
    ];
  }

  async generateStructured<T>(
    prompt: string,
    schema: TAIStructuredSchema<T>,
    fallbackData: T,
  ): Promise<TAIGatewayResponse<T>> {
    for (const provider of this.providers) {
      if (!provider.apiKey) {
        continue;
      }

      try {
        const responseText = await this.withTimeout((signal) =>
          provider.call(this.buildJsonPrompt(prompt), signal),
        );
        const parsed = this.safeJsonParse(responseText);
        const data = schema.parse(parsed);

        return {
          success: true,
          provider: provider.name,
          data,
        };
      } catch {
        continue;
      }
    }

    return {
      success: true,
      provider: "mock",
      data: fallbackData,
    };
  }

  private buildJsonPrompt(prompt: string) {
    return [
      prompt,
      "Return only valid JSON. Do not include markdown, prose, or code fences.",
    ].join("\n\n");
  }

  private async withTimeout<T>(
    operation: (signal: AbortSignal) => Promise<T>,
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.ai.timeoutMs);

    try {
      return await operation(controller.signal);
    } finally {
      clearTimeout(timeout);
    }
  }

  private safeJsonParse(response: string) {
    const repaired = response
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      return JSON.parse(repaired);
    } catch {
      const start = repaired.indexOf("{");
      const end = repaired.lastIndexOf("}");

      if (start >= 0 && end > start) {
        return JSON.parse(repaired.slice(start, end + 1));
      }

      throw new Error("AI response was not valid JSON");
    }
  }

  private async callGemini(prompt: string, signal: AbortSignal) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.ai.geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
        signal,
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini failed with ${response.status}`);
    }

    const json = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    return json.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  private async callGroq(prompt: string, signal: AbortSignal) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.ai.groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Groq failed with ${response.status}`);
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    return json.choices?.[0]?.message?.content || "";
  }

  private async callOpenRouter(prompt: string, signal: AbortSignal) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.ai.openRouterApiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`OpenRouter failed with ${response.status}`);
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    return json.choices?.[0]?.message?.content || "";
  }
}

export const aiGateway = new AIGateway();
