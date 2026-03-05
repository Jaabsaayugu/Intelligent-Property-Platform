import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface User {
  userId: string;
  role: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (token: string) => void;
  logout: () => void;
}

// useAuthStore.ts
interface JwtPayload {
  userId: string;
  role: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);

    localStorage.setItem("token", token);

    set({
      token,
      user: {
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      },
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));