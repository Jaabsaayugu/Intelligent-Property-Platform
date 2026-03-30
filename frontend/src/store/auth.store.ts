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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string) => {
        const decoded = jwtDecode<{
          sub?: string;
          userId?: string;
          email?: string;
          firstName?: string;
          secondName?: string;
          role?: string;
        }>(token);
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
      partialize: (state) => ({ token: state.token }), // only persist token
    }
  )
);
