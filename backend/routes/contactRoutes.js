import express from 'express';
import { sendContactEmail, sendToClient, testEmailConfig } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - Send contact form
router.post('/', sendContactEmail);

// Admin - Send email to a client
router.post('/send-to-client', protect, adminOnly, sendToClient);

// Admin only - Test email configuration
router.get('/test', protect, adminOnly, testEmailConfig);

export default router;
