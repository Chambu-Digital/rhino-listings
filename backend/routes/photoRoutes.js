import express from "express";
import {
  uploadPhoto,
  getPhotosByBooking,
  deletePhoto,
  upload,
} from "../controllers/photoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Upload photo (with multer middleware)
router.post("/upload", upload.single("photo"), uploadPhoto);

// Get photos by booking
router.get("/booking/:bookingId", getPhotosByBooking);

// Delete photo
router.delete("/:id", deletePhoto);

export default router;
