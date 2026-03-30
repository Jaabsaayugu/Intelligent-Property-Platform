import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { deleteReview, getAllReviews } from "../controllers/review.controller";

const router = Router();

router.get("/", authenticate, authorize("ADMIN"), getAllReviews);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteReview);

export default router;
