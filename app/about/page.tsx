import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="About"
        title="A practical association hub for rodeo members and organizers."
        description="CCRA brings event information, membership resources, results, and community updates into one place for competitors, families, volunteers, and sponsors."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
            Purpose
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-stone-950">
            Keep event operations clear and member information easy to find.
          </h2>
          <p className="mt-5 text-base leading-8 text-stone-700">
            This project is structured as a production-ready prototype: public pages are complete,
            member flows are navigable, and admin users can create and manage events through Firebase.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Events", "Members", "Results"].map((item) => (
              <div key={item} className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
                <p className="mt-3 font-semibold text-stone-950">{item}</p>
                <p className="mt-1 text-sm text-stone-600">Organized and ready to expand.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm">
          <div className="relative h-72">
            <Image src="/bullriding.jpg" alt="Rodeo competitor" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="p-6">
            <Users className="h-6 w-6 text-orange-600" />
            <h3 className="mt-4 text-xl font-semibold text-stone-950">Built around people</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              The UI emphasizes fast scanning, simple actions, and content that works for repeat visits.
            </p>
            <Link href="/board-of-director" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
              Meet the board
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
