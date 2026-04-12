"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@gmail.com")) {
      setError("Only Gmail accounts (@gmail.com) are allowed.");
      return;
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(normalizedEmail)) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, normalizedEmail, password);

      if (auth.currentUser && fullName.trim()) {
        await updateProfile(auth.currentUser, {
          displayName: fullName.trim(),
        });
      }

      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }

      setSuccess("Account created successfully. Please verify your Gmail.");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
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
        className="object-cover blur-md scale-110"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="inline-block text-4xl text-white sm:text-5xl">
          ←
        </Link>

        <div className="flex min-h-[85vh] items-center justify-center">
          <form
            onSubmit={handleSignUp}
            className="w-full max-w-xl rounded-2xl border border-[#d8c8bc] bg-[#f8f3f1]/90 p-6 shadow-lg sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-lg font-medium sm:text-xl">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-b border-gray-300 bg-transparent py-3 outline-none placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-lg font-medium sm:text-xl">
                  Gmail
                </label>
                <input
                  type="email"
                  placeholder="Enter your Gmail (example@gmail.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-gray-300 bg-transparent py-3 outline-none placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-lg font-medium sm:text-xl">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-[#e5d8d0] bg-white/70 px-3 py-3 outline-none placeholder:text-gray-400"
                  required
                />
              </div>

              {error && (
                <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-3 text-lg text-white shadow-lg transition hover:bg-orange-600 disabled:opacity-70"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>

            <div className="mt-6 text-sm text-black sm:text-base">
              <p className="mb-2">Password (Strongly Recommended)</p>
              <ul className="list-disc pl-5">
                <li>Use at least 8 characters</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>

            <p className="mt-8 text-center text-sm leading-6 text-black sm:text-base">
              By signing up, you agree to our{" "}
              <span className="text-orange-500">Terms of services</span> and{" "}
              <span className="text-orange-500">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}