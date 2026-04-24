import { createApiResponse } from "../utils/apiResponse.js";

export const notFound = (req, res) => {
  res.status(404).json(
    createApiResponse({
      success: false,
      message: "Route not found",
      error: {
        code: "NOT_FOUND",
        details: [`No route matches ${req.method} ${req.originalUrl}`]
      }
    })
  );
};
