"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Image
  src="/hero-rodeo.png"
  alt="Rodeo background"
  fill
  className="object-cover blur-sm scale-105"
/>

<div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="inline-block text-4xl text-white sm:text-5xl">
          ←
        </Link>

        <div className="flex min-h-[85vh] items-center justify-center">
          <form onSubmit={handleSignIn} className="w-full max-w-xl text-center">
            <h1 className="text-3xl font-light text-white sm:text-4xl md:text-5xl">
              Have an Account?
            </h1>

            <div className="mt-8 space-y-5">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-white/70 bg-white/20 px-6 py-4 text-base text-white placeholder:text-white/90 outline-none backdrop-blur-sm sm:text-lg"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-white/70 bg-white/20 px-6 py-4 text-base text-white placeholder:text-white/90 outline-none backdrop-blur-sm sm:text-lg"
                required
              />

              {error && (
                <p className="rounded-md bg-red-100 px-3 py-2 text-left text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-orange-500 py-4 text-base text-white sm:text-lg disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm text-white/90 sm:flex-row sm:justify-between sm:text-base">
              <span>Remember me</span>
              <span>Forgot Password</span>
            </div>

            <p className="mt-10 text-lg text-white sm:text-xl">-Or Sign In With-</p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button type="button" className="bg-orange-500 py-4 text-white">
                Facebook
              </button>
              <button type="button" className="bg-orange-500 py-4 text-white">
                Twitter
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}