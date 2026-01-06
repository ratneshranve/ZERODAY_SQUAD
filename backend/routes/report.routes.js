import express from "express";
import { submitReport } from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", protect, submitReport);

export default router;
