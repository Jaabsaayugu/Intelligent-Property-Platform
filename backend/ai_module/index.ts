import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../src/middleware/auth.middleware";
import { recommendProperties } from "./recommendation";

const router = Router();

export const getRecommendationsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit ?? 6);
    const queryText = typeof req.query.query === "string" ? req.query.query : undefined;
    const excludePropertyId =
      typeof req.query.excludePropertyId === "string" ? req.query.excludePropertyId : undefined;

    const properties = await recommendProperties({
      buyerId: req.user?.userId,
      queryText,
      excludePropertyId,
      limit: Number.isFinite(limit) ? limit : 6,
    });

    res.json({
      data: properties,
      meta: {
        total: properties.length,
        usedBuyerHistory: !queryText,
      },
    });
  } catch (error) {
    console.error("Failed to generate recommendations:", error);
    res.status(500).json({ message: "Could not generate recommendations" });
  }
};

router.get("/", authenticate, getRecommendationsHandler);

export default router;
