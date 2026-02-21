// routes/serviceRoutes.js
import express from "express";
import { pay } from "../controllers/mpesaController.js";
import {
    assignEmployee,
    cancelBooking,
    createServiceBooking,
    getAllBookings,
    getUserBookings,
    markPaid,
    markCompleted,
    updateCost,
    getAdminStats
} from "../controllers/serviceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧑‍💼 Admin endpoints (MUST come before generic routes to avoid conflicts)
router.get("/admin/stats", verifyToken, getAdminStats);
router.get("/all", verifyToken, getAllBookings);
router.post("/assign", verifyToken, assignEmployee);
router.patch("/:id/paid", verifyToken, markPaid);
router.patch("/:id/completed", verifyToken, markCompleted);
router.patch("/:id/cost", verifyToken, updateCost);

// 🧾 Customer service bookings
router.post("/", verifyToken, createServiceBooking);
router.get("/", verifyToken, getUserBookings);
router.put("/:id/cancel", verifyToken, cancelBooking);

// 💳 Payment route
router.post("/:id/pay", verifyToken, pay);
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const ServiceBooking = (await import("../models/serviceBooking.js")).default;
    const booking = await ServiceBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("customerId", "name email")
      .populate("assignedTo", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🧑‍💼 Employee claim task
router.post("/claim", verifyToken, async (req, res) => {
  try {
    const { serviceId } = req.body;
    const ServiceBooking = (await import("../models/serviceBooking.js")).default;
    const booking = await ServiceBooking.findById(serviceId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.assignedTo) return res.status(400).json({ message: "Already assigned" });
    
    booking.assignedTo = req.user._id;
    booking.status = "In Progress";
    await booking.save();
    
    const updated = await ServiceBooking.findById(serviceId)
      .populate("customerId", "name email")
      .populate("assignedTo", "name email");
    
    res.json({ message: "Task claimed successfully", booking: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;