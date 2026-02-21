import express from 'express';
import { sendContactEmail, testEmailConfig } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - Send contact form
router.post('/', sendContactEmail);

// Admin only - Test email configuration
router.get('/test', protect, adminOnly, testEmailConfig);

export default router;
