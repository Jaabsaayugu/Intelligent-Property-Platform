import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// SEND MESSAGE
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "receiverId and content required" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.userId,
        receiverId,
      },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not send message" });
  }
};

// GET CONVERSATION BETWEEN TWO USERS
export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const withUserId = Array.isArray(req.params.withUserId) ? req.params.withUserId[0] : req.params.withUserId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: withUserId },
          { senderId: withUserId, receiverId: req.user.userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch conversation" });
  }
};

// GET ALL USER CONVERSATIONS (last message per conversation)
export const getUserConversations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get all messages involving this user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: req.user.userId }, { receiverId: req.user.userId }],
      },
      orderBy: { createdAt: "desc" },
    });

    // Reduce to one per conversation (other user)
    const convMap: Record<string, any> = {};
    const userId = req.user.userId;
    messages.forEach((msg) => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!convMap[otherUserId]) convMap[otherUserId] = msg;
    });

    res.json(Object.values(convMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch conversations" });
  }
};