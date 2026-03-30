import axios from "axios";
import { useAuthStore } from "@/store/auth.store"; // ← import the store creator

// This is the key: use the store object directly (no parentheses = no hook call)
const authStore = useAuthStore;

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = authStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 → logout + redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout();

      // Only redirect if we're in the browser (avoids SSR crashes)
      if (typeof window !== "undefined") {
        // Optional: avoid redirect loop if already on login
        if (!window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/auth/login")) {
          window.location.href = "/login?session=expired";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
