"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// ────────────────────────────────────────────────
//  Mock data – replace with real API calls (e.g. via React Query)
// ────────────────────────────────────────────────
const stats = [
  { title: "Active Listings", value: "7", change: "+2 this month", trend: "up" },
  { title: "Total Views", value: "4,812", change: "+18.4%", trend: "up" },
  { title: "New Inquiries", value: "23", change: "+5", trend: "up" },
  { title: "Favorites / Saves", value: "156", change: "+32%", trend: "up" },
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
  { id: "PROP-4821", title: "4bd Villa – Westlands", action: "New inquiry from buyer", time: "2 hours ago", status: "pending" },
  { id: "PROP-4819", title: "3bd Apartment – Kilimani", action: "Added to favorites (x3)", time: "Yesterday", status: "viewed" },
  { id: "PROP-4815", title: "Commercial Plot – Ruaka", action: "Listing updated", time: "3 days ago", status: "active" },
];

export default function SellerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
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
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role?.toLowerCase() !== "seller") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header / Topbar – similar style to admin */}
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="flex h-16 items-center gap-4 px-6">
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-xl font-semibold">Seller Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Action Button */}
            <button
              onClick={() => router.push("/seller/listings/new")}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              + Add New Property
            </button>

            {/* Notifications (simple) */}
            <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">Seller</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold">{stat.value}</p>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Views Trend Chart */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="mb-4 text-lg font-semibold">Property Views (Last 6 Months)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} name="Total Views" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 dark:border-gray-800"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <span
                      className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button className="text-sm text-indigo-600 hover:underline">
                View All Activity →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links / My Properties Summary (optional extension) */}
        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="mb-4 text-lg font-semibold">My Properties Overview</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Example property cards – in real app, map over user's listings */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-4 hover:border-indigo-500 transition-colors">
                <div className="mb-2 h-32 bg-gray-200 rounded-md dark:bg-gray-800" /> {/* Placeholder image */}
                <h4 className="font-medium">Sample Property {i}</h4>
                <p className="text-sm text-gray-500">KSh 12.5M • 4 Beds • Westlands</p>
                <div className="mt-2 flex justify-between text-xs text-gray-600">
                  <span>Views: 842</span>
                  <span>Inquiries: 7</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}