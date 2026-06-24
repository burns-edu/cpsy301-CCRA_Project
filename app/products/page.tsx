import ProductCatalog from "@/components/product-catalog";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Products"
        title="CCRA apparel, resources, and member gear."
        description="A working product catalog with local cart behavior, ready to connect to inventory and payments later."
        image="/bullriding.jpg"
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductCatalog />
      </section>
      <SiteFooter />
    </main>
  );
}
