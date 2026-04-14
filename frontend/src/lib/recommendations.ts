import api from "@/lib/axios";

export type RecommendedProperty = {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  address: string;
  city: string;
  county?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm?: number | null;
  yearBuilt?: number | null;
  price: number;
  currency: string;
  features: string[];
  images: string[];
  recommendationScore?: number;
  recommendationReason?: string;
};

export type RecommendationResponse = {
  data: RecommendedProperty[];
  meta?: {
    total?: number;
    usedBuyerHistory?: boolean;
  };
};

type RecommendationQuery = {
  limit?: number;
  query?: string;
  excludePropertyId?: string;
};

export async function fetchRecommendations(query: RecommendationQuery = {}) {
  const params = new URLSearchParams();

  if (typeof query.limit === "number") {
    params.set("limit", String(query.limit));
  }

  if (query.query?.trim()) {
    params.set("query", query.query.trim());
  }

  if (query.excludePropertyId) {
    params.set("excludePropertyId", query.excludePropertyId);
  }

  const search = params.toString();
  const response = await api.get<RecommendationResponse>(
    `/recommendations${search ? `?${search}` : ""}`
  );

  return response.data;
}
