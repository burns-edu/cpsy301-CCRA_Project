"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, Share2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { demoEvents, type EventItem } from "@/lib/site-data";

type EventDetailProps = {
  eventId: string;
};

function imageNeedsUnoptimized(src: string) {
  return src.startsWith("http") || src.startsWith("blob:");
}

function normalizeEvent(id: string, data: Partial<EventItem>): EventItem {
  return {
    id,
    title: data.title || "Untitled event",
    date: data.date || "Date to be announced",
    rawDate: data.rawDate,
    rawTime: data.rawTime,
    location: data.location || "Location to be announced",
    image: data.image || "/hero-rodeo.webp",
    description: data.description || "Event details will be posted soon.",
    category: data.category || "Rodeo",
    entriesOpen: data.entriesOpen,
  };
}

export default function EventDetail({ eventId }: EventDetailProps) {
  const fallbackEvent = useMemo(
    () => demoEvents.find((event) => event.id === eventId) || null,
    [eventId],
  );
  const [event, setEvent] = useState<EventItem | null>(fallbackEvent);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const snapshot = await getDoc(doc(db, "events", eventId));

        if (active && snapshot.exists()) {
          setEvent(normalizeEvent(snapshot.id, snapshot.data() as Partial<EventItem>));
        }
      } catch {
        if (active) {
          setEvent(fallbackEvent);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [eventId, fallbackEvent]);

  const handleShare = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const url = window.location.href;

    try {
      if (navigator.share && event) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  if (!event && !loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-stone-950">Event not found</h1>
          <p className="mt-3 text-stone-600">This event may have been removed or renamed.</p>
          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </Link>
        </div>
      </main>
    );
  }

  const image = (event?.image || "/hero-rodeo.webp").replace("/bullriding.jpg","/bullriding.webp").replace("/hero-rodeo.png","/hero-rodeo.webp");

  return (
    <main className="bg-stone-50">
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <Image
          src={image}
          alt={event?.title || "Event"}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
          unoptimized={imageNeedsUnoptimized(image)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/20" />
        <div className="relative mx-auto flex min-h-[360px] w-full max-w-7xl flex-col justify-end px-4 py-10 sm:min-h-[420px] sm:px-6 sm:py-12 lg:px-8">
          <Link href="/events" className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-orange-200 sm:mb-8">
            <ArrowLeft className="h-4 w-4" />
            All events
          </Link>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-white/15 px-3 py-1 text-sm font-semibold text-white">
              {event?.category || "Rodeo"}
            </span>
            <span className="rounded-md bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
              {event?.entriesOpen === false ? "Entries closed" : "Entries open"}
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {event?.title || "Loading event"}
          </h1>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-stone-950">Event details</h2>
          <p className="mt-4 text-base leading-8 text-stone-700">
            {event?.description || "Event details will be posted soon."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-stone-50 p-4">
              <CalendarDays className="h-5 w-5 text-orange-600" />
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">
                Date
              </h3>
              <p className="mt-1 font-medium text-stone-950">{event?.date}</p>
            </div>
            <div className="rounded-md bg-stone-50 p-4">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-500">
                Location
              </h3>
              <p className="mt-1 font-medium text-stone-950">{event?.location}</p>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-md border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-950">Plan your entry</h2>
          <div className="mt-5 grid gap-3 text-sm text-stone-700">
            {["Confirm membership status", "Review the rulebook", "Arrive before check-in closes"].map((item) => (
              <span key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                {item}
              </span>
            ))}
          </div>
          <Link
            href="/membership"
            className="mt-6 flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Membership options
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            <Share2 className="h-4 w-4" />
            {copied ? "Link copied" : "Share event"}
          </button>
        </aside>
      </section>
    </main>
  );
}
