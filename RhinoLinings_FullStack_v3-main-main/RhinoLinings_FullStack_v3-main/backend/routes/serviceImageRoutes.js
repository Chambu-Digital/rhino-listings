// routes/serviceImageRoutes.js
import express from "express";
import { uploadServiceImage, handleServiceImageUpload, deleteServiceImage } from "../controllers/serviceImageController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Upload service image (admin only)
router.post("/upload", protect, adminOnly, uploadServiceImage.single("image"), handleServiceImageUpload);

// Delete service image (admin only)
router.delete("/:filename", protect, adminOnly, deleteServiceImage);

export default router;
