"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
} from "lucide-react";
import { mockStudent, rideTypeInfo, type RideType } from "@/lib/mockData";
import { CoinDoodle, StarDoodle, SquiggleDoodle, ArrowDoodle } from "@/components/doodles";

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

const PREFS = [
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

export default function ProfilePage() {
  const [prefs, setPrefs] = useState(PREFS);
  const [fav, setFav] = useState(mockStudent.favouriteRide);

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
                style={{ background: mockStudent.avatarColor, boxShadow: "5px 5px 0 #1B1B1F" }}
              >
                {mockStudent.name.split(" ").map((n) => n[0]).join("")}
              </span>
              <span className="absolute -bottom-1 -right-1 w-9 h-9 grid place-items-center bg-leaf rounded-full border-[2.5px] border-ink">
                <BadgeCheck size={16} strokeWidth={2.5} />
              </span>
            </div>
            <p className="mt-3 font-scribble text-tomato text-lg">verified student</p>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-marker text-3xl sm:text-4xl">{mockStudent.name}</h2>
            <p className="font-hand text-lg text-ink/80 flex items-center gap-2 mt-1">
              <GraduationCap size={16} /> {mockStudent.college}
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3 font-hand text-base">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-tomato" /> {mockStudent.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-tomato" /> {mockStudent.phone}
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-tomato" /> ID: <span className="font-marker">{mockStudent.studentId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bike size={14} className="text-tomato" /> {mockStudent.branch} • {mockStudent.year}
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
          <p className="font-hand text-base text-ink/60">
            emergency contact: <span className="font-marker">{mockStudent.emergencyContact.name}</span>
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {SAFETY.map((s, i) => (
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
              <p className="font-body text-lg text-ink/85 mt-3">{s.desc}</p>
              <button
                className={`mt-4 sketch-btn !py-2 !px-4 !text-sm ${
                  s.id === "sos" ? "sketch-btn--tomato" : ""
                }`}
                data-testid={`safety-cta-${s.id}`}
              >
                {s.cta} <ArrowDoodle className="w-6 h-4" color={s.id === "sos" ? "#fff" : "#1B1B1F"} />
              </button>
            </motion.div>
          ))}
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
                onChange={() =>
                  setPrefs((arr) =>
                    arr.map((x) => (x.id === p.id ? { ...x, on: !x.on } : x))
                  )
                }
                testId={`pref-toggle-${p.id}`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
