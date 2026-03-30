import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createContactInquiry,
  deleteContactInquiry,
  deleteMessage,
  getAllMessages,
  getContactInquiries,
  getConversation,
  getUserConversations,
  sendMessage,
} from "../controllers/message.controller";
import {
  createContactInquirySchema,
  sendMessageSchema,
} from "../validators/interaction.validator";

const router = Router();

router.post("/contact", validate(createContactInquirySchema), createContactInquiry);
router.get("/contact-inquiries", authenticate, authorize("ADMIN"), getContactInquiries);
router.delete("/contact-inquiries/:id", authenticate, authorize("ADMIN"), deleteContactInquiry);
router.get("/all", authenticate, authorize("ADMIN"), getAllMessages);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteMessage);
router.post("/", authenticate, validate(sendMessageSchema), sendMessage);
router.get("/conversation/:withUserId", authenticate, getConversation);
router.get("/conversations", authenticate, getUserConversations);

export default router;
