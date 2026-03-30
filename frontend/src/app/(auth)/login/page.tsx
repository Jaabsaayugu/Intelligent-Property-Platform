"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";

const roleOptions = [
  {
    key: "buyer",
    label: "Buyer",
    description: "Browse listings and track new opportunities.",
  },
  {
    key: "seller",
    label: "Seller",
    description: "Manage listings, inquiries, and performance.",
  },
  {
    key: "admin",
    label: "Admin",
    description: "Review activity and oversee the platform.",
  },
] as const;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const selectedRole = searchParams.get("role")?.toLowerCase();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token } = res.data;
      login(token);
      document.cookie = `auth_token=${token}; path=/; SameSite=Strict; Max-Age=604800`;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const role = decoded.role?.toLowerCase();

      if (role === "buyer") {
        router.push("/buyer/dashboard");
      } else if (role === "seller") {
        router.push("/seller/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      let message = "Login failed";

      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as { message?: string } | undefined)?.message ||
          err.message;
      } else if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      } else if (err && typeof err === "object" && "message" in err) {
        message = String((err as { message: unknown }).message);
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-800/70">
            Welcome Back
          </p>
          <h2 className="mt-3 font-display text-4xl leading-none text-slate-900">
            Sign in to continue
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            Step back into your property workflow with a cleaner, calmer
            sign-in experience.
          </p>
        </div>

        <Link
          href="/"
          className="hidden rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
        >
          Back home
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {roleOptions.map((role) => {
          const isSelected = selectedRole === role.key;

          return (
            <div
              key={role.key}
              className={`rounded-2xl border px-4 py-4 transition ${
                isSelected
                  ? "border-teal-700 bg-teal-50 shadow-[0_12px_30px_-20px_rgba(15,118,110,0.75)]"
                  : "border-slate-200 bg-white/70"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{role.label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {role.description}
              </p>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="block w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="block w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
            />
            <span className="ml-2 text-slate-600">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-teal-700 transition hover:text-teal-800 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-full px-4 py-3.5 text-base font-semibold text-white transition duration-200 ${
            loading
              ? "cursor-not-allowed bg-teal-400"
              : "bg-slate-900 shadow-lg shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-slate-800 active:bg-slate-950"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Enter dashboard"
          )}
        </button>
      </form>

      <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">New here?</p>
        <p className="mt-1 leading-6">
          Create an account and choose whether you want to join as a buyer,
          seller, or administrator.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-teal-700 hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-600">Loading sign-in...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
