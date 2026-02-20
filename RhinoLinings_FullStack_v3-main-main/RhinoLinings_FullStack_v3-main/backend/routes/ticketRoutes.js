// routes/ticketRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Ticket from "../models/ticket.js";

const router = express.Router();

// Admin: list all tickets
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  const tickets = await Ticket.find().populate("assignedTo");
  res.json(tickets);
});

// Specific ticket view — requires auth
router.get("/track/:id", verifyToken, async (req, res) => {
  const t = await Ticket.findById(req.params.id).populate("assignedTo");
  if (!t) return res.status(404).json({ message: "Not found" });

  // Admin can view any ticket
  if (req.user.role === "admin") return res.json(t);

  // Employee: must be assigned to the ticket
  if (req.user.role === "employee" && String(t.assignedTo) === String(req.user.employeeId)) {
    return res.json(t);
  }

  // User: can view only their own tickets
  if (req.user.role === "user" && String(t.customerId) === String(req.user.id)) {
    return res.json(t);
  }

  return res.status(403).json({ message: "Forbidden" });
});

// ✅ Export the router as default
export default router;