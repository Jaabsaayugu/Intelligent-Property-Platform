import { randomUUID } from "crypto";
import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const userSelect = {
  id: true,
  email: true,
  role: true,
  firstName: true,
  secondName: true,
} as const;

const messageInclude = {
  sender: { select: userSelect },
  receiver: { select: userSelect },
  property: { select: { id: true, title: true } },
} as const;

const getCurrentUser = (req: AuthRequest) => req.user;

const requireAdmin = (req: AuthRequest, res: Response) => {
  const user = getCurrentUser(req);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  if (user.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden" });
    return null;
  }

  return user;
};

export const createContactInquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, secondName, email, message } = req.body as {
      firstName: string;
      secondName: string;
      email: string;
      message: string;
    };

    await prisma.$executeRawUnsafe(
      `
        INSERT INTO "ContactInquiry" ("id", "firstName", "secondName", "email", "message")
        VALUES ($1, $2, $3, $4, $5)
      `,
      randomUUID(),
      firstName.trim(),
      secondName.trim(),
      email.trim().toLowerCase(),
      message.trim()
    );

    res.status(201).json({ message: "Your inquiry has been sent to the admin team." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not send contact inquiry" });
  }
};

export const getContactInquiries = async (req: AuthRequest, res: Response) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const inquiries = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        firstName: string;
        secondName: string;
        email: string;
        message: string;
        createdAt: string;
      }>
    >(`
      SELECT "id", "firstName", "secondName", "email", "message", "createdAt"
      FROM "ContactInquiry"
      ORDER BY "createdAt" DESC
    `);

    res.json({ data: inquiries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch contact inquiries" });
  }
};

export const deleteContactInquiry = async (req: AuthRequest, res: Response) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    await prisma.$executeRawUnsafe(
      `
        DELETE FROM "ContactInquiry"
        WHERE "id" = $1
      `,
      req.params.id
    );

    res.json({ message: "Contact inquiry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete contact inquiry" });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { receiverId, propertyId, content } = req.body as {
      receiverId: string;
      propertyId?: string;
      content: string;
    };

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ message: "receiverId and content required" });
    }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (receiver.id === currentUser.userId) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    if (propertyId) {
      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: currentUser.userId,
        receiverId,
        propertyId: propertyId || null,
      },
      include: messageInclude as any,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not send message" });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const withUserId = Array.isArray(req.params.withUserId)
      ? req.params.withUserId[0]
      : req.params.withUserId;
    const propertyId = typeof req.query.propertyId === "string" ? req.query.propertyId : undefined;

    const messages = await prisma.message.findMany({
      where: {
        AND: [
          {
            OR: [
              { senderId: currentUser.userId, receiverId: withUserId },
              { senderId: withUserId, receiverId: currentUser.userId },
            ],
          },
          propertyId ? { propertyId } : { propertyId: null },
        ],
      },
      include: messageInclude as any,
      orderBy: { createdAt: "asc" },
    });

    res.json({ data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch conversation" });
  }
};

export const getUserConversations = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUser.userId }, { receiverId: currentUser.userId }],
      },
      include: messageInclude as any,
      orderBy: { createdAt: "desc" },
    });

    const conversationMap: Record<string, (typeof messages)[number]> = {};
    const userId = currentUser.userId;

    messages.forEach((message) => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const key = `${otherUserId}:${message.propertyId ?? "general"}`;

      if (!conversationMap[key]) {
        conversationMap[key] = message;
      }
    });

    res.json({ data: Object.values(conversationMap) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch conversations" });
  }
};

export const getAllMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const messages = await prisma.message.findMany({
      include: messageInclude as any,
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch messages" });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }

    const id = req.params.id as string;
    const message = await prisma.message.findUnique({ where: { id } });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await prisma.message.delete({ where: { id } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete message" });
  }
};
