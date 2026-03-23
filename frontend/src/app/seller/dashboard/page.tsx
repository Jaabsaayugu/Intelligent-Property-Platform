"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const stats = [
  { title: "Active listings", value: "7", change: "+2 this month" },
  { title: "Property views", value: "4,812", change: "+18.4%" },
  { title: "New inquiries", value: "23", change: "+5 this week" },
  { title: "Saved by buyers", value: "156", change: "+32%" },
];

const viewsOverTime = [
  { name: "Jan", views: 1200 },
  { name: "Feb", views: 1900 },
  { name: "Mar", views: 2400 },
  { name: "Apr", views: 3200 },
  { name: "May", views: 4100 },
  { name: "Jun", views: 4812 },
];

const recentActivity = [
  { id: "PROP-4821", title: "4bd Villa - Westlands", action: "New inquiry from buyer", time: "2 hours ago", status: "pending" },
  { id: "PROP-4819", title: "3bd Apartment - Kilimani", action: "Added to favorites (x3)", time: "Yesterday", status: "viewed" },
  { id: "PROP-4815", title: "Commercial Plot - Ruaka", action: "Listing updated", time: "3 days ago", status: "active" },
];

const listingPreview = [
  { title: "Westlands Signature Villa", meta: "KSh 12.5M • 4 Beds", insight: "842 views • 7 inquiries" },
  { title: "Kilimani Urban Apartment", meta: "KSh 8.9M • 3 Beds", insight: "610 views • 4 inquiries" },
  { title: "Ruaka Commerce Plot", meta: "KSh 18M • Commercial", insight: "391 views • 3 inquiries" },
];

export default function SellerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute right-[8%] top-10 h-64 w-64 rounded-full bg-amber-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <header className="hero-panel rounded-[2rem] border border-white/60 px-6 py-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
                Seller Dashboard
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none text-slate-900 sm:text-5xl">
                Grow listing momentum
                <span className="block text-teal-700">from one elevated command center.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Welcome back, {user?.email || "seller"}. Track demand, monitor
                property performance, and launch your next listing with less friction.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => router.push("/seller/listings/new")}
                className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Add new property
              </button>
              <button
                onClick={logout}
                className="rounded-full border border-slate-900/10 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Sign out
              </button>
            </div>
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
              Signals from the market
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
              Listings with refreshed photos are converting faster.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Your audience is responding strongest to listings with updated
              presentation and clear pricing. Consider refreshing underperforming
              properties this week.
            </p>
          </div>

          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              My properties
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              Listing overview
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {listingPreview.map((listing) => (
                <div
                  key={listing.title}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-4 h-32 rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-sky-100" />
                  <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{listing.meta}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{listing.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
