// routes/adminRoutes.js
import express from "express";
import {
    assignRequestToEmployee,
    getRequestById,
    listAllRequests,
    listEmployeeLogins,
    listEmployees,
    markRequestPaid,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require verifyToken + role === 'admin' within controllers or middleware
router.get("/requests", verifyToken, listAllRequests); // list all requests (booked + custom)
router.get("/requests/:id", verifyToken, getRequestById);
router.put("/requests/:id/assign", verifyToken, assignRequestToEmployee); // { employeeId }
router.put("/requests/:id/mark-paid", verifyToken, markRequestPaid);

router.get("/employees", verifyToken, listEmployees); // convenience: admin can fetch employees list
router.get("/employee-logins", verifyToken, listEmployeeLogins); // recent login activity

export default router;