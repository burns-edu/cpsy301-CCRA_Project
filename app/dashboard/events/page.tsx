"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
};

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const data = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<EventItem, "id">),
    }));
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setConfirmDeleteId(null);
      loadEvents();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl">
            ← Back
          </Link>

          <h1 className="text-3xl font-bold">Manage Events</h1>

          <Link href="/dashboard/create-event" className="text-orange-500">
            Create
          </Link>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl bg-white p-5 shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p>{event.date}</p>
                <p>{event.location}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/dashboard/edit-events/${event.id}`}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-white"
                >
                  Edit
                </Link>

                <button
                  onClick={() => setConfirmDeleteId(event.id)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-3 text-xl font-bold text-black">
              Confirm Delete
            </h2>

            <p className="mb-6 text-gray-700">
              Are you sure ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-lg bg-gray-300 px-4 py-2 text-black"
              >
                No
              </button>

              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}