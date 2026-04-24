import mongoose from "mongoose";

const aiSummarySchema = new mongoose.Schema(
  {
    issueSummary: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["mild", "urgent", "unknown"]
    },
    suggestion: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const supportRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ["patient", "volunteer"]
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    supportType: {
      type: String,
      required: true,
      enum: ["medical", "mental-health", "transport", "medicine", "food", "other"]
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    consent: {
      type: Boolean,
      required: true,
      default: false
    },
    aiSummary: {
      type: aiSummarySchema,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const SupportRequest = mongoose.model("SupportRequest", supportRequestSchema);
