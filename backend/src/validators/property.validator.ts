import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  price: z.number().positive(),
  location: z.string().min(2),
  bedrooms: z.number().int().positive(),
  images: z.array(z.string()).min(1),
});