"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function SessionBootstrap() {
  useEffect(() => {
    const { token, isAuthenticated, login, logout } = useAuthStore.getState();

    if (!token) {
      return;
    }

    if (!isAuthenticated) {
      try {
        login(token);
      } catch {
        logout();
      }
    }
  }, []);

  return null;
}
