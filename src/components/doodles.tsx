"use client";

import React from "react";
import { motion } from "framer-motion";
/* All illustrations are inline SVGs styled to feel hand-drawn:
   - rough strokes with stroke-linecap="round"
   - slightly tilted / imperfect geometry
   - thick contour + soft fills
   Each accepts className for sizing & animation hooks. */

interface DoodleProps {
  className?: string;
}

interface ColorDoodleProps extends DoodleProps {
  color?: string;
}

interface FriendMascotProps extends DoodleProps {
  hat?: string;
}

export const CarMascot = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 420 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="rough1" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={3}/>
        <feDisplacementMap in="SourceGraphic" scale={1.6}/>
      </filter>
    </defs>
    <g filter="url(#rough1)">
      {/* road shadow */}
      <ellipse cx="210" cy="248" rx="160" ry="12" fill="#1B1B1F" opacity="0.15"/>
      {/* car body */}
      <path d="M40,200 C 40,160 70,140 110,135 L 150,100 C 170,80 200,76 230,76 L 290,76 C 320,76 340,90 358,118 L 376,148 C 392,152 402,168 402,188 L 402,210 C 402,222 392,232 380,232 L 360,232" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="#FFD23F"/>
      <path d="M40,232 L 60,232" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round"/>
      <path d="M120,232 L 300,232" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round"/>
      {/* windows */}
      <path d="M150,116 L 180,90 L 246,90 L 268,116 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M276,116 L 286,92 L 322,92 C 332,92 340,98 346,108 L 352,116 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M210,90 L 210,116" stroke="#1B1B1F" strokeWidth="4"/>
      {/* headlight */}
      <circle cx="386" cy="178" r="8" fill="#fff" stroke="#1B1B1F" strokeWidth="3"/>
      {/* door handle */}
      <path d="M196,150 L 220,150" stroke="#1B1B1F" strokeWidth="4" strokeLinecap="round"/>
      {/* wheels */}
      <g>
        <circle cx="100" cy="232" r="28" fill="#1B1B1F"/>
        <circle cx="100" cy="232" r="14" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" className="wheel-spin"/>
        <path d="M100,222 L 100,242 M90,232 L 110,232" stroke="#1B1B1F" strokeWidth="3"/>
      </g>
      <g>
        <circle cx="330" cy="232" r="28" fill="#1B1B1F"/>
        <circle cx="330" cy="232" r="14" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" className="wheel-spin"/>
        <path d="M330,222 L 330,242 M320,232 L 340,232" stroke="#1B1B1F" strokeWidth="3"/>
      </g>
      {/* driver face */}
      <circle cx="210" cy="108" r="11" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="2.5"/>
      <circle cx="207" cy="107" r="1.3" fill="#1B1B1F"/>
      <circle cx="213" cy="107" r="1.3" fill="#1B1B1F"/>
      <path d="M205,112 Q 210,116 215,112" stroke="#1B1B1F" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* speed lines */}
      <path d="M0,150 L 30,150" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round"/>
      <path d="M-4,178 L 26,178" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round"/>
      <path d="M6,206 L 34,206" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round"/>
      {/* roof rack */}
      <path d="M168,76 L 250,76" stroke="#1B1B1F" strokeWidth="3"/>
      {/* heart */}
      <path d="M320,40 q 8,-14 18,-4 q 10,-10 18,4 q 0,14 -18,26 q -18,-12 -18,-26 z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2.5"/>
    </g>
  </svg>
);

export const CloudDoodle = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 140 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,60 C 4,60 4,38 22,36 C 26,18 50,16 56,30 C 64,18 90,20 92,36 C 112,34 122,56 104,62 C 100,72 30,72 20,60 Z" fill="#fff" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M30,52 C 36,56 44,54 48,50" stroke="#1B1B1F" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

export const SunDoodle = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="22" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3.5"/>
    {[...Array(8)].map((_, i) => {
      const a = (i * 45 * Math.PI) / 180;
      const x1 = 60 + Math.cos(a) * 32, y1 = 60 + Math.sin(a) * 32;
      const x2 = 60 + Math.cos(a) * 50, y2 = 60 + Math.sin(a) * 50;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round"/>;
    })}
    <circle cx="54" cy="58" r="1.6" fill="#1B1B1F"/>
    <circle cx="66" cy="58" r="1.6" fill="#1B1B1F"/>
    <path d="M53,66 Q60,72 67,66" stroke="#1B1B1F" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
  </svg>
);

export const StarDoodle = ({ className = "", color = "#FF5A36" }: ColorDoodleProps) => (
  <svg viewBox="0 0 60 60" className={className} fill="none">
    <path d="M30,5 L 36,22 L 54,24 L 40,36 L 44,54 L 30,44 L 16,54 L 20,36 L 6,24 L 24,22 Z" fill={color} stroke="#1B1B1F" strokeWidth="2.5" strokeLinejoin="round"/>
  </svg>
);

export const BlobDoodle = ({ className = "", color = "#9B5DE5" }: ColorDoodleProps) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M44,72 C 60,28 142,18 168,62 C 196,108 162,168 116,176 C 64,184 18,148 28,108 C 32,92 36,80 44,72 Z" fill={color} stroke="#1B1B1F" strokeWidth="3"/>
  </svg>
);

export const SquiggleDoodle = ({ className = "", color = "#1B1B1F" }: ColorDoodleProps) => (
  <svg viewBox="0 0 120 30" className={className} fill="none">
    <path d="M2,15 C 16,2 28,28 42,15 C 56,2 68,28 82,15 C 96,2 108,28 118,15" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
  </svg>
);

export const ArrowDoodle = ({ className = "", color = "#1B1B1F" }: ColorDoodleProps) => (
  <svg viewBox="0 0 140 80" className={className} fill="none">
    <path d="M6,40 C 30,12 70,68 110,30" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <path d="M96,22 L 112,28 L 106,44" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const PinDoodle = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 60 80" className={className} fill="none">
    <path d="M30,4 C 14,4 6,18 8,32 C 10,46 30,72 30,72 C 30,72 50,46 52,32 C 54,18 46,4 30,4 Z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="30" cy="30" r="8" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5"/>
  </svg>
);

export const CoinDoodle = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <ellipse cx="40" cy="44" rx="30" ry="28" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3"/>
    <ellipse cx="40" cy="40" rx="30" ry="28" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3"/>
    <text x="40" y="48" textAnchor="middle" fontFamily="Permanent Marker, cursive" fontSize="26" fill="#1B1B1F">$</text>
  </svg>
);

export const HeartDoodle = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 80 76" className={className} fill="none">
    <path d="M40,68 C 8,46 8,18 24,12 C 32,8 38,14 40,20 C 42,14 48,8 56,12 C 72,18 72,46 40,68 Z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);

export const SkateDoodle = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 160 100" className={className} fill="none">
    <path d="M18,52 L 142,52" stroke="#1B1B1F" strokeWidth="6" strokeLinecap="round"/>
    <path d="M18,52 C 22,38 138,38 142,52" stroke="#7BC950" strokeWidth="8" strokeLinecap="round" fill="none"/>
    <circle cx="38" cy="74" r="12" fill="#1B1B1F"/>
    <circle cx="122" cy="74" r="12" fill="#1B1B1F"/>
    <circle cx="38" cy="74" r="5" fill="#FDF6E3"/>
    <circle cx="122" cy="74" r="5" fill="#FDF6E3"/>
  </svg>
);

export const ChatDoodle = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 120 100" className={className} fill="none">
    <path d="M14,18 C 14,10 22,6 30,6 L 92,6 C 102,6 110,12 110,22 L 110,58 C 110,68 102,74 92,74 L 50,74 L 32,92 L 36,74 L 30,74 C 22,74 14,68 14,58 Z" fill="#fff" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="40" cy="40" r="3" fill="#1B1B1F"/>
    <circle cx="60" cy="40" r="3" fill="#1B1B1F"/>
    <circle cx="80" cy="40" r="3" fill="#1B1B1F"/>
  </svg>
);

export const PaperPlane = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 120 100" className={className} fill="none">
    <path d="M10,50 L 110,12 L 78,90 L 62,62 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M62,62 L 110,12" stroke="#1B1B1F" strokeWidth="3"/>
  </svg>
);

/* A small friend mascot — used as a passenger character */
export const FriendMascot = ({ className = "", hat = "#FF5A36" }: FriendMascotProps) => (
  <svg viewBox="0 0 140 180" className={className} fill="none">
    {/* legs */}
    <path d="M58,156 L 56,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round"/>
    <path d="M82,156 L 84,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round"/>
    {/* shoes */}
    <path d="M48,178 L 64,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round"/>
    <path d="M76,178 L 92,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round"/>
    {/* body */}
    <path d="M40,100 C 40,84 56,76 70,76 C 84,76 100,84 100,100 L 100,140 C 100,150 90,158 70,158 C 50,158 40,150 40,140 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4"/>
    {/* backpack strap */}
    <path d="M52,80 L 62,140" stroke="#1B1B1F" strokeWidth="3"/>
    {/* arms */}
    <path d="M40,108 C 26,118 20,134 26,148" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <path d="M100,108 C 116,114 124,128 122,142" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" fill="none"/>
    {/* head */}
    <circle cx="70" cy="52" r="28" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="4"/>
    {/* hair / beanie */}
    <path d="M42,46 C 44,22 96,22 98,46 L 100,52 C 80,46 60,46 40,52 Z" fill={hat} stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round"/>
    <circle cx="70" cy="22" r="4" fill={hat} stroke="#1B1B1F" strokeWidth="3"/>
    {/* eyes */}
    <circle cx="60" cy="54" r="2.4" fill="#1B1B1F"/>
    <circle cx="80" cy="54" r="2.4" fill="#1B1B1F"/>
    {/* smile */}
    <path d="M58,64 Q 70,74 82,64" stroke="#1B1B1F" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    {/* cheek */}
    <circle cx="54" cy="62" r="3" fill="#FF5A36" opacity="0.5"/>
    <circle cx="86" cy="62" r="3" fill="#FF5A36" opacity="0.5"/>
  </svg>
);

export const RoadPath = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 1400 220" className={className} fill="none" preserveAspectRatio="none">
    <motion.path
      d="M0,170 C 200,40 380,260 580,140 C 760,30 940,250 1140,150 C 1280,90 1360,180 1400,140"
      stroke="#1B1B1F"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  </svg>
);
