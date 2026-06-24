import Link from "next/link";
import { Home } from "lucide-react";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950 sm:text-4xl">Page not found</h1>
        <p className="mt-3 text-stone-600">
          That page is not part of the CCRA prototype, or the link has changed.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <Home className="h-4 w-4" />
          Back home
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
