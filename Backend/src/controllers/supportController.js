import { asyncHandler } from "../utils/asyncHandler.js";
import { createApiResponse } from "../utils/apiResponse.js";
import { createSupportRequest, listSupportRequests } from "../services/supportService.js";

export const submitSupportRequest = asyncHandler(async (req, res) => {
  const supportRequest = await createSupportRequest(req.body);

  res.status(201).json(
    createApiResponse({
      success: true,
      message: "Support request submitted successfully",
      data: supportRequest
    })
  );
});

export const getSupportRequests = asyncHandler(async (req, res) => {
  const requests = await listSupportRequests();

  res.status(200).json(
    createApiResponse({
      success: true,
      message: "Support requests fetched successfully",
      data: requests
    })
  );
});
