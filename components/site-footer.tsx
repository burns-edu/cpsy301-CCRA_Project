import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import SponsorsList from "@/components/sponsors-list";
import { publicNavItems } from "@/lib/site-data";

export default function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex max-w-full items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-orange-600 text-sm font-bold">
              CCRA
            </span>
            <span className="min-w-0 text-base font-semibold leading-tight sm:text-lg">
              Canadian Classic Rodeo Association
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-stone-300">
            A practical home for members, events, results, rulebook resources, and rodeo community updates.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-stone-300">
            <span className="flex min-w-0 items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-sky-300" />
              Alberta, Canada
            </span>
            <span className="flex min-w-0 items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-sky-300" />
              info@ccra.example
            </span>
            <span className="flex min-w-0 items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-sky-300" />
              1-800-555-CCRA
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
            Explore
          </h2>
          <nav className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-stone-300 transition hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/about" className="text-stone-300 transition hover:text-white">
              About
            </Link>
            <Link href="/rulebook" className="text-stone-300 transition hover:text-white">
              Rulebook
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
            Sponsors
          </h2>
          <SponsorsList variant="pills" className="mt-4 flex flex-wrap gap-2" />
        </div>
      </div>
    </footer>
  );
}
