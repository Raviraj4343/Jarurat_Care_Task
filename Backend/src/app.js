import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import healthRoutes from "./routes/healthRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");

const isAllowedOrigin = (requestOrigin) => {
  if (!requestOrigin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(requestOrigin);

  if (env.clientUrls.includes(normalizedOrigin)) {
    return true;
  }

  // Allow Vercel preview URLs when the main site is hosted on Vercel.
  return normalizedOrigin.endsWith(".vercel.app");
};

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (isAllowedOrigin(requestOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/support-requests", supportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
