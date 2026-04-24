import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (validator) => (req, res, next) => {
  void res;

  const errors = validator(req.body);

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  return next();
};
