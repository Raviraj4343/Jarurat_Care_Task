import dotenv from "dotenv";

dotenv.config();

const requiredValues = ["MONGODB_URI"];

requiredValues.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Missing environment variable: ${key}`);
  }
});

const getClientUrls = () => {
  const sources = [process.env.CLIENT_URL, process.env.CLIENT_URLS].filter(Boolean);

  if (!sources.length) {
    return ["http://127.0.0.1:5173"];
  }

  const urls = sources
    .flatMap((value) => value.split(","))
    .map((value) => value.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  return [...new Set(urls)];
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI || "",
  clientUrl: process.env.CLIENT_URL || "http://127.0.0.1:5173",
  clientUrls: getClientUrls(),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash"
};
