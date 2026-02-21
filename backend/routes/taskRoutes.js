// routes/taskRoutes.js
import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getTaskStats,
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/", verifyToken, createTask);                    // Admin: Create task
router.get("/", verifyToken, getTasks);                       // Admin/Employee: Get tasks
router.get("/stats", verifyToken, getTaskStats);              // Admin/Employee: Get stats
router.get("/:id", verifyToken, getTaskById);                 // Admin/Employee: Get single task
router.patch("/:id/status", verifyToken, updateTaskStatus);   // Admin/Employee: Update status
router.put("/:id", verifyToken, updateTask);                  // Admin: Update task
router.delete("/:id", verifyToken, deleteTask);               // Admin: Delete task

export default router;
