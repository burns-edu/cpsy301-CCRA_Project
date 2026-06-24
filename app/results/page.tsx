import { Medal } from "lucide-react";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { results } from "@/lib/site-data";

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Results"
        title="Verified results and standings snapshots."
        description="Publish division winners, scores, and season standings in a format members can scan quickly."
        image="/bullriding.jpg"
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm">
          <div className="hidden bg-stone-950 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white md:grid md:grid-cols-[1.2fr_1fr_1fr_0.7fr]">
            <span>Event</span>
            <span>Division</span>
            <span>Winner</span>
            <span>Score</span>
          </div>
          <div className="divide-y divide-stone-200">
            {results.map((result) => (
              <div key={`${result.event}-${result.division}`} className="grid gap-3 px-4 py-5 md:grid-cols-[1.2fr_1fr_1fr_0.7fr] md:items-center md:px-5">
                <p className="grid gap-1 font-semibold text-stone-950">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 md:hidden">
                    Event
                  </span>
                  {result.event}
                </p>
                <p className="grid gap-1 text-sm text-stone-700">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 md:hidden">
                    Division
                  </span>
                  {result.division}
                </p>
                <p className="flex min-w-0 items-center gap-2 font-medium text-stone-950">
                  <Medal className="h-4 w-4 shrink-0 text-orange-600" />
                  <span className="font-semibold text-stone-500 md:hidden">Winner:</span>
                  {result.winner}
                </p>
                <p className="flex min-w-0 gap-2 text-sm font-semibold text-orange-700">
                  <span className="text-stone-500 md:hidden">Score:</span>
                  {result.score}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
