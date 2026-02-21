// routes/transactionRoutes.js
import express from "express";
import {
  generateTransactionReceipt,
  listTransactions,
  markPaid,
} from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Admin: list all transactions
router.get("/", verifyToken, listTransactions);

// 🔹 Admin: mark a transaction as paid
router.patch("/:txId/paid", verifyToken, markPaid);

// 🔹 Generate plain text receipt (user/admin)
router.get("/receipt/:id", verifyToken, generateTransactionReceipt);

export default router;