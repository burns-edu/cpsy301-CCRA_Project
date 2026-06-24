"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { ArrowLeft, Eye, EyeOff, Plus, Star, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAdminAccess } from "@/lib/use-admin-access";

type Sponsor = {
  id: string;
  name: string;
  website: string;
  active: boolean;
};

function normalizeSponsor(id: string, data: Record<string, unknown>): Sponsor {
  return {
    id,
    name: (data.name as string) || "Unnamed sponsor",
    website: (data.website as string) || "",
    active: data.active !== false,
  };
}

export default function SponsorsPage() {
  const { checkingAccess } = useAdminAccess();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState("");

  const loadSponsors = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "sponsors"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setSponsors(snapshot.docs.map((d) => normalizeSponsor(d.id, d.data() as Record<string, unknown>)));
    } catch {
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (checkingAccess) return;
    void loadSponsors();
  }, [checkingAccess, loadSponsors]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName.trim() || adding) return;

    setAdding(true);
    setAddMessage("");
    try {
      await addDoc(collection(db, "sponsors"), {
        name: newName.trim(),
        website: newWebsite.trim(),
        active: true,
        createdAt: new Date(),
      });
      setNewName("");
      setNewWebsite("");
      setAddMessage("Sponsor added.");
      await loadSponsors();
    } catch {
      setAddMessage("Failed to add sponsor.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (sponsor: Sponsor) => {
    await updateDoc(doc(db, "sponsors", sponsor.id), { active: !sponsor.active });
    setSponsors((prev) =>
      prev.map((s) => (s.id === sponsor.id ? { ...s, active: !s.active } : s)),
    );
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "sponsors", id));
    setConfirmDeleteId(null);
    setSponsors((prev) => prev.filter((s) => s.id !== id));
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <p className="text-stone-600">Checking access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="order-3 w-full text-center text-xl font-semibold text-stone-950 sm:order-none sm:w-auto sm:text-2xl">
            Manage Sponsors
          </h1>
          <div className="hidden w-24 sm:block" />
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        {/* Sponsor list */}
        <div>
          <h2 className="text-xl font-semibold text-stone-950">Active sponsors</h2>
          <p className="mt-1 text-sm text-stone-600">
            Active sponsors appear on the homepage and footer. Toggle to show or hide.
          </p>

          <div className="mt-5 grid gap-3">
            {loading ? (
              <div className="rounded-md border border-stone-200 bg-white p-6 text-stone-600 shadow-sm">
                Loading sponsors...
              </div>
            ) : sponsors.length === 0 ? (
              <div className="rounded-md border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm">
                <Star className="mx-auto h-8 w-8 text-stone-300" />
                <p className="mt-3 font-semibold text-stone-950">No sponsors yet</p>
                <p className="mt-1 text-sm text-stone-600">Add your first sponsor using the form.</p>
              </div>
            ) : (
              sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="flex items-center justify-between gap-4 rounded-md border border-stone-200 bg-white px-4 py-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-950">{sponsor.name}</p>
                    {sponsor.website && (
                      <a
                        href={sponsor.website.startsWith("http") ? sponsor.website : `https://${sponsor.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-700 hover:underline"
                      >
                        {sponsor.website}
                      </a>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                        sponsor.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {sponsor.active ? "Visible" : "Hidden"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggle(sponsor)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone-300 text-stone-700 transition hover:bg-stone-100"
                      title={sponsor.active ? "Hide sponsor" : "Show sponsor"}
                    >
                      {sponsor.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(sponsor.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white transition hover:bg-red-700"
                      title="Delete sponsor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add sponsor form */}
        <aside className="h-fit rounded-md border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-950">Add sponsor</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            New sponsors are visible by default. Toggle them off if not yet confirmed.
          </p>
          <form onSubmit={handleAdd} className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-700">Sponsor name</span>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                placeholder="e.g. Range West"
                className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-700">Website (optional)</span>
              <input
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                type="url"
                placeholder="https://example.com"
                className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
              />
            </label>

            {addMessage && (
              <p className="rounded-md bg-orange-50 px-4 py-3 text-sm text-orange-800">{addMessage}</p>
            )}

            <button
              type="submit"
              disabled={adding}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {adding ? "Adding..." : "Add sponsor"}
            </button>
          </form>
        </aside>
      </section>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-stone-950">Remove sponsor?</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              This permanently removes the sponsor from Firestore.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
