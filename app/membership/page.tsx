import { CheckCircle2, CreditCard } from "lucide-react";
import MembershipCTA from "@/components/membership-cta";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { membershipTiers } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Membership"
        title="Membership options for competitors, juniors, and families."
        description="Choose a membership path, keep your member profile current, and prepare for future event entry workflows."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {membershipTiers.map((tier) => (
            <article key={tier.name} className="flex flex-col rounded-md border border-stone-200 bg-white p-6 shadow-sm">
              <CreditCard className="h-7 w-7 text-orange-600" />
              <h2 className="mt-5 text-2xl font-semibold text-stone-950">{tier.name}</h2>
              <p className="mt-2 text-4xl font-semibold text-stone-950">{formatCurrency(tier.price)}</p>
              <p className="mt-4 text-sm leading-6 text-stone-600">{tier.description}</p>
              <div className="mt-6 grid gap-3">
                {tier.features.map((feature) => (
                  <span key={feature} className="flex items-start gap-2 text-sm text-stone-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                    {feature}
                  </span>
                ))}
              </div>
              <MembershipCTA tierName={tier.name} />
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            ["Eligibility", "Membership supports event eligibility and future digital entry management."],
            ["Communication", "Members can receive schedule, results, and rulebook updates from one hub."],
            ["Community", "Families, volunteers, sponsors, and competitors all have a place in the season."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
