"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  CalendarDays,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { memberNavItems, publicNavItems } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import NavPendingDot from "@/components/nav-pending-dot";
import TransitionLink from "@/components/transition-link";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        setIsAdmin(userSnap.exists() && userSnap.data().role === "admin");
      } catch {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const nav = [
    { label: "Home", href: "/", icon: Home },
    ...publicNavItems.map((item) => ({
      ...item,
      icon: item.href === "/events" ? CalendarDays : undefined,
    })),
    { label: "Cart", href: "/cart", icon: ShoppingCart },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-stone-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-600 text-sm font-bold text-white">
            CCRA
          </span>
          <span className="hidden min-w-0 text-sm font-semibold leading-tight sm:block">
            Canadian Classic
            <br />
            Rodeo Association
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {publicNavItems.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950",
                pathname === item.href && "bg-stone-100 text-stone-950",
              )}
            >
              {item.label}
              <NavPendingDot />
            </TransitionLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <TransitionLink
            href="/cart"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-700 transition hover:bg-stone-100"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </TransitionLink>

          {!loadingUser && user && isAdmin && (
            <TransitionLink
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TransitionLink>
          )}

          {!loadingUser && user ? (
            <TransitionLink
              href="/navigation/profile"
              className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
            >
              <UserRound className="h-4 w-4" />
              Profile
            </TransitionLink>
          ) : (
            <TransitionLink
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </TransitionLink>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-900 transition hover:bg-stone-100 lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 overflow-hidden lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-stone-950/45 transition-opacity duration-300 ease-in-out",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          aria-label="Close menu overlay"
          onClick={() => setMenuOpen(false)}
        />
        <aside
          id="mobile-navigation"
          className={cn(
            "absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 font-semibold text-stone-950"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-600 text-sm font-bold text-white">
                CCRA
              </span>
              Menu
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-900 transition hover:bg-stone-100"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-8 grid gap-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-stone-800 transition hover:bg-stone-100",
                    pathname === item.href && "bg-stone-100 text-stone-950",
                  )}
                >
                  {Icon ? <Icon className="h-5 w-5 text-orange-600" /> : <span className="h-2 w-2 rounded-full bg-orange-600" />}
                  {item.label}
                  <NavPendingDot />
                </TransitionLink>
              );
            })}
          </nav>

          {!user && (
            <div className="mt-8 border-t border-stone-200 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Account
              </p>
              <TransitionLink
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-orange-700"
              >
                <LogIn className="h-5 w-5" />
                Sign in
              </TransitionLink>
            </div>
          )}

          {user && (
            <div className="mt-8 border-t border-stone-200 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Member
              </p>
              <div className="grid gap-2">
                {memberNavItems.map((item) => (
                  <TransitionLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center rounded-md px-3 py-3 text-base font-medium text-stone-800 transition hover:bg-stone-100"
                  >
                    {item.label}
                    <NavPendingDot />
                  </TransitionLink>
                ))}
                {isAdmin && (
                  <TransitionLink
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md bg-stone-950 px-3 py-3 text-base font-semibold text-white"
                  >
                    Dashboard
                  </TransitionLink>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </header>
  );
}
