"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import api from "@/lib/axios";
import { getDisplayName } from "@/lib/display-name";
import { useAuthStore } from "@/store/auth.store";

type ConversationPreview = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  propertyId?: string | null;
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
  property?: {
    id: string;
    title: string;
  } | null;
};

type Message = ConversationPreview;

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(searchParams.get("withUserId"));
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(searchParams.get("propertyId"));
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: ConversationPreview[] }>("/messages/conversations");
      setConversations(response.data.data ?? []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async (withUserId: string, propertyId?: string | null) => {
    setThreadLoading(true);
    try {
      const query = propertyId ? `?propertyId=${propertyId}` : "";
      const response = await api.get<{ data: Message[] }>(`/messages/conversation/${withUserId}${query}`);
      setMessages(response.data.data ?? []);
    } catch (error) {
      console.error("Failed to load thread:", error);
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void loadConversations();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedUserId) {
      void loadThread(selectedUserId, selectedPropertyId);
    }
  }, [selectedPropertyId, selectedUserId]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedUserId || !draft.trim()) {
      return;
    }

    try {
      await api.post("/messages", {
        receiverId: selectedUserId,
        propertyId: selectedPropertyId || undefined,
        content: draft,
      });
      setDraft("");
      await loadConversations();
      await loadThread(selectedUserId, selectedPropertyId);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

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
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute right-[8%] top-10 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.4fr_0.6fr]">
        <section className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
            Conversations
          </p>
          <h1 className="mt-3 font-display text-3xl text-slate-900">
            Your inbox
          </h1>

          <div className="mt-8 space-y-3">
            {loading && (
              <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                Loading conversations...
              </div>
            )}

            {!loading && conversations.length === 0 && (
              <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                No messages yet.
              </div>
            )}

            {conversations.map((conversation) => {
              const otherUser = conversation.senderId === user?.id ? conversation.receiver : conversation.sender;
              const isSelected =
                selectedUserId === otherUser.id &&
                (selectedPropertyId ?? null) === (conversation.propertyId ?? null);

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(otherUser.id);
                    setSelectedPropertyId(conversation.propertyId ?? null);
                  }}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                    isSelected
                      ? "border-teal-700 bg-teal-50"
                      : "border-slate-200/80 bg-white/80"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{getDisplayName(otherUser, "User")}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {conversation.property?.title || "General conversation"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{conversation.content}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
            Thread
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-900">
            {selectedUserId ? "Reply in context" : "Choose a conversation"}
          </h2>

          <div className="mt-8 space-y-3">
            {threadLoading && (
              <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                Loading messages...
              </div>
            )}

            {!threadLoading && selectedUserId && messages.length === 0 && (
              <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                No messages yet. Start the conversation below.
              </div>
            )}

            {!selectedUserId && (
              <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm text-slate-600">
                Pick a buyer or seller from the left to view the thread.
              </div>
            )}

            {messages.map((message) => {
              const isMine = message.senderId === user?.id;

              return (
                <div
                  key={message.id}
                  className={`rounded-[1.5rem] px-4 py-3 text-sm leading-6 ${
                    isMine ? "ml-10 bg-teal-700 text-white" : "mr-10 bg-white/80 text-slate-700"
                  }`}
                >
                  <p className="font-semibold">{isMine ? "You" : getDisplayName(message.sender, "User")}</p>
                  {message.property?.title && (
                    <p className={`mt-1 text-xs ${isMine ? "text-white/80" : "text-slate-500"}`}>
                      {message.property.title}
                    </p>
                  )}
                  <p className="mt-2">{message.content}</p>
                </div>
              );
            })}
          </div>

          {selectedUserId && (
            <form onSubmit={handleSend} className="mt-8 space-y-4">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={4}
                className="block w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3"
                placeholder="Write your reply"
              />
              <button className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                Send reply
              </button>
            </form>
          )}
        </section>
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
