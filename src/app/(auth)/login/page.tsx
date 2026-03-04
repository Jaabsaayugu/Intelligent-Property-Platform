"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

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

      // Save token & user info to Zustand store
      login(token);

      // Optional: store token in cookie/httpOnly for SSR protection (advanced)
      // document.cookie = `auth_token=${token}; path=/; max-age=3600; SameSite=Strict`;

      // Redirect based on role (you can get role from decoded token or from response)
      const decoded = JSON.parse(atob(token.split(".")[1])); // simple jwt decode
      const role = decoded.role?.toLowerCase();

      if (role === "buyer") {
        router.push("/buyer/dashboard");
      } else if (role === "seller") {
        router.push("/seller/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/"); // fallback
      }
    } catch (err) {                  // ← no type = unknown in strict mode
  let message = "Login failed";

  if (err instanceof Error) {
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
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-gray-600">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white 
            transition-colors duration-200
            ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-indigo-600 font-medium hover:underline"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
}