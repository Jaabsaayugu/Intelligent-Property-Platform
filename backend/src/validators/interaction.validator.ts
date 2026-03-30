import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

export const createTourRequestSchema = z.object({
  preferredDate: z.string().datetime(),
  notes: z.string().max(1000).optional(),
});

export const createPurchaseRequestSchema = z.object({
  offerAmount: z.number().positive().optional(),
  message: z.string().min(10).max(1000).optional(),
}).refine(
  (value) => value.offerAmount !== undefined || Boolean(value.message?.trim()),
  {
    message: "Provide an offer amount or a purchase message",
  }
);

export const sendMessageSchema = z.object({
  receiverId: z.string().min(1),
  propertyId: z.string().min(1).optional(),
  content: z.string().min(1).max(2000),
});
