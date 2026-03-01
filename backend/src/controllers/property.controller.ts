import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// CREATE PROPERTY (SELLER ONLY)
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    // req.user is guaranteed by `authenticate` middleware
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, price, location, images, bedrooms } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        location,
        bedrooms,
        images,
        user: { connect: { id: user.userId } },
      },
    });

    res.status(201).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create property" });
  }
};

// GET ALL PROPERTIES
export const getProperties = async (req: Request, res: Response) => {
  try {
    const {
      minPrice,
      maxPrice,
      bedrooms,
      location,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build dynamic filter
    const where: any = {};

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (bedrooms) where.bedrooms = Number(bedrooms);

    if (location) {
      where.location = { contains: String(location), mode: "insensitive" };
    }

    const properties = await prisma.property.findMany({
      where,
      include: { user: { select: { email: true, role: true } } },
      orderBy: { [sortBy as string]: order === "asc" ? "asc" : "desc" },
      skip,
      take: limitNumber,
    });

    const total = await prisma.property.count({ where });

    res.json({
      data: properties,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch properties" });
  }
};

// GET PROPERTY BY ID
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const property = await prisma.property.findUnique({
      where: { id },
      include: { user: { select: { email: true, role: true } } },
    });

    if (!property) return res.status(404).json({ message: "Not found" });

    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch property" });
  }
};

// UPDATE PROPERTY (SELLER ONLY, OWNED PROPERTY)
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const id = req.params.id as string;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Not found" });

    if (property.userId !== user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update property" });
  }
};

// DELETE PROPERTY (SELLER ONLY, OWNED PROPERTY)
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const id = req.params.id as string;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Not found" });

    if (property.userId !== user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.property.delete({ where: { id } });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete property" });
  }
};