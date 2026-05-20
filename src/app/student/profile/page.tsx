"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  BadgeCheck,
  Phone,
  Mail,
  GraduationCap,
  Bike,
  Car,
  AlertTriangle,
  MapPinned,
  ShieldCheck,
  Bell,
  Moon,
  Heart,
  Share2,
  Copy,
  Check,
  X,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { rideTypeInfo, type RideType } from "@/lib/mockData";
import { CoinDoodle, StarDoodle, SquiggleDoodle, ArrowDoodle } from "@/components/doodles";
import { useStudent } from "@/hooks/use-student";
import { parseEmergencyContact } from "@/lib/student-utils";

const SAFETY = [
  {
    id: "sos",
    title: "Emergency SOS",
    desc: "One tap alerts your emergency contact + nearest campus security with your live location.",
    icon: AlertTriangle,
    color: "#FF5A36",
    cta: "Trigger SOS",
  },
  {
    id: "live",
    title: "Live trip sharing",
    desc: "Share your live ride link with mom, bestie, hostel warden — they see your trip in real time.",
    icon: MapPinned,
    color: "#5BC0EB",
    cta: "Share next ride",
  },
  {
    id: "verify",
    title: "Driver verification",
    desc: "Every driver clears police verification + 2 student references. Trusted ones earn a badge.",
    icon: ShieldCheck,
    color: "#7BC950",
    cta: "How it works",
  },
];

const PREFS_DEFAULT = [
  { id: "notif", label: "Ride notifications", icon: Bell, on: true },
  { id: "darkride", label: "Dark mode while riding", icon: Moon, on: false },
  { id: "pool", label: "Auto-suggest campus pool", icon: Heart, on: true },
];

function Toggle({ on, onChange, testId }: { on: boolean; onChange: () => void; testId: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      data-testid={testId}
      className={`w-12 h-7 rounded-full border-[2.5px] border-ink relative transition-colors ${
        on ? "bg-leaf" : "bg-cream"
      }`}
      style={{ boxShadow: "2px 2px 0 #1B1B1F" }}
    >
      <motion.span
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full border-[2px] border-ink bg-white"
      />
    </button>
  );
}

// Derive initials from a name or fall back to email initial.
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
  return email ? email[0].toUpperCase() : "?";
}

// Resolve emergency contact display name from the stored value (object or plain string).
function emergencyName(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return typeof obj.name === "string" ? obj.name : null;
  }
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

class EmergencySiren {
  private ctx: AudioContext | null = null;
  private oscillator1: OscillatorNode | null = null;
  private oscillator2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  start() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();

      // Setup main alarm sound
      this.oscillator1 = this.ctx.createOscillator();
      this.oscillator2 = this.ctx.createOscillator();
      const modulationGain = this.ctx.createGain();
      this.gainNode = this.ctx.createGain();

      this.oscillator1.type = "sawtooth";
      this.oscillator1.frequency.value = 800; // Base freq

      // Low frequency oscillator wails 2 times per second
      this.oscillator2.type = "sine";
      this.oscillator2.frequency.value = 2; // Wail cycles/sec
      modulationGain.gain.value = 150; // Pitch wails between 650Hz and 950Hz

      this.gainNode.gain.value = 0.25; // Volume level

      // Connect modulator to oscillator frequency
      this.oscillator2.connect(modulationGain);
      modulationGain.connect(this.oscillator1.frequency);

      // Connect main sound to output
      this.oscillator1.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.oscillator1.start();
      this.oscillator2.start();
    } catch (err) {
      console.warn("AudioContext blocked or not supported:", err);
    }
  }

  stop() {
    try {
      if (this.oscillator1) {
        this.oscillator1.stop();
        this.oscillator1.disconnect();
      }
      if (this.oscillator2) {
        this.oscillator2.stop();
        this.oscillator2.disconnect();
      }
      if (this.ctx && this.ctx.state !== "closed") {
        this.ctx.close();
      }
    } catch (err) {
      console.warn("Failed to stop siren:", err);
    } finally {
      this.oscillator1 = null;
      this.oscillator2 = null;
      this.gainNode = null;
      this.ctx = null;
    }
  }
}

export default function ProfilePage() {
  const { data, isLoading } = useStudent();
  const [prefs, setPrefs] = useState(PREFS_DEFAULT);
  const [fav, setFav] = useState<RideType>("auto");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("campus-rides-prefs");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setPrefs((prev) =>
              prev.map((def) => {
                const found = parsed.find((p) => p.id === def.id);
                return found ? { ...def, on: Boolean(found.on) } : def;
              })
            );
          }
        } catch (e) {
          console.warn("Failed to parse stored preferences:", e);
        }
      }
    }
  }, []);

  // Auto-trigger SOS if query param is set (e.g. from Mobile Bottom Navigation)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("triggerSos") === "true") {
        setShowSOSModal(true);
        setSosStatus("countdown");
        setSosCountdown(3);
        setSosError(null);
        // Clean up URL query parameter to prevent re-triggering on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, []);

  const handlePrefToggle = (id: string) => {
    setPrefs((prev) => {
      const updated = prev.map((x) => (x.id === id ? { ...x, on: !x.on } : x));
      if (typeof window !== "undefined") {
        localStorage.setItem("campus-rides-prefs", JSON.stringify(updated));
        window.dispatchEvent(new Event("prefs-changed"));
      }
      return updated;
    });
  };

  // SOS Emergency States
  const sirenRef = useRef<EmergencySiren | null>(null);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosStatus, setSosStatus] = useState<"idle" | "countdown" | "triggering" | "active" | "resolving">("idle");
  const [sosCountdown, setSosCountdown] = useState(3);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [sosLocation, setSosLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sosError, setSosError] = useState<string | null>(null);

  // Stop siren on unmount
  useEffect(() => {
    return () => {
      if (sirenRef.current) {
        sirenRef.current.stop();
      }
    };
  }, []);

  // Parse emergency contact info dynamically
  const emergencyInfo = parseEmergencyContact(data?.profile?.emergencyContact);

  // SOS Countdown logic
  useEffect(() => {
    if (sosStatus !== "countdown") return;

    if (sosCountdown === 0) {
      triggerSOS();
      return;
    }

    const timer = setTimeout(() => {
      setSosCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sosCountdown, sosStatus]);

  const triggerSOS = async () => {
    // Start sirens immediately
    if (!sirenRef.current) {
      sirenRef.current = new EmergencySiren();
    }
    sirenRef.current.start();

    setSosStatus("triggering");
    setSosError(null);

    // Get current location from navigator.geolocation
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSosLocation({ lat: latitude, lng: longitude });

        try {
          const res = await fetch("/api/sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error ?? "Failed to log SOS alert in database");
          }

          const responseData = await res.json();
          setActiveAlertId(responseData.alert.id);
          setSosStatus("active");
        } catch (err: any) {
          console.error("SOS trigger error:", err);
          setSosError(err.message ?? "Could not send emergency signal to security server.");
          setSosStatus("active");
        }
      },
      async (err) => {
        console.warn("Geolocation failed for SOS, trying fallback create:", err);
        // Fallback: create alert even without precise location
        try {
          const res = await fetch("/api/sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          if (res.ok) {
            const responseData = await res.json();
            setActiveAlertId(responseData.alert.id);
          }
        } catch (postErr) {
          console.error("Failed fallback SOS post:", postErr);
        }
        setSosError("Could not retrieve GPS coordinates, but emergency alarm has been dispatched.");
        setSosStatus("active");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const resolveSOS = async () => {
    // Silence siren
    if (sirenRef.current) {
      sirenRef.current.stop();
      sirenRef.current = null;
    }

    if (!activeAlertId) {
      setSosStatus("idle");
      setShowSOSModal(false);
      return;
    }

    setSosStatus("resolving");
    try {
      const res = await fetch("/api/sos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId: activeAlertId }),
      });

      if (!res.ok) {
        throw new Error("Failed to mark SOS as resolved in backend.");
      }

      setSosStatus("idle");
      setShowSOSModal(false);
      setActiveAlertId(null);
      setSosLocation(null);
    } catch (err: any) {
      alert(err.message ?? "Failed to resolve SOS alert. Please try again.");
      setSosStatus("active");
    }
  };

  // Resolved identity fields
  const name = data?.profile?.name ?? data?.user?.name ?? null;
  const email = data?.profile?.email ?? data?.user?.email ?? null;
  const initials = getInitials(name, email);
  const displayName = name ?? email ?? "Student";
  const emergencyContactName = emergencyName(data?.profile?.emergencyContact);

  if (isLoading) {
    return (
      <div className="space-y-8" data-testid="page-profile">
        <header>
          <p className="font-scribble text-2xl text-tomato">~ that&apos;s you, friend ~</p>
          <h1 className="font-marker text-4xl sm:text-5xl">Your <span className="marker">profile</span></h1>
        </header>
        <div className="flex items-center justify-center py-16">
          <p className="font-hand text-xl text-ink/60 animate-pulse">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="page-profile">
      <header>
        <p className="font-scribble text-2xl text-tomato">~ that&apos;s you, friend ~</p>
        <h1 className="font-marker text-4xl sm:text-5xl">Your <span className="marker">profile</span></h1>
      </header>

      {/* Identity card */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative border-[2.5px] border-ink rounded-[32px_12px_28px_14px/14px_28px_12px_32px] p-6 sm:p-8 bg-sun overflow-hidden"
        style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
        data-testid="identity-card"
      >
        <div className="absolute -top-3 right-6 w-20 float-c"><CoinDoodle /></div>
        <div className="absolute bottom-3 right-12 w-10 float-b opacity-90"><StarDoodle color="#FF5A36" /></div>
        <div className="grid md:grid-cols-12 gap-6 items-center relative">
          <div className="md:col-span-3 flex flex-col items-center">
            <div className="relative">
              <span
                className="w-28 h-28 grid place-items-center rounded-full border-[3px] border-ink font-marker text-4xl text-white"
                style={{ background: "#FF5A36", boxShadow: "5px 5px 0 #1B1B1F" }}
              >
                {initials}
              </span>
              <span className="absolute -bottom-1 -right-1 w-9 h-9 grid place-items-center bg-leaf rounded-full border-[2.5px] border-ink">
                <BadgeCheck size={16} strokeWidth={2.5} />
              </span>
            </div>
            <p className="mt-3 font-scribble text-tomato text-lg">verified student</p>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-marker text-3xl sm:text-4xl">{displayName}</h2>
            <p className="font-hand text-lg text-ink/80 flex items-center gap-2 mt-1">
              <GraduationCap size={16} /> Campus Rides Student
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3 font-hand text-base">
              {email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-tomato" /> {email}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-tomato" />
                <span className="text-ink/60 italic">not set</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-tomato" /> ID:{" "}
                <span className="font-marker">{data?.profile?.id?.slice(0, 8) ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bike size={14} className="text-tomato" /> Campus Rides Member
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Favourite ride */}
      <section data-testid="fav-ride">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="font-scribble text-xl text-plum">~ ride of choice ~</p>
            <h3 className="font-marker text-2xl">Favourite ride</h3>
          </div>
          <SquiggleDoodle className="w-24 h-4" color="#9B5DE5" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(rideTypeInfo) as RideType[]).map((t) => {
            const info = rideTypeInfo[t];
            const active = fav === t;
            return (
              <button
                key={String(t)}
                onClick={() => setFav(t)}
                data-testid={`fav-${t}`}
                className="relative border-[2.5px] border-ink rounded-[22px_8px_22px_10px/10px_22px_8px_22px] p-4 text-left transition-transform"
                style={{
                  background: active ? info.color : "#FDF6E3",
                  boxShadow: active ? "5px 5px 0 #1B1B1F" : "2px 2px 0 #1B1B1F",
                  transform: active ? "translate(-2px,-2px)" : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-marker text-xl">{info.label}</p>
                  {t === "cab" ? <Car size={18} /> : <Bike size={18} />}
                </div>
                <p className="font-hand text-base text-ink/70">{info.blurb}</p>
                {active && <span className="absolute -top-2 right-3 stamp">my pick</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Safety */}
      <section data-testid="safety-section">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="font-scribble text-xl text-tomato">~ peace of mind ~</p>
            <h3 className="font-marker text-2xl">Safety features</h3>
          </div>
          {emergencyContactName && (
            <p className="font-hand text-base text-ink/60">
              emergency contact: <span className="font-marker">{emergencyContactName}</span>
            </p>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {(() => {
            const activeRide = data?.rides?.find(
              (r) => r.status === "active" || r.status === "requested"
            );

            return SAFETY.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12, rotate: i % 2 ? -1 : 1 }}
                animate={{ opacity: 1, y: 0, rotate: i % 2 ? -0.5 : 0.5 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ rotate: 0, y: -4 }}
                className="sketch-card !p-5 bg-white relative"
                data-testid={`safety-${s.id}`}
              >
                <div className="sticky-tape" style={{ background: s.color }}>{i + 1}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className="w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink"
                    style={{ background: s.color, boxShadow: "2px 2px 0 #1B1B1F" }}
                  >
                    <s.icon size={18} strokeWidth={2.5} />
                  </span>
                  <h4 className="font-marker text-xl leading-tight">{s.title}</h4>
                </div>

                {s.id === "live" && activeRide ? (
                  <>
                    <p className="font-body text-lg text-ink/85 mt-3">
                      Your ride from <span className="font-marker text-tomato">{activeRide.pickupLabel}</span> to <span className="font-marker text-tomato">{activeRide.destinationLabel}</span> is active!
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          const shareUrl = `${window.location.origin}/track/${activeRide.id}`;
                          navigator.clipboard.writeText(shareUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="sketch-btn !py-2 !px-4 !text-sm flex items-center justify-center gap-1.5"
                      >
                        {copied ? <Check size={14} className="text-leaf" strokeWidth={3} /> : <Copy size={14} />}
                        {copied ? "Link Copied!" : "Copy Tracking Link"}
                      </button>

                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `Track my live campus ride here: ${window.location.origin}/track/${activeRide.id}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sketch-btn sketch-btn--tomato text-center !py-2 !px-4 !text-sm flex items-center justify-center gap-1.5"
                      >
                        <Share2 size={14} /> WhatsApp Share
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-body text-lg text-ink/85 mt-3">{s.desc}</p>
                    <button
                      onClick={() => {
                        if (s.id === "live") {
                          setShowShareModal(true);
                        } else if (s.id === "sos") {
                          setShowSOSModal(true);
                          setSosStatus("countdown");
                          setSosCountdown(3);
                          setSosError(null);
                        }
                      }}
                      className={`mt-4 sketch-btn !py-2 !px-4 !text-sm ${
                        s.id === "sos" ? "sketch-btn--tomato" : ""
                      }`}
                      data-testid={`safety-cta-${s.id}`}
                    >
                      {s.cta} <ArrowDoodle className="w-6 h-4" color={s.id === "sos" ? "#fff" : "#1B1B1F"} />
                    </button>
                  </>
                )}
              </motion.div>
            ));
          })()}
        </div>
      </section>

      {/* Preferences */}
      <section data-testid="prefs-section">
        <h3 className="font-marker text-2xl mb-3">Account preferences</h3>
        <div
          className="border-[2.5px] border-ink rounded-[24px_8px_22px_10px/10px_22px_8px_24px] bg-white overflow-hidden"
          style={{ boxShadow: "5px 5px 0 #1B1B1F" }}
        >
          {prefs.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 p-4 ${
                i !== 0 ? "border-t-[2px] border-dashed border-ink/30" : ""
              }`}
              data-testid={`pref-${p.id}`}
            >
              <span
                className="w-10 h-10 grid place-items-center rounded-full border-[2px] border-ink bg-cream"
                style={{ boxShadow: "2px 2px 0 #1B1B1F" }}
              >
                <p.icon size={16} strokeWidth={2} />
              </span>
              <p className="flex-1 font-hand text-lg">{p.label}</p>
              <Toggle
                on={p.on}
                onChange={() => handlePrefToggle(p.id)}
                testId={`pref-toggle-${p.id}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Share Modal overlay */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md border-[2.5px] border-ink bg-white rounded-[28px_10px_24px_12px/12px_24px_10px_28px] p-6 relative overflow-hidden"
            style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
          >
            {/* Top doodle star */}
            <div className="absolute -top-4 -right-4 w-12 float-c pointer-events-none">
              <StarDoodle color="#5BC0EB" />
            </div>

            <div className="flex items-center justify-between pb-3 border-b-[2px] border-dashed border-ink/20">
              <h3 className="font-marker text-2xl flex items-center gap-2">
                <MapPinned className="text-sky" size={22} /> Share Live Ride
              </h3>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setCopied(false);
                }}
                className="w-8 h-8 grid place-items-center rounded-full border-[2px] border-ink bg-cream hover:bg-tomato/20 transition-colors"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {(() => {
                const activeRide = data?.rides?.find(
                  (r) => r.status === "active" || r.status === "requested"
                );

                if (activeRide) {
                  const shareUrl = typeof window !== "undefined"
                    ? `${window.location.origin}/track/${activeRide.id}`
                    : `/track/${activeRide.id}`;

                  const handleCopy = () => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  };

                  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Hey! Track my live campus ride in real-time here: ${shareUrl}`
                  )}`;

                  return (
                    <div className="space-y-4">
                      <p className="font-hand text-base text-ink/80 leading-relaxed">
                        Your ride from <span className="font-marker text-tomato">{activeRide.pickupLabel}</span> to{" "}
                        <span className="font-marker text-tomato">{activeRide.destinationLabel}</span> is active. Guardians can track your journey live on a map.
                      </p>

                      <div className="border-[2px] border-ink rounded-xl bg-cream p-3 flex items-center justify-between gap-3">
                        <span className="font-hand text-sm truncate select-all flex-1 text-ink/75">
                          {shareUrl}
                        </span>
                        <button
                          onClick={handleCopy}
                          className="sketch-btn !p-2 shrink-0 bg-white"
                          title="Copy Link"
                        >
                          {copied ? (
                            <Check className="text-leaf" size={16} strokeWidth={3} />
                          ) : (
                            <Copy size={16} strokeWidth={2.5} />
                          )}
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sketch-btn sketch-btn--tomato text-center flex items-center justify-center gap-2"
                        >
                          <Share2 size={16} strokeWidth={2.5} /> Share via WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center space-y-3 py-2">
                      <p className="font-hand text-lg text-ink/70">
                        You don&apos;t have an active ride right now!
                      </p>
                      <p className="font-body text-sm text-ink/65 leading-relaxed">
                        Once you book a ride and the request goes live, you can generate a secret tracking link here for family or friends to watch your route.
                      </p>
                      <button
                        onClick={() => {
                          setShowShareModal(false);
                          window.location.href = "/student/book";
                        }}
                        className="sketch-btn sketch-btn--sun !py-2 !px-4 mt-2"
                      >
                        Book a Ride
                      </button>
                    </div>
                  );
                }
              })()}
            </div>
          </motion.div>
        </div>
      )}

      {/* SOS Modal overlay */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md border-[3px] border-ink bg-white rounded-[28px_10px_24px_12px/12px_24px_10px_28px] p-6 relative overflow-hidden"
            style={{
              boxShadow: "8px 8px 0 #1B1B1F",
              borderColor: sosStatus === "active" || sosStatus === "countdown" || sosStatus === "resolving" ? "#FF5A36" : "#1B1B1F"
            }}
          >
            {/* Top red header accent */}
            <div
              className="absolute top-0 left-0 right-0 h-2 bg-tomato"
              style={{
                background: sosStatus === "active" || sosStatus === "countdown" || sosStatus === "resolving" ? "#FF5A36" : "#1B1B1F"
              }}
            />

            {/* Countdown State */}
            {sosStatus === "countdown" && (
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 rounded-full border-[3px] border-ink bg-[#FF5A36]/10 text-tomato flex items-center justify-center mx-auto animate-ping absolute left-1/2 -translate-x-1/2 opacity-30" />
                <div className="w-20 h-20 rounded-full border-[3px] border-ink bg-[#FF5A36]/10 text-tomato flex items-center justify-center mx-auto relative" style={{ boxShadow: "4px 4px 0 #1B1B1F" }}>
                  <span className="font-marker text-4xl">{sosCountdown}</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-marker text-3xl text-tomato animate-pulse">Triggering SOS Alert...</h3>
                  <p className="font-hand text-lg text-ink/80 px-4">
                    Alerting campus security and your emergency contact in <strong>{sosCountdown} seconds</strong>.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSosStatus("idle");
                    setShowSOSModal(false);
                  }}
                  className="sketch-btn bg-white hover:bg-cream/40 !py-3 !px-6 w-full text-lg font-marker tracking-wide uppercase"
                  style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
                >
                  Cancel / False Alarm
                </button>
              </div>
            )}

            {/* Triggering (Loading) State */}
            {sosStatus === "triggering" && (
              <div className="text-center py-8 space-y-4">
                <Loader2 className="animate-spin text-tomato mx-auto" size={48} />
                <h3 className="font-marker text-2xl">Dispatched emergency signal...</h3>
                <p className="font-hand text-lg text-ink/75">
                  Retrieving your real-time GPS coordinates and updating the server.
                </p>
              </div>
            )}

            {/* Active SOS State */}
            {(sosStatus === "active" || sosStatus === "resolving") && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b-[2px] border-dashed border-ink/20">
                  <div className="w-10 h-10 rounded-full bg-tomato/20 border-[2px] border-tomato text-tomato grid place-items-center animate-pulse shrink-0">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="font-marker text-2xl text-tomato leading-tight">SOS EMERGENCY ACTIVE</h3>
                    <p className="font-scribble text-sm text-tomato">Campus Security & Contacts Notified</p>
                  </div>
                </div>

                <div className="space-y-4 py-2">
                  {sosError ? (
                    <div className="p-3 bg-tomato/10 border-[2px] border-tomato rounded-xl flex items-center gap-2">
                      <AlertTriangle className="text-tomato shrink-0" size={16} />
                      <p className="font-hand text-sm text-tomato">{sosError}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-leaf/10 border-[2px] border-leaf rounded-xl flex items-center gap-2">
                      <Check className="text-leaf shrink-0" size={16} strokeWidth={3} />
                      <p className="font-hand text-sm text-ink/80">GPS location logged successfully.</p>
                    </div>
                  )}

                  {/* Dynamic Emergency Contact details */}
                  <div className="sketch-card !p-4 bg-[#FF5A36]/5 border-[2px] border-tomato/30">
                    <h4 className="font-marker text-lg text-tomato mb-2">Emergency Contacts</h4>
                    <div className="space-y-3">
                      {/* Campus Security */}
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-marker text-base">Campus Security Office</p>
                          <p className="font-hand text-sm text-ink/60">24/7 Control Room Control</p>
                        </div>
                        <a
                          href="tel:100"
                          className="sketch-btn sketch-btn--tomato !py-1 !px-3 !text-sm flex items-center gap-1 shrink-0"
                          style={{ boxShadow: "2px 2px 0 #1B1B1F" }}
                        >
                          <Phone size={12} /> Call 100
                        </a>
                      </div>

                      {/* Student's Emergency Contact */}
                      {emergencyInfo.name ? (
                        <div className="flex items-center justify-between gap-3 border-t border-dashed border-tomato/20 pt-3">
                          <div>
                            <p className="font-marker text-base">{emergencyInfo.name}</p>
                            <p className="font-hand text-sm text-ink/60">Your Trusted Contact</p>
                          </div>
                          {emergencyInfo.phone ? (
                            <a
                              href={`tel:${emergencyInfo.phone}`}
                              className="sketch-btn sketch-btn--sun !py-1 !px-3 !text-sm flex items-center gap-1 shrink-0"
                              style={{ boxShadow: "2px 2px 0 #1B1B1F" }}
                            >
                              <Phone size={12} /> Call Contact
                            </a>
                          ) : (
                            <span className="font-hand text-xs text-ink/50 italic">No number set</span>
                          )}
                        </div>
                      ) : (
                        <div className="border-t border-dashed border-tomato/20 pt-3 text-center">
                          <p className="font-hand text-xs text-ink/65 italic">
                            No emergency contact configured in your profile.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={resolveSOS}
                  disabled={sosStatus === "resolving"}
                  className="sketch-btn sketch-btn--leaf w-full !py-3 font-marker uppercase tracking-wider text-white"
                  style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
                >
                  {sosStatus === "resolving" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Resolving Alert...
                    </span>
                  ) : (
                    "Resolve Alert (I am safe now)"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
