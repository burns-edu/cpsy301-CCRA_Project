"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export function useAdminAccess() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));

        if (!userSnap.exists() || userSnap.data().role !== "admin") {
          router.push("/");
          return;
        }

        setUser(currentUser);
        setCheckingAccess(false);
      } catch {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user, checkingAccess };
}
