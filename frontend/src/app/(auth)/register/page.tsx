"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "BUYER" as "BUYER" | "SELLER" | "ADMIN",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          secondName: formData.secondName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      router.push("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-amber-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,248,242,0.95))] p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.6)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-700">
            Join the Platform
          </p>
          <h2 className="mt-3 font-display text-4xl leading-none text-slate-950">
            Create your account
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-700">
            Open your AfREALTY DATAHOMES account with a clean, elegant registration
            flow built for buyers, sellers, and administrators.
          </p>
        </div>

        <Link
          href="/"
          className="hidden rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-amber-50 sm:inline-flex"
        >
          Back home
        </Link>
      </div>

      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">First name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Second name</label>
            <input
              type="text"
              required
              value={formData.secondName}
              onChange={(e) => setFormData({ ...formData, secondName: e.target.value })}
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              placeholder="Second name"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            placeholder="Create a secure password"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">
            Confirm password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
            placeholder="Retype your password"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">I want to be a...</label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as "BUYER" | "SELLER" | "ADMIN",
              })
            }
            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 shadow-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          >
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-full px-4 py-3.5 text-base font-semibold text-white transition duration-200 ${
            loading
              ? "cursor-not-allowed bg-slate-500"
              : "bg-[#0f2747] shadow-lg shadow-[#0f2747]/20 hover:-translate-y-0.5 hover:bg-[#0b1d35] active:bg-[#08162a]"
          }`}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-8 rounded-2xl border border-amber-200/70 bg-amber-50/60 px-4 py-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Already part of the platform?</p>
        <p className="mt-1 leading-6">
          Sign in and continue with your property workflow inside AfREALTY DATAHOMES.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-700">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-amber-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
