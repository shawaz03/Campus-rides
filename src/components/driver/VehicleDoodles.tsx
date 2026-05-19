"use client";

import { JSX } from "react";

/* ──────────────────────────────────────────────────────────── */
/* Hand-drawn vehicle doodles                                  */
/* ──────────────────────────────────────────────────────────── */

export function BikeDoodle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 260 180" fill="none" {...props}>
      {/* ground shadow */}
      <ellipse cx="130" cy="160" rx="98" ry="8" fill="#1B1B1F" opacity="0.18" />

      {/* dashed road */}
      <path
        d="M18,168 L 242,168"
        className="road-dash-run"
        stroke="#1B1B1F"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* rear wheel */}
      <g className="wheel-spin">
        <circle cx="62" cy="126" r="28" fill="#1B1B1F" />
        <circle cx="62" cy="126" r="14" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" />
        <path d="M62,116 L 62,136 M52,126 L 72,126" stroke="#1B1B1F" strokeWidth="2.5" />
      </g>
      {/* front wheel */}
      <g className="wheel-spin">
        <circle cx="200" cy="126" r="28" fill="#1B1B1F" />
        <circle cx="200" cy="126" r="14" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" />
        <path d="M200,116 L 200,136 M190,126 L 210,126" stroke="#1B1B1F" strokeWidth="2.5" />
      </g>

      {/* body / fuel tank */}
      <path
        d="M78,118 C 86,84 122,76 152,82 L 174,82 C 184,82 192,90 192,100 L 192,118"
        stroke="#1B1B1F"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="#FF5A36"
      />
      {/* seat */}
      <path d="M86,98 L 138,94 L 142,108 L 92,112 Z" fill="#1B1B1F" />
      {/* handlebars */}
      <path d="M178,82 L 198,62 M198,62 L 214,58" stroke="#1B1B1F" strokeWidth="4" strokeLinecap="round" />
      <circle cx="216" cy="58" r="4" fill="#1B1B1F" />
      {/* headlight */}
      <circle cx="186" cy="92" r="8" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
      {/* exhaust */}
      <path d="M82,126 L 50,126" stroke="#1B1B1F" strokeWidth="4" strokeLinecap="round" />
      {/* wind lines */}
      <g>
        <path
          d="M36,104 C 20,104 14,100 8,94"
          className="wind-line wind-line--1"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M40,120 C 22,120 16,116 10,110"
          className="wind-line wind-line--2"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M42,136 C 26,136 20,132 14,126"
          className="wind-line wind-line--3"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* spark */}
      <path d="M40,118 L 32,114 M40,126 L 28,126 M40,134 L 32,138" stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" />

      {/* sparkles */}
      <path
        d="M30,40 L 38,32 M34,28 L 34,44"
        className="sparkle-blink sparkle-blink--1"
        stroke="#FFD23F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M226,40 L 234,32 M230,28 L 230,44"
        className="sparkle-blink sparkle-blink--2"
        stroke="#FF5A36"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AutoDoodle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 260 180" fill="none" {...props}>
      <ellipse cx="130" cy="160" rx="100" ry="8" fill="#1B1B1F" opacity="0.18" />
      <path
        d="M18,168 L 242,168"
        className="road-dash-run"
        stroke="#1B1B1F"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* canopy */}
      <path
        d="M58,116 L 58,74 C 58,60 70,52 84,52 L 168,52 C 184,52 200,62 206,80 L 214,116"
        stroke="#1B1B1F"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="#FFD23F"
      />
      {/* roof stripe */}
      <path d="M62,68 L 210,68" stroke="#1B1B1F" strokeWidth="3" />

      {/* body */}
      <path
        d="M44,128 L 44,116 L 222,116 L 222,128 C 222,138 214,144 204,144 L 62,144 C 52,144 44,138 44,128 Z"
        stroke="#1B1B1F"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="#7BC950"
      />

      {/* windshield */}
      <path d="M80,84 L 80,108 L 134,108 L 134,80 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="3" />
      {/* side opening */}
      <path d="M142,84 L 142,108 L 198,108 L 198,86 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="3" />

      {/* headlight */}
      <circle cx="52" cy="100" r="6" fill="#fff" stroke="#1B1B1F" strokeWidth="2.5" />

      {/* wheels */}
      <g className="wheel-spin">
        <circle cx="84" cy="148" r="18" fill="#1B1B1F" />
        <circle cx="84" cy="148" r="8" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
        <circle cx="90" cy="148" r="2" fill="#1B1B1F" />
      </g>
      <g className="wheel-spin">
        <circle cx="190" cy="148" r="18" fill="#1B1B1F" />
        <circle cx="190" cy="148" r="8" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
        <circle cx="196" cy="148" r="2" fill="#1B1B1F" />
      </g>

      {/* meter on top */}
      <rect x="100" y="40" width="22" height="14" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2.5" />
      <path d="M111,40 L 111,32" stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" />

      {/* wind lines */}
      <g>
        <path
          d="M40,96 C 22,96 16,92 10,86"
          className="wind-line wind-line--1"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M44,112 C 26,112 20,108 12,102"
          className="wind-line wind-line--2"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M46,128 C 30,128 22,124 16,118"
          className="wind-line wind-line--3"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* sparkles */}
      <path
        d="M28,46 L 36,38 M32,34 L 32,50"
        className="sparkle-blink sparkle-blink--1"
        stroke="#FF5A36"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M228,46 L 236,38 M232,34 L 232,50"
        className="sparkle-blink sparkle-blink--2"
        stroke="#FFD23F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CabDoodle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 260 180" fill="none" {...props}>
      <ellipse cx="130" cy="160" rx="110" ry="9" fill="#1B1B1F" opacity="0.18" />
      <path
        d="M18,168 L 242,168"
        className="road-dash-run"
        stroke="#1B1B1F"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* car body */}
      <path
        d="M20,134 C 20,108 38,98 60,96 L 80,68 C 90,56 104,52 120,52 L 174,52 C 194,52 210,62 222,80 L 232,98 C 244,102 250,114 250,128 L 250,140 C 250,148 244,154 236,154 L 26,154 C 22,154 20,150 20,146 Z"
        stroke="#1B1B1F"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="#5BC0EB"
      />

      {/* taxi stripe */}
      <path d="M22,128 L 250,128" stroke="#1B1B1F" strokeWidth="3" />
      <rect x="22" y="118" width="230" height="10" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="2" />
      {/* checker pattern */}
      <path d="M30,118 L 30,128 M50,118 L 50,128 M70,118 L 70,128 M90,118 L 90,128 M110,118 L 110,128 M130,118 L 130,128 M150,118 L 150,128 M170,118 L 170,128 M190,118 L 190,128 M210,118 L 210,128 M230,118 L 230,128" stroke="#1B1B1F" strokeWidth="2" />

      {/* windshields */}
      <path d="M84,96 L 96,72 L 132,72 L 132,96 Z" fill="#fff" stroke="#1B1B1F" strokeWidth="3" />
      <path d="M138,96 L 138,72 L 174,72 C 188,72 200,82 208,96 Z" fill="#fff" stroke="#1B1B1F" strokeWidth="3" />
      <path d="M134,72 L 134,96" stroke="#1B1B1F" strokeWidth="3" />

      {/* taxi sign on roof */}
      <rect x="118" y="40" width="34" height="14" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
      <text x="135" y="51" textAnchor="middle" fontFamily="var(--font-marker), cursive" fontSize="9" fill="#1B1B1F">TAXI</text>

      {/* headlights */}
      <circle cx="240" cy="118" r="6" fill="#fff" stroke="#1B1B1F" strokeWidth="2.5" />
      <circle cx="28" cy="118" r="5" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2.5" />

      {/* wheels */}
      <g className="wheel-spin">
        <circle cx="70" cy="154" r="22" fill="#1B1B1F" />
        <circle cx="70" cy="154" r="10" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" />
        <path d="M70,144 L 70,164 M60,154 L 80,154" stroke="#1B1B1F" strokeWidth="2.5" />
      </g>
      <g className="wheel-spin">
        <circle cx="200" cy="154" r="22" fill="#1B1B1F" />
        <circle cx="200" cy="154" r="10" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" />
        <path d="M200,144 L 200,164 M190,154 L 210,154" stroke="#1B1B1F" strokeWidth="2.5" />
      </g>

      {/* wind lines */}
      <g>
        <path
          d="M38,100 C 20,100 14,96 8,90"
          className="wind-line wind-line--1"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M44,116 C 24,116 18,112 12,106"
          className="wind-line wind-line--2"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M46,132 C 28,132 22,128 14,122"
          className="wind-line wind-line--3"
          stroke="#1B1B1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* sparkles */}
      <path
        d="M22,40 L 30,32 M26,28 L 26,44"
        className="sparkle-blink sparkle-blink--1"
        stroke="#FFD23F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M228,38 L 236,30 M232,26 L 232,42"
        className="sparkle-blink sparkle-blink--2"
        stroke="#FF5A36"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Background floating doodles                                 */
/* ──────────────────────────────────────────────────────────── */

export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 80" className={className} fill="none">
      <path
        d="M20,60 C 4,60 4,38 22,36 C 26,18 50,16 56,30 C 64,18 90,20 92,36 C 112,34 122,56 104,62 C 100,72 30,72 20,60 Z"
        fill="#fff"
        stroke="#1B1B1F"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <circle cx="60" cy="60" r="26" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
      <g stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round">
        <path d="M60,12 L 60,26" /><path d="M60,94 L 60,108" />
        <path d="M12,60 L 26,60" /><path d="M94,60 L 108,60" />
        <path d="M22,22 L 32,32" /><path d="M88,88 L 98,98" />
        <path d="M22,98 L 32,88" /><path d="M88,32 L 98,22" />
      </g>
    </svg>
  );
}

export function Star({ color = "#FFD23F", className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none">
      <path
        d="M30,5 L 36,22 L 54,24 L 40,36 L 44,54 L 30,44 L 16,54 L 20,36 L 6,24 L 24,22 Z"
        fill={color}
        stroke="#1B1B1F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Document illustrations                                      */
/* ──────────────────────────────────────────────────────────── */

export function AadhaarDoodle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 200 130" fill="none" {...props}>
      <rect x="10" y="10" width="180" height="110" rx="10"
        fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="3.5"
        transform="rotate(-2 100 65)" />
      <rect x="10" y="10" width="180" height="22" fill="#FF5A36"
        transform="rotate(-2 100 65)" />
      <text x="22" y="26" fontFamily="var(--font-marker), cursive" fontSize="13" fill="#FDF6E3" transform="rotate(-2 100 65)">AADHAAR</text>
      {/* photo */}
      <rect x="22" y="44" width="44" height="56" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" transform="rotate(-2 100 65)" />
      <circle cx="44" cy="64" r="9" fill="#1B1B1F" transform="rotate(-2 100 65)" />
      <path d="M30,98 C 32,86 56,86 58,98" stroke="#1B1B1F" strokeWidth="2.5" fill="none" transform="rotate(-2 100 65)" />
      {/* lines */}
      <path d="M78,52 L 168,52 M78,64 L 152,64 M78,76 L 162,76 M78,88 L 142,88" stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-2 100 65)" />
      {/* number boxes */}
      <path d="M78,100 L 92,100 M96,100 L 110,100 M114,100 L 128,100" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" transform="rotate(-2 100 65)" />
    </svg>
  );
}

export function LicenseDoodle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 200 130" fill="none" {...props}>
      <rect x="10" y="10" width="180" height="110" rx="10"
        fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="3.5"
        transform="rotate(2 100 65)" />
      <rect x="10" y="10" width="180" height="22" fill="#1B1B1F"
        transform="rotate(2 100 65)" />
      <text x="22" y="26" fontFamily="var(--font-marker), cursive" fontSize="12" fill="#FFD23F" transform="rotate(2 100 65)">DRIVING LICENSE</text>
      <rect x="22" y="44" width="44" height="56" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" transform="rotate(2 100 65)" />
      <circle cx="44" cy="62" r="9" fill="#1B1B1F" transform="rotate(2 100 65)" />
      <path d="M30,96 C 32,86 56,86 58,96" stroke="#1B1B1F" strokeWidth="2.5" fill="none" transform="rotate(2 100 65)" />
      <path d="M78,52 L 168,52 M78,64 L 156,64 M78,76 L 162,76 M78,88 L 138,88" stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" transform="rotate(2 100 65)" />
      {/* steering wheel mini */}
      <g transform="translate(150 96) rotate(2 100 65)">
        <circle cx="0" cy="0" r="10" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="3" fill="#1B1B1F" />
        <path d="M-10,0 L 10,0 M0,-10 L 0,10" stroke="#1B1B1F" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function RCDoodle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 200 130" fill="none" {...props}>
      <rect x="10" y="10" width="180" height="110" rx="10"
        fill="#7BC950" stroke="#1B1B1F" strokeWidth="3.5"
        transform="rotate(-1.5 100 65)" />
      <rect x="10" y="10" width="180" height="22" fill="#1B1B1F"
        transform="rotate(-1.5 100 65)" />
      <text x="22" y="26" fontFamily="var(--font-marker), cursive" fontSize="13" fill="#FFD23F" transform="rotate(-1.5 100 65)">VEHICLE RC</text>
      {/* mini car */}
      <g transform="translate(44 76) rotate(-1.5 100 65)">
        <path d="M-26,8 C -26,-4 -16,-10 -6,-10 L 10,-10 C 18,-10 24,-4 26,8 Z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="-14" cy="10" r="5" fill="#1B1B1F" />
        <circle cx="14" cy="10" r="5" fill="#1B1B1F" />
        <rect x="-12" y="-8" width="22" height="8" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="2" />
      </g>
      {/* lines */}
      <path d="M88,52 L 170,52 M88,64 L 156,64 M88,76 L 162,76 M88,88 L 144,88 M88,100 L 130,100" stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-1.5 100 65)" />
      {/* stamp */}
      <g transform="translate(168 96) rotate(-12)">
        <circle cx="0" cy="0" r="13" fill="none" stroke="#FF5A36" strokeWidth="2.5" />
        <text x="0" y="3" textAnchor="middle" fontFamily="var(--font-marker), cursive" fontSize="7" fill="#FF5A36">OK</text>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Payout illustrations                                        */
/* ──────────────────────────────────────────────────────────── */

export function BankDoodle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 200 140" fill="none" {...props}>
      <path
        d="M20,54 L 100,16 L 180,54 Z"
        fill="#FFD23F"
        stroke="#1B1B1F"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect
        x="26"
        y="54"
        width="148"
        height="72"
        rx="10"
        fill="#FFB4A2"
        stroke="#1B1B1F"
        strokeWidth="3.5"
      />
      <rect x="42" y="66" width="18" height="52" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
      <rect x="72" y="66" width="18" height="52" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
      <rect x="110" y="66" width="18" height="52" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
      <rect x="140" y="66" width="18" height="52" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
      <rect x="88" y="86" width="24" height="40" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
      <path d="M26,54 L 174,54" stroke="#1B1B1F" strokeWidth="3" />
      <circle cx="166" cy="34" r="10" fill="#7BC950" stroke="#1B1B1F" strokeWidth="2.5" />
      <path d="M166,28 L 166,40" stroke="#1B1B1F" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M24,30 L 32,22 M28,20 L 28,34"
        className="sparkle-blink sparkle-blink--1"
        stroke="#FF5A36"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="100"
        y="80"
        textAnchor="middle"
        fontFamily="var(--font-marker), cursive"
        fontSize="12"
        fill="#1B1B1F"
      >
        BANK
      </text>
    </svg>
  );
}

export function UpiDoodle(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 200 140" fill="none" {...props}>
      <rect
        x="38"
        y="12"
        width="124"
        height="116"
        rx="18"
        fill="#5BC0EB"
        stroke="#1B1B1F"
        strokeWidth="3.5"
      />
      <rect
        x="54"
        y="28"
        width="92"
        height="76"
        rx="10"
        fill="#FDF6E3"
        stroke="#1B1B1F"
        strokeWidth="3"
      />
      <rect x="64" y="38" width="16" height="16" fill="#1B1B1F" />
      <rect x="120" y="38" width="16" height="16" fill="#1B1B1F" />
      <rect x="64" y="72" width="16" height="16" fill="#1B1B1F" />
      <rect x="94" y="54" width="14" height="14" fill="#1B1B1F" />
      <rect x="114" y="72" width="12" height="12" fill="#1B1B1F" className="sparkle-blink sparkle-blink--2" />
      <circle cx="100" cy="116" r="6" fill="#1B1B1F" />
      <path
        d="M142,86 L 160,74 M160,74 L 152,72"
        stroke="#FF5A36"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="100"
        y="126"
        textAnchor="middle"
        fontFamily="var(--font-marker), cursive"
        fontSize="11"
        fill="#1B1B1F"
      >
        UPI
      </text>
    </svg>
  );
}
