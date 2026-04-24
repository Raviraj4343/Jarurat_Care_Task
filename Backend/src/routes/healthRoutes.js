import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  void req;
  res.status(200).json({
    success: true,
    message: "Backend is healthy"
  });
});

export default router;
