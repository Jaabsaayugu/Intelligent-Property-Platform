import { z } from "zod";

export const propertySchema = z.object({
  // Step 1: Basic Info
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description is too short").max(2000),
  propertyType: z.enum(["house", "apartment", "land", "commercial", "other"]),
  status: z.enum(["sale", "rent"]),

  // Step 2: Location
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  county: z.string().optional(),
  subCounty: z.string().optional(),
  ward: z.string().optional(),
  area: z.string().optional(),
  exactLocation: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  // Step 3: Details
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(15).optional(),
  areaSqm: z.number().positive("Area must be positive").optional(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),

  // Step 4: Pricing
  price: z.number().positive("Price must be positive"),
  currency: z.enum(["KES", "USD"]),

  // Step 5: Features
  features: z.array(z.string()).optional(),     // ← removed .default([])

  // Step 6: Images
  images: z.array(z.string().url("Must be a valid URL"))
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// Per-step schemas (for partial validation)
export const step1Schema = propertySchema.pick({
  title: true,
  description: true,
  propertyType: true,
  status: true,
});

export const step2Schema = propertySchema.pick({
  address: true,
  city: true,
  county: true,
  subCounty: true,
  ward: true,
  area: true,
  exactLocation: true,
  latitude: true,
  longitude: true,
});

export const step3Schema = propertySchema.pick({
  bedrooms: true,
  bathrooms: true,
  areaSqm: true,
  yearBuilt: true,
});

export const step4Schema = propertySchema.pick({
  price: true,
  currency: true,
});

export const step5Schema = propertySchema.pick({
  images: true,
});
