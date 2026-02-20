// routes/messageRoutes.js
import express from "express";
import {
    createMessage,
    listChatThreads,
    listMessages,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/", verifyToken, listMessages);
router.get("/threads", verifyToken, listChatThreads); // keep for admin use

export default router;