"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { CalendarDays, LogOut, Settings, ShoppingBag, ShieldCheck, UserRound } from "lucide-react";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Member";

  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Profile"
        title={loading ? "Loading member profile" : `Welcome, ${displayName}`}
        description="View your account, membership shortcuts, orders, and event tools from one member area."
        image="/bullriding.jpg"
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="h-fit rounded-md border border-stone-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-md bg-orange-50 text-orange-700">
              <UserRound className="h-12 w-12" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-stone-950">{displayName}</h2>
            <p className="mt-1 break-words text-sm text-stone-600">{user?.email}</p>
            <div className="mt-6 grid gap-2">
              <Link
                href="/setting"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
              >
                <Settings className="h-4 w-4" />
                Account settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </aside>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: "Membership",
                text: "Review membership options and prepare for future digital status tracking.",
                href: "/membership",
                icon: ShieldCheck,
              },
              {
                title: "Events",
                text: "Browse the event calendar, details, and entry preparation steps.",
                href: "/events",
                icon: CalendarDays,
              },
              {
                title: "Orders",
                text: "See prototype order history and future receipts.",
                href: "/orders",
                icon: ShoppingBag,
              },
              {
                title: "Settings",
                text: "Update your display name and email verification status.",
                href: "/setting",
                icon: Settings,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Icon className="h-7 w-7 text-orange-600" />
                  <h3 className="mt-5 text-xl font-semibold text-stone-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
