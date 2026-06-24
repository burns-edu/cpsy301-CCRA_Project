import { BookOpen, CheckCircle2 } from "lucide-react";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { rulebookSections } from "@/lib/site-data";

export default function RulebookPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Rulebook"
        title="Rules, policies, and member expectations."
        description="A structured rulebook page for quick lookup. Replace these prototype sections with official approved language when finalized."
        image="/bullriding.jpg"
      />

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        {rulebookSections.map((section) => (
          <article key={section.title} className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
            <BookOpen className="h-6 w-6 text-orange-600" />
            <h2 className="mt-4 text-2xl font-semibold text-stone-950">{section.title}</h2>
            <div className="mt-5 grid gap-3">
              {section.points.map((point) => (
                <p key={point} className="flex items-start gap-2 text-sm leading-6 text-stone-700">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-orange-600" />
                  {point}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
