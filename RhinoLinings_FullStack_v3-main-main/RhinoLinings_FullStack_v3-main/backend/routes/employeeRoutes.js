// routes/employeeRoutes.js
import express from "express";
import {
    createEmployee,
    listEmployees,
    updateEmployee,
    deleteEmployee,
    listEmployeeRequests,
    getRequestForEmployee,
    acceptRequest,
    updateRequestStatus,
    getEmployeeStats
} from "../controllers/employeeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes for employee management
router.post("/", verifyToken, createEmployee);                         // Admin: Create employee
router.get("/", verifyToken, listEmployees);                           // Admin: List all employees
router.put("/:id", verifyToken, updateEmployee);                       // Admin: Update employee
router.delete("/:id", verifyToken, deleteEmployee);                    // Admin: Delete employee

// Employee-only routes
router.get("/my/requests", verifyToken, listEmployeeRequests);         // Get all assigned bookings
router.get("/my/stats", verifyToken, getEmployeeStats);                // Get dashboard stats
router.get("/requests/:id", verifyToken, getRequestForEmployee);       // View a specific booking
router.put("/requests/:id/accept", verifyToken, acceptRequest);        // Accept a booking
router.put("/requests/:id/status", verifyToken, updateRequestStatus);  // Update booking status & cost

export default router;