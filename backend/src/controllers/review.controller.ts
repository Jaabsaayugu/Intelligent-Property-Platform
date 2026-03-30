import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstName: true, secondName: true },
        } as any,
        property: { select: { id: true, title: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch reviews" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete review" });
  }
};
