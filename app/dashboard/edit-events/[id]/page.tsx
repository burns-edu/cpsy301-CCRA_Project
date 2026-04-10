"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      const ref = doc(db, "events", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || "");
        setDate(data.date || "");
        setLocation(data.location || "");
        setImage(data.image || "");
        setDescription(data.description || "");
      }
    };

    if (id) loadEvent();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "events", id), {
        title,
        date,
        location,
        image,
        description,
      });

      setMessage("Event updated successfully");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update event");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard/events" className="text-2xl">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <div />
        </div>

        <form onSubmit={handleUpdate} className="rounded-2xl bg-white p-8 shadow space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border p-3"
            rows={4}
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 py-3 text-white"
          >
            Update Event
          </button>

          {message && <p>{message}</p>}
        </form>
      </div>
    </main>
  );
}