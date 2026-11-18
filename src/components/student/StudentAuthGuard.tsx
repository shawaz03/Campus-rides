"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export default function StudentAuthGuard({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const verifySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthenticated(false);
        window.location.replace("/auth");
      } else {
        setIsAuthenticated(true);
      }
    };

    // 1. Initial verification on mount
    verifySession();

    // 2. Handle browser Back-Forward Cache (bfcache) restore on swipe-back / back button
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        verifySession();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // 3. Listen to Supabase auth events (e.g. SIGNED_OUT)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setIsAuthenticated(false);
        window.location.replace("/auth");
      } else if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      subscription.unsubscribe();
    };
  }, []);

  // Block rendering dashboard if session is absent to eliminate content flash
  if (isAuthenticated === false) {
    return null;
  }

  return <>{children}</>;
}
