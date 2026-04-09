"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AppBackdrop from "@/components/layout/AppBackdrop";
import PropertyMapPanel from "@/components/maps/PropertyMapPanel";
import api from "@/lib/axios";
import { getDisplayName } from "@/lib/display-name";
import { useAuthStore } from "@/store/auth.store";

type PropertyReview = {
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
};

type PropertyDetail = {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  address: string;
  city: string;
  county?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm?: number | null;
  yearBuilt?: number | null;
  price: number;
  currency: string;
  features: string[];
  images: string[];
  user: {
    id: string;
    email: string;
    firstName?: string;
    secondName?: string;
    role: string;
  };
  reviews: PropertyReview[];
};

type PropertyApiResponse = Omit<PropertyDetail, "reviews" | "user"> & {
  reviews?: PropertyReview[];
  user?: {
    id?: string;
    email?: string;
    firstName?: string;
    secondName?: string;
    role?: string;
  };
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    email: string;
    firstName?: string;
    secondName?: string;
    role: string;
  };
  receiver: {
    id: string;
    email: string;
    firstName?: string;
    secondName?: string;
    role: string;
  };
};

type TourRequest = {
  id: string;
  preferredDate: string;
  notes?: string | null;
  status: string;
  buyer: {
    id: string;
    email: string;
    firstName?: string;
    secondName?: string;
  };
};

type PurchaseRequest = {
  id: string;
  offerAmount?: number | null;
  message?: string | null;
  status: string;
  buyer: {
    id: string;
    email: string;
    firstName?: string;
    secondName?: string;
  };
};

export default function PropertyDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const propertyId = typeof params.id === "string" ? params.id : "";

  const [hasMounted, setHasMounted] = useState(false);
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [tourNotes, setTourNotes] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const sellerId = property?.user.id ?? "";
  const isOwner = Boolean(user && sellerId && user.id === sellerId);
  const canActAsBuyer = Boolean(
    isAuthenticated && user?.role === "BUYER" && property && sellerId && user.id !== sellerId
  );

  const loadProperty = async () => {
    if (!propertyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<PropertyApiResponse>(`/properties/${propertyId}`);
      const data = response.data;

      setProperty({
        ...data,
        user: {
          id: data.user?.id ?? "",
          email: data.user?.email ?? "Unknown seller",
          firstName: data.user?.firstName ?? "",
          secondName: data.user?.secondName ?? "",
          role: data.user?.role ?? "SELLER",
        },
        reviews: data.reviews ?? [],
      });
    } catch (fetchError) {
      console.error("Failed to load property:", fetchError);
      setError("We could not load this property right now.");
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (nextSellerId: string) => {
    setConversationLoading(true);

    try {
      const response = await api.get<{ data: Message[] }>(
        `/messages/conversation/${nextSellerId}?propertyId=${propertyId}`
      );
      setConversation(response.data.data ?? []);
    } catch (fetchError) {
      console.error("Failed to load conversation:", fetchError);
    } finally {
      setConversationLoading(false);
    }
  };

  const loadOwnerActivity = async () => {
    if (!propertyId || !isOwner) return;

    try {
      const [tourResponse, purchaseResponse] = await Promise.all([
        api.get<{ data: TourRequest[] }>(`/properties/${propertyId}/tour-requests`),
        api.get<{ data: PurchaseRequest[] }>(`/properties/${propertyId}/purchase-requests`),
      ]);

      setTourRequests(tourResponse.data.data ?? []);
      setPurchaseRequests(purchaseResponse.data.data ?? []);
    } catch (fetchError) {
      console.error("Failed to load property activity:", fetchError);
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    void loadProperty();
  }, [propertyId]);

  useEffect(() => {
    if (property && sellerId && canActAsBuyer) {
      void loadConversation(sellerId);
    }
  }, [canActAsBuyer, property, sellerId]);

  useEffect(() => {
    if (isOwner) {
      void loadOwnerActivity();
    }
  }, [isOwner, propertyId]);

  const requireBuyer = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${propertyId}`);
      return false;
    }

    if (user?.role !== "BUYER") {
      setActionMessage("Only buyers can perform that action on a listing.");
      return false;
    }

    return true;
  };

  const handleReviewSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!requireBuyer()) return;

    try {
      await api.post(`/properties/${propertyId}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment("");
      setActionMessage("Your review has been saved.");
      await loadProperty();
    } catch (submitError) {
      console.error("Failed to submit review:", submitError);
      setActionMessage("We could not save your review right now.");
    }
  };

  const handleTourSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!requireBuyer()) return;
    if (!tourDate) {
      setActionMessage("Please choose a date and time for the tour.");
      return;
    }

    try {
      await api.post(`/properties/${propertyId}/tours`, {
        preferredDate: new Date(tourDate).toISOString(),
        notes: tourNotes || undefined,
      });
      setTourDate("");
      setTourNotes("");
      setActionMessage("Your tour request has been sent to the seller.");
    } catch (submitError) {
      console.error("Failed to request tour:", submitError);
      setActionMessage("We could not send your tour request right now.");
    }
  };

  const handlePurchaseSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!requireBuyer()) return;
    if (!offerAmount && !purchaseMessage.trim()) {
      setActionMessage("Add an offer amount or a purchase message before submitting.");
      return;
    }

    try {
      await api.post(`/properties/${propertyId}/purchase-requests`, {
        offerAmount: offerAmount ? Number(offerAmount) : undefined,
        message: purchaseMessage || undefined,
      });
      setOfferAmount("");
      setPurchaseMessage("");
      setActionMessage("Your purchase request has been sent to the seller.");
    } catch (submitError) {
      console.error("Failed to send purchase request:", submitError);
      setActionMessage("We could not send your purchase request right now.");
    }
  };

  const handleMessageSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!requireBuyer() || !property) return;
    if (!messageDraft.trim()) {
      setActionMessage("Please write a message before sending.");
      return;
    }

    try {
      await api.post("/messages", {
        receiverId: property.user.id,
        propertyId,
        content: messageDraft.trim(),
      });
      setMessageDraft("");
      setActionMessage("Your message has been sent.");
      await loadConversation(sellerId);
    } catch (submitError) {
      console.error("Failed to send message:", submitError);
      setActionMessage("We could not send your message right now.");
    }
  };

  if (!hasMounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#0f2747]" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          {error || "Property not found."}
        </div>
      </main>
    );
  }

  const reviews = property.reviews ?? [];
  const fullAddress = [property.address, property.city, property.county].filter(Boolean).join(", ");

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <AppBackdrop />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <section className="hero-panel rounded-[2rem] border border-white/60 px-6 py-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#17365d]/80">
                Property details
              </p>
              <h1 className="mt-4 font-display text-4xl leading-none text-slate-900 sm:text-5xl">
                {property.title}
              </h1>
              <p className="mt-5 text-lg font-semibold text-[#0f2747]">
                {property.currency} {property.price.toLocaleString()}
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                {property.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl bg-white/75 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
                  <p className="mt-2 font-semibold text-slate-900">{fullAddress}</p>
                </div>
                <div className="rounded-3xl bg-white/75 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Type</p>
                  <p className="mt-2 font-semibold capitalize text-slate-900">{property.propertyType}</p>
                </div>
                <div className="rounded-3xl bg-white/75 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Bedrooms</p>
                  <p className="mt-2 font-semibold text-slate-900">{property.bedrooms ?? "N/A"}</p>
                </div>
                <div className="rounded-3xl bg-white/75 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Bathrooms</p>
                  <p className="mt-2 font-semibold text-slate-900">{property.bathrooms ?? "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {(property.images ?? []).slice(0, 2).map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className="h-56 w-full rounded-[1.75rem] object-cover shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]"
                />
              ))}
            </div>
          </div>
        </section>

        <PropertyMapPanel
          title={property.title}
          address={fullAddress}
          latitude={property.latitude}
          longitude={property.longitude}
        />

        {actionMessage && (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {actionMessage}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#17365d]/80">
                Seller
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-900">
                Contact and trust
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Seller: {getDisplayName(property.user, "Seller")}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Listing status: <span className="capitalize">{property.status}</span>
              </p>

              {(canActAsBuyer || isOwner) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={
                      isOwner
                        ? "/messages"
                        : `/messages?withUserId=${property.user.id}&propertyId=${property.id}`
                    }
                    className="rounded-full bg-[#0f2747] px-5 py-3 text-sm font-semibold text-white"
                  >
                    {isOwner ? "Open seller inbox" : "Open full message center"}
                  </Link>
                </div>
              )}
            </div>

            <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#17365d]/80">
                Reviews
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-900">
                What buyers are saying
              </h2>

              <div className="mt-8 space-y-4">
                {reviews.length === 0 && (
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 text-sm text-slate-600">
                    No reviews yet for this property.
                  </div>
                )}

                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-slate-900">{getDisplayName(review.user, "Buyer")}</p>
                      <p className="text-sm font-semibold text-amber-600">
                        {review.rating}/5
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>

              {canActAsBuyer && (
                <form onSubmit={handleReviewSubmit} className="mt-8 space-y-4 rounded-[1.5rem] bg-white/80 p-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(event) => setReviewRating(Number(event.target.value))}
                      className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} star{rating === 1 ? "" : "s"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      rows={4}
                      className="mt-2 block w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                    />
                  </div>
                  <button className="rounded-full bg-[#0f2747] px-5 py-3 text-sm font-semibold text-white">
                    Save review
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {canActAsBuyer && (
              <>
                <form onSubmit={handleTourSubmit} className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#17365d]/80">
                    Tour planning
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-slate-900">
                    Book a visit
                  </h2>
                  <div className="mt-6 space-y-4">
                    <input
                      type="datetime-local"
                      value={tourDate}
                      onChange={(event) => setTourDate(event.target.value)}
                      className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                    />
                    <textarea
                      value={tourNotes}
                      onChange={(event) => setTourNotes(event.target.value)}
                      rows={3}
                      placeholder="Any timing notes or questions for the seller"
                      className="block w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                    />
                    <button className="rounded-full bg-[#0f2747] px-5 py-3 text-sm font-semibold text-white">
                      Request tour
                    </button>
                  </div>
                </form>

                <form onSubmit={handlePurchaseSubmit} className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#17365d]/80">
                    Purchase booking
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-slate-900">
                    Start your purchase request
                  </h2>
                  <div className="mt-6 space-y-4">
                    <input
                      type="number"
                      value={offerAmount}
                      onChange={(event) => setOfferAmount(event.target.value)}
                      placeholder="Offer amount"
                      className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                    />
                    <textarea
                      value={purchaseMessage}
                      onChange={(event) => setPurchaseMessage(event.target.value)}
                      rows={3}
                      placeholder="Share financing, timelines, or purchase notes"
                      className="block w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                    />
                    <button className="rounded-full bg-[#0f2747] px-5 py-3 text-sm font-semibold text-white">
                      Send purchase request
                    </button>
                  </div>
                </form>

                <form onSubmit={handleMessageSubmit} className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#17365d]/80">
                    Buyer and seller chat
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-slate-900">
                    Message the seller
                  </h2>

                  <div className="mt-6 space-y-3">
                    {conversationLoading && (
                      <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                        Loading messages...
                      </div>
                    )}

                    {!conversationLoading && conversation.length === 0 && (
                      <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                        No messages yet for this property. Start the conversation here.
                      </div>
                    )}

                    {conversation.map((message) => {
                      const isCurrentUser = message.senderId === user?.id;

                      return (
                        <div
                          key={message.id}
                          className={`rounded-[1.5rem] px-4 py-3 text-sm leading-6 ${
                            isCurrentUser
                              ? "ml-8 bg-[#0f2747] text-white"
                              : "mr-8 bg-white/80 text-slate-700"
                          }`}
                        >
                          <p className="font-semibold">
                            {isCurrentUser ? "You" : getDisplayName(message.sender, "Seller")}
                          </p>
                          <p className="mt-1">{message.content}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 space-y-4">
                    <textarea
                      value={messageDraft}
                      onChange={(event) => setMessageDraft(event.target.value)}
                      rows={3}
                      placeholder="Ask about availability, payment terms, or the neighborhood"
                      className="block w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0f2747] focus:ring-4 focus:ring-[#dbe7f7]"
                    />
                    <button className="rounded-full bg-[#0f2747] px-5 py-3 text-sm font-semibold text-white">
                      Send message
                    </button>
                  </div>
                </form>
              </>
            )}

            {isOwner && (
              <>
                <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#17365d]/80">
                        Tour requests
                      </p>
                      <h2 className="mt-3 font-display text-3xl text-slate-900">
                        Buyer visits
                      </h2>
                    </div>
                    <Link
                      href="/messages"
                      className="rounded-full bg-[#0f2747] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Open inbox
                    </Link>
                  </div>
                  <div className="mt-6 space-y-3">
                    {tourRequests.length === 0 && (
                      <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                        No tours have been requested yet.
                      </div>
                    )}
                    {tourRequests.map((request) => (
                      <div key={request.id} className="rounded-[1.5rem] bg-white/80 p-4">
                        <p className="font-semibold text-slate-900">{getDisplayName(request.buyer, "Buyer")}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          Preferred date: {new Date(request.preferredDate).toLocaleString()}
                        </p>
                        {request.notes && <p className="mt-2 text-sm text-slate-600">{request.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#17365d]/80">
                    Purchase requests
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-slate-900">
                    Buyer intent
                  </h2>
                  <div className="mt-6 space-y-3">
                    {purchaseRequests.length === 0 && (
                      <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                        No purchase requests have been submitted yet.
                      </div>
                    )}
                    {purchaseRequests.map((request) => (
                      <div key={request.id} className="rounded-[1.5rem] bg-white/80 p-4">
                        <p className="font-semibold text-slate-900">{getDisplayName(request.buyer, "Buyer")}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          Offer: {request.offerAmount ? `${property.currency} ${request.offerAmount.toLocaleString()}` : "Not specified"}
                        </p>
                        {request.message && <p className="mt-2 text-sm text-slate-600">{request.message}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
