"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async (currentUser: User) => {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || userSnap.data().role !== "admin") {
        router.push("/");
        return false;
      }

      return true;
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      try {
        const allowed = await checkAdmin(currentUser);
        if (!allowed) return;

        setUser(currentUser);

        const eventSnap = await getDocs(collection(db, "events"));
        setTotalEvents(eventSnap.size);
        setCheckingAccess(false);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="rounded-xl px-3 py-2 text-lg font-medium text-black transition hover:bg-[#f4efef]"
          >
            ← Back
          </Link>

          <h1 className="text-2xl font-bold text-black sm:text-3xl">
            Dashboard
          </h1>

          <div className="w-20" />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-gradient-to-r from-[#2d1d12] via-[#7a4d21] to-[#e38b2c] p-8 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-white/80">
            Admin Panel
          </p>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Welcome back
              </h2>
              <p className="mt-2 text-base text-white/90 sm:text-lg">
                {user?.displayName || user?.email || "Admin"}
              </p>
            </div>

            <Link
              href="/dashboard/create-event"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#7a4d21] shadow-md transition hover:scale-[1.02]"
            >
              + Create New Event
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-gray-500">Admin User</p>
            <h3 className="mt-3 text-2xl font-bold text-black break-words">
              {user?.displayName || user?.email || "Admin"}
            </h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-gray-500">Total Events</p>
            <h3 className="mt-3 text-5xl font-bold text-orange-500">
              {totalEvents}
            </h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <h3 className="mt-3 text-2xl font-bold text-black">
              Event Management
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Create, edit, and manage rodeo events.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Link
            href="/dashboard/create-event"
            className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                📝
              </div>
              <span className="text-2xl text-gray-400 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-bold text-black">
              Create Event
            </h3>
            <p className="mt-2 text-gray-600">
              Add a new event with details, location, and image.
            </p>
          </Link>

          <Link
            href="/dashboard/events"
            className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                📅
              </div>
              <span className="text-2xl text-gray-400 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-bold text-black">
              Manage Events
            </h3>
            <p className="mt-2 text-gray-600">
              View all events, edit details, or delete old events.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}