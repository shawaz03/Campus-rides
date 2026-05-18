"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Map,
  Activity,
  Wallet,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useStudent } from "@/hooks/use-student";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/student", label: "Home", icon: Home, color: "#FFD23F", testId: "nav-home" },
  { href: "/student/book", label: "Book a ride", icon: Map, color: "#FF5A36", testId: "nav-book" },
  { href: "/student/activity", label: "Activity", icon: Activity, color: "#5BC0EB", testId: "nav-activity" },
  { href: "/student/wallet", label: "Wallet", icon: Wallet, color: "#7BC950", testId: "nav-wallet" },
  { href: "/student/profile", label: "Profile", icon: User, color: "#9B5DE5", testId: "nav-profile" },
];

// Derive initials from a display name or email.
function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

// Pick the best available display name.
function getDisplayName(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) return name.trim().split(" ")[0];
  if (email) return email.split("@")[0];
  return "You";
}

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const { data } = useStudent();

  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // Resolve user info — prefer profile.name > user.name > user.email
  const name =
    data?.profile?.name ?? data?.user?.name ?? null;
  const email = data?.user?.email ?? null;
  const initials = getInitials(name, email);
  const displayFirst = getDisplayName(name, email);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <>
      {/* mobile top bar */}
      <div
        className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-3 bg-[color:var(--cream)] border-b-[2.5px] border-ink"
        data-testid="student-topbar"
      >
        <Link href="/student" className="flex items-center gap-2" data-testid="topbar-logo">
          <span
            className="w-9 h-9 grid place-items-center rounded-full border-[2.5px] border-ink bg-sun"
            style={{ boxShadow: "2px 2px 0 #1B1B1F" }}
          >
            <span className="font-marker text-sm">CR</span>
          </span>
          <span className="font-marker text-lg">
            Campus<span className="text-tomato">Rides</span>
          </span>
        </Link>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="w-10 h-10 grid place-items-center rounded-full border-[2.5px] border-ink bg-cream"
          style={{ boxShadow: "2px 2px 0 #1B1B1F" }}
          data-testid="sidebar-toggle"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-0 left-0 z-40 h-screen w-[280px] bg-[color:var(--cream)] border-r-[2.5px] border-ink p-6 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:flex flex-col`}
        data-testid="student-sidebar"
      >
        <Link href="/student" className="hidden lg:flex items-center gap-3 mb-10" data-testid="sidebar-logo">
          <span
            className="w-11 h-11 grid place-items-center rounded-full border-[2.5px] border-ink bg-sun"
            style={{ boxShadow: "3px 3px 0 #1B1B1F" }}
          >
            <span className="font-marker text-base">CR</span>
          </span>
          <span className="font-marker text-xl leading-tight">
            Campus<span className="text-tomato">Rides</span>
            <span className="block font-scribble text-tomato text-sm -mt-1">~ student hub ~</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-2 lg:mt-0 mt-4">
          {NAV.map((item) => {
            const active =
              item.href === "/student"
                ? pathname === "/student"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.testId}
                className="relative group"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 border-[2.5px] border-ink rounded-[24px_8px_22px_10px/10px_22px_8px_24px] font-hand text-xl transition-all duration-200 group-hover:translate-x-1 ${
                    active ? "text-ink" : "text-ink/85 group-hover:text-ink"
                  }`}
                  style={{
                    background: active ? item.color : "#fffdf5",
                    boxShadow: active ? "4px 4px 0 #1B1B1F" : "3px 3px 0 #1B1B1F",
                  }}
                >
                  <span
                    className="w-9 h-9 grid place-items-center rounded-full border-[2px] border-ink shrink-0"
                    style={{
                      background: active ? "#FDF6E3" : item.color,
                      boxShadow: "2px 2px 0 #1B1B1F",
                    }}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                  </span>
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-dot"
                      className="ml-auto w-2.5 h-2.5 rounded-full bg-ink"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div
            className="border-[2.5px] border-ink rounded-[22px_8px_22px_10px/10px_22px_8px_22px] p-4 bg-white"
            style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
            data-testid="sidebar-user-card"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-full border-[2.5px] border-ink grid place-items-center font-marker text-lg"
                style={{ background: "#FF5A36", color: "#fff", boxShadow: "2px 2px 0 #1B1B1F" }}
              >
                {initials}
              </span>
              <div className="leading-tight overflow-hidden">
                <p className="font-marker text-base truncate">{displayFirst}</p>
                <p className="font-scribble text-tomato text-base truncate">
                  {email ? `~ ${email.split("@")[0]} ~` : "~ student ~"}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 border-[2px] border-ink rounded-full font-hand text-base bg-cream hover:bg-sun transition-colors"
              data-testid="sidebar-logout"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* backdrop for mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-ink/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
