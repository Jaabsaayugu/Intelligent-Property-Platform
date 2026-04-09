import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  email: string;
  firstName: string;
  secondName: string;
  role: "BUYER" | "SELLER" | "ADMIN";
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const decodeAuthToken = (token: string) =>
  jwtDecode<{
    sub?: string;
    userId?: string;
    email?: string;
    firstName?: string;
    secondName?: string;
    role?: string;
    exp?: number;
  }>(token);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string) => {
        const decoded = decodeAuthToken(token);

        if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        set({
          token,
          user: {
            id: decoded.sub || decoded.userId || "",
            email: decoded.email || "",
            firstName: decoded.firstName || "",
            secondName: decoded.secondName || "",
            role: (decoded.role || "BUYER") as "BUYER" | "SELLER" | "ADMIN",
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "auth_token=; path=/; Max-Age=0; SameSite=Strict";
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "ipppr-auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
