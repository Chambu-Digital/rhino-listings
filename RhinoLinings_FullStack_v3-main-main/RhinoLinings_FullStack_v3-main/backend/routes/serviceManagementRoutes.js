// routes/serviceManagementRoutes.js
import express from "express";
import {
  createService,
  getServices,
  getServicesByCategory,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus,
} from "../controllers/serviceManagementController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getServices); // Get all services
router.get("/category/:category", getServicesByCategory); // Get by category
router.get("/:id", getServiceById); // Get single service

// Admin-only routes
router.post("/", protect, adminOnly, createService); // Create service
router.put("/:id", protect, adminOnly, updateService); // Update service
router.delete("/:id", protect, adminOnly, deleteService); // Delete service
router.patch("/:id/toggle", protect, adminOnly, toggleServiceStatus); // Toggle active status

export default router;
