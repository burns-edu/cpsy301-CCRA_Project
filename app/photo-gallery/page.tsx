import Image from "next/image";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { galleryImages } from "@/lib/site-data";

export default function PhotoGalleryPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Gallery"
        title="Photo gallery"
        description="A visual archive for event photography, sponsor moments, member stories, and finals coverage."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {galleryImages.map((item, index) => (
            <figure
              key={`${item.title}-${index}`}
              className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-stone-200">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </div>
              <figcaption className="p-5">
                <h2 className="text-lg font-semibold text-stone-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
