"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function BuyerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore(); // for reactivity
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("[BUYER DASHBOARD] Mounted – initial render state:", {
      isAuthenticated,
      role: user?.role,
    });

    const timer = setTimeout(() => {
      // Fresh read from store to avoid stale closure issues
      const currentState = useAuthStore.getState();

      console.log("[BUYER DASHBOARD] Auth check after delay:", {
        isAuthenticated: currentState.isAuthenticated,
        role: currentState.user?.role,
      });

      if (!currentState.isAuthenticated) {
        console.log("[BUYER DASHBOARD] Not authenticated → redirecting to /login");
        router.replace("/login");
      } else {
        console.log("[BUYER DASHBOARD] Auth check passed – showing dashboard");
      }

      setIsChecking(false);
    }, 100); // small delay to allow store update to propagate

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]); // removed user?.role from deps → we don't redirect on role here anymore

  if (isChecking) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
}

  // Only render content if authenticated
  // Role check is no longer here — LoginPage already sent the correct user to the right dashboard
  if (!isAuthenticated) {
    return null; // or <div>Redirecting...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Buyer Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700 mb-4">
          Hello, {user?.email || "Buyer"}! You are successfully logged in.
        </p>
        
        {/* Your actual dashboard content goes here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example cards */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Orders</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Wishlist</h3>
            <p className="text-2xl font-bold">8</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Balance</h3>
            <p className="text-2xl font-bold">KSh 4,250</p>
          </div>
        </div>
      </div>
    </div>
  );
}
