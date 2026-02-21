import express from "express";
import { generateDocument } from "../controllers/documentController.js";
import { generateReceiptPDF } from "../controllers/mpesaController.js"; // ✅ import from mpesa
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate PDF/printable artifacts: receipt | invoice | quotation
router.post("/generate", verifyToken, generateDocument);

// Generate standalone M-PESA receipt PDF (handled in mpesaController)
router.get("/receipt/:txId", verifyToken, generateReceiptPDF);

export default router;