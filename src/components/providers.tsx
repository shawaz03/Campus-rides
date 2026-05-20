"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { useStudent } from "@/hooks/use-student";

function RidingThemeManager() {
  const { data } = useStudent();

  useEffect(() => {
    const updateTheme = () => {
      if (typeof window === "undefined") return;

      // 1. Check if "darkmode-while-riding" preference is enabled
      let isDarkPrefEnabled = false;
      const stored = localStorage.getItem("campus-rides-prefs");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const found = parsed.find((p) => p.id === "darkride");
            if (found) {
              isDarkPrefEnabled = Boolean(found.on);
            }
          }
        } catch (e) {
          console.warn("Failed to parse preferences in RidingThemeManager:", e);
        }
      }

      // 2. Check if student has an active ride (status is active or requested)
      const hasActiveRide = Boolean(
        data?.rides?.some((r) => r.status === "active" || r.status === "requested")
      );

      // 3. Apply .dark class if both conditions are met
      if (isDarkPrefEnabled && hasActiveRide) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateTheme();

    // Listen to storage changes and custom prefs-changed events
    window.addEventListener("storage", updateTheme);
    window.addEventListener("prefs-changed", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("prefs-changed", updateTheme);
    };
  }, [data]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>
      <RidingThemeManager />
      {children}
    </QueryClientProvider>
  );
}
