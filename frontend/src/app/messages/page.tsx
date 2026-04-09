"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AppBackdrop from "@/components/layout/AppBackdrop";
import MessageWorkspace from "@/components/messages/MessageWorkspace";
import { useAuthStore } from "@/store/auth.store";

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-700">
          Please sign in to view messages.
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <AppBackdrop />

      <div className="relative mx-auto max-w-7xl">
        <MessageWorkspace
          initialUserId={searchParams.get("withUserId")}
          initialPropertyId={searchParams.get("propertyId")}
        />
      </div>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<main className="px-6 py-12 text-sm text-slate-600">Loading messages...</main>}>
      <MessagesPageContent />
    </Suspense>
  );
}
