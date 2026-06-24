"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Search, SlidersHorizontal } from "lucide-react";
import EventCard from "@/components/event-card";
import { db } from "@/lib/firebase";
import { demoEvents, type EventItem } from "@/lib/site-data";

type EventsListProps = {
  limit?: number;
  showControls?: boolean;
};

function normalizeEvent(id: string, data: Partial<EventItem>): EventItem {
  return {
    id,
    title: data.title || "Untitled event",
    date: data.date || "Date to be announced",
    rawDate: data.rawDate,
    rawTime: data.rawTime,
    location: data.location || "Location to be announced",
    image: data.image || "/hero-rodeo.png",
    description: data.description || "Event details will be posted soon.",
    category: data.category || "Rodeo",
    entriesOpen: data.entriesOpen,
  };
}

export default function EventsList({ limit, showControls = true }: EventsListProps) {
  const [events, setEvents] = useState<EventItem[]>(demoEvents);
  const [loading, setLoading] = useState(true);
  const [queryText, setQueryText] = useState("");
  const [status, setStatus] = useState<"all" | "open">("all");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const eventsQuery = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(eventsQuery);
        const liveEvents = snapshot.docs.map((docItem) =>
          normalizeEvent(docItem.id, docItem.data() as Partial<EventItem>),
        );

        if (active && liveEvents.length > 0) {
          setEvents(liveEvents);
        }
      } catch {
        if (active) {
          setEvents(demoEvents);
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
  }, []);

  const filteredEvents = useMemo(() => {
    const text = queryText.trim().toLowerCase();

    return events
      .filter((event) => {
        if (status === "open" && event.entriesOpen === false) {
          return false;
        }

        if (!text) {
          return true;
        }

        return [event.title, event.location, event.date, event.category]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(text));
      })
      .slice(0, limit);
  }, [events, limit, queryText, status]);

  return (
    <div>
      {showControls && (
        <div className="mb-6 grid gap-3 rounded-md border border-stone-200 bg-white p-3 shadow-sm md:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              placeholder="Search by event, city, or division"
              className="h-12 w-full rounded-md border border-stone-200 bg-stone-50 pl-10 pr-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
            />
          </label>
          <div className="flex w-full min-w-0 items-center gap-2 rounded-md border border-stone-200 bg-stone-50 p-1 md:w-auto">
            <SlidersHorizontal className="ml-2 h-4 w-4 shrink-0 text-stone-500" />
            <button
              type="button"
              onClick={() => setStatus("all")}
              className={`flex-1 rounded px-3 py-2 text-sm font-semibold transition md:flex-none ${
                status === "all" ? "bg-white text-stone-950 shadow-sm" : "text-stone-600"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatus("open")}
              className={`flex-1 rounded px-3 py-2 text-sm font-semibold transition md:flex-none ${
                status === "open" ? "bg-white text-stone-950 shadow-sm" : "text-stone-600"
              }`}
            >
              Open
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p className="mb-4 rounded-md bg-orange-50 px-4 py-3 text-sm text-orange-800">
          Loading live event updates...
        </p>
      )}

      {filteredEvents.length === 0 ? (
        <div className="rounded-md border border-dashed border-stone-300 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-stone-950">No matching events</h2>
          <p className="mt-2 text-sm text-stone-600">Try a different search or view all events.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
