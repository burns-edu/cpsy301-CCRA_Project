import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { scheduleRows } from "@/lib/site-data";

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Schedule"
        title="Season dates at a glance."
        description="Use this schedule to plan travel, entries, clinics, and finals qualification windows."
        image="/bullriding.jpg"
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm">
          <div className="hidden bg-stone-950 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white sm:grid sm:grid-cols-[1fr_1fr_1.4fr_1.2fr]">
            <span>Date</span>
            <span>Time</span>
            <span>Event</span>
            <span>Location</span>
          </div>
          <div className="divide-y divide-stone-200">
            {scheduleRows.map((row) => (
              <div key={`${row.date}-${row.event}`} className="grid gap-3 px-4 py-5 sm:grid-cols-[1fr_1fr_1.4fr_1.2fr] sm:items-center sm:px-5">
                <p className="grid gap-1 font-semibold text-stone-950">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 sm:hidden">
                    Date
                  </span>
                  {row.date}
                </p>
                <p className="flex min-w-0 items-center gap-2 text-sm text-stone-600">
                  <Clock className="h-4 w-4 shrink-0 text-orange-600" />
                  <span className="font-semibold text-stone-500 sm:hidden">Time:</span>
                  {row.time}
                </p>
                <p className="grid gap-1 font-medium text-stone-800">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 sm:hidden">
                    Event
                  </span>
                  {row.event}
                </p>
                <p className="flex min-w-0 items-center gap-2 text-sm text-stone-600">
                  <MapPin className="h-4 w-4 shrink-0 text-orange-600" />
                  <span className="font-semibold text-stone-500 sm:hidden">Location:</span>
                  {row.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-md border border-orange-200 bg-orange-50 p-6">
          <h2 className="text-xl font-semibold text-stone-950">Need event details?</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Event pages include descriptions, entry status, and member preparation steps.
          </p>
          <Link href="/events" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-800">
            Browse event cards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
