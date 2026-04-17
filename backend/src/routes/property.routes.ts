import { Router } from "express";
import {
  createProperty,
  createPurchaseRequest,
  createReview,
  createTourRequest,
  getProperties,
  getPurchaseRequests,
  getPropertyById,
  getTourRequests,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createPropertySchema } from "../validators/property.validator";
import {
  createPurchaseRequestSchema,
  createReviewSchema,
  createTourRequestSchema,
} from "../validators/interaction.validator";

const router = Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/:id/reviews", authenticate, validate(createReviewSchema), createReview);
router.post("/:id/tours", authenticate, validate(createTourRequestSchema), createTourRequest);
router.get("/:id/tour-requests", authenticate, getTourRequests);
router.post(
  "/:id/purchase-requests",
  authenticate,
  validate(createPurchaseRequestSchema),
  createPurchaseRequest
);
router.get("/:id/purchase-requests", authenticate, getPurchaseRequests);
router.post("/", authenticate, authorize("SELLER"), validate(createPropertySchema), createProperty);
router.put("/:id", authenticate, authorize("SELLER", "ADMIN"), updateProperty);
router.delete("/:id", authenticate, authorize("SELLER", "ADMIN"), deleteProperty);
export default router;
