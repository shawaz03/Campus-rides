"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ArrowDownUp,
  Calendar,
  Users,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useBookingStore } from "@/lib/bookingStore";
import {
  campusPlaces,
  DEFAULT_CENTER,
  rideTypeInfo,
  type RideType,
} from "@/lib/ride-data";
import {
  PinDoodle,
  CoinDoodle,
  StarDoodle,
  SquiggleDoodle,
  ArrowDoodle,
} from "@/components/doodles";
import RideMap from "@/components/student/RideMap";
import { createClient } from "@/lib/supabase/client";

function haversine([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type PlaceOption = {
  id?: string;
  name: string;
  coords: [number, number];
  source: "campus" | "search";
};

function PlacePicker({
  label,
  testId,
  color,
  value,
  onChange,
  placeholder,
  excludeId,
}: {
  label: string;
  testId: string;
  color: string;
  value: { name: string; coords: [number, number] } | null;
  onChange: (v: { name: string; coords: [number, number] } | null) => void;
  placeholder: string;
  excludeId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [liveResults, setLiveResults] = useState<PlaceOption[]>([]);
  const [liveStatus, setLiveStatus] = useState<"idle" | "loading" | "error">("idle");
  const rawQuery = q.trim();
  const query = rawQuery.toLowerCase();
  const shouldSearchLive = rawQuery.length >= 2;

  const campusMatches = useMemo(
    () =>
      campusPlaces
        .filter((p) => p.id !== excludeId)
        .filter((p) => p.name.toLowerCase().includes(query))
        .map((p) => ({
          id: p.id,
          name: p.name,
          coords: p.coords,
          source: "campus" as const,
        })),
    [query, excludeId]
  );

  useEffect(() => {
    if (!open) {
      setLiveResults([]);
      setLiveStatus("idle");
      return;
    }

    if (!shouldSearchLive) {
      setLiveResults([]);
      setLiveStatus("idle");
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLiveStatus("loading");
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(rawQuery)}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("geocode failed");
        }
        const data = (await res.json()) as { results?: Array<{ name: string; coords: [number, number] }> };
        const results = Array.isArray(data.results) ? data.results : [];
        setLiveResults(
          results
            .map((item) => ({
              name: item.name,
              coords: item.coords,
              source: "search" as const,
            }))
            .filter((item) => item.name && item.coords?.length === 2)
        );
        setLiveStatus("idle");
      } catch (error) {
        if (controller.signal.aborted) return;
        setLiveResults([]);
        setLiveStatus("error");
      }
    }, 1000);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [open, rawQuery, shouldSearchLive]);

  const displayList: PlaceOption[] = shouldSearchLive
    ? (campusMatches as PlaceOption[]).concat(liveResults)
    : (campusMatches as PlaceOption[]);
  const showSearchError = shouldSearchLive && liveStatus === "error" && campusMatches.length === 0;
  const showEmpty = displayList.length === 0 && liveStatus !== "loading" && !showSearchError;
  return (
    <div className="relative" data-testid={testId}>
      <label className="font-scribble text-base text-tomato">{label}</label>
      <div
        className="mt-1 flex items-center gap-3 px-3 py-2.5 border-[2.5px] border-ink rounded-[18px_8px_18px_10px/10px_18px_8px_18px] bg-cream cursor-pointer"
        style={{ boxShadow: "3px 3px 0 #1B1B1F" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className="w-9 h-9 grid place-items-center rounded-full border-[2px] border-ink shrink-0"
          style={{ background: color, boxShadow: "2px 2px 0 #1B1B1F" }}
        >
          <MapPin size={15} strokeWidth={2.5} />
        </span>
        <span
          className={`flex-1 font-hand text-lg truncate ${value ? "text-ink" : "text-ink/50"}`}
          data-testid={`${testId}-input`}
        >
          {value?.name ?? placeholder}
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-30 mt-2 w-full bg-white border-[2.5px] border-ink rounded-[18px_8px_18px_10px/10px_18px_8px_18px] p-3"
            style={{ boxShadow: "5px 5px 0 #1B1B1F" }}
            data-testid={`${testId}-dropdown`}
          >
            <div className="flex items-center gap-2 px-2 py-1.5 border-[2px] border-ink rounded-full bg-cream">
              <Search size={14} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="search a place…"
                className="flex-1 bg-transparent outline-none font-hand"
              />
            </div>
            <div className="mt-2 max-h-56 overflow-y-auto">
              {shouldSearchLive && liveStatus === "loading" && (
                <p className="font-hand text-base text-ink/60 px-2 py-2">Searching...</p>
              )}
              {showSearchError && (
                <p className="font-hand text-base text-ink/60 px-2 py-2">Search unavailable. Try again.</p>
              )}
              {showEmpty && (
                <p className="font-hand text-base text-ink/60 px-2 py-3">
                  {rawQuery.length < 2 ? "Type at least 2 letters to search." : "No matches."}
                </p>
              )}
              {displayList.map((p, index) => (
                <button
                  key={p.id ?? `${p.source}-${index}`}
                  onClick={() => {
                    onChange({ name: p.name, coords: p.coords });
                    setOpen(false);
                    setQ("");
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-sun/40 transition-colors font-hand text-lg flex items-center gap-2"
                  data-testid={`${testId}-option-${p.id ?? `search-${index}`}`}
                >
                  <span className="text-tomato">◉</span>
                  {p.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FEATURES = [
  { id: "pool", title: "Shared campus pool", desc: "Match with classmates going the same way.", icon: Users, color: "#7BC950" },
  { id: "schedule", title: "Scheduled rides", desc: "Lock in a 5 AM airport run — we'll remind you.", icon: Calendar, color: "#5BC0EB" },
  { id: "trust", title: "Trusted driver badge", desc: "Drivers reviewed by 30+ students get the badge.", icon: ShieldCheck, color: "#FFD23F" },
];

export default function BookRidePage() {
  const supabase = useMemo(() => createClient(), []);
  const {
    pickup,
    destination,
    rideType,
    scheduled,
    scheduledFor,
    setPickup,
    setDestination,
    setRideType,
    setScheduled,
    setScheduledFor,
    swap,
  } = useBookingStore();

  const distanceKm = useMemo(() => {
    if (!pickup || !destination) return 0;
    return haversine(pickup.coords, destination.coords);
  }, [pickup, destination]);

  const fare = useMemo(() => {
    const info = rideTypeInfo[rideType];
    if (!distanceKm) return 0;
    return Math.round(info.base + info.perKm * distanceKm);
  }, [rideType, distanceKm]);

  const eta = useMemo(() => {
    if (!distanceKm) return rideTypeInfo[rideType].eta;
    const speed = rideType === "bike" ? 28 : rideType === "auto" ? 22 : 26;
    return `${Math.max(4, Math.round((distanceKm / speed) * 60))} min`;
  }, [distanceKm, rideType]);

  const [booking, setBooking] = useState<"idle" | "confirming" | "booked">("idle");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("cash");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const onBook = async () => {
    if (!pickup || !destination || booking === "confirming") return;
    setBookingError(null);
    setBooking("confirming");

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setBooking("idle");
      setBookingError("Please sign in to request a ride.");
      return;
    }

    const durationMinutes = Math.max(
      4,
      Math.round((distanceKm / (rideType === "bike" ? 28 : rideType === "auto" ? 22 : 26)) * 60)
    );

    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupLabel: pickup.name,
        destinationLabel: destination.name,
        rideType,
        distanceKm,
        durationMin: durationMinutes,
        fare,
        scheduledAt: scheduled ? scheduledFor || null : null,
        paymentMethod,
      }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setBooking("idle");
      setBookingError(data?.error ?? "Could not place the request. Please try again.");
      return;
    }

    setBooking("booked");
  };

  return (
    <div className="space-y-8" data-testid="page-book">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="font-scribble text-2xl text-tomato">~ tap, swipe, ride ~</p>
          <h1 className="font-marker text-4xl sm:text-5xl">Book a <span className="scribble">ride</span></h1>
        </div>
        <p className="font-hand text-lg text-ink/70 max-w-sm">
          Fares are upfront. Pickup in <span className="font-marker text-tomato">~4 min</span>. No surge before 8 PM.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* ── Booking form ── */}
        <section className="lg:col-span-5 space-y-5">
          <div
            className="border-[2.5px] border-ink rounded-[28px_10px_24px_12px/12px_24px_10px_28px] bg-white p-5 space-y-4 relative"
            style={{ boxShadow: "6px 6px 0 #1B1B1F" }}
            data-testid="booking-form"
          >
            <div className="absolute -top-4 -right-4 w-12 float-c"><PinDoodle /></div>
            <PlacePicker
              label="pickup"
              testId="pickup-picker"
              color="#7BC950"
              value={pickup}
              onChange={setPickup}
              placeholder="where are you now?"
              excludeId={destination ? campusPlaces.find((p) => p.name === destination.name)?.id : undefined}
            />
            <div className="flex justify-center -my-2">
              <button
                onClick={swap}
                aria-label="Swap pickup and destination"
                className="w-10 h-10 grid place-items-center rounded-full border-[2.5px] border-ink bg-sun hover:rotate-180 transition-transform duration-500"
                style={{ boxShadow: "2px 2px 0 #1B1B1F" }}
                data-testid="swap-btn"
              >
                <ArrowDownUp size={16} strokeWidth={2.5} />
              </button>
            </div>
            <PlacePicker
              label="destination"
              testId="dest-picker"
              color="#FF5A36"
              value={destination}
              onChange={setDestination}
              placeholder="where to?"
              excludeId={pickup ? campusPlaces.find((p) => p.name === pickup.name)?.id : undefined}
            />

            {/* Ride type chips */}
            <div className="pt-2">
              <p className="font-scribble text-base text-plum mb-2">pick your ride</p>
              <div className="grid grid-cols-4 gap-2" data-testid="ride-type-row">
                {(Object.keys(rideTypeInfo) as RideType[]).map((t) => {
                  const info = rideTypeInfo[t];
                  const active = rideType === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setRideType(t)}
                      data-testid={`ride-type-${t}`}
                      className={`relative border-[2.5px] border-ink rounded-[18px_6px_18px_8px/8px_18px_6px_18px] p-2 text-center transition-transform ${
                        active ? "" : "hover:-translate-y-0.5"
                      }`}
                      style={{
                        background: active ? info.color : "#FDF6E3",
                        boxShadow: active ? "4px 4px 0 #1B1B1F" : "2px 2px 0 #1B1B1F",
                        transform: active ? "translate(-1px,-2px)" : undefined,
                      }}
                    >
                      <p className="font-marker text-base">{info.label}</p>
                      <p className="font-hand text-xs text-ink/70">{info.eta}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule toggle */}
            <label
              className="flex items-center gap-3 mt-2 px-3 py-2 border-[2px] border-ink rounded-full bg-cream font-hand text-base cursor-pointer"
              data-testid="schedule-toggle"
            >
              <input
                type="checkbox"
                checked={scheduled}
                onChange={(e) => setScheduled(e.target.checked)}
                className="accent-tomato w-4 h-4"
                suppressHydrationWarning
              />
              schedule for later
              {scheduled && (
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="ml-auto bg-transparent outline-none font-hand text-sm border-b-2 border-ink/40 focus:border-tomato"
                  data-testid="schedule-input"
                  suppressHydrationWarning
                />
              )}
            </label>
          </div>

          {/* Fare summary */}
          <motion.div
            layout
            className="border-[2.5px] border-ink rounded-[28px_10px_24px_12px/12px_24px_10px_28px] p-5 bg-sun relative overflow-hidden"
            style={{ boxShadow: "6px 6px 0 #1B1B1F" }}
            data-testid="fare-card"
          >
            <div className="absolute -top-3 -right-3 w-16 float-b"><CoinDoodle /></div>
            <p className="font-scribble text-xl text-tomato">~ fare estimate ~</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="font-marker text-5xl">₹{fare || "—"}</span>
              <span className="font-hand text-lg text-ink/70 mb-1">
                {distanceKm ? `${distanceKm.toFixed(1)} km` : "pick both stops"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 font-hand text-base">
              <div>
                <p className="text-ink/60">ride</p>
                <p className="font-marker text-lg">{rideTypeInfo[rideType].label}</p>
              </div>
              <div>
                <p className="text-ink/60">eta</p>
                <p className="font-marker text-lg">{eta}</p>
              </div>
              <div>
                <p className="text-ink/60">surge</p>
                <p className="font-marker text-lg text-leaf">none</p>
              </div>
            </div>
            <SquiggleDoodle className="absolute bottom-2 left-4 w-24 h-4" color="#FF5A36" />
          </motion.div>

          <div
            className="border-[2.5px] border-ink rounded-[28px_10px_24px_12px/12px_24px_10px_28px] p-5 bg-white"
            style={{ boxShadow: "6px 6px 0 #1B1B1F" }}
            data-testid="payment-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-scribble text-xl text-plum">~ payment ~</p>
                <h3 className="font-marker text-2xl mt-1">Choose a mode</h3>
              </div>
              <div className="w-10 float-b">
                <CoinDoodle />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {([
                { id: "cash", label: "Cash" },
                { id: "upi", label: "UPI" },
              ] as const).map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-full border-[2.5px] border-ink font-hand text-lg cursor-pointer"
                  style={{
                    background: paymentMethod === method.id ? "#FFD23F" : "#FDF6E3",
                    boxShadow: paymentMethod === method.id ? "3px 3px 0 #1B1B1F" : "2px 2px 0 #1B1B1F",
                  }}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-tomato w-4 h-4"
                  />
                  {method.label}
                </label>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between font-hand text-base text-ink/70">
              <span>Platform fee</span>
              <span>10% included</span>
            </div>

            <button
              onClick={onBook}
              disabled={!pickup || !destination || booking === "confirming" || fare === 0}
              className="mt-4 sketch-btn sketch-btn--tomato w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="confirm-book-btn"
            >
              {booking === "idle" && (
                <>Pay ₹{fare || "—"} & request <ArrowDoodle className="w-7 h-5" color="#fff" /></>
              )}
              {booking === "confirming" && "processing payment…"}
              {booking === "booked" && "✓ booked! see Activity →"}
            </button>
            {bookingError && (
              <p className="mt-3 font-hand text-base text-tomato text-center" data-testid="booking-error">
                {bookingError}
              </p>
            )}
          </div>
        </section>

        {/* ── Map ── */}
        <section className="lg:col-span-7" data-testid="map-section">
          <div className="h-[420px] sm:h-[520px] lg:h-[640px]">
            <RideMap pickup={pickup} destination={destination} center={DEFAULT_CENTER} />
          </div>
          <p className="mt-3 font-hand text-base text-ink/60 flex items-center gap-2">
            <StarDoodle className="w-4 h-4" color="#FFD23F" /> map by OpenStreetMap • routed live via OpenRouteService once you wire it up
          </p>
        </section>
      </div>

      {/* ── Features row ── */}
      <section className="grid sm:grid-cols-3 gap-5" data-testid="features-row">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 14, rotate: i % 2 ? -1 : 1 }}
            animate={{ opacity: 1, y: 0, rotate: i % 2 ? -0.6 : 0.6 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            whileHover={{ rotate: 0, y: -4 }}
            className="sketch-card !p-5 bg-white"
            data-testid={`feature-${f.id}`}
          >
            <div className="sticky-tape" style={{ background: f.color }}>{f.title.split(" ")[0]}</div>
            <div className="flex items-center gap-3 mt-2">
              <span
                className="w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink"
                style={{ background: f.color, boxShadow: "2px 2px 0 #1B1B1F" }}
              >
                <f.icon size={18} strokeWidth={2.5} />
              </span>
              <h3 className="font-marker text-xl">{f.title}</h3>
            </div>
            <p className="font-body text-lg mt-3 text-ink/85">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
