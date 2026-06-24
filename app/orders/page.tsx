import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Orders"
        title="Member order history."
        description="A ready page for merchandise orders, membership receipts, and future event entry confirmations."
      />

      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-md border border-dashed border-stone-300 bg-white p-6 text-center shadow-sm sm:p-10">
          <PackageCheck className="mx-auto h-10 w-10 text-orange-600" />
          <h2 className="mt-4 text-2xl font-semibold text-stone-950">No saved orders yet</h2>
          <p className="mt-2 text-stone-600">
            Prototype checkout clears the local cart and lands here. Connect a backend order collection to persist receipts.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Browse products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
