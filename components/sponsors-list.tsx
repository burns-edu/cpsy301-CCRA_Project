"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sponsorNames } from "@/lib/site-data";

type Sponsor = { id: string; name: string; website: string };

type Props = {
  variant?: "cards" | "pills";
  className?: string;
};

export default function SponsorsList({ variant = "cards", className }: Props) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(
    sponsorNames.map((name, i) => ({ id: String(i), name, website: "" })),
  );

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const q = query(collection(db, "sponsors"), where("active", "==", true));
        const snapshot = await getDocs(q);
        const live = snapshot.docs.map((d) => ({
          id: d.id,
          name: (d.data().name as string) || "Sponsor",
          website: (d.data().website as string) || "",
        }));
        if (active && live.length > 0) setSponsors(live);
      } catch {
        // keep static fallback
      }
    })();

    return () => { active = false; };
  }, []);

  if (variant === "pills") {
    return (
      <div className={className ?? "flex flex-wrap gap-2"}>
        {sponsors.map((s) =>
          s.website ? (
            <a
              key={s.id}
              href={s.website.startsWith("http") ? s.website : `https://${s.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:text-white"
            >
              {s.name}
            </a>
          ) : (
            <span key={s.id} className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-200">
              {s.name}
            </span>
          ),
        )}
      </div>
    );
  }

  return (
    <div className={className ?? "grid gap-3 sm:grid-cols-2 lg:grid-cols-5"}>
      {sponsors.map((s) =>
        s.website ? (
          <a
            key={s.id}
            href={s.website.startsWith("http") ? s.website : `https://${s.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-24 items-center justify-center rounded-md border border-stone-200 bg-stone-50 px-4 text-center font-semibold text-stone-700 transition hover:border-orange-300 hover:text-stone-950"
          >
            {s.name}
          </a>
        ) : (
          <div key={s.id} className="flex min-h-24 items-center justify-center rounded-md border border-stone-200 bg-stone-50 px-4 text-center font-semibold text-stone-700">
            {s.name}
          </div>
        ),
      )}
    </div>
  );
}
