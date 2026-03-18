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
} from "recharts";

// ────────────────────────────────────────────────
//  Mock data – replace with real API fetches later
// ────────────────────────────────────────────────
const stats = [
  { title: "Total Properties", value: "2,847", change: "+12.5%", trend: "up" },
  { title: "Active Listings", value: "1,420", change: "+8.2%", trend: "up" },
  { title: "Pending Approvals", value: "93", change: "-4.1%", trend: "down" },
  { title: "Total Users", value: "15,673", change: "+19.3%", trend: "up" },
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

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay → let store settle (hydration safety)
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
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role?.toLowerCase() !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header / Topbar */}
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="flex h-16 items-center gap-4 px-6">
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="sr-only">Notifications</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={logout}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
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

        {/* Charts & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Property & Sales Chart */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="mb-4 text-lg font-semibold">Activity Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="properties" fill="#6366f1" name="Properties" />
                  <Bar dataKey="sales" fill="#10b981" name="Sales (KSh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Approvals / Activity Feed */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="mb-4 text-lg font-semibold">Pending Approvals</h3>
            <div className="space-y-4">
              {[
                { id: "PROP-4821", title: "4bd Villa – Westlands", time: "2 hours ago" },
                { id: "PROP-4819", title: "3bd Apartment – Kilimani", time: "5 hours ago" },
                { id: "PROP-4815", title: "Commercial Plot – Ruaka", time: "Yesterday" },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 dark:border-gray-800"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <button className="mt-1 text-xs text-indigo-600 hover:underline">
                      Review →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}