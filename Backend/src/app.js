import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import healthRoutes from "./routes/healthRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/support-requests", supportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
