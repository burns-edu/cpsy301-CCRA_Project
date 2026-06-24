"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowLeft, CheckCircle2, UserPlus } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(normalizedEmail)) {
      setMessage("Please use a valid Gmail address.");
      return;
    }

    if (password.length < 8) {
      setMessage("Use at least 8 characters for your password.");
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

      await updateProfile(credential.user, {
        displayName: fullName.trim(),
      });

      await setDoc(doc(db, "users", credential.user.uid), {
        email: normalizedEmail,
        displayName: fullName.trim(),
        role: "member",
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(credential.user);
      setMessage("Account created. Verification email sent.");

      window.setTimeout(() => {
        router.push("/");
      }, 900);
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Failed to create account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-stone-950 text-white">
      <Image
        src="/bullriding.jpg"
        alt="Rodeo background"
        fill
        priority
        className="object-cover opacity-45"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/30" />

      <div className="relative mx-auto grid min-h-svh w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
        <div className="flex flex-col justify-between">
          <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="hidden pb-12 lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300">Join CCRA</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight">
              Create a member account for the season.
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center py-8 sm:py-12">
          <form onSubmit={handleSignUp} className="w-full max-w-md rounded-md border border-white/15 bg-white/95 p-5 text-stone-950 shadow-2xl sm:p-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">Create account</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Gmail accounts are accepted for this prototype. New users are created as members.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Full name</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Gmail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-12 rounded-md border border-stone-300 px-3 outline-none transition focus:border-orange-500"
                />
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
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating..." : "Create account"}
            </button>

            <p className="mt-5 text-center text-sm text-stone-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-orange-700">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
