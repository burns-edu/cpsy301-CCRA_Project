import CartView from "@/components/cart-view";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Cart"
        title="Review your CCRA products."
        description="The cart works locally in this prototype and is structured for a future checkout integration."
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CartView />
      </section>
      <SiteFooter />
    </main>
  );
}
