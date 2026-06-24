"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import {
  CalendarDays,
  Edit3,
  Home,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { useAdminAccess } from "@/lib/use-admin-access";

export default function DashboardPage() {
  const { user, checkingAccess } = useAdminAccess();
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSponsors, setTotalSponsors] = useState(0);

  useEffect(() => {
    if (checkingAccess) return;

    let active = true;

    void (async () => {
      try {
        const [eventSnap, productSnap, sponsorSnap] = await Promise.all([
          getDocs(collection(db, "events")),
          getDocs(collection(db, "products")),
          getDocs(collection(db, "sponsors")),
        ]);

        if (active) {
          setTotalEvents(eventSnap.size);
          setTotalProducts(productSnap.size);
          setTotalSponsors(sponsorSnap.size);
        }
      } catch {
        // stats unavailable — rules not yet deployed
      }
    })();

    return () => { active = false; };
  }, [checkingAccess]);

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <p className="text-stone-600">Checking dashboard access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
            <Home className="h-4 w-4" />
            Site
          </Link>
          <h1 className="text-xl font-semibold text-stone-950 sm:text-2xl">Admin Dashboard</h1>
          <div className="hidden w-20 sm:block" />
        </div>
      </header>

      {/* Banner */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-stone-950 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">CCRA Admin</p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold sm:text-4xl">Site operations</h2>
              <p className="mt-2 text-stone-300">{user?.displayName || user?.email}</p>
            </div>
            <Link
              href="/dashboard/create-event"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Create event
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-8 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-8">
        {[
          { label: "Admin", value: user?.displayName || user?.email || "Admin", icon: ShieldCheck },
          { label: "Live events", value: String(totalEvents), icon: CalendarDays },
          { label: "Products", value: String(totalProducts), icon: ShoppingBag },
          { label: "Sponsors", value: String(totalSponsors), icon: Star },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
              <Icon className="h-6 w-6 text-orange-600" />
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">{item.label}</p>
              <h3 className="mt-2 break-words text-2xl font-semibold text-stone-950">{item.value}</h3>
            </div>
          );
        })}
      </section>

      {/* Events section */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Events</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/dashboard/create-event"
            className="rounded-md border border-stone-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
          >
            <Plus className="h-7 w-7 text-orange-600" />
            <h3 className="mt-5 text-xl font-semibold text-stone-950">Create event</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Add title, date, time, location, description, and a cover image.
            </p>
          </Link>
          <Link
            href="/dashboard/events"
            className="rounded-md border border-stone-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
          >
            <Edit3 className="h-7 w-7 text-orange-600" />
            <h3 className="mt-5 text-xl font-semibold text-stone-950">Manage events</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Review, edit, and remove events from the public event pages.
            </p>
          </Link>
        </div>
      </section>

      {/* Products section */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Products</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/dashboard/create-product"
            className="rounded-md border border-stone-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
          >
            <Package className="h-7 w-7 text-orange-600" />
            <h3 className="mt-5 text-xl font-semibold text-stone-950">Add product</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Add apparel, accessories, or resources to the member shop.
            </p>
          </Link>
          <Link
            href="/dashboard/products"
            className="rounded-md border border-stone-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
          >
            <ShoppingBag className="h-7 w-7 text-orange-600" />
            <h3 className="mt-5 text-xl font-semibold text-stone-950">Manage products</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Edit prices, descriptions, and images. Remove discontinued items.
            </p>
          </Link>
        </div>
      </section>

      {/* Sponsors section */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Sponsors</h2>
        <Link
          href="/dashboard/sponsors"
          className="block rounded-md border border-stone-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
        >
          <Star className="h-7 w-7 text-orange-600" />
          <h3 className="mt-5 text-xl font-semibold text-stone-950">Manage sponsors</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Add, remove, and toggle sponsor visibility on the homepage and footer.
          </p>
        </Link>
      </section>
    </main>
  );
}
