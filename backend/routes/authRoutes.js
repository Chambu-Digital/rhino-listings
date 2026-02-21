// routes/authRoutes.js
import express from 'express';
import { loginUser, registerUser, createFirstAdmin, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create-first-admin', createFirstAdmin); // Special route for first admin
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
