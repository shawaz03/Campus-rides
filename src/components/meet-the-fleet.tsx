"use client";
import React, { useState } from "react";

/* ---------- DOODLE PRIMITIVES ---------- */

// Tiny scribbled star
const Star = ({ className = "", fill = "#FFD23F" }: any) => (
  <svg viewBox="0 0 60 60" className={className} fill="none" aria-hidden>
    <path
      d="M30,5 L 36,22 L 54,24 L 40,36 L 44,54 L 30,44 L 16,54 L 20,36 L 6,24 L 24,22 Z"
      fill={fill}
      stroke="#1B1B1F"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

// Wobbly blob (background doodle)
const Blob = ({ className = "", fill = "#FFD23F" }: any) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
    <path
      d="M44,72 C 60,28 142,18 168,62 C 196,108 162,168 116,176 C 64,184 18,148 28,108 C 32,92 36,80 44,72 Z"
      fill={fill}
      stroke="#1B1B1F"
      strokeWidth="3"
    />
  </svg>
);

// Squiggly underline
const Squiggle = ({ className = "", stroke = "#FFD23F" }: any) => (
  <svg viewBox="0 0 120 30" className={className} fill="none" aria-hidden>
    <path
      d="M2,15 C 16,2 28,28 42,15 C 56,2 68,28 82,15 C 96,2 108,28 118,15"
      stroke={stroke}
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Curvy arrow (handwritten)
const CurvyArrow = ({ className = "", stroke = "#1B1B1F" }: any) => (
  <svg viewBox="0 0 140 80" className={className} fill="none" aria-hidden>
    <path
      d="M6,40 C 30,12 70,68 110,30"
      stroke={stroke}
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M96,22 L 112,28 L 106,44"
      stroke={stroke}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/* ---------- VEHICLE DOODLES ---------- */

// Bike doodle — scooty style
const BikeDoodle = () => (
  <svg viewBox="0 0 260 180" className="w-full h-auto" fill="none" aria-hidden>
    {/* shadow */}
    <ellipse cx="130" cy="160" rx="92" ry="6" fill="#1B1B1F" opacity="0.12" />
    {/* back wheel */}
    <g className="wheel-spin-on-hover" style={{ transformOrigin: "62px 132px" }}>
      <circle cx="62" cy="132" r="26" fill="#1B1B1F" />
      <circle cx="62" cy="132" r="11" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
      <line x1="62" y1="121" x2="62" y2="143" stroke="#1B1B1F" strokeWidth="2" />
      <line x1="51" y1="132" x2="73" y2="132" stroke="#1B1B1F" strokeWidth="2" />
    </g>
    {/* front wheel */}
    <g className="wheel-spin-on-hover" style={{ transformOrigin: "204px 132px" }}>
      <circle cx="204" cy="132" r="26" fill="#1B1B1F" />
      <circle cx="204" cy="132" r="11" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
      <line x1="204" y1="121" x2="204" y2="143" stroke="#1B1B1F" strokeWidth="2" />
      <line x1="193" y1="132" x2="215" y2="132" stroke="#1B1B1F" strokeWidth="2" />
    </g>
    {/* body */}
    <path
      d="M40,118 C 48,86 92,72 132,76 C 156,78 170,90 174,108 L 198,110 C 210,110 214,120 210,128 L 178,128 C 168,128 162,124 156,118 L 96,118 C 86,128 70,128 60,124 Z"
      fill="#FF5A36"
      stroke="#1B1B1F"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* seat */}
    <path
      d="M100,82 L 156,82 C 162,82 162,92 156,92 L 100,92 C 94,92 94,82 100,82 Z"
      fill="#1B1B1F"
    />
    {/* handlebars */}
    <path d="M200,92 L 230,72" stroke="#1B1B1F" strokeWidth="6" strokeLinecap="round" />
    <circle cx="232" cy="70" r="4" fill="#1B1B1F" />
    {/* headlight */}
    <circle cx="218" cy="102" r="9" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="2.5" />
    {/* speed lines */}
    <path d="M14,84 L 32,84" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" />
    <path d="M8,98 L 30,98" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" />
    <path d="M14,112 L 28,112" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Auto rickshaw doodle
const AutoDoodle = () => (
  <svg viewBox="0 0 260 180" className="w-full h-auto" fill="none" aria-hidden>
    <ellipse cx="130" cy="160" rx="98" ry="6" fill="#1B1B1F" opacity="0.12" />
    {/* roof curve */}
    <path
      d="M50,76 C 60,38 200,38 214,80 L 220,118 L 36,118 Z"
      fill="#FFD23F"
      stroke="#1B1B1F"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* black top stripe */}
    <path
      d="M50,76 C 60,38 200,38 214,80"
      stroke="#1B1B1F"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    {/* body lower */}
    <path
      d="M28,118 L 232,118 L 224,148 C 222,154 216,156 210,156 L 48,156 C 42,156 36,154 34,148 Z"
      fill="#1B1B1F"
    />
    {/* yellow lower body */}
    <path
      d="M40,124 L 220,124 L 214,142 L 46,142 Z"
      fill="#FFD23F"
      stroke="#1B1B1F"
      strokeWidth="2.5"
    />
    {/* windshield */}
    <path
      d="M76,82 C 82,58 178,58 184,82 L 184,110 L 76,110 Z"
      fill="#FDF6E3"
      stroke="#1B1B1F"
      strokeWidth="3"
    />
    {/* window divider */}
    <line x1="130" y1="62" x2="130" y2="110" stroke="#1B1B1F" strokeWidth="2.5" />
    {/* driver silhouette */}
    <circle cx="104" cy="92" r="9" fill="#1B1B1F" />
    <path d="M94,108 C 96,98 112,98 114,108" stroke="#1B1B1F" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* wheels */}
    <g className="wheel-spin-on-hover" style={{ transformOrigin: "70px 156px" }}>
      <circle cx="70" cy="156" r="18" fill="#1B1B1F" />
      <circle cx="70" cy="156" r="7" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2" />
    </g>
    <g className="wheel-spin-on-hover" style={{ transformOrigin: "190px 156px" }}>
      <circle cx="190" cy="156" r="18" fill="#1B1B1F" />
      <circle cx="190" cy="156" r="7" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2" />
    </g>
    {/* headlight */}
    <circle cx="222" cy="102" r="6" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="2" />
    {/* antenna squiggle */}
    <path d="M132,42 C 138,30 126,28 134,18" stroke="#1B1B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="134" cy="16" r="3" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2" />
  </svg>
);

// Cab doodle
const CabDoodle = () => (
  <svg viewBox="0 0 260 180" className="w-full h-auto" fill="none" aria-hidden>
    <ellipse cx="130" cy="160" rx="102" ry="6" fill="#1B1B1F" opacity="0.12" />
    {/* roof */}
    <path
      d="M58,98 C 70,62 188,62 202,98 L 218,118 L 42,118 Z"
      fill="#5BC0EB"
      stroke="#1B1B1F"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* taxi sign */}
    <rect
      x="112"
      y="46"
      width="36"
      height="18"
      rx="3"
      fill="#FFD23F"
      stroke="#1B1B1F"
      strokeWidth="2.5"
    />
    <text
      x="130"
      y="60"
      textAnchor="middle"
      fontFamily="Permanent Marker, cursive"
      fontSize="13"
      fill="#1B1B1F"
    >
      TAXI
    </text>
    {/* body */}
    <path
      d="M28,118 L 232,118 L 232,148 C 232,154 226,156 220,156 L 40,156 C 34,156 28,154 28,148 Z"
      fill="#5BC0EB"
      stroke="#1B1B1F"
      strokeWidth="3"
    />
    {/* checker stripe */}
    <g>
      <rect x="28" y="128" width="14" height="8" fill="#1B1B1F" />
      <rect x="56" y="128" width="14" height="8" fill="#1B1B1F" />
      <rect x="84" y="128" width="14" height="8" fill="#1B1B1F" />
      <rect x="112" y="128" width="14" height="8" fill="#1B1B1F" />
      <rect x="140" y="128" width="14" height="8" fill="#1B1B1F" />
      <rect x="168" y="128" width="14" height="8" fill="#1B1B1F" />
      <rect x="196" y="128" width="14" height="8" fill="#1B1B1F" />
      <rect x="42" y="136" width="14" height="8" fill="#1B1B1F" />
      <rect x="70" y="136" width="14" height="8" fill="#1B1B1F" />
      <rect x="98" y="136" width="14" height="8" fill="#1B1B1F" />
      <rect x="126" y="136" width="14" height="8" fill="#1B1B1F" />
      <rect x="154" y="136" width="14" height="8" fill="#1B1B1F" />
      <rect x="182" y="136" width="14" height="8" fill="#1B1B1F" />
      <rect x="210" y="136" width="14" height="8" fill="#1B1B1F" />
    </g>
    {/* windows */}
    <path d="M72,98 C 80,76 124,72 130,72 C 138,72 180,76 188,98 Z" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round" />
    <line x1="130" y1="72" x2="130" y2="98" stroke="#1B1B1F" strokeWidth="2.5" />
    {/* wheels */}
    <g className="wheel-spin-on-hover" style={{ transformOrigin: "70px 156px" }}>
      <circle cx="70" cy="156" r="20" fill="#1B1B1F" />
      <circle cx="70" cy="156" r="8" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2" />
      <line x1="70" y1="148" x2="70" y2="164" stroke="#1B1B1F" strokeWidth="2" />
      <line x1="62" y1="156" x2="78" y2="156" stroke="#1B1B1F" strokeWidth="2" />
    </g>
    <g className="wheel-spin-on-hover" style={{ transformOrigin: "190px 156px" }}>
      <circle cx="190" cy="156" r="20" fill="#1B1B1F" />
      <circle cx="190" cy="156" r="8" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2" />
      <line x1="190" y1="148" x2="190" y2="164" stroke="#1B1B1F" strokeWidth="2" />
      <line x1="182" y1="156" x2="198" y2="156" stroke="#1B1B1F" strokeWidth="2" />
    </g>
    {/* headlight */}
    <circle cx="226" cy="124" r="6" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="2" />
    {/* AC squiggle */}
    <path d="M40,82 Q 46,72 52,82 T 64,82" stroke="#1B1B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M40,90 Q 46,80 52,90 T 64,90" stroke="#1B1B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

/* ---------- FLEET CARD ---------- */

const FleetCard = ({
  vehicle,
  Doodle,
  bg,
  accent,
  tape,
  tilt,
  vibe,
  speed,
  cost,
  costColor,
  tagline,
  rotate,
  testId,
}: any) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="relative" style={{ transform: `rotate(${rotate}deg)` }} data-testid={`fleet-card-wrapper-${vehicle?.toLowerCase()}`}>
      <div
        className={`sketch-card fleet-card ${tilt} pt-10 ${isActive ? 'active' : ''}`}
        style={{ background: bg }}
        data-testid={`fleet-card-${vehicle?.toLowerCase()}`}
        onClick={() => setIsActive(!isActive)}
      >
        {/* tape */}
        <div className="sticky-tape" style={{ background: tape }}>
          {vehicle}
        </div>

        {/* doodle */}
        <div className="doodle-wiggle px-2 pt-3">
          <Doodle />
        </div>

        {/* dashed road */}
        <div className="dashed-road h-1 my-4 mx-2" />

        {/* title */}
        <div className="flex items-end justify-between mt-1 px-1">
          <h3 className="font-marker text-3xl md:text-4xl text-ink leading-none">
            {vehicle}
          </h3>
          <span className="stamp" style={{ color: accent }}>
            {cost}
          </span>
        </div>

        {/* tagline */}
        <p className="font-scribble text-2xl mt-2 px-1" style={{ color: accent }}>
          {tagline}
        </p>

        {/* specs — pop-up on hover */}
        <div className="spec-pop space-y-2 px-1" data-testid={`fleet-specs-${vehicle?.toLowerCase()}`}>
          <SpecRow label="Vibe" value={vibe} />
          <SpecRow label="Speed" value={speed} />
          <SpecRow label="Cost" value={<span style={{ color: costColor }}>{cost}</span>} />
        </div>

        {/* footer scribble */}
        <div className="mt-5 px-1 flex items-center gap-2">
          <Squiggle className="w-24 h-4" stroke={accent} />
          <span className="font-hand text-lg text-ink/90">tap to ride</span>
          <CurvyArrow className="w-10 h-5 ml-auto" stroke={accent} />
        </div>
      </div>

      {/* tiny floating star next to each card */}
      <div className="absolute -top-6 -right-3 w-10 float-c" aria-hidden>
        <Star className="w-10 h-10" fill={accent} />
      </div>
    </div>
  );
};

const SpecRow = ({ label, value }: any) => (
  <div className="flex items-baseline gap-3 font-hand text-xl text-ink">
    <span className="font-marker text-base tracking-wide text-ink/80 min-w-[58px]">
      {label}
    </span>
    <span className="flex-1 border-b-2 border-dotted border-ink/30 mb-1" aria-hidden />
    <span className="font-hand text-xl">{value}</span>
  </div>
);

/* ---------- MEET THE FLEET SECTION ---------- */

export const MeetTheFleet = () => {
  return (
    <section
      id="fleet"
      className="relative py-24 paper overflow-hidden"
      data-testid="section-fleet"
    >
      {/* background floating doodles */}
      <div className="absolute -top-10 left-6 w-24 float-a opacity-90" aria-hidden>
        <Blob fill="#FFD23F" />
      </div>
      <div className="absolute top-24 right-10 w-20 float-c opacity-80" aria-hidden>
        <Star className="w-20 h-20" fill="#FF5A36" />
      </div>
      <div className="absolute bottom-16 left-[40%] w-28 float-b opacity-80" aria-hidden>
        <Blob fill="#5BC0EB" />
      </div>
      <div className="absolute bottom-8 right-[12%] w-16 float-a opacity-90" aria-hidden>
        <Star className="w-16 h-16" fill="#7BC950" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative">
        {/* header */}
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="font-scribble text-2xl text-tomato">say hi to →</p>
            <h2 className="font-marker text-5xl md:text-6xl mt-2 leading-none">
              Meet the <span className="scribble">Fleet</span>
            </h2>
          </div>
          <p className="font-body text-xl text-ink/90 max-w-md leading-snug">
            Three flavours of &quot;let&apos;s go&quot;. Pick the vibe, split the bill, save the
            planet (a tiny bit).
          </p>
        </div>

        {/* dashed road divider */}
        <div className="relative mt-10 mb-2">
          <div className="dashed-road h-1 w-full" />
          <div className="absolute -top-3 left-[18%] font-marker text-tomato text-lg rotate-[-4deg]">
            ↘ hover us
          </div>
        </div>

        {/* fleet grid */}
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          <FleetCard
            vehicle="Bike"
            Doodle={BikeDoodle}
            bg="#FFFDF5"
            accent="#FF5A36"
            tape="#FFD23F"
            tilt="tilt-left"
            rotate={-1.5}
            vibe="Breezy 🍃"
            speed={<span>🚀 zoomy</span>}
            cost="₹"
            costColor="#7BC950"
            tagline="Perfect for solo dashes"
            testId="bike"
          />
          <FleetCard
            vehicle="Auto"
            Doodle={AutoDoodle}
            bg="#FFFDF5"
            accent="#1B1B1F"
            tape="#FF5A36"
            tilt="tilt-up"
            rotate={1}
            vibe="Classic 🛺"
            speed={<span>🏃 brisk</span>}
            cost="₹₹"
            costColor="#FFB400"
            tagline="Best for 2-3 friends"
            testId="auto"
          />
          <FleetCard
            vehicle="Cab"
            Doodle={CabDoodle}
            bg="#FFFDF5"
            accent="#5BC0EB"
            tape="#7BC950"
            tilt="tilt-right"
            rotate={-1}
            vibe="AC Luxury 🛋️"
            speed={<span>🛣️ smooth</span>}
            cost="₹₹₹"
            costColor="#FF5A36"
            tagline="Luggage / Airport runs"
            testId="cab"
          />
        </div>

        {/* footer note */}
        <div className="mt-14 flex items-center justify-center gap-4 flex-wrap">
          <span className="font-scribble text-2xl text-plum">psst —</span>
          <p className="font-hand text-xl text-ink max-w-2xl text-center">
            All three split the fare automatically. No &quot;minimum bill&quot;
            awkwardness, no calculator wars at the back-seat.
          </p>
          <CurvyArrow className="w-12 h-7" stroke="#9B5DE5" />
        </div>
      </div>
    </section>
  );
};
