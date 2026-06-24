"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { ArrowLeft, LogIn, Mail } from "lucide-react";
import { auth } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      router.push("/");
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Failed to sign in."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage("");
    setLoading(true);

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/");
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Google sign-in is not available."));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setMessage("Enter your email first, then request a reset link.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setMessage("Password reset email sent.");
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Unable to send a reset email."));
    }
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-stone-950 text-white">
      <Image
        src="/hero-rodeo.png"
        alt="Rodeo background"
        fill
        priority
        className="object-cover opacity-50"
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300">CCRA Member Hub</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight">
              Sign in to manage your rodeo season.
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center py-8 sm:py-12">
          <form onSubmit={handleSignIn} className="w-full max-w-md rounded-md border border-white/15 bg-white/95 p-5 text-stone-950 shadow-2xl sm:p-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Use your member email to access profile, settings, cart, and admin tools when assigned.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Email</span>
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
              <p className="mt-5 rounded-md bg-orange-50 px-4 py-3 text-sm text-orange-800">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 disabled:opacity-60"
            >
              <Mail className="h-4 w-4" />
              Continue with Google
            </button>

            <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={handlePasswordReset} className="text-left font-semibold text-orange-700">
                Forgot password?
              </button>
              <Link href="/sign-up" className="font-semibold text-stone-950">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
