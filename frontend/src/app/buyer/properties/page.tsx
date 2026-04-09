"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppBackdrop from "@/components/layout/AppBackdrop";
import PropertyMapPanel from "@/components/maps/PropertyMapPanel";
import PropertyCard from "@/components/property/PropertyCard";
import api from "@/lib/axios";

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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await api.get("/properties");
        const nextProperties = (res.data.data || []) as Property[];
        setProperties(nextProperties);
        setSelectedPropertyId(nextProperties[0]?.id ?? null);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError("We could not load properties right now.");
      } finally {
        setLoading(false);
      }
    };

    void loadProperties();
  }, []);

  const selectedProperty =
    properties.find((property) => property.id === selectedPropertyId) ?? properties[0] ?? null;

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
                  Available listings
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Explore published homes in a calmer, more readable grid with a live
                  map that helps you inspect the neighborhood and open directions fast.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/75 px-5 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Current results
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {properties.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Listing{properties.length === 1 ? "" : "s"} available now
              </p>
            </div>
          </div>
        </section>

        <section className="hero-panel rounded-[2rem] border border-white/60 p-5 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 border-b border-slate-200/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#17365d]/80">
                Marketplace
              </p>
              <h2 className="mt-2 font-display text-2xl text-slate-900 sm:text-3xl">
                Properties for You
              </h2>
            </div>
            <div className="text-sm text-slate-600">
              Showing {properties.length} result{properties.length === 1 ? "" : "s"}
            </div>
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

            {!loading && !error && properties.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <div key={property.id} onMouseEnter={() => setSelectedPropertyId(property.id)}>
                    <PropertyCard
                      property={{
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        location: `${property.address}, ${property.city}`,
                        bedrooms: property.bedrooms ?? 0,
                        imageUrl: property.images?.[0],
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && properties.length === 0 && (
              <div className="rounded-[1.75rem] border border-white/60 bg-white/80 px-6 py-12 text-center text-slate-600 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
                No properties have been published yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
