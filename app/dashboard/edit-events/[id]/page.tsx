"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Save } from "lucide-react";
import { db } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";
import { useAdminAccess } from "@/lib/use-admin-access";

function formatEventDate(date: string, time: string) {
  if (!date) {
    return "";
  }

  const dateObj = time ? new Date(`${date}T${time}`) : new Date(`${date}T00:00`);
  const formattedDate = dateObj.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!time) {
    return formattedDate;
  }

  const formattedTime = dateObj.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${formattedTime}`;
}

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { checkingAccess } = useAdminAccess();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Rodeo");
  const [image, setImage] = useState("/hero-rodeo.png");
  const [description, setDescription] = useState("");
  const [entriesOpen, setEntriesOpen] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (checkingAccess || !id) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        const snapshot = await getDoc(doc(db, "events", id));

        if (!active) {
          return;
        }

        if (!snapshot.exists()) {
          setMessage("Event not found.");
          setLoadingEvent(false);
          return;
        }

        const data = snapshot.data();
        setTitle(data.title || "");
        setEventDate(data.rawDate || "");
        setEventTime(data.rawTime || "");
        setLocation(data.location || "");
        setCategory(data.category || "Rodeo");
        setImage(data.image || "/hero-rodeo.png");
        setDescription(data.description || "");
        setEntriesOpen(data.entriesOpen !== false);
        setLoadingEvent(false);
      } catch (error: unknown) {
        if (active) {
          setMessage(getErrorMessage(error, "Unable to load event."));
          setLoadingEvent(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [checkingAccess, id]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateDoc(doc(db, "events", id), {
        title: title.trim(),
        date: formatEventDate(eventDate, eventTime),
        rawDate: eventDate,
        rawTime: eventTime,
        location: location.trim(),
        category,
        image: image.trim() || "/hero-rodeo.png",
        description: description.trim(),
        entriesOpen,
      });

      setMessage("Event updated successfully.");
      window.setTimeout(() => router.push("/dashboard/events"), 800);
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Failed to update event."));
    } finally {
      setSaving(false);
    }
  };

  if (checkingAccess || loadingEvent) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <p className="text-stone-600">Loading event editor...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link href="/dashboard/events" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
            <ArrowLeft className="h-4 w-4" />
            Events
          </Link>
          <h1 className="order-3 w-full text-center text-xl font-semibold text-stone-950 sm:order-none sm:w-auto sm:text-2xl">
            Edit Event
          </h1>
          <div className="hidden w-20 sm:block" />
        </div>
      </header>

      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleUpdate} className="rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-700">Title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} required className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Date</span>
                <input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} required className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Time</span>
                <input type="time" value={eventTime} onChange={(event) => setEventTime(event.target.value)} className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500" />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-700">Location</span>
              <input value={location} onChange={(event) => setLocation(event.target.value)} required className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-orange-500">
                  <option>Rodeo</option>
                  <option>Series</option>
                  <option>Clinic</option>
                  <option>Finals</option>
                  <option>Meeting</option>
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-md border border-stone-200 bg-stone-50 px-4 py-3">
                <input type="checkbox" checked={entriesOpen} onChange={(event) => setEntriesOpen(event.target.checked)} className="h-4 w-4 accent-orange-600" />
                <span className="text-sm font-semibold text-stone-700">Entries open</span>
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-700">Image URL</span>
              <input value={image} onChange={(event) => setImage(event.target.value)} className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-700">Description</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={6} required className="rounded-md border border-stone-300 px-3 py-3 outline-none transition focus:border-orange-500" />
            </label>
          </div>

          {message && (
            <p className="mt-5 rounded-md bg-orange-50 px-4 py-3 text-sm text-orange-800">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save event"}
          </button>
        </form>
      </section>
    </main>
  );
}
