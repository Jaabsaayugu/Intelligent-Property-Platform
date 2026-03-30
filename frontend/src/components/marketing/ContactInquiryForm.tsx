"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

type ContactFormState = {
  firstName: string;
  secondName: string;
  email: string;
  message: string;
};

const initialState: ContactFormState = {
  firstName: "",
  secondName: "",
  email: "",
  message: "",
};

export default function ContactInquiryForm() {
  const { user } = useAuthStore();
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm((current) => ({
      ...current,
      firstName: current.firstName || user.firstName || "",
      secondName: current.secondName || user.secondName || "",
      email: current.email || user.email || "",
    }));
  }, [user]);

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await api.post<{ message?: string }>("/messages/contact", form);
      setFeedbackType("success");
      setFeedback(response.data.message ?? "Your inquiry has been sent to the admin team.");
      setForm((current) => ({
        ...initialState,
        firstName: user?.firstName || "",
        secondName: user?.secondName || "",
        email: user?.email || "",
      }));
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "We could not send your inquiry right now. Please try again.";
      setFeedbackType("error");
      setFeedback(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">First name</span>
        <input
          type="text"
          value={form.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          placeholder="Your first name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Second name</span>
        <input
          type="text"
          value={form.secondName}
          onChange={(event) => updateField("secondName", event.target.value)}
          placeholder="Your second name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
        <textarea
          rows={5}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Tell us how we can help."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600"
        />
      </label>

      {feedback && (
        <div
          className={`sm:col-span-2 rounded-[1.5rem] px-4 py-3 text-sm ${
            feedbackType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-slate-950 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Sending inquiry..." : "Send inquiry"}
        </button>
      </div>
    </form>
  );
}
