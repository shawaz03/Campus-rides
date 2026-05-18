"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CarMascot,
  CloudDoodle,
  SunDoodle,
  StarDoodle,
  BlobDoodle,
  ArrowDoodle,
  PinDoodle,
  CoinDoodle,
  SquiggleDoodle,
  PaperPlane,
  HeartDoodle,
} from "@/components/doodles";
import { Shield, Sparkles, TrendingUp, Zap, Clock } from "lucide-react";
import { useStudent } from "@/hooks/use-student";
import type { StudentDriver } from "@/lib/student-types";

const HOTSPOTS = [
  { name: "Secunderabad Station", time: "18 min", fare: "₹142", color: "#FFD23F" },
  { name: "RGIA Airport", time: "55 min", fare: "₹760", color: "#5BC0EB" },
  { name: "Inorbit Mall", time: "24 min", fare: "₹78", color: "#7BC950" },
  { name: "Charminar", time: "14 min", fare: "₹95", color: "#FFB4A2" },
];

// Derive first name from a full name or email.
function getFirstName(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) return name.trim().split(" ")[0];
  if (email) return email.split("@")[0];
  return "friend";
}

// Pick a deterministic avatar colour per driver id.
const DRIVER_COLOURS = ["#FFD23F", "#5BC0EB", "#7BC950", "#9B5DE5", "#FFB4A2", "#FF5A36"];
function driverColour(id: string, index: number) {
  const code = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return DRIVER_COLOURS[(code + index) % DRIVER_COLOURS.length];
}

function DriverCard({ driver, index }: { driver: StudentDriver; index: number }) {
  const color = driverColour(driver.id, index);
  const initial = driver.name ? driver.name[0].toUpperCase() : "?";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -3 }}
      className="border-[2.5px] border-ink rounded-[22px_8px_22px_10px/10px_22px_8px_22px] p-4 bg-cream"
      style={{ boxShadow: "3px 3px 0 #1B1B1F" }}
      data-testid={`driver-${index}`}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink font-marker text-base"
          style={{ background: color, boxShadow: "2px 2px 0 #1B1B1F" }}
        >
          {initial}
        </span>
        <div className="leading-tight">
          <p className="font-marker text-lg flex items-center gap-1">
            {driver.name ?? "Driver"}{" "}
            {driver.isTrusted && (
              <span className="text-leaf" title="trusted">
                <HeartDoodle className="w-4 h-4" />
              </span>
            )}
          </p>
          <p className="font-hand text-sm text-ink/70">{driver.vehicleType ?? "—"}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between font-hand text-base">
        <span>★ {driver.rating?.toFixed(1) ?? "—"}</span>
        <motion.span
          className="font-marker text-tomato"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.2 }}
        >
          nearby
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function StudentHome() {
  const { data, isLoading } = useStudent();

  // Resolved values from real data.
  const name = data?.profile?.name ?? data?.user?.name ?? null;
  const email = data?.user?.email ?? null;
  const firstName = getFirstName(name, email);

  const totalRides = data?.rides?.length ?? 0;
  const walletBalance = data?.profile?.coinsBalance ?? null;
  const trustedDriverCount = (data?.drivers ?? []).filter((d) => d.isTrusted).length;
  const activeRide = (data?.rides ?? []).find((r) => r.status === "active");
  const drivers = data?.drivers ?? [];

  return (
    <div className="space-y-10" data-testid="page-home">
      {/* ── Greeting bar ── */}
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-scribble text-2xl text-tomato"
          >
            ~ welcome back, friend ~
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-marker text-4xl sm:text-5xl leading-[1]"
            data-testid="greeting"
          >
            {isLoading ? (
              "Hey there, where to today?"
            ) : (
              <>Hey <span className="marker">{firstName}</span>, where to today?</>
            )}
          </motion.h1>
        </div>
        <div
          className="hidden sm:flex items-center gap-3 px-4 py-2 border-[2.5px] border-ink rounded-full bg-white"
          style={{ boxShadow: "3px 3px 0 #1B1B1F" }}
        >
          <Sparkles size={16} className="text-tomato" />
          <span className="font-hand text-lg">
            {isLoading ? (
              "loading rides…"
            ) : (
              <><span className="font-marker">{totalRides}</span> rides so far</>
            )}
          </span>
        </div>
      </header>

      {/* ── Hero card ── */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative overflow-hidden border-[2.5px] border-ink rounded-[40px_12px_36px_14px/14px_36px_12px_40px] bg-sun p-7 sm:p-9"
        style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
        data-testid="hero-card"
      >
        <div className="absolute top-3 right-5 w-20 float-c"><CloudDoodle /></div>
        <div className="absolute bottom-3 right-10 w-16 float-b opacity-90"><SunDoodle /></div>
        <div className="absolute top-1/2 right-[42%] w-10 float-a hidden md:block"><StarDoodle color="#FF5A36" /></div>

        <div className="grid md:grid-cols-12 gap-6 items-center relative">
          <div className="md:col-span-7">
            <p className="font-scribble text-2xl text-plum">three taps. one ride.</p>
            <h2 className="font-marker text-3xl sm:text-4xl mt-1 leading-tight">
              Where can I go?<br />
              <span className="scribble">How fast?</span> <span className="text-tomato">How cheap?</span>
            </h2>
            <p className="font-body text-xl text-ink/85 mt-4 max-w-md">
              Tap a hotspot below or open the booking map for a full quote — fares are upfront, no haggling, no surprises.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/student/book" data-testid="hero-cta-book" className="sketch-btn sketch-btn--tomato">
                Book a ride <ArrowDoodle className="w-7 h-5" color="#fff" />
              </Link>
              <Link href="/student/activity" data-testid="hero-cta-activity" className="sketch-btn">
                See my rides
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <div className="absolute -inset-6 -z-10 opacity-90">
              <BlobDoodle color="#FFB4A2" />
            </div>
            <div className="mascot-wobble">
              <CarMascot className="w-full max-w-[340px] mx-auto" />
            </div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -bottom-4 left-2 bg-cream border-[2.5px] border-ink px-3 py-2 font-hand text-base"
              style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
            >
              {walletBalance !== null ? (
                <>₹<span className="font-marker text-tomato">{walletBalance}</span> in wallet</>
              ) : (
                <span className="font-marker text-tomato">wallet</span>
              )}
            </motion.div>
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.55, type: "spring" }}
              className="absolute -top-4 -right-1 w-16 float-b"
            >
              <CoinDoodle />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── Stats row ── */}
      <section className="grid sm:grid-cols-3 gap-5" data-testid="stats-row">
        {[
          { icon: Zap, label: "Avg pickup", value: "4 min", color: "#FFD23F", note: "around your campus" },
          { icon: TrendingUp, label: "Saved this month", value: "₹1,240", color: "#7BC950", note: "vs solo rides" },
          {
            icon: Shield,
            label: "Trusted drivers",
            value: isLoading ? "…" : `${trustedDriverCount} nearby`,
            color: "#5BC0EB",
            note: "all verified",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14, rotate: i % 2 ? -1 : 1 }}
            animate={{ opacity: 1, y: 0, rotate: i % 2 ? -0.6 : 0.6 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            whileHover={{ rotate: 0, y: -4 }}
            className="sketch-card !p-5 bg-white"
            data-testid={`stat-${i}`}
          >
            <div className="flex items-start justify-between">
              <span
                className="w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink"
                style={{ background: s.color, boxShadow: "2px 2px 0 #1B1B1F" }}
              >
                <s.icon size={18} strokeWidth={2.5} />
              </span>
              <SquiggleDoodle className="w-16 h-4" color={s.color} />
            </div>
            <p className="font-scribble text-tomato text-lg mt-3">{s.label}</p>
            <p className="font-marker text-3xl mt-0">{s.value}</p>
            <p className="font-hand text-ink/70 text-base mt-1">{s.note}</p>
          </motion.div>
        ))}
      </section>

      {/* ── Hotspots ── */}
      <section data-testid="hotspots">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="font-scribble text-xl text-leaf">~ quick taps ~</p>
            <h3 className="font-marker text-3xl">Popular hops</h3>
          </div>
          <Link href="/student/book" className="font-hand text-lg underline decoration-tomato underline-offset-4">
            see all destinations →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOTSPOTS.map((h, i) => (
            <motion.div
              key={h.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -5, rotate: i % 2 ? -1.5 : 1.5 }}
              className="sketch-card !p-5 cursor-pointer relative"
              style={{ background: h.color }}
              data-testid={`hotspot-${i}`}
            >
              <div className="absolute -top-3 -right-3 w-10"><PinDoodle /></div>
              <p className="font-marker text-xl pr-8">{h.name}</p>
              <div className="flex items-center justify-between mt-3 font-hand text-lg">
                <span className="inline-flex items-center gap-1"><Clock size={14} /> {h.time}</span>
                <span className="font-marker">{h.fare}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Live driver activity ── */}
      <section
        className="relative border-[2.5px] border-ink rounded-[32px_10px_28px_12px/12px_28px_10px_32px] p-6 sm:p-8 bg-white overflow-hidden"
        style={{ boxShadow: "6px 6px 0 #1B1B1F" }}
        data-testid="live-drivers"
      >
        <div className="absolute -top-4 right-6 w-14 float-c"><PaperPlane /></div>
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <p className="font-scribble text-xl text-tomato flex items-center gap-2">
              <span className="relative inline-flex w-3 h-3">
                <span className="absolute inset-0 rounded-full bg-leaf opacity-70 animate-ping" />
                <span className="relative w-3 h-3 rounded-full bg-leaf border-[1.5px] border-ink" />
              </span>
              live around you
            </p>
            <h3 className="font-marker text-3xl">Drivers nearby</h3>
          </div>
          {activeRide ? (
            <Link
              href="/student/activity"
              className="sketch-btn sketch-btn--sun !py-2 !px-4 !text-base"
              data-testid="active-ride-link"
            >
              You&apos;ve got a ride in motion →
            </Link>
          ) : (
            <span className="font-hand text-lg text-ink/70">
              avg <span className="font-marker">4 min</span> pickup time
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="font-hand text-lg text-ink/60 py-4">Finding drivers near you…</p>
        ) : drivers.length === 0 ? (
          <p className="font-hand text-lg text-ink/60 py-4">No drivers online right now. Check back soon!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {drivers.map((d, i) => (
              <DriverCard key={d.id} driver={d} index={i} />
            ))}
          </div>
        )}

        {/* dashed animated road */}
        <div className="mt-6 h-3 dashed-road relative overflow-hidden">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-8 text-tomato"
            initial={{ x: "-10%" }}
            animate={{ x: "110%" }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 60 32" className="w-full">
              <path d="M4,20 C 4,14 8,10 14,10 L 38,10 C 46,10 50,14 50,20" stroke="#1B1B1F" strokeWidth="3" fill="#FF5A36" />
              <circle cx="14" cy="22" r="4" fill="#1B1B1F" />
              <circle cx="44" cy="22" r="4" fill="#1B1B1F" />
            </svg>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
