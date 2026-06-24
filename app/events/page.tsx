import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventsList from "@/components/events-list";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Events"
        title="Find the next CCRA rodeo, clinic, or finals night."
        description="Browse live Firebase events when available, with fallback season programming so the page stays useful while content is being added."
      >
        <Link
          href="/membership"
          className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Check membership
          <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EventsList />
      </section>
      <SiteFooter />
    </main>
  );
}
