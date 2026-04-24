import { ApiError } from "../utils/ApiError.js";
import { createApiResponse } from "../utils/apiResponse.js";

export const errorHandler = (error, req, res, next) => {
  void req;
  void next;

  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((entry) => entry.message);

    return res.status(400).json(
      createApiResponse({
        success: false,
        message: "Validation failed",
        error: {
          code: "VALIDATION_ERROR",
          details
        }
      })
    );
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const details = error instanceof ApiError ? error.details : null;

  return res.status(statusCode).json(
    createApiResponse({
      success: false,
      message: error.message || "Internal server error",
      error: {
        code: error.code || "SERVER_ERROR",
        details
      }
    })
  );
};
