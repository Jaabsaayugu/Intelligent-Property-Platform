import { Router } from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createPropertySchema } from "../validators/property.validator";

const router = Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);


// Routes
router.post("/", authenticate, authorize("SELLER"), validate(createPropertySchema),createProperty);
router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.put("/:id", authenticate, authorize("SELLER"), updateProperty);
router.delete("/:id", authenticate, authorize("SELLER"), deleteProperty);
export default router;