// routes/index.js
import express from 'express';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import documentsRoutes from './documentsRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import messageRoutes from './messageRoutes.js';
import mpesaRoutes from './mpesaRoutes.js';
import quotationRoutes from './quotationRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import userRoutes from './userRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/messages', messageRoutes);
router.use('/transactions', transactionRoutes);
router.use('/mpesa', mpesaRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/services', serviceRoutes);
router.use('/quotations', quotationRoutes);
router.use('/users', userRoutes);

// new ones
router.use('/admin', adminRoutes);
router.use('/employee', employeeRoutes);
router.use('/documents', documentsRoutes);

export default router;