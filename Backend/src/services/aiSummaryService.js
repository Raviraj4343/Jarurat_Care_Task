import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

let geminiClient = null;

const getGeminiClient = () => {
  if (!env.geminiApiKey) {
    return null;
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  return geminiClient;
};

const summarySchema = {
  type: "object",
  propertyOrdering: ["issueSummary", "category", "suggestion"],
  additionalProperties: false,
  properties: {
    issueSummary: {
      type: "string",
      description: "A concise summary of the issue stated in the provided request."
    },
    category: {
      type: "string",
      enum: ["mild", "urgent", "unknown"],
      description: "Classify as urgent only if the submitted text clearly indicates urgency."
    },
    suggestion: {
      type: "string",
      description: "A basic, neutral suggestion based only on the provided text with no added facts."
    }
  },
  required: ["issueSummary", "category", "suggestion"]
};

const fallbackSummary = (message) => ({
  issueSummary: message.trim().slice(0, 160),
  category: "unknown",
  suggestion: "Share this request with a healthcare coordinator for a manual review."
});

const systemInstruction = `
You summarize healthcare support requests.
Use only the provided input.
Do not add facts, diagnoses, names, urgency reasons, or recommendations that are not directly grounded in the input.
If urgency is unclear, use unknown.
Keep each field concise and neutral.
`;

const fallbackModelOrder = ["gemini-2.5-flash"];

const isModelNotFoundError = (error) =>
  error?.status === 404 || String(error?.message || "").includes("models/");

const normalizeSummary = (summary, message) => {
  if (!summary || typeof summary !== "object") {
    return fallbackSummary(message);
  }

  const allowedCategories = new Set(["mild", "urgent", "unknown"]);
  const issueSummary =
    typeof summary.issueSummary === "string" && summary.issueSummary.trim()
      ? summary.issueSummary.trim()
      : fallbackSummary(message).issueSummary;
  const category = allowedCategories.has(summary.category) ? summary.category : "unknown";
  const suggestion =
    typeof summary.suggestion === "string" && summary.suggestion.trim()
      ? summary.suggestion.trim()
      : fallbackSummary(message).suggestion;

  return { issueSummary, category, suggestion };
};

export const generateSupportSummary = async ({ role, supportType, message }) => {
  const client = getGeminiClient();

  if (!client) {
    return fallbackSummary(message);
  }

  try {
    const modelsToTry = [env.geminiModel, ...fallbackModelOrder].filter(
      (model, index, array) => model && array.indexOf(model) === index
    );

    for (const model of modelsToTry) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: `Role: ${role}\nSupport type: ${supportType}\nMessage: ${message}`,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseJsonSchema: summarySchema,
            temperature: 0.2
          }
        });

        const rawOutput = response?.text;

        if (!rawOutput) {
          throw new Error("Empty AI summary response");
        }

        return normalizeSummary(JSON.parse(rawOutput), message);
      } catch (error) {
        if (!isModelNotFoundError(error) || model === modelsToTry[modelsToTry.length - 1]) {
          throw error;
        }
      }
    }
  } catch (error) {
    if (env.nodeEnv !== "production") {
      console.error("AI summary generation failed:", error);
    }

    return fallbackSummary(message);
  }
};
