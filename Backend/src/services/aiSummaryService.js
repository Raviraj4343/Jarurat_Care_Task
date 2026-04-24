import OpenAI from "openai";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

let openAiClient = null;

const getOpenAiClient = () => {
  if (!env.openAiApiKey) {
    return null;
  }

  if (!openAiClient) {
    openAiClient = new OpenAI({ apiKey: env.openAiApiKey });
  }

  return openAiClient;
};

const summarySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issueSummary: { type: "string" },
    category: {
      type: "string",
      enum: ["mild", "urgent", "unknown"]
    },
    suggestion: { type: "string" }
  },
  required: ["issueSummary", "category", "suggestion"]
};

const fallbackSummary = (message) => ({
  issueSummary: message.trim().slice(0, 160),
  category: "unknown",
  suggestion: "Share this request with a healthcare coordinator for a manual review."
});

const extractStructuredText = (response) => {
  if (response?.output_text) {
    return response.output_text;
  }

  const firstOutput = response?.output?.[0];
  const firstContent = firstOutput?.content?.find((item) => item.type === "output_text");

  return firstContent?.text || "";
};

export const generateSupportSummary = async ({ role, supportType, message }) => {
  const client = getOpenAiClient();

  if (!client) {
    return fallbackSummary(message);
  }

  try {
    const response = await client.responses.create({
      model: env.openAiModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You summarize healthcare support requests. Return JSON only. Use only the user-provided input. Do not add facts, diagnoses, names, urgency reasons, or recommendations that are not directly grounded in the input. If urgency is unclear, use unknown. Keep each field concise and neutral."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Role: ${role}\nSupport type: ${supportType}\nMessage: ${message}`
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "support_summary",
          strict: true,
          schema: summarySchema
        }
      }
    });

    const rawOutput = extractStructuredText(response);

    if (!rawOutput) {
      throw new Error("Empty AI summary response");
    }

    return JSON.parse(rawOutput);
  } catch (error) {
    if (env.nodeEnv !== "production") {
      console.error("AI summary generation failed:", error);
    }

    return fallbackSummary(message);
  }
};
