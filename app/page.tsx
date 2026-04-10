"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description?: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);

  const menuItems = [
    { name: "Profile", href: "/navigation/profile", icon: "👤" },
    { name: "Schedule", href: "/schedule", icon: "🕒" },
    { name: "Membership", href: "/membership", icon: "➕" },
    { name: "Products", href: "/products", icon: "🛍️" },
    { name: "Board of Director", href: "/board-of-director", icon: "👥" },
    { name: "Results", href: "/results", icon: "📊" },
    { name: "Photo Gallery", href: "/photo-gallery", icon: "🖼️" },
    { name: "Rulebook", href: "/rulebook", icon: "📖" },
    { name: "Cart", href: "/cart", icon: "🛒" },
    { name: "Contact", href: "/contact", icon: "📔" },
    { name: "Setting", href: "/setting", icon: "⚙️" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);

      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const eventList: EventItem[] = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<EventItem, "id">),
        }));

        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen w-full bg-white">
      <section className="relative min-h-screen w-full overflow-hidden">
        <Image
          src="/hero-rodeo.png"
          alt="Rodeo hero"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {user ? (
              <button
                onClick={() => setMenuOpen(true)}
                className="rounded-md p-2 text-3xl text-white"
              >
                ☰
              </button>
            ) : (
              <div />
            )}

            {loadingUser ? null : !user ? (
              <Link
                href="/sign-in"
                className="rounded-xl bg-orange-500 px-5 py-2 text-sm text-white shadow-md sm:px-6 sm:py-3 sm:text-base"
              >
                Sign in
              </Link>
            ) : isAdmin ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-orange-500 px-5 py-2 text-sm text-white shadow-md sm:px-6 sm:py-3 sm:text-base"
              >
                Dashboard
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-auto max-w-3xl pb-16 text-white sm:pb-20">
            <div className="flex flex-wrap items-end gap-3">
              <h1 className="text-5xl font-light sm:text-6xl md:text-7xl">
                Welcome
              </h1>

              {user && (
                <p className="mb-2 text-base sm:text-lg">
                  ({user.displayName || user.email})
                </p>
              )}
            </div>

            <h2 className="mt-4 text-2xl leading-snug sm:text-3xl md:text-4xl">
              Canadian Classic Rodeo Association
            </h2>

            {!user && !loadingUser && (
              <div className="mt-6">
                <Link
                  href="/sign-up"
                  className="inline-block rounded-xl bg-orange-500 px-5 py-3 text-base text-white shadow-md sm:px-6 sm:text-lg"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div
            className={`fixed inset-0 z-50 transition ${
              menuOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div
              className={`absolute inset-0 bg-black/40 transition-opacity ${
                menuOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setMenuOpen(false)}
            />

            <div
              className={`absolute left-0 top-0 h-full w-[85%] max-w-[420px] overflow-y-auto bg-[#f7f7f7] shadow-xl transition-transform duration-300 ${
                menuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between px-6 py-6">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl text-black"
                >
                  ☰
                </button>
              </div>

              <nav className="space-y-1 pb-6">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-5 px-6 py-5 text-2xl text-black hover:bg-[#e9dfd7] ${
                      index === 0 ? "bg-[#e9dfd7]" : ""
                    }`}
                  >
                    <span className="text-3xl text-orange-500">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </section>

      <section className="bg-[#f5f5f5] py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-medium sm:text-4xl">
            Upcoming Events →
          </h2>

          {events.length === 0 ? (
            <p className="text-gray-600">No events yet.</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {events.map((event) => (
                <div
                key={event.id}
                className="min-w-[280px] max-w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-[#ece7df] shadow">
                  <div className="relative h-48 w-full">
                    <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    unoptimized={event.image.startsWith("http")}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{event.date}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    
                    <Link
                    href="/events"
                    className="mt-4 inline-block rounded-xl bg-orange-500 px-4 py-2 text-white">
                    Details
                    </Link>
                  </div>
             </div>
            ))}
        </div>
      )}
  </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Why Join CCRA?</h2>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl bg-[#f4efef] p-6 text-center">
        <div className="mb-4 text-4xl text-orange-500">🏅</div>
        <h3 className="text-lg font-semibold">Membership Benefits</h3>
        <p className="mt-2 text-sm leading-7 text-gray-600">
          Access exclusive perks and member resources.
        </p>
      </div>

      <div className="rounded-xl bg-[#f4efef] p-6 text-center">
        <div className="mb-4 text-4xl text-orange-500">🏆</div>
        <h3 className="text-lg font-semibold">Compete & Rankings</h3>
        <p className="mt-2 text-sm leading-7 text-gray-600">
          Join competitions and track your rankings.
        </p>
      </div>

      <div className="rounded-xl bg-[#f4efef] p-6 text-center">
        <div className="mb-4 text-4xl text-orange-500">👥</div>
        <h3 className="text-lg font-semibold">Community & Updates</h3>
        <p className="mt-2 text-sm leading-7 text-gray-600">
          Connect with members and stay updated.
        </p>
            </div>
          </div>

          <h3 className="mt-12 mb-6 text-2xl font-bold">Our Sponsors</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="h-45 rounded-xl bg-[#eee7e4]" />
            <div className="h-45 rounded-xl bg-[#eee7e4]" />
            <div className="h-45 rounded-xl bg-[#eee7e4]" />
            <div className="h-45 rounded-xl bg-[#eee7e4]" />
            <div className="h-45 rounded-xl bg-[#eee7e4]" />
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#faf7f5] p-8 shadow-sm">
            <h2 className="text-3xl font-bold sm:text-4xl">Become a Sponsor</h2>
            <p className="mt-3 text-lg text-gray-700">
              Support Canadian rodeo and promote your brand.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-block rounded-2xl bg-orange-500 px-6 py-3 text-white"
            >
              Become a Sponsor
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#e6dddd] py-10">
        <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-[0.3em] sm:text-5xl">CCRA</h2>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-base sm:gap-10 sm:text-lg">
            <Link href="/about">About</Link>
            <Link href="/events">Events</Link>
            <Link href="/membership">Membership</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-3xl text-[#8f6b47] sm:text-4xl">
            <span>◎</span>
            <span>f</span>
            <span>𝕏</span>
          </div>
        </div>
      </footer>
    </main>
  );
}