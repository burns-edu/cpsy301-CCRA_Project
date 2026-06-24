import { Mail, UserRound } from "lucide-react";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { directors } from "@/lib/site-data";

export default function BoardPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Board"
        title="Board of Directors"
        description="A clear, scannable directory for member representation, event operations, finances, and results support."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {directors.map((director) => (
            <article key={director.name} className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-orange-50 text-orange-700">
                <UserRound className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-stone-950">{director.name}</h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">
                {director.role}
              </p>
              <p className="mt-4 text-sm leading-6 text-stone-600">{director.focus}</p>
              <a
                href={`mailto:${director.name.toLowerCase().replaceAll(" ", ".")}@ccra.example`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-700"
              >
                <Mail className="h-4 w-4" />
                Contact
              </a>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
