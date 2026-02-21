import express from "express";
import {
    generateReceiptPDF, getPaymentStatus,
    initiateSTK,
    mpesaCallback,
    pay
} from "../controllers/mpesaController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/initiate", verifyToken, initiateSTK);
router.post("/pay", verifyToken, pay);
router.get("/status/:ticketId", verifyToken, getPaymentStatus);
router.post("/callback", express.json({ type: "*/*" }), mpesaCallback);
router.get("/receipt/:txId", verifyToken, generateReceiptPDF);

export default router;