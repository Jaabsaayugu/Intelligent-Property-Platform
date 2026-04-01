"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getDisplayName } from "@/lib/display-name";
import api from "@/lib/axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SellerProperty = {
  id: string;
  title: string;
  price: number;
  currency: string;
  propertyType: string;
  city: string;
  bedrooms?: number | null;
  images: string[];
  _count?: {
    reviews: number;
    tourRequests: number;
    purchaseRequests: number;
  };
};

const viewsOverTime = [
  { name: "Jan", views: 1200 },
  { name: "Feb", views: 1900 },
  { name: "Mar", views: 2400 },
  { name: "Apr", views: 3200 },
  { name: "May", views: 4100 },
  { name: "Jun", views: 4812 },
];

const recentActivity = [
  {
    id: "seller-focus-1",
    title: "Keep listing details current",
    action: "Review tours and purchase requests from each property page.",
    time: "Action",
    status: "live",
  },
  {
    id: "seller-focus-2",
    title: "Respond to buyer messages",
    action: "Use the property detail page or message center to reply quickly.",
    time: "Inbox",
    status: "ready",
  },
  {
    id: "seller-focus-3",
    title: "Add another listing",
    action: "Fresh listings improve visibility across the buyer dashboard.",
    time: "Growth",
    status: "open",
  },
];

export default function SellerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<SellerProperty[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const state = useAuthStore.getState();

      if (!state.isAuthenticated || state.user?.role?.toLowerCase() !== "seller") {
        router.replace("/login?redirect=/seller/dashboard");
      } else {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    const currentUser = useAuthStore.getState().user;

    if (!currentUser?.id || currentUser.role !== "SELLER") {
      setPropertiesLoading(false);
      return;
    }

    const loadProperties = async () => {
      setPropertiesLoading(true);
      setPropertiesError(null);

      try {
        const response = await api.get<{ data: SellerProperty[] }>(
          `/properties?sellerId=${currentUser.id}`
        );
        setProperties(response.data.data ?? []);
      } catch (error) {
        console.error("Failed to load seller properties:", error);
        setPropertiesError("We could not load your listings right now.");
      } finally {
        setPropertiesLoading(false);
      }
    };

    void loadProperties();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-teal-700" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role?.toLowerCase() !== "seller") {
    return null;
  }

  const totalReviews = properties.reduce(
    (sum, property) => sum + (property._count?.reviews ?? 0),
    0
  );
  const totalTours = properties.reduce(
    (sum, property) => sum + (property._count?.tourRequests ?? 0),
    0
  );
  const totalPurchaseRequests = properties.reduce(
    (sum, property) => sum + (property._count?.purchaseRequests ?? 0),
    0
  );

  const stats = [
    {
      title: "Active listings",
      value: String(properties.length),
      change:
        properties.length === 1
          ? "1 property published"
          : `${properties.length} properties published`,
    },
    {
      title: "Buyer reviews",
      value: String(totalReviews),
      change:
        totalReviews === 1 ? "1 review received" : `${totalReviews} reviews received`,
    },
    {
      title: "Tours planned",
      value: String(totalTours),
      change: totalTours === 1 ? "1 tour request" : `${totalTours} tour requests`,
    },
    {
      title: "Purchase requests",
      value: String(totalPurchaseRequests),
      change:
        totalPurchaseRequests === 1
          ? "1 buyer interested"
          : `${totalPurchaseRequests} buyer requests`,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute right-[8%] top-10 h-64 w-64 rounded-full bg-amber-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-4 flex justify-end">
          <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-medium text-slate-700">
              Welcome back, <span className="font-semibold text-slate-900">{getDisplayName(user, "seller")}</span>
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
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
                Seller Dashboard
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none text-slate-900 sm:text-5xl">
                Grow listing momentum
                <span className="block text-teal-700">from one elevated command center.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Your dashboard now shows only the properties you have actually added,
                together with the buyer activity attached to them.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-start lg:justify-end">
            <button
              onClick={() => router.push("/seller/listings/new")}
              className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-800"
            >
              Add new property
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-3xl bg-white/75 px-5 py-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)]"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  {stat.title}
                </p>
                <p className="mt-3 text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-700">{stat.change}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Seller conversation area */}
          <div className="rounded-[2rem] bg-white p-6 shadow mb-8">
            <h3 className="text-xl font-semibold mb-2">Conversations with Buyers</h3>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              placeholder="Type your message to the buyer..."
            />
            <button
              className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
              type="button"
            >
              Send
            </button>
            {/* Conversation thread would be displayed here */}
            <div className="bg-gray-50 border rounded p-2 min-h-[60px] text-sm text-gray-700 mt-2">
              No messages yet.
            </div>
          </div>
          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
                  Market attention
                </p>
                <h2 className="mt-3 font-display text-3xl text-slate-900">
                  Property views over time
                </h2>
              </div>
              <span className="rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                Last 6 months
              </span>
            </div>

            <div className="mt-8 h-80 rounded-[1.5rem] bg-white/80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbe4ea" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#0f766e"
                    strokeWidth={3}
                    name="Total views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              Recent activity
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              Seller actions
            </h2>

            <div className="mt-8 space-y-4">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.action}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.8)] sm:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">
              Seller insight
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Every card on the right is one of your actual listings.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Open any property to review buyer messages, plan tours, check purchase
              requests, and read the reviews attached to that specific house.
            </p>
          </div>

          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              My properties
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              Listing overview
            </h2>

            <div className="mt-8">
              {propertiesLoading && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 text-sm text-slate-600">
                  Loading your properties...
                </div>
              )}

              {!propertiesLoading && propertiesError && (
                <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                  {propertiesError}
                </div>
              )}

              {!propertiesLoading && !propertiesError && properties.length === 0 && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 text-sm text-slate-600">
                  You have not added any properties yet.
                </div>
              )}

              {!propertiesLoading && !propertiesError && properties.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3">
                  {properties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/properties/${property.id}`}
                      className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="mb-4 h-32 w-full rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="mb-4 h-32 rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-sky-100" />
                      )}
                      <h3 className="text-lg font-semibold text-slate-900">{property.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {property.currency} {property.price.toLocaleString()} • {property.bedrooms ?? "N/A"} Beds
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {property.propertyType} • {property.city}
                      </p>
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {(property._count?.reviews ?? 0)} reviews • {(property._count?.tourRequests ?? 0)} tours •{" "}
                        {(property._count?.purchaseRequests ?? 0)} purchase requests
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
