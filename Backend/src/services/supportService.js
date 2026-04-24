import { SupportRequest } from "../models/SupportRequest.js";
import { generateSupportSummary } from "./aiSummaryService.js";

export const createSupportRequest = async (payload) => {
  const aiSummary = await generateSupportSummary({
    role: payload.role,
    supportType: payload.supportType,
    message: payload.message
  });

  const supportRequest = await SupportRequest.create({
    ...payload,
    aiSummary
  });

  return supportRequest;
};

export const listSupportRequests = async () =>
  SupportRequest.find().sort({ createdAt: -1 }).lean();
