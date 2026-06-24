import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact-form";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Contact"
        title="Questions, entries, sponsorships, and member support."
        description="Reach the right part of the association with a simple contact workflow."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="grid gap-4">
          {[
            { icon: Mail, label: "Email", value: "info@ccra.example" },
            { icon: Phone, label: "Phone", value: "1-800-555-CCRA" },
            { icon: MapPin, label: "Region", value: "Alberta, Canada" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
                <Icon className="h-6 w-6 text-orange-600" />
                <h2 className="mt-4 text-lg font-semibold text-stone-950">{item.label}</h2>
                <p className="mt-1 text-stone-600">{item.value}</p>
              </div>
            );
          })}
        </div>
        <ContactForm />
      </section>
      <SiteFooter />
    </main>
  );
}
