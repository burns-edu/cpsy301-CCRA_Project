"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
      } else {
        setUser(currentUser);
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";

  const email = user?.email || "No email";

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <header className="border-b border-gray-300 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="text-3xl text-black">
            ←
          </Link>

          <h1 className="text-2xl font-medium text-black sm:text-3xl">CCRA</h1>

          <div className="w-8" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title */}
        <section>
          <h2 className="text-3xl font-normal text-black sm:text-4xl md:text-5xl">
            Profile
          </h2>
        </section>

        {/* Top profile section */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-orange-500 text-5xl sm:h-44 sm:w-44 sm:text-6xl">
              👤
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-black sm:text-3xl">
              {displayName}
            </h3>

            <p className="mt-2 text-base text-gray-700 sm:text-lg">{email}</p>

            <button className="mt-6 rounded-full bg-[#eadbc9] px-8 py-3 text-base text-black sm:px-10 sm:text-lg">
              ✏ Edit
            </button>
          </div>
        </section>

        {/* Info cards */}
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/membership"
            className="flex items-center justify-between rounded-2xl bg-[#f1ede9] px-5 py-5 transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl text-orange-500 sm:text-4xl">💳</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 sm:text-2xl">
                  Membership
                </h3>
                <p className="text-sm text-gray-500 sm:text-base">Status</p>
              </div>
            </div>
            <span className="text-3xl text-gray-400">›</span>
          </Link>

          <Link
            href="/events"
            className="flex items-center justify-between rounded-2xl bg-[#f1ede9] px-5 py-5 transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl text-orange-500 sm:text-4xl">📅</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 sm:text-2xl">
                  Events
                </h3>
                <p className="text-sm text-gray-500 sm:text-base">
                  Event Status
                </p>
              </div>
            </div>
            <span className="text-3xl text-gray-400">›</span>
          </Link>

          <Link
            href="/orders"
            className="flex items-center justify-between rounded-2xl bg-[#f1ede9] px-5 py-5 transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl text-orange-500 sm:text-4xl">🛍️</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 sm:text-2xl">
                  Orders
                </h3>
                <p className="text-sm text-gray-500 sm:text-base">2 Order</p>
              </div>
            </div>
            <span className="text-3xl text-gray-400">›</span>
          </Link>
        </section>

        {/* Logout */}
        <section className="mt-10 pb-10">
          <button
            onClick={handleLogout}
            className="w-full rounded-full bg-orange-500 py-4 text-lg text-white sm:text-xl"
          >
            Log Out
          </button>
        </section>
      </div>
    </main>
  );
}