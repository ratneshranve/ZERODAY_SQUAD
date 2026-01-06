import express from "express";
import { getDashboard } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();
router.get("/dashboard", protect, adminOnly, getDashboard);
// router.get("/map", protect, adminOnly, getMapData);

export default router;
