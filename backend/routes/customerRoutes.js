import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  upsertCustomer,
  updateCustomerStatus,
  getCustomerStats,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all customers (admin only)
router.get("/", getAllCustomers);

// Get customer stats (admin only)
router.get("/stats", getCustomerStats);

// Get customer by ID (admin only)
router.get("/:id", getCustomerById);

// Create or update customer profile
router.post("/", upsertCustomer);

// Update customer status (admin only)
router.patch("/:id/status", updateCustomerStatus);

export default router;
