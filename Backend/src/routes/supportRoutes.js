import { Router } from "express";
import { getSupportRequests, submitSupportRequest } from "../controllers/supportController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateSupportSubmission } from "../validators/supportValidator.js";

const router = Router();

router.get("/", getSupportRequests);
router.post("/", validateRequest(validateSupportSubmission), submitSupportRequest);

export default router;
