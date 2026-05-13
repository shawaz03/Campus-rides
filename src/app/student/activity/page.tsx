"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  Navigation,
} from "lucide-react";
import { mockRides, type MockRide } from "@/lib/mockData";
import { SquiggleDoodle, CoinDoodle, StarDoodle, ArrowDoodle, PinDoodle } from "@/components/doodles";

const STATUS_CONFIG = {
  active: { label: "In progress", color: "#7BC950", bg: "#7BC950", icon: Navigation },
  scheduled: { label: "Scheduled", color: "#5BC0EB", bg: "#5BC0EB", icon: Calendar },
  completed: { label: "Completed", color: "#FFD23F", bg: "#FFD23F", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "#FFB4A2", bg: "#FFB4A2", icon: XCircle },
};

function RideCard({ ride, index }: { ride: MockRide; index: number }) {
  const [expanded, setExpanded] = useState(ride.status === "active");
  const cfg = STATUS_CONFIG[ride.status];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: index % 2 ? -0.8 : 0.8 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 ? -0.4 : 0.4 }}
      whileHover={{ rotate: 0, y: -3 }}
      transition={{ delay: index * 0.06 }}
      className="border-[2.5px] border-ink rounded-[28px_10px_24px_12px/12px_24px_10px_28px] bg-white overflow-hidden"
      style={{ boxShadow: "5px 5px 0 #1B1B1F" }}
      data-testid={`ride-card-${ride.id}`}
    >
      {/* Status tape */}
      <div
        className="px-5 py-2 flex items-center justify-between font-hand text-base border-b-[2px] border-dashed border-ink/30"
        style={{ background: cfg.bg }}
      >
        <span className="flex items-center gap-2 font-marker text-base">
          <StatusIcon size={14} strokeWidth={2.5} />
          {cfg.label}
        </span>
        {ride.scheduledAt && (
          <span className="text-ink/80">{ride.scheduledAt}</span>
        )}
        {ride.completedAt && (
          <span className="text-ink/70">{ride.completedAt}</span>
        )}
        {ride.status === "active" && (
          <motion.span
            className="flex items-center gap-1 text-ink"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-ink inline-block" />
            live
          </motion.span>
        )}
      </div>

      {/* Main info */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center pt-1 shrink-0">
            <span className="w-4 h-4 rounded-full border-[2px] border-ink bg-leaf" />
            <span className="w-0.5 h-8 bg-ink/20 my-1" />
            <span className="w-4 h-4 rounded-full border-[2px] border-ink bg-tomato" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="font-hand text-sm text-ink/60">from</p>
              <p className="font-marker text-lg leading-tight">{ride.pickup}</p>
            </div>
            <div>
              <p className="font-hand text-sm text-ink/60">to</p>
              <p className="font-marker text-lg leading-tight">{ride.destination}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-marker text-3xl">₹{ride.fare}</p>
            <p className="font-hand text-sm text-ink/60">{ride.distance}</p>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full border-[2px] border-ink bg-cream font-hand text-sm capitalize" style={{ boxShadow: "2px 2px 0 #1B1B1F" }}>
            {ride.rideType}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full border-[2px] border-ink bg-cream font-hand text-sm" style={{ boxShadow: "2px 2px 0 #1B1B1F" }}>
            <Clock size={12} /> {ride.duration}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full border-[2px] border-ink bg-cream font-hand text-sm" style={{ boxShadow: "2px 2px 0 #1B1B1F" }}>
            <MapPin size={12} /> {ride.distance}
          </span>
        </div>

        {/* Expand toggle */}
        {ride.driver && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-4 w-full flex items-center justify-between font-hand text-base text-ink/70 hover:text-ink transition-colors"
            data-testid={`expand-${ride.id}`}
          >
            <span>{expanded ? "hide driver details" : "show driver details"}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}

        {/* Driver detail panel */}
        <AnimatePresence initial={false}>
          {expanded && ride.driver && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="mt-4 flex items-center gap-4 p-4 rounded-[18px_6px_18px_8px/8px_18px_6px_18px] border-[2px] border-ink"
                style={{ background: ride.driver.color + "33", boxShadow: "3px 3px 0 #1B1B1F" }}
                data-testid={`driver-detail-${ride.id}`}
              >
                <span
                  className="w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink font-marker text-xl shrink-0"
                  style={{ background: ride.driver.color, boxShadow: "2px 2px 0 #1B1B1F" }}
                >
                  {ride.driver.name[0]}
                </span>
                <div className="flex-1">
                  <p className="font-marker text-lg flex items-center gap-2">
                    {ride.driver.name}
                    {ride.driver.trusted && (
                      <span className="text-xs font-hand bg-leaf/30 border border-leaf px-2 py-0.5 rounded-full text-ink">
                        ✓ trusted
                      </span>
                    )}
                  </p>
                  <p className="font-hand text-base text-ink/70">
                    {ride.driver.vehicle} • {ride.driver.plate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-marker text-lg flex items-center gap-1">
                    <Star size={14} className="fill-current text-sun" />
                    {ride.driver.rating}
                  </p>
                </div>
              </div>

              {/* Ride mini-replay animation for completed */}
              {ride.status === "completed" && (
                <div className="mt-3 relative h-8 rounded-full overflow-hidden bg-cream border-[2px] border-ink/20">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{ background: ride.driver.color }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center font-hand text-sm text-ink z-10">
                    ride replay ↝
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const TABS = ["all", "active", "scheduled", "completed"] as const;
type Tab = typeof TABS[number];

export default function ActivityPage() {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = tab === "all"
    ? mockRides
    : mockRides.filter((r) => r.status === tab);

  const activeRide = mockRides.find((r) => r.status === "active");

  return (
    <div className="space-y-8" data-testid="page-activity">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="font-scribble text-2xl text-tomato">~ your ride diary ~</p>
          <h1 className="font-marker text-4xl sm:text-5xl">
            Activity <span className="scribble">log</span>
          </h1>
        </div>
        <p className="font-hand text-lg text-ink/70">
          <span className="font-marker text-tomato">{mockRides.length}</span> rides total
        </p>
      </header>

      {/* Active ride banner */}
      {activeRide && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative border-[2.5px] border-ink rounded-[28px_10px_24px_12px/12px_24px_10px_28px] bg-leaf/20 p-5 overflow-hidden"
          style={{ boxShadow: "6px 6px 0 #1B1B1F" }}
          data-testid="active-ride-banner"
        >
          <div className="absolute -top-3 right-5 w-10">
            <PinDoodle />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="relative flex w-4 h-4">
              <span className="absolute inset-0 rounded-full bg-leaf opacity-60 animate-ping" />
              <span className="relative w-4 h-4 rounded-full bg-leaf border-[2px] border-ink" />
            </span>
            <p className="font-marker text-xl">
              You&apos;re on a ride right now!{" "}
              <span className="font-hand text-lg text-ink/70">
                {activeRide.pickup} → {activeRide.destination}
              </span>
            </p>
            <Link
              href="/student/book"
              className="ml-auto sketch-btn sketch-btn--tomato !py-1.5 !px-4 !text-base"
              data-testid="track-ride-btn"
            >
              Track <ArrowDoodle className="w-6 h-4" color="#fff" />
            </Link>
          </div>
          {/* animated road */}
          <div className="mt-4 h-2 dashed-road relative overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 h-full w-8"
              initial={{ x: "-10%" }}
              animate={{ x: "110%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 32 16" className="w-full h-full">
                <rect width="32" height="16" rx="4" fill="#FF5A36" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Tab filters */}
      <div className="flex flex-wrap gap-2" data-testid="activity-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            data-testid={`tab-${t}`}
            className="px-4 py-1.5 rounded-full border-[2.5px] border-ink font-hand text-lg capitalize transition-all"
            style={{
              background: tab === t ? STATUS_CONFIG[t === "all" ? "active" : t]?.bg ?? "#FFD23F" : "#FDF6E3",
              boxShadow: tab === t ? "3px 3px 0 #1B1B1F" : "2px 2px 0 #1B1B1F",
              transform: tab === t ? "translate(-1px,-1px)" : undefined,
            }}
          >
            {t}
            <span className="ml-2 font-marker text-base">
              {t === "all" ? mockRides.length : mockRides.filter((r) => r.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Summary mini-stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total spent", value: `₹${mockRides.filter(r => r.status === "completed").reduce((s, r) => s + r.fare, 0)}`, color: "#FFD23F", doodle: <CoinDoodle /> },
          { label: "Rides done", value: mockRides.filter(r => r.status === "completed").length, color: "#7BC950", doodle: <StarDoodle color="#7BC950" /> },
          { label: "Km covered", value: "43.1 km", color: "#5BC0EB", doodle: <SquiggleDoodle color="#5BC0EB" /> },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="sketch-card !p-4 bg-white flex items-center gap-4"
            data-testid={`summary-stat-${i}`}
          >
            <span className="w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink shrink-0" style={{ background: s.color, boxShadow: "2px 2px 0 #1B1B1F" }}>
              <div className="w-8 h-8">{s.doodle}</div>
            </span>
            <div>
              <p className="font-scribble text-tomato text-base">{s.label}</p>
              <p className="font-marker text-2xl">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ride list */}
      <div className="space-y-5" data-testid="ride-list">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className="font-marker text-3xl">no rides here yet ✿</p>
              <p className="font-hand text-lg text-ink/60 mt-2">time to book your first one!</p>
              <Link href="/student/book" className="sketch-btn sketch-btn--tomato mt-6 inline-flex">
                Book a ride <ArrowDoodle className="w-7 h-5" color="#fff" />
              </Link>
            </motion.div>
          ) : (
            <motion.div key={tab} className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filtered.map((ride, i) => (
                <RideCard key={ride.id} ride={ride} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
