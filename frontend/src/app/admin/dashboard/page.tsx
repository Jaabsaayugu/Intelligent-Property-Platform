"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getDisplayName } from "@/lib/display-name";
import api from "@/lib/axios";
import AppBackdrop from "@/components/layout/AppBackdrop";

type AdminReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    secondName?: string;
  };
  property: {
    id: string;
    title: string;
    city: string;
  };
};

type AdminMessage = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  propertyId?: string | null;
  sender: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    secondName?: string;
  };
  receiver: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    secondName?: string;
  };
  property?: {
    id: string;
    title: string;
  } | null;
};

type ContactInquiry = {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  message: string;
  createdAt: string;
};

type ManagedProperty = {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  status: string;
  propertyType: string;
  price: number;
  currency: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    secondName?: string;
  };
};

type PropertyEditForm = {
  title: string;
  description: string;
  address: string;
  city: string;
  status: string;
  propertyType: string;
  price: string;
};

const createEditForm = (property: ManagedProperty): PropertyEditForm => ({
  title: property.title,
  description: property.description,
  address: property.address,
  city: property.city,
  status: property.status,
  propertyType: property.propertyType,
  price: String(property.price),
});

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [properties, setProperties] = useState<ManagedProperty[]>([]);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propertyForm, setPropertyForm] = useState<PropertyEditForm | null>(null);
  const [savingProperty, setSavingProperty] = useState(false);

  const loadDashboardData = async () => {
    setRefreshing(true);
    setDashboardError(null);

    try {
      const [reviewResponse, messageResponse, inquiryResponse, propertyResponse] = await Promise.all([
        api.get<{ data: AdminReview[] }>("/reviews"),
        api.get<{ data: AdminMessage[] }>("/messages/all"),
        api.get<{ data: ContactInquiry[] }>("/messages/contact-inquiries"),
        api.get<{ data: ManagedProperty[] }>("/properties?limit=100"),
      ]);

      setReviews(reviewResponse.data.data ?? []);
      setMessages(messageResponse.data.data ?? []);
      setInquiries(inquiryResponse.data.data ?? []);
      setProperties(propertyResponse.data.data ?? []);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      setDashboardError("We could not load the latest admin dashboard data.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const state = useAuthStore.getState();

      if (!state.isAuthenticated || state.user?.role?.toLowerCase() !== "admin") {
        router.replace("/login?redirect=/admin/dashboard");
      } else {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (useAuthStore.getState().user?.role === "ADMIN") {
      void loadDashboardData();
    }
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((current) => current.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Failed to delete review:", error);
      setDashboardError("We could not delete that review right now.");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await api.delete(`/messages/${messageId}`);
      setMessages((current) => current.filter((message) => message.id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
      setDashboardError("We could not delete that message right now.");
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    try {
      await api.delete(`/messages/contact-inquiries/${inquiryId}`);
      setInquiries((current) => current.filter((inquiry) => inquiry.id !== inquiryId));
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      setDashboardError("We could not delete that contact inquiry right now.");
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await api.delete(`/properties/${propertyId}`);
      setProperties((current) => current.filter((property) => property.id !== propertyId));
      if (editingPropertyId === propertyId) {
        setEditingPropertyId(null);
        setPropertyForm(null);
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      setDashboardError("We could not delete that property right now.");
    }
  };

  const startEditingProperty = (property: ManagedProperty) => {
    setEditingPropertyId(property.id);
    setPropertyForm(createEditForm(property));
  };

  const handlePropertySave = async (event: FormEvent) => {
    event.preventDefault();

    if (!editingPropertyId || !propertyForm) {
      return;
    }

    setSavingProperty(true);

    try {
      const response = await api.put<ManagedProperty>(`/properties/${editingPropertyId}`, {
        ...propertyForm,
        price: Number(propertyForm.price),
      });

      setProperties((current) =>
        current.map((property) =>
          property.id === editingPropertyId
            ? {
                ...property,
                ...response.data,
                user: response.data.user ?? property.user,
              }
            : property
        )
      );
      setEditingPropertyId(null);
      setPropertyForm(null);
    } catch (error) {
      console.error("Failed to update property:", error);
      setDashboardError("We could not save that property right now.");
    } finally {
      setSavingProperty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-teal-700" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role?.toLowerCase() !== "admin") {
    return null;
  }

  const stats = [
    { title: "Reviews", value: String(reviews.length), detail: "Public feedback to moderate" },
    { title: "Messages", value: String(messages.length), detail: "Buyer, seller, and admin-visible chat records" },
    { title: "Inquiries", value: String(inquiries.length), detail: "Contact page submissions sent to admins" },
    { title: "Properties", value: String(properties.length), detail: "Listings you can edit or remove" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <AppBackdrop photoUrl="https://images.pexels.com/photos/17999591/pexels-photo-17999591.jpeg" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-4 flex justify-end">
          <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-medium text-slate-700">
              Welcome back, <span className="font-semibold text-slate-900">{getDisplayName(user, "administrator")}</span>
            </p>
            <button
              onClick={logout}
              className="rounded-full border border-slate-900/10 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>

        <header className="hero-panel rounded-[2rem] border border-white/60 px-6 py-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
                Admin Dashboard
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none text-slate-900 sm:text-5xl">
                Moderate reviews, messages,
                <span className="block text-teal-700">contact inquiries, and live listings.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                You can now monitor communication across the marketplace and edit or
                delete seller listings directly.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-start lg:justify-end">
            <button
              onClick={() => void loadDashboardData()}
              className="rounded-full bg-[#0f2747] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b1d35]"
            >
              {refreshing ? "Refreshing..." : "Refresh dashboard"}
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-3xl bg-white/75 px-5 py-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)]"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{stat.title}</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-700">{stat.detail}</p>
              </div>
            ))}
          </div>
        </header>

        {dashboardError && (
          <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {dashboardError}
          </div>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              Review moderation
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">Buyer reviews</h2>
            <div className="mt-8 space-y-4">
              {reviews.length === 0 && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4 text-sm text-slate-600">
                  No reviews are waiting right now.
                </div>
              )}
              {reviews.map((review) => (
                <div key={review.id} className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{review.property.title}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        {getDisplayName(review.user, "Buyer")} • {review.property.city}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => void handleDeleteReview(review.id)}
                      className="text-sm font-semibold text-rose-700 hover:underline"
                    >
                      Delete review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              Contact inbox
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">Contact page inquiries</h2>
            <div className="mt-8 space-y-4">
              {inquiries.length === 0 && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4 text-sm text-slate-600">
                  No contact inquiries have been submitted yet.
                </div>
              )}
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {inquiry.firstName} {inquiry.secondName}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{inquiry.email}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{inquiry.message}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {new Date(inquiry.createdAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => void handleDeleteInquiry(inquiry.id)}
                      className="text-sm font-semibold text-rose-700 hover:underline"
                    >
                      Delete inquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
            Message oversight
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-900">Buyer and seller messages</h2>
          <div className="mt-8 grid gap-4 xl:grid-cols-2">
            {messages.length === 0 && (
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4 text-sm text-slate-600">
                No messages have been exchanged yet.
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>{getDisplayName(message.sender, "Sender")}</span>
                  <span>→</span>
                  <span>{getDisplayName(message.receiver, "Receiver")}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {message.sender.role.toLowerCase()} to {message.receiver.role.toLowerCase()}
                  </span>
                </div>
                {message.property?.title && (
                  <p className="mt-3 text-sm font-semibold text-teal-700">{message.property.title}</p>
                )}
                <p className="mt-3 text-sm leading-7 text-slate-600">{message.content}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => void handleDeleteMessage(message.id)}
                    className="text-sm font-semibold text-rose-700 hover:underline"
                  >
                    Delete message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              Property management
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">Live seller listings</h2>
            <div className="mt-8 space-y-4">
              {properties.length === 0 && (
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4 text-sm text-slate-600">
                  No seller properties were found.
                </div>
              )}
              {properties.map((property) => (
                <div key={property.id} className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-5 py-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{property.title}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Seller: {getDisplayName(property.user, "Seller")} • {property.city}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {property.currency} {property.price.toLocaleString()} • {property.propertyType} •{" "}
                        <span className="capitalize">{property.status}</span>
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{property.description}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditingProperty(property)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Edit property
                      </button>
                      <button
                        onClick={() => void handleDeleteProperty(property.id)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              Property editor
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              {editingPropertyId ? "Edit the selected property" : "Choose a property to edit"}
            </h2>

            {!editingPropertyId || !propertyForm ? (
              <div className="mt-8 rounded-[1.5rem] bg-white/80 px-5 py-4 text-sm leading-7 text-slate-600">
                Select any seller listing from the left to update its title, pricing, address,
                type, status, or description.
              </div>
            ) : (
              <form onSubmit={handlePropertySave} className="mt-8 space-y-4">
                <input
                  value={propertyForm.title}
                  onChange={(event) => setPropertyForm((current) => current ? { ...current, title: event.target.value } : current)}
                  placeholder="Title"
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                />
                <textarea
                  rows={4}
                  value={propertyForm.description}
                  onChange={(event) => setPropertyForm((current) => current ? { ...current, description: event.target.value } : current)}
                  placeholder="Description"
                  className="block w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3"
                />
                <input
                  value={propertyForm.address}
                  onChange={(event) => setPropertyForm((current) => current ? { ...current, address: event.target.value } : current)}
                  placeholder="Address"
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={propertyForm.city}
                    onChange={(event) => setPropertyForm((current) => current ? { ...current, city: event.target.value } : current)}
                    placeholder="City"
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                  <input
                    value={propertyForm.price}
                    onChange={(event) => setPropertyForm((current) => current ? { ...current, price: event.target.value } : current)}
                    placeholder="Price"
                    type="number"
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={propertyForm.propertyType}
                    onChange={(event) => setPropertyForm((current) => current ? { ...current, propertyType: event.target.value } : current)}
                    placeholder="Property type"
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                  <input
                    value={propertyForm.status}
                    onChange={(event) => setPropertyForm((current) => current ? { ...current, status: event.target.value } : current)}
                    placeholder="Status"
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={savingProperty}
                    className="rounded-full bg-[#0f2747] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingProperty ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPropertyId(null);
                      setPropertyForm(null);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
