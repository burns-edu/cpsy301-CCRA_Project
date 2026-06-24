import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/site-data";

type EventCardProps = {
  event: EventItem;
};

function imageNeedsUnoptimized(src: string) {
  return src.startsWith("http") || src.startsWith("blob:");
}

export default function EventCard({ event }: EventCardProps) {
  const image = (event.image || "/hero-rodeo.webp").replace("/bullriding.jpg","/bullriding.webp").replace("/hero-rodeo.png","/hero-rodeo.webp");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/events/${event.id}`} className="relative block aspect-[4/3] overflow-hidden bg-stone-200">
        <Image
          src={image}
          alt={event.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          unoptimized={imageNeedsUnoptimized(image)}
        />
        {event.entriesOpen !== undefined && (
          <span className="absolute left-3 top-3 rounded-md bg-white/95 px-3 py-1 text-xs font-semibold text-stone-900 shadow-sm">
            {event.entriesOpen ? "Entries open" : "Entries closed"}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          {event.category && (
            <span className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
              {event.category}
            </span>
          )}
        </div>
        <h2 className="mt-3 text-xl font-semibold leading-snug text-stone-950">
          <Link href={`/events/${event.id}`}>{event.title}</Link>
        </h2>
        <div className="mt-4 grid gap-2 text-sm text-stone-600">
          <span className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {event.date}
          </span>
          <span className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {event.location}
          </span>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-600">
          {event.description}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
