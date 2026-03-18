import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  sendMessage,
  getConversation,
  getUserConversations,
} from "../controllers/message.controller";

const router = Router();

router.post("/", authenticate, sendMessage); // Send message
router.get("/conversation/:withUserId", authenticate, getConversation); // Get conversation with a specific user
router.get("/conversations", authenticate, getUserConversations); // Get all conversations for logged-in user

export default router;