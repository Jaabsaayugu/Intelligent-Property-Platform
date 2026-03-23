"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";

const buyerStats = [
  { label: "Saved homes", value: "18", detail: "4 new matches this week" },
  { label: "Tours planned", value: "3", detail: "Next visit on Saturday" },
  { label: "Active offers", value: "2", detail: "1 awaiting seller feedback" },
];

const buyerMatches = [
  {
    title: "Riverside Apartment",
    meta: "Westlands, Nairobi",
    price: "KSh 13.5M",
    note: "Strong location score and recent price adjustment",
  },
  {
    title: "Garden Maisonette",
    meta: "Lavington, Nairobi",
    price: "KSh 24M",
    note: "Fits your 4-bedroom preference and school radius",
  },
  {
    title: "City View Loft",
    meta: "Kilimani, Nairobi",
    price: "KSh 9.8M",
    note: "High-demand listing with updated interiors",
  },
];

const buyerTimeline = [
  { title: "Offer submitted", time: "Today", detail: "Skyline Residency, Unit 4B" },
  { title: "Viewing confirmed", time: "Tomorrow", detail: "Palm Grove Villas, 10:30 AM" },
  { title: "New recommendation", time: "2 hours ago", detail: "2 listings added to your shortlist" },
];

export default function BuyerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

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

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute right-[10%] top-10 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <header className="hero-panel rounded-[2rem] border border-white/60 px-6 py-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
                Buyer Dashboard
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none text-slate-900 sm:text-5xl">
                Discover your next move
                <span className="block text-teal-700">with more confidence and less noise.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Welcome back, {user?.email || "buyer"}. Your search, shortlist,
                and next actions are all lined up in one calm workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => router.push("/buyer/properties")}
                className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Browse properties
              </button>
              <button
                onClick={logout}
                className="rounded-full border border-slate-900/10 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Sign out
              </button>
            </div>
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
              {buyerMatches.map((match, index) => (
                <div
                  key={match.title}
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
                      <p className="mt-2 text-sm text-slate-500">{match.meta}</p>
                    </div>
                    <p className="text-xl font-bold text-teal-700">{match.price}</p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{match.note}</p>
                </div>
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
                Nairobi apartments are trending upward this week.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                Listings matching your budget and preferred neighborhoods are
                moving faster than usual, so this is a strong moment to review
                your shortlist.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
