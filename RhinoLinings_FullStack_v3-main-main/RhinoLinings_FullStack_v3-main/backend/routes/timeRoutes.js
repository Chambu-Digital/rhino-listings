import express from "express";
import {
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getMyTimeEntries,
  getEmployeeTimeEntries,
  getCurrentStatus,
} from "../controllers/timeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Employee routes
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/break/start", startBreak);
router.post("/break/end", endBreak);
router.get("/my-entries", getMyTimeEntries);
router.get("/status", getCurrentStatus);

// Admin routes
router.get("/employee-entries", getEmployeeTimeEntries);

export default router;
