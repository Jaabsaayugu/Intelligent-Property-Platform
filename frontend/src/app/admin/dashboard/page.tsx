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

const stats = [
  { title: "Total properties", value: "2,847", change: "+12.5%" },
  { title: "Active listings", value: "1,420", change: "+8.2%" },
  { title: "Pending approvals", value: "93", change: "-4.1%" },
  { title: "Total users", value: "15,673", change: "+19.3%" },
];

const chartData = [
  { name: "Jan", properties: 400, sales: 2400 },
  { name: "Feb", properties: 300, sales: 1398 },
  { name: "Mar", properties: 200, sales: 9800 },
  { name: "Apr", properties: 278, sales: 3908 },
  { name: "May", properties: 189, sales: 4800 },
  { name: "Jun", properties: 239, sales: 3800 },
  { name: "Jul", properties: 349, sales: 4300 },
];

const approvals = [
  { id: "PROP-4821", title: "4bd Villa - Westlands", time: "2 hours ago", priority: "High" },
  { id: "PROP-4819", title: "3bd Apartment - Kilimani", time: "5 hours ago", priority: "Medium" },
  { id: "PROP-4815", title: "Commercial Plot - Ruaka", time: "Yesterday", priority: "Medium" },
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
                Welcome back, {user?.email || "administrator"}. Review market
                signals, moderation load, and operational health in one premium workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-800">
                Review queue
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
              Pending approvals
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              Items needing review
            </h2>

            <div className="mt-8 space-y-4">
              {approvals.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.id}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                      {item.priority}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {item.time}
                    </p>
                    <button className="text-sm font-semibold text-teal-700 hover:underline">
                      Review
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
              Moderation is healthy, but queue volume is climbing.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
              Your strongest leverage this week is approval throughput. Keeping
              review speed high will protect listing quality without slowing marketplace momentum.
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
