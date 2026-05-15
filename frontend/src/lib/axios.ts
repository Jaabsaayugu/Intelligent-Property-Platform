import axios from "axios";
import { getApiBaseUrl } from "@/lib/api-url";
import { useAuthStore } from "@/store/auth.store";

const authStore = useAuthStore;

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout();

      if (typeof window !== "undefined") {
        if (
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/auth/login")
        ) {
          window.location.href = "/login?session=expired";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
