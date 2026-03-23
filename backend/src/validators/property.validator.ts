import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  propertyType: z.enum(["house", "apartment", "land", "commercial", "other"]),
  status: z.enum(["sale", "rent"]),
  address: z.string().min(5),
  city: z.string().min(2),
  county: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bathrooms: z.number().int().min(0).max(15).optional(),
  areaSqm: z.number().positive().optional(),
  yearBuilt: z.number().int().min(1900).optional(),
  price: z.number().positive(),
  currency: z.enum(["KES", "USD"]),
  bedrooms: z.number().int().min(0).max(20).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url()).min(1).max(10),
});
