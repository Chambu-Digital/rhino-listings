import express from 'express';
import { getActiveBanner, getAllBanners, upsertBanner, deleteBanner } from '../controllers/bannerController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - get active banner
router.get('/active', getActiveBanner);

// Admin routes
router.get('/', protect, adminOnly, getAllBanners);
router.post('/', protect, adminOnly, upsertBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

export default router;
