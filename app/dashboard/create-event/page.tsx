"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || userSnap.data().role !== "admin") {
          router.push("/");
          return;
        }

        setUser(currentUser);
        setCheckingAccess(false);
      } catch (error) {
        console.error("Access check error:", error);
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage("");
    setMessageType("");
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      if (!user) {
        throw new Error("You must be signed in.");
      }

      if (!title.trim() || !date.trim() || !location.trim()) {
        throw new Error("Please fill in title, date, and location.");
      }

      let imageUrl = "/hero-rodeo-web.jpg";

      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const storageRef = ref(storage, `events/${fileName}`);

        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "events"), {
        title: title.trim(),
        date: date.trim(),
        location: location.trim(),
        description: description.trim(),
        image: imageUrl,
        createdAt: serverTimestamp(),
        createdBy: user.email || "",
      });

      setMessage("Event created successfully.");
      setMessageType("success");

      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl("");

      setTimeout(() => {
        router.push("/dashboard/events");
      }, 1000);
    } catch (error: any) {
      console.error("Create event error:", error);
      setMessage(error?.message || "Failed to create event.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] px-6 py-10">
        <p>Checking access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-xl font-medium text-black">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-black">Create Event</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-black">Event Details</h2>
            <p className="mt-2 text-gray-600">
              Fill in the event information and upload a cover image.
            </p>

            <form onSubmit={handleCreateEvent} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="Calgary Bull"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="text"
                  placeholder="June 5-10, 2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Calgary, AB"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Write event details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {message && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-orange-500 py-3 text-lg font-medium text-white disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-black">Event Image</h2>
            <p className="mt-2 text-gray-600">
              Click below to choose an image from your device gallery.
            </p>

            <button
              type="button"
              onClick={handlePickImage}
              className="mt-6 flex h-[360px] w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-orange-300 bg-[#faf7f5] text-center"
            >
              {previewUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="px-6">
                  <div className="text-5xl">🖼️</div>
                  <p className="mt-4 text-lg font-medium text-black">
                    Click to upload event photo
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG, PNG, WEBP supported
                  </p>
                </div>
              )}
            </button>

            {selectedFile && (
              <p className="mt-4 text-sm text-gray-600">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}