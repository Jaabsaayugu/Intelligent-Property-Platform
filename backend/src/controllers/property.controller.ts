import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const propertyListInclude = {
  user: {
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      secondName: true,
    },
  },
  _count: {
    select: {
      reviews: true,
      tourRequests: true,
      purchaseRequests: true,
    },
  },
} as const;

const propertyDetailInclude = {
  user: {
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      secondName: true,
    },
  },
  reviews: {
    include: {
      user: {
        select: { id: true, email: true, firstName: true, secondName: true },
      },
    },
    orderBy: { createdAt: "desc" as const },
  },
} as const;

const getRequestUser = (req: AuthRequest) => req.user;

// CREATE PROPERTY (SELLER ONLY)
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const {
      title,
      description,
      propertyType,
      status,
      address,
      city,
      county,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      areaSqm,
      yearBuilt,
      price,
      currency,
      features,
      images,
    } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        propertyType,
        status,
        address,
        city,
        county,
        latitude,
        longitude,
        bathrooms,
        areaSqm,
        yearBuilt,
        price,
        bedrooms,
        currency,
        features: features || [],
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
      city,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
      sellerId,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (bedrooms) where.bedrooms = Number(bedrooms);

    if (location) {
      where.OR = [
        { address: { contains: String(location), mode: "insensitive" } },
        { city: { contains: String(location), mode: "insensitive" } },
        { county: { contains: String(location), mode: "insensitive" } },
      ];
    }

    if (city) {
      where.city = { contains: String(city), mode: "insensitive" };
    }

    if (sellerId) {
      where.userId = String(sellerId);
    }

    let properties: any[] = [];

    try {
      properties = await prisma.property.findMany({
        where,
        include: propertyListInclude as any,
        orderBy: { [sortBy as string]: order === "asc" ? "asc" : "desc" },
        skip,
        take: limitNumber,
      });
    } catch (relationError) {
      console.error("Property list include failed, falling back to base query:", relationError);

      const baseProperties = await prisma.property.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              firstName: true,
              secondName: true,
            },
          },
        } as any,
        orderBy: { [sortBy as string]: order === "asc" ? "asc" : "desc" },
        skip,
        take: limitNumber,
      });

      properties = baseProperties.map((property) => ({
        ...property,
        _count: {
          reviews: 0,
          tourRequests: 0,
          purchaseRequests: 0,
        },
      }));
    }

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
      include: propertyDetailInclude as any,
    });

    if (!property) return res.status(404).json({ message: "Not found" });

    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch property" });
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const user = getRequestUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "BUYER") {
      return res.status(403).json({ message: "Only buyers can leave reviews" });
    }

    const propertyId = req.params.id as string;
    const { rating, comment } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.userId === user.userId) {
      return res.status(400).json({ message: "You cannot review your own property" });
    }

    const review = await prisma.review.upsert({
      where: {
        propertyId_userId: {
          propertyId,
          userId: user.userId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        rating,
        comment,
        propertyId,
        userId: user.userId,
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, secondName: true },
        },
      } as any,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not save review" });
  }
};

export const createTourRequest = async (req: AuthRequest, res: Response) => {
  try {
    const user = getRequestUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "BUYER") {
      return res.status(403).json({ message: "Only buyers can request tours" });
    }

    const propertyId = req.params.id as string;
    const { preferredDate, notes } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    const request = await prisma.tourRequest.create({
      data: {
        propertyId,
        buyerId: user.userId,
        preferredDate: new Date(preferredDate),
        notes,
      },
      include: {
        buyer: {
          select: { id: true, email: true, firstName: true, secondName: true },
        },
      } as any,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create tour request" });
  }
};

export const getTourRequests = async (req: AuthRequest, res: Response) => {
  try {
    const user = getRequestUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const propertyId = req.params.id as string;
    const property = await prisma.property.findUnique({ where: { id: propertyId } });

    if (!property) return res.status(404).json({ message: "Property not found" });
    if (property.userId !== user.userId && user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const requests = await prisma.tourRequest.findMany({
      where: { propertyId },
      include: {
        buyer: {
          select: { id: true, email: true, firstName: true, secondName: true },
        },
      } as any,
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch tour requests" });
  }
};

export const createPurchaseRequest = async (req: AuthRequest, res: Response) => {
  try {
    const user = getRequestUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "BUYER") {
      return res.status(403).json({ message: "Only buyers can request purchases" });
    }

    const propertyId = req.params.id as string;
    const { offerAmount, message } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    const request = await prisma.purchaseRequest.create({
      data: {
        propertyId,
        buyerId: user.userId,
        offerAmount,
        message,
      },
      include: {
        buyer: {
          select: { id: true, email: true, firstName: true, secondName: true },
        },
      } as any,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create purchase request" });
  }
};

export const getPurchaseRequests = async (req: AuthRequest, res: Response) => {
  try {
    const user = getRequestUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const propertyId = req.params.id as string;
    const property = await prisma.property.findUnique({ where: { id: propertyId } });

    if (!property) return res.status(404).json({ message: "Property not found" });
    if (property.userId !== user.userId && user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const requests = await prisma.purchaseRequest.findMany({
      where: { propertyId },
      include: {
        buyer: {
          select: { id: true, email: true, firstName: true, secondName: true },
        },
      } as any,
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch purchase requests" });
  }
};

// UPDATE PROPERTY (SELLER OWNED OR ADMIN)
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const id = req.params.id as string;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Not found" });

    if (property.userId !== user.userId && user.role !== "ADMIN") {
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

// DELETE PROPERTY (SELLER OWNED OR ADMIN)
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const id = req.params.id as string;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Not found" });

    if (property.userId !== user.userId && user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.property.delete({ where: { id } });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete property" });
  }
};
