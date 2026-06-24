"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function MembershipCTA({ tierName }: { tierName: string }) {
  const [signedIn, setSignedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setSignedIn(!!user);
      setChecked(true);
    });
    return () => unsub();
  }, []);

  if (!checked) {
    return (
      <div className="mt-8 h-12 animate-pulse rounded-md bg-stone-100" />
    );
  }

  if (signedIn) {
    return (
      <div className="mt-8 grid gap-3">
        <span className="flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          You&rsquo;re signed in
        </span>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
        >
          Contact us to activate {tierName}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/sign-up"
      className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
    >
      Start membership
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
