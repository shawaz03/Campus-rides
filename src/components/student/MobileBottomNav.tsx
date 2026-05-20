"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import { Home, Map, Activity, Wallet, AlertTriangle } from "lucide-react";

const MOBILE_NAV = [
  { href: "/student", label: "Home", icon: Home, color: "#FFD23F" },
  { href: "/student/book", label: "Book", icon: Map, color: "#FF5A36" },
  { href: "/student/profile?triggerSos=true", label: "SOS", icon: AlertTriangle, color: "#FF5A36", isSos: true },
  { href: "/student/activity", label: "Activity", icon: Activity, color: "#5BC0EB" },
  { href: "/student/wallet", label: "Wallet", icon: Wallet, color: "#7BC950" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mobile first approach: default to rendering on mobile/SSR, hidden on desktop via utility class
  if (mounted && !isMobile) {
    return null;
  }

  return (
    <div 
      className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-[color:var(--cream)] border-[2.5px] border-ink rounded-[24px_16px_22px_18px/18px_22px_16px_24px] px-3 py-2 flex items-center justify-around"
      style={{
        boxShadow: "5px 5px 0 #1B1B1F",
      }}
      data-testid="mobile-bottom-nav"
    >
      {MOBILE_NAV.map((item) => {
        const active = item.isSos 
          ? false 
          : item.href === "/student" 
            ? pathname === "/student" 
            : pathname.startsWith(item.href);

        const Icon = item.icon;

        if (item.isSos) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -mt-6 flex flex-col items-center justify-center shrink-0"
              data-testid="mobile-nav-sos"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full border-[2.5px] border-ink bg-tomato text-white flex items-center justify-center shadow-md cursor-pointer relative"
                style={{
                  boxShadow: "0px 4px 0 #1B1B1F",
                }}
              >
                <Icon size={24} strokeWidth={2.5} className="animate-pulse" />
              </motion.div>
              <span className="font-marker text-xs text-tomato mt-1">SOS</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all"
            data-testid={`mobile-nav-${item.label.toLowerCase()}`}
          >
            <div
              className="relative p-2 rounded-full border-[2px] border-ink flex items-center justify-center"
              style={{
                background: active ? item.color : "transparent",
                boxShadow: active ? "2px 2px 0 #1B1B1F" : "none",
                transform: active ? "translate(-1px, -1px)" : "none",
              }}
            >
              <Icon size={18} strokeWidth={active ? 3 : 2} className="text-ink" />
            </div>
            <span 
              className={`font-hand text-sm mt-1 leading-none ${
                active ? "font-marker text-ink" : "text-ink/75"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
