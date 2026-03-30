"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AdminReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
  };
  property: {
    id: string;
    title: string;
    city: string;
  };
};

const chartData = [
  { name: "Jan", properties: 400, sales: 2400 },
  { name: "Feb", properties: 300, sales: 1398 },
  { name: "Mar", properties: 200, sales: 9800 },
  { name: "Apr", properties: 278, sales: 3908 },
  { name: "May", properties: 189, sales: 4800 },
  { name: "Jun", properties: 239, sales: 3800 },
  { name: "Jul", properties: 349, sales: 4300 },
];

const alerts = [
  "Moderation queue increased by 7% since yesterday",
  "Seller activity is strongest in Nairobi and Kiambu",
  "Approval turnaround remains below 24 hours",
];

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const loadReviews = async () => {
    setReviewsLoading(true);
    setReviewError(null);

    try {
      const token = useAuthStore.getState().token;
      const response = await fetch("/api/reviews", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load reviews");
      }

      setReviews(data.data ?? []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviewError("We could not load review moderation data right now.");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const state = useAuthStore.getState();

      if (!state.isAuthenticated || state.user?.role?.toLowerCase() !== "admin") {
        router.replace("/login?redirect=/admin/dashboard");
      } else {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (useAuthStore.getState().user?.role === "ADMIN") {
      void loadReviews();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-teal-700" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role?.toLowerCase() !== "admin") {
    return null;
  }

  const stats = [
    { title: "Reviews to moderate", value: String(reviews.length), change: "Marketplace feedback queue" },
    {
      title: "Five-star reviews",
      value: String(reviews.filter((review) => review.rating === 5).length),
      change: "Strong buyer sentiment",
    },
    {
      title: "Recent properties",
      value: String(new Set(reviews.map((review) => review.property.id)).size),
      change: "Listings with public feedback",
    },
    {
      title: "Reviewed buyers",
      value: String(new Set(reviews.map((review) => review.user.id)).size),
      change: "Distinct buyer voices",
    },
  ];

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete review");
      }

      setReviews((current) => current.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Failed to delete review:", error);
      setReviewError("We could not delete that review right now.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute right-[8%] top-10 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <header className="hero-panel rounded-[2rem] border border-white/60 px-6 py-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
                Admin Dashboard
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none text-slate-900 sm:text-5xl">
                Keep the platform
                <span className="block text-teal-700">trusted, balanced, and moving well.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Welcome back, {user?.email || "administrator"}. Buyer reviews are now
                visible here, and you can remove any review directly from this moderation panel.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => void loadReviews()}
                className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Refresh reviews
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

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
                  Activity overview
                </p>
                <h2 className="mt-3 font-display text-3xl text-slate-900">
                  Platform growth pulse
                </h2>
              </div>
              <span className="rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                Monthly
              </span>
            </div>

            <div className="mt-8 h-80 rounded-[1.5rem] bg-white/80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbe4ea" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="properties" fill="#0f766e" name="Properties" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sales" fill="#0f172a" name="Sales (KSh)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              Review moderation
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              Buyer reviews
            </h2>

            <div className="mt-8 space-y-4">
              {reviewsLoading && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4 text-sm text-slate-600">
                  Loading reviews...
                </div>
              )}

              {!reviewsLoading && reviewError && (
                <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                  {reviewError}
                </div>
              )}

              {!reviewsLoading && !reviewError && reviews.length === 0 && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4 text-sm text-slate-600">
                  No property reviews have been submitted yet.
                </div>
              )}

              {!reviewsLoading &&
                !reviewError &&
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{review.property.title}</p>
                        <p className="mt-2 text-sm text-slate-500">
                          {review.user.email} • {review.property.city}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                      <button
                        onClick={() => void handleDeleteReview(review.id)}
                        className="text-sm font-semibold text-rose-700 hover:underline"
                      >
                        Delete review
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.8)] sm:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">
              Operations brief
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Review moderation is now part of the admin workflow.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Buyers can leave public property reviews for everyone to read, while
              administrators can remove unsuitable feedback from this dashboard.
            </p>
          </div>

          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              Watchlist
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              High-level alerts
            </h2>

            <div className="mt-8 space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={alert}
                  className="flex items-start gap-4 rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4"
                >
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-slate-600">{alert}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
