import express from "express";
import {
    getQuotation,
    getQuotationById,
    listQuotations,
} from "../controllers/quotationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Generate new quotation
router.post("/", verifyToken, getQuotation);

// 🔹 Get all quotations (user or admin)
router.get("/", verifyToken, listQuotations);

// 🔹 Get a specific quotation
router.get("/:id", verifyToken, getQuotationById);

export default router;