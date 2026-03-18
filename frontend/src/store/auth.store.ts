import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  email: string;
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
        const decoded = jwtDecode<{ sub: string; email: string; role: string }>(token);
        set({
          token,
          user: {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role as "BUYER" | "SELLER" | "ADMIN",
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "ipppr-auth-storage",
      partialize: (state) => ({ token: state.token }), // only persist token
    }
  )
);