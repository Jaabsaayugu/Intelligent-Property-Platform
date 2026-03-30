"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getDisplayName } from "@/lib/display-name";
import api from "@/lib/axios";

type BuyerProperty = {
  id: string;
  title: string;
  city: string;
  address: string;
  price: number;
  currency: string;
  bedrooms?: number | null;
  propertyType: string;
  description: string;
};

export default function BuyerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [matches, setMatches] = useState<BuyerProperty[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentState = useAuthStore.getState();

      if (!currentState.isAuthenticated) {
        router.replace("/login?redirect=/buyer/dashboard");
      } else {
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    const loadMatches = async () => {
      setMatchesLoading(true);

      try {
        const response = await api.get<{ data: BuyerProperty[] }>("/properties?limit=6");
        setMatches(response.data.data ?? []);
      } catch (error) {
        console.error("Failed to load buyer recommendations:", error);
        setMatches([]);
      } finally {
        setMatchesLoading(false);
      }
    };

    void loadMatches();
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-teal-700" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const buyerStats = [
    {
      label: "Recommended homes",
      value: String(matches.length),
      detail: matches.length > 0 ? "Freshly published by sellers" : "Waiting for new listings",
    },
    {
      label: "Cities available",
      value: String(new Set(matches.map((property) => property.city)).size),
      detail: "Browse active neighborhoods",
    },
    {
      label: "Property types",
      value: String(new Set(matches.map((property) => property.propertyType)).size),
      detail: "Apartments, villas, plots, and more",
    },
  ];

  const buyerTimeline = matches.slice(0, 3).map((property, index) => ({
    title: index === 0 ? "New recommendation" : "Listing to review",
    time: `${index + 1} of ${Math.min(matches.length, 3)}`,
    detail: `${property.title} in ${property.city}`,
  }));

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div
        className="absolute inset-y-0 left-0 w-full sm:w-[60%] lg:w-[42%]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,253,248,0.16) 0%, rgba(255,253,248,0.6) 68%, rgba(255,253,248,0.9) 100%), url('https://images.pexels.com/photos/17999591/pexels-photo-17999591.jpeg')",
          backgroundPosition: "center left",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.46,
        }}
      />
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute right-[10%] top-10 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-4 flex justify-end">
          <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-medium text-slate-700">
              Welcome back, <span className="font-semibold text-slate-900">{getDisplayName(user, "buyer")}</span>
            </p>
            <button
              onClick={logout}
              className="rounded-full border border-slate-900/10 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>

        <header className="hero-panel rounded-[2rem] border border-white/60 px-6 py-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
                Your Dashboard
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none text-slate-900 sm:text-5xl">
                Find Your Next Move with Greater Clarity
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Browse verified properties directly from sellers — backed by intelligent
                insights and transparent data.
              </p>
            </div>

            <div className="w-full max-w-md justify-self-start lg:justify-self-end">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/45 p-3 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)]">
                <img
                  src="https://images.pexels.com/photos/8293749/pexels-photo-8293749.jpeg"
                  alt="Modern home exterior"
                  className="h-48 w-full rounded-[1.3rem] object-cover opacity-70 sm:h-56"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-start lg:justify-end">
            <button
              onClick={() => router.push("/buyer/properties")}
              className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-800"
            >
              Browse properties
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {buyerStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl bg-white/75 px-5 py-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)]"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{stat.detail}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
                  Recommended for you
                </p>
                <h2 className="mt-3 font-display text-3xl text-slate-900">
                  Curated matches
                </h2>
              </div>
              <button
                onClick={() => router.push("/buyer/properties")}
                className="text-sm font-semibold text-teal-700 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="mt-8 grid gap-4">
              {matchesLoading && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 text-sm text-slate-600">
                  Loading recommendations...
                </div>
              )}

              {!matchesLoading && matches.length === 0 && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 text-sm text-slate-600">
                  No seller listings are available yet.
                </div>
              )}

              {!matchesLoading &&
                matches.map((match, index) => (
                  <Link
                    key={match.id}
                    href={`/properties/${match.id}`}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                          Match {index + 1}
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                          {match.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {match.address}, {match.city}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-teal-700">
                        {match.currency} {match.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {match.description}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-teal-700">
                      {match.propertyType} • {match.bedrooms ?? "N/A"} bedrooms • View details
                    </p>
                  </Link>
                ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
                Next actions
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-900">
                Your timeline
              </h2>

              <div className="mt-8 space-y-4">
                {buyerTimeline.length === 0 && (
                  <div className="rounded-3xl bg-white/80 px-5 py-4 text-sm text-slate-600">
                    New seller listings will appear here as they are published.
                  </div>
                )}

                {buyerTimeline.map((item) => (
                  <div
                    key={item.title + item.time}
                    className="rounded-3xl bg-white/80 px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.8)] sm:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">
                Search pulse
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Open any recommended property to book tours, message sellers, and leave reviews.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                The property detail page now acts as your buyer workspace for
                requests, conversations, and public feedback on each listing.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
