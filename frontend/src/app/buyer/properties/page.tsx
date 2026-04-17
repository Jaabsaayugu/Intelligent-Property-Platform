"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppBackdrop from "@/components/layout/AppBackdrop";
import PropertyMapPanel from "@/components/maps/PropertyMapPanel";
import PropertyCard from "@/components/property/PropertyCard";
import api from "@/lib/axios";
import { fetchRecommendations, RecommendedProperty } from "@/lib/recommendations";
import { useAuthStore } from "@/store/auth.store";

type Property = {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  county?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  images: string[];
};

type BuyerPropertyCard = Property & {
  currency?: string;
  recommendationScore?: number;
  recommendationReason?: string;
};

export default function PropertiesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [defaultRecommendations, setDefaultRecommendations] = useState<RecommendedProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [usesBuyerHistory, setUsesBuyerHistory] = useState(false);
  const [personalizedResults, setPersonalizedResults] = useState<RecommendedProperty[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/buyer/properties");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const [recommendationResponse, propertyResponse] = await Promise.allSettled([
          fetchRecommendations({ limit: 18 }),
          api.get("/properties?limit=18"),
        ]);

        const nextProperties =
          propertyResponse.status === "fulfilled"
            ? ((propertyResponse.value.data.data || []) as Property[])
            : [];

        const nextRecommendations =
          recommendationResponse.status === "fulfilled"
            ? recommendationResponse.value.data ?? []
            : [];

        setProperties(nextProperties);
        setDefaultRecommendations(nextRecommendations);
        setPersonalizedResults(nextRecommendations);
        setUsesBuyerHistory(
          recommendationResponse.status === "fulfilled" &&
            Boolean(recommendationResponse.value.meta?.usedBuyerHistory)
        );
        setSelectedPropertyId((nextRecommendations[0]?.id ?? nextProperties[0]?.id) || null);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError("We could not load properties right now.");
      } finally {
        setLoading(false);
      }
    };

    void loadProperties();
  }, []);

  useEffect(() => {
    const loadSearchRecommendations = async () => {
      if (!searchText.trim()) {
        setPersonalizedResults(defaultRecommendations);
        setSelectedPropertyId(defaultRecommendations[0]?.id ?? properties[0]?.id ?? null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchRecommendations({ limit: 18, query: searchText });
        setPersonalizedResults(response.data ?? []);
        setUsesBuyerHistory(Boolean(response.meta?.usedBuyerHistory));
        setSelectedPropertyId(response.data?.[0]?.id ?? null);
      } catch (searchError) {
        console.error("Failed to load searched recommendations:", searchError);
        setError("We could not search recommendations right now.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      void loadSearchRecommendations();
    }, 350);

    return () => clearTimeout(timer);
  }, [defaultRecommendations, properties, searchText]);

  const visibleProperties: BuyerPropertyCard[] =
    personalizedResults.length > 0
      ? personalizedResults.map((property) => ({
          ...property,
          currency: property.currency,
          recommendationScore: property.recommendationScore,
          recommendationReason: property.recommendationReason,
        }))
      : properties.map((property) => ({
          ...property,
          currency: "KSh",
        }));

  const selectedProperty =
    visibleProperties.find((property) => property.id === selectedPropertyId) ??
    visibleProperties[0] ??
    null;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <AppBackdrop photoUrl="https://images.pexels.com/photos/17999591/pexels-photo-17999591.jpeg" />

      <div className="relative mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <div className="flex justify-end">
          <Link
            href="/buyer/dashboard"
            className="rounded-full border border-slate-900/10 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.4)] transition hover:bg-white"
          >
            Return to dashboard
          </Link>
        </div>

        <section className="hero-panel rounded-[2rem] border border-white/60 px-5 py-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="max-w-lg overflow-hidden rounded-[1.75rem] border border-amber-300/80 bg-white/50 p-3 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)]">
                <img
                  src="https://images.pexels.com/photos/8482523/pexels-photo-8482523.jpeg"
                  alt="Elegant property lifestyle scene"
                  className="h-56 w-full rounded-[1.35rem] object-cover opacity-75 sm:h-64 lg:h-72"
                />
              </div>

              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#17365d]/80">
                  Browse properties
                </p>
              <h1 className="mt-3 font-display text-4xl text-slate-900 sm:text-5xl">
                  Recommended matches for you
              </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Explore listings ranked from your history, or describe what you
                  want and let the recommendation engine reprioritize the grid for you.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/75 px-5 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Current results
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {visibleProperties.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {usesBuyerHistory ? "Personalized picks ready" : "Active matches available"}
              </p>
            </div>
          </div>
        </section>

        <section className="hero-panel rounded-[2rem] border border-white/60 p-5 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 border-b border-slate-200/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#17365d]/80">
                Recommendation engine
              </p>
              <h2 className="mt-2 font-display text-2xl text-slate-900 sm:text-3xl">
                Properties for You
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {usesBuyerHistory
                  ? "Your recent request activity is shaping these rankings."
                  : "No profile signal yet, so we are blending recent listings with recommendation search."}
              </p>
            </div>
            <div className="text-sm text-slate-600">
              Showing {visibleProperties.length} result{visibleProperties.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label htmlFor="recommendation-search" className="text-sm font-medium text-slate-700">
                Describe your ideal property
              </label>
              <input
                id="recommendation-search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Example: 3 bedroom apartment in Nairobi under 12,000,000 near schools"
                className="mt-2 block w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setPersonalizedResults(defaultRecommendations);
                setSelectedPropertyId(defaultRecommendations[0]?.id ?? properties[0]?.id ?? null);
              }}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear search
            </button>
          </div>

          {selectedProperty && (
            <div className="mt-6">
              <PropertyMapPanel
                title={selectedProperty.title}
                address={[selectedProperty.address, selectedProperty.city, selectedProperty.county]
                  .filter(Boolean)
                  .join(", ")}
                latitude={selectedProperty.latitude}
                longitude={selectedProperty.longitude}
              />
            </div>
          )}

          <div className="mt-6">
            {loading && (
              <div className="rounded-[1.75rem] border border-white/60 bg-white/80 px-6 py-12 text-center text-slate-600 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
                Loading properties...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-6 py-12 text-center text-rose-700">
                {error}
              </div>
            )}

            {!loading && !error && visibleProperties.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProperties.map((property) => (
                  <div key={property.id} onMouseEnter={() => setSelectedPropertyId(property.id)}>
                    <PropertyCard
                      property={{
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        currency: property.currency ?? "KSh",
                        location: `${property.address}, ${property.city}`,
                        bedrooms: property.bedrooms ?? 0,
                        imageUrl: property.images?.[0],
                        badge:
                          typeof property.recommendationScore === "number"
                            ? `Match ${(property.recommendationScore * 100).toFixed(0)}%`
                            : "Buyer view",
                        footnote: property.recommendationReason,
                        ctaLabel: "Open property",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && visibleProperties.length === 0 && (
              <div className="rounded-[1.75rem] border border-white/60 bg-white/80 px-6 py-12 text-center text-slate-600 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
                No recommendation results are available right now.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
