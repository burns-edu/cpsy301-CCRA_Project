"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description?: string;
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const router = useRouter();

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const eventList: EventItem[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<EventItem, "id">),
      }));

      setEvents(eventList);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          router.push("/");
          return;
        }

        const userData = userSnap.data();

        if (userData.role !== "admin") {
          router.push("/");
          return;
        }

        setUser(currentUser);
        setCheckingAccess(false);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!checkingAccess) {
      fetchEvents();
    }
  }, [checkingAccess]);

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await addDoc(collection(db, "events"), {
        title,
        date,
        location,
        image,
        description,
        createdAt: serverTimestamp(),
        createdBy: user?.email || "",
      });

      setTitle("");
      setDate("");
      setLocation("");
      setImage("");
      setDescription("");
      setMessage("Event created successfully.");
      fetchEvents();
    } catch (error) {
      console.error(error);
      setMessage("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-lg text-gray-600">Checking admin access...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <header className="border-b border-gray-300 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="text-3xl text-black">
            ←
          </Link>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Admin</p>
            <h2 className="mt-2 text-2xl font-bold text-black">
              {user?.displayName || user?.email || "Admin"}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Events</p>
            <h2 className="mt-2 text-4xl font-bold text-orange-500">
              {loadingEvents ? "..." : events.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Dashboard</p>
            <h2 className="mt-2 text-2xl font-bold text-black">
              Event Management
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-bold text-black">Create Event</h2>
            <p className="mt-2 text-gray-600">
              Add a new event and it will appear on the site automatically.
            </p>

            <form onSubmit={handleCreateEvent} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Calgary Bull"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="June 5-10, 2026"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Calgary, AB"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/event1.jpg or https://example.com/image.jpg"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event details..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {message && (
                <p className="rounded-xl bg-[#f4efef] px-4 py-3 text-sm text-gray-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-3 text-white disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-black">All Events</h2>
              <Link
                href="/events"
                className="text-sm font-medium text-orange-500"
              >
                View page
              </Link>
            </div>

            {loadingEvents ? (
              <p className="mt-6 text-gray-600">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="mt-6 text-gray-600">No events yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-gray-200 p-4"
                  >
                    <h3 className="text-lg font-semibold text-black">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{event.date}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-700">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}