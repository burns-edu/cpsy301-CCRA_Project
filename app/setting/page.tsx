import SettingsPanel from "@/components/settings-panel";
import PageHero from "@/components/page-hero";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function SettingPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteHeader />
      <PageHero
        eyebrow="Settings"
        title="Manage your CCRA account."
        description="Update your display name, confirm your email, and access member actions."
        image="/bullriding.jpg"
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SettingsPanel />
      </section>
      <SiteFooter />
    </main>
  );
}
