"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, sendEmailVerification, signOut, updateProfile, User } from "firebase/auth";
import { CheckCircle2, LogOut, Mail, Save, UserRound } from "lucide-react";
import { auth } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";

export default function SettingsPanel() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      setUser(currentUser);
      setDisplayName(currentUser.displayName || "");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth.currentUser) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setUser(auth.currentUser);
      setMessage("Profile updated.");
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Unable to update profile."));
    } finally {
      setSaving(false);
    }
  };

  const handleVerification = async () => {
    if (!auth.currentUser) {
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser);
      setMessage("Verification email sent.");
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Unable to send verification email."));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="rounded-md border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-stone-600">Loading account settings...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSave} className="rounded-md border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-stone-950">Account details</h2>
        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-stone-700">Display name</span>
            <span className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="h-12 w-full rounded-md border border-stone-300 pl-10 pr-3 outline-none transition focus:border-orange-500"
                placeholder="Your name"
              />
            </span>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-stone-700">Email</span>
            <span className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                value={user?.email || ""}
                readOnly
                className="h-12 w-full rounded-md border border-stone-200 bg-stone-50 pl-10 pr-3 text-stone-600"
              />
            </span>
          </label>
        </div>

        {message && (
          <p className="mt-5 flex items-start gap-2 rounded-md bg-orange-50 px-4 py-3 text-sm text-orange-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <aside className="h-fit rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-stone-950">Member actions</h2>
        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={handleVerification}
            className="rounded-md border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            Send verification email
          </button>
          <Link
            href="/orders"
            className="rounded-md border border-stone-300 px-4 py-3 text-center text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            View orders
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    </div>
  );
}
