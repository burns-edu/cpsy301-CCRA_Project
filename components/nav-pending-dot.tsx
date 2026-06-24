"use client";

import { useLinkStatus } from "next/link";

export default function NavPendingDot() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className={`nav-dot${pending ? " pending" : ""}`} />;
}
