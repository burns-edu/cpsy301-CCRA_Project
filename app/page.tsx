import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck, ShoppingBag, Trophy, Users } from "lucide-react";
import EventCard from "@/components/event-card";
import EventsList from "@/components/events-list";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import SponsorsList from "@/components/sponsors-list";
import { demoEvents, membershipTiers } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <Image
  src="/hero-rodeo.webp"
  alt="Rodeo arena"
  fill
  priority
  loading="eager"
  className="object-cover opacity-65"
  sizes="100vw"
/>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/20" />
        <div className="relative mx-auto grid min-h-[68svh] w-full max-w-7xl content-end px-4 py-12 sm:min-h-[72svh] sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300 sm:text-sm sm:tracking-[0.24em]">
              Canadian Classic Rodeo Association
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Ride, compete, and keep the season moving.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-100 sm:text-lg">
              A complete member hub for CCRA events, schedules, results, merchandise, rulebook access,
              and rodeo community updates.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                View events
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Become a member
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: CalendarDays, label: "Sanctioned events", value: "Season schedule" },
            { icon: Trophy, label: "Verified standings", value: "Results and rankings" },
            { icon: Users, label: "Member support", value: "Profiles and resources" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-950">{item.label}</p>
                  <p className="text-sm text-stone-600">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
              Upcoming
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-stone-950 sm:text-4xl">
              Events built for members
            </h2>
          </div>
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
            See all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <EventsList limit={3} showControls={false} />
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
              Membership
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-stone-950 sm:text-4xl">
              Choose the pass that fits your season.
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Membership can support competitor eligibility, updates, resources, and future digital entry workflows.
            </p>
            <Link
              href="/membership"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Compare memberships
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {membershipTiers.map((tier) => (
              <article key={tier.name} className="rounded-md border border-stone-200 bg-stone-50 p-5">
                <ShieldCheck className="h-6 w-6 text-orange-600" />
                <h3 className="mt-4 text-lg font-semibold text-stone-950">{tier.name}</h3>
                <p className="mt-1 text-2xl font-semibold text-stone-950">
                  {formatCurrency(tier.price)}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-600">{tier.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm">
          <div className="relative h-64">
            <Image
              src="/bullriding.webp"
              alt="Rodeo action"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="p-6">
            <ShoppingBag className="h-6 w-6 text-orange-600" />
            <h2 className="mt-4 text-2xl font-semibold text-stone-950">Member products</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Browse apparel, decals, and printed resources with a working local cart prototype.
            </p>
              <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
              Shop products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-stone-950">Season highlights</h2>
          <div className="mt-5 grid gap-4">
            {demoEvents.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            Sponsors
          </p>
          <SponsorsList className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" variant="cards" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
