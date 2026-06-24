import EventDetail from "@/components/event-detail";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;

  return (
    <>
      <SiteHeader />
      <EventDetail eventId={id} />
      <SiteFooter />
    </>
  );
}
