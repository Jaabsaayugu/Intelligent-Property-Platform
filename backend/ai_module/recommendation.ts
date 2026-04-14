import type { Property } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import { EMBEDDING_DIMENSION, generateEmbedding } from "./generateEmbeddings";

type PropertyCandidate = Pick<
  Property,
  | "id"
  | "title"
  | "description"
  | "propertyType"
  | "status"
  | "address"
  | "city"
  | "county"
  | "bedrooms"
  | "bathrooms"
  | "areaSqm"
  | "price"
  | "currency"
  | "features"
  | "images"
  | "createdAt"
  | "updatedAt"
>;

type PurchaseRequestContext = {
  purchaseRequestId: string;
  offerAmount?: number | null;
  message?: string | null;
  property: Pick<
    Property,
    | "title"
    | "description"
    | "propertyType"
    | "address"
    | "city"
    | "county"
    | "bedrooms"
    | "bathrooms"
    | "areaSqm"
    | "price"
    | "currency"
    | "features"
  >;
};

type RecommendationOptions = {
  buyerId?: string;
  queryText?: string;
  limit?: number;
  excludePropertyId?: string;
};

type BuyerPreferenceProfile = {
  document: string;
  propertyTypes: Set<string>;
  locations: Set<string>;
  averageOffer: number | null;
};

const propertyEmbeddingCache = new Map<string, number[]>();

function cosineSimilarity(left: number[], right: number[]): number {
  const size = Math.min(left.length, right.length, EMBEDDING_DIMENSION);
  let sum = 0;

  for (let index = 0; index < size; index += 1) {
    sum += left[index] * right[index];
  }

  return sum;
}

function normaliseText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function buildPropertyDocument(property: PurchaseRequestContext["property"] | PropertyCandidate): string {
  return [
    property.title,
    property.description,
    `${property.propertyType} in ${property.city}${property.county ? `, ${property.county}` : ""}`,
    `Address ${property.address}`,
    property.bedrooms ? `${property.bedrooms} bedrooms` : "",
    property.bathrooms ? `${property.bathrooms} bathrooms` : "",
    property.areaSqm ? `${property.areaSqm} square meters` : "",
    `Price ${property.currency} ${property.price}`,
    property.features.join(" "),
  ]
    .filter(Boolean)
    .join(". ");
}

function buildPurchaseRequestDocument(context: PurchaseRequestContext): string {
  return [
    context.message ?? "",
    context.offerAmount ? `Preferred offer ${context.property.currency} ${context.offerAmount}` : "",
    buildPropertyDocument(context.property),
  ]
    .filter(Boolean)
    .join(". ");
}

async function getPropertyEmbedding(property: PropertyCandidate): Promise<number[]> {
  const cacheKey = `${property.id}:${property.updatedAt.toISOString()}`;
  const cached = propertyEmbeddingCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const embedding = await generateEmbedding(buildPropertyDocument(property));
  propertyEmbeddingCache.set(cacheKey, embedding);
  return embedding;
}

async function getBuyerPreferenceProfile(buyerId: string): Promise<BuyerPreferenceProfile | null> {
  const requests = await prisma.purchaseRequest.findMany({
    where: { buyerId },
    include: {
      property: {
        select: {
          title: true,
          description: true,
          propertyType: true,
          address: true,
          city: true,
          county: true,
          bedrooms: true,
          bathrooms: true,
          areaSqm: true,
          price: true,
          currency: true,
          features: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (requests.length === 0) {
    return null;
  }

  const propertyTypes = new Set<string>();
  const locations = new Set<string>();
  const offers = requests
    .map((request) => request.offerAmount)
    .filter((offerAmount): offerAmount is number => typeof offerAmount === "number");

  const document = requests
    .map((request) => {
      propertyTypes.add(normaliseText(request.property.propertyType));
      locations.add(normaliseText(request.property.city));
      if (request.property.county) {
        locations.add(normaliseText(request.property.county));
      }

      return buildPurchaseRequestDocument({
        purchaseRequestId: request.id,
        offerAmount: request.offerAmount,
        message: request.message,
        property: request.property,
      });
    })
    .join(". ");

  return {
    document,
    propertyTypes,
    locations,
    averageOffer: offers.length > 0 ? offers.reduce((sum, value) => sum + value, 0) / offers.length : null,
  };
}

function scorePropertyHeuristics(property: PropertyCandidate, profile: BuyerPreferenceProfile | null): number {
  if (!profile) {
    return 0;
  }

  let score = 0;

  if (profile.propertyTypes.has(normaliseText(property.propertyType))) {
    score += 0.12;
  }

  if (
    profile.locations.has(normaliseText(property.city)) ||
    (property.county && profile.locations.has(normaliseText(property.county)))
  ) {
    score += 0.08;
  }

  if (profile.averageOffer && profile.averageOffer > 0) {
    const distance = Math.abs(property.price - profile.averageOffer) / profile.averageOffer;
    score += Math.max(0, 0.12 - Math.min(distance, 1) * 0.12);
  }

  return score;
}

export async function storePurchaseRequestEmbedding(context: PurchaseRequestContext): Promise<void> {
  const embedding = await generateEmbedding(buildPurchaseRequestDocument(context));
  const vectorLiteral = `[${embedding.map((value) => value.toFixed(8)).join(",")}]`;

  await prisma.$executeRawUnsafe(
    `UPDATE "PurchaseRequest" SET "embedding" = $1::vector WHERE "id" = $2`,
    vectorLiteral,
    context.purchaseRequestId
  );
}

export async function recommendProperties(options: RecommendationOptions) {
  const limit = Math.max(1, Math.min(options.limit ?? 6, 20));
  const buyerProfile =
    !options.queryText && options.buyerId ? await getBuyerPreferenceProfile(options.buyerId) : null;
  const preferenceDocument = options.queryText?.trim() || buyerProfile?.document || "";

  const properties = await prisma.property.findMany({
    where: {
      ...(options.excludePropertyId ? { id: { not: options.excludePropertyId } } : {}),
      status: { not: "SOLD" },
    },
    orderBy: { updatedAt: "desc" },
    take: Math.max(limit * 5, 30),
  });

  if (!preferenceDocument) {
    return properties.slice(0, limit).map((property) => ({
      ...property,
      recommendationScore: 0,
      recommendationReason: "No buyer preference history yet, showing recent active listings.",
    }));
  }

  const preferenceEmbedding = await generateEmbedding(preferenceDocument);
  const scored = await Promise.all(
    properties.map(async (property) => {
      const propertyEmbedding = await getPropertyEmbedding(property);
      const semanticScore = cosineSimilarity(preferenceEmbedding, propertyEmbedding);
      const heuristicScore = scorePropertyHeuristics(property, buyerProfile);
      const recommendationScore = Number((semanticScore * 0.8 + heuristicScore).toFixed(4));

      return {
        ...property,
        recommendationScore,
        recommendationReason:
          heuristicScore > 0
            ? "Matched against saved buyer intent, preferred location, type, and budget."
            : "Matched against saved buyer intent using listing description similarity.",
      };
    })
  );

  return scored
    .sort((left, right) => right.recommendationScore - left.recommendationScore)
    .slice(0, limit);
}
