"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Role = "student" | "driver";

/* ────────────────────────────────────────────────────────────────── */
/* Doodle illustrations — hand-drawn, campus-rides style              */
/* ────────────────────────────────────────────────────────────────── */

function StudentDoodle() {
  return (
    <svg
      viewBox="0 0 420 420"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="student-doodle"
    >
      {/* ground shadow */}
      <ellipse cx="210" cy="360" rx="150" ry="12" fill="#1B1B1F" opacity="0.18" />

      {/* scattered notebook on floor */}
      <g transform="translate(40 320) rotate(-8)">
        <rect x="0" y="0" width="80" height="56" rx="4" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="3" />
        <path d="M10,12 L 68,12 M10,24 L 60,24 M10,36 L 64,36 M10,46 L 50,46" stroke="#1B1B1F" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      </g>

      {/* pencil */}
      <g transform="translate(290 332) rotate(18)">
        <rect x="0" y="0" width="74" height="12" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="2.5" />
        <path d="M74,0 L 90,6 L 74,12 Z" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M86,4 L 92,6 L 86,8 Z" fill="#1B1B1F" />
        <path d="M0,0 L 0,12 L -8,12 L -8,0 Z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2.5" />
      </g>

      {/* backpack behind */}
      <g transform="translate(118 198)">
        <path d="M14,18 C 14,8 28,2 42,2 L 124,2 C 138,2 152,8 152,18 L 152,142 C 152,154 142,162 130,162 L 36,162 C 24,162 14,154 14,142 Z"
          fill="#7BC950" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
        {/* strap loops */}
        <path d="M52,4 C 50,-14 78,-14 80,4" stroke="#1B1B1F" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M88,4 C 90,-14 118,-14 116,4" stroke="#1B1B1F" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* pocket */}
        <rect x="44" y="70" width="78" height="56" rx="6" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3.5" />
        <path d="M52,84 L 114,84" stroke="#1B1B1F" strokeWidth="2.5" />
        {/* zipper */}
        <circle cx="118" cy="98" r="4" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2" />
      </g>

      {/* graduation cap on head — drawn last */}

      {/* head */}
      <g>
        <circle cx="210" cy="158" r="56" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="4" />
        {/* hair fringe */}
        <path d="M158,140 C 168,108 252,104 262,142 C 250,128 230,124 218,138 C 208,128 188,128 178,142 C 174,138 168,138 158,140 Z"
          fill="#1B1B1F" />
        {/* eyes */}
        <g>
          <circle cx="194" cy="158" r="6" fill="#fff" stroke="#1B1B1F" strokeWidth="2.5" />
          <circle cx="195" cy="159" r="2.6" fill="#1B1B1F" />
          <circle cx="228" cy="158" r="6" fill="#fff" stroke="#1B1B1F" strokeWidth="2.5" />
          <circle cx="229" cy="159" r="2.6" fill="#1B1B1F" />
        </g>
        {/* cheek blush */}
        <circle cx="180" cy="178" r="5" fill="#FF5A36" opacity="0.45" />
        <circle cx="240" cy="178" r="5" fill="#FF5A36" opacity="0.45" />
        {/* smile */}
        <path d="M198,184 Q 210,196 222,184" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      {/* graduation cap */}
      <g transform="translate(210 92)">
        <path d="M-58,8 L 0,-14 L 58,8 L 0,30 Z" fill="#1B1B1F" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round" />
        <path d="M-30,18 L -30,40 C -30,52 30,52 30,40 L 30,18" stroke="#1B1B1F" strokeWidth="3" fill="#1B1B1F" />
        {/* tassel */}
        <path d="M40,4 Q 56,6 58,22" stroke="#FFD23F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="58" cy="24" r="5" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="2.5" />
      </g>

      {/* body — sweater */}
      <g>
        <path d="M148,238 C 152,224 174,214 210,214 C 246,214 268,224 272,238 L 282,332 C 284,346 272,358 256,358 L 164,358 C 148,358 136,346 138,332 Z"
          fill="#FF5A36" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
        {/* sweater pattern stripe */}
        <path d="M150,272 C 184,280 236,280 270,272" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* collar */}
        <path d="M192,214 Q 210,228 228,214" stroke="#1B1B1F" strokeWidth="3.5" fill="#FDF6E3" strokeLinejoin="round" />
      </g>

      {/* waving arm */}
      <g>
        <path d="M268,242 Q 318,222 322,176 Q 324,158 312,148"
          stroke="#1B1B1F" strokeWidth="4" fill="#FF5A36" strokeLinejoin="round" strokeLinecap="round" />
        {/* hand */}
        <circle cx="312" cy="144" r="14" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="3.5" />
        {/* finger lines */}
        <path d="M306,138 L 304,128 M312,136 L 312,124 M318,138 L 320,128" stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* book in other arm */}
      <g transform="translate(140 280) rotate(-12)">
        <rect x="0" y="0" width="58" height="44" fill="#9B5DE5" stroke="#1B1B1F" strokeWidth="3" />
        <rect x="0" y="0" width="58" height="6" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
        <path d="M8,20 L 50,20 M8,30 L 42,30" stroke="#FDF6E3" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* sparkles + scribbles */}
      <g opacity="0.9">
        <path d="M60,140 L 70,130 M65,135 L 65,135 M58,128 L 72,142" stroke="#FF5A36" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M348,210 L 360,200 M354,196 L 354,210 M348,210 L 360,210" stroke="#FFD23F" strokeWidth="3" strokeLinecap="round" />
        <path d="M86,232 q 6,-10 14,-2 q 8,-8 14,2 q 0,10 -14,18 q -14,-8 -14,-18 z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2.5" />
        {/* squiggle */}
        <path d="M320,80 C 330,72 340,88 350,80 C 360,72 370,88 380,80" stroke="#1B1B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function DriverDoodle() {
  return (
    <svg
      viewBox="0 0 420 420"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="driver-doodle"
    >
      {/* road shadow */}
      <ellipse cx="210" cy="358" rx="170" ry="14" fill="#1B1B1F" opacity="0.18" />

      {/* dashed road */}
      <path d="M30,388 L 60,388 M90,388 L 120,388 M150,388 L 180,388 M210,388 L 240,388 M270,388 L 300,388 M330,388 L 360,388"
        stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" opacity="0.45" />

      {/* car body */}
      <g>
        <path
          d="M48,310 C 48,256 78,232 122,228 L 152,180 C 168,160 196,156 226,156 L 290,156 C 318,156 338,170 354,196 L 370,222 C 386,230 396,246 396,266 L 396,298 C 396,310 386,320 374,320"
          stroke="#1B1B1F"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#FFD23F"
        />
        <path d="M48,320 L 70,320 M130,320 L 320,320" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />

        {/* windshield */}
        <path d="M156,200 L 188,170 L 244,170 L 268,200 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
        {/* side window */}
        <path d="M276,200 L 286,172 L 322,172 C 332,172 340,180 346,190 L 352,200 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
        {/* window separator */}
        <path d="M210,170 L 210,200" stroke="#1B1B1F" strokeWidth="4" />
        {/* headlight */}
        <circle cx="378" cy="258" r="9" fill="#fff" stroke="#1B1B1F" strokeWidth="3" />
        {/* door handle */}
        <path d="M204,236 L 230,236" stroke="#1B1B1F" strokeWidth="4" strokeLinecap="round" />
        {/* roof rack */}
        <path d="M174,156 L 256,156" stroke="#1B1B1F" strokeWidth="3" />
      </g>

      {/* wheels */}
      <g>
        <circle cx="112" cy="320" r="30" fill="#1B1B1F" />
        <circle cx="112" cy="320" r="15" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" className="wheel-spin" />
        <path d="M112,310 L 112,330 M102,320 L 122,320" stroke="#1B1B1F" strokeWidth="3" />
      </g>
      <g>
        <circle cx="332" cy="320" r="30" fill="#1B1B1F" />
        <circle cx="332" cy="320" r="15" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" className="wheel-spin" />
        <path d="M332,310 L 332,330 M322,320 L 342,320" stroke="#1B1B1F" strokeWidth="3" />
      </g>

      {/* driver — head poking out window */}
      <g>
        {/* face */}
        <circle cx="218" cy="190" r="16" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="3.5" />
        {/* cap */}
        <path d="M198,184 L 198,176 C 198,166 240,166 240,176 L 240,184 Z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round" />
        <path d="M236,184 L 252,184" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="213" cy="192" r="2.2" fill="#1B1B1F" />
        <circle cx="223" cy="192" r="2.2" fill="#1B1B1F" />
        {/* smile */}
        <path d="M212,198 Q 218,202 224,198" stroke="#1B1B1F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>

      {/* waving hand out of window */}
      <g transform="translate(150 174)">
        <path d="M0,28 C -22,18 -34,2 -32,-12" stroke="#1B1B1F" strokeWidth="4" fill="#FFB4A2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="-34" cy="-16" r="12" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="3.5" />
        <path d="M-38,-22 L -40,-30 M-34,-24 L -34,-34 M-30,-22 L -28,-30" stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* steering wheel small badge bottom */}
      <g transform="translate(56 90)">
        <circle cx="0" cy="0" r="26" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3.5" />
        <circle cx="0" cy="0" r="8" fill="#1B1B1F" />
        <path d="M-26,0 L 26,0 M0,-26 L 0,26" stroke="#1B1B1F" strokeWidth="3" />
        <path d="M-22,-14 C -10,-22 10,-22 22,-14" stroke="#1B1B1F" strokeWidth="2.5" fill="none" />
      </g>

      {/* heart sticker */}
      <path d="M328,72 q 8,-14 18,-4 q 10,-10 18,4 q 0,14 -18,26 q -18,-12 -18,-26 z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="2.5" />

      {/* speed lines */}
      <path d="M-4,238 L 32,238 M-2,266 L 28,266 M6,292 L 36,292" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" />

      {/* scribble cloud */}
      <g opacity="0.85" transform="translate(280 80)">
        <path d="M0,18 C -12,18 -12,4 0,4 C 4,-8 26,-8 30,4 C 36,-6 56,-2 56,14 C 68,16 68,32 56,30 C 50,40 6,40 0,30 Z"
          fill="#fff" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round" />
      </g>

      {/* sparkles */}
      <path d="M84,160 L 92,152 M88,148 L 88,164 M80,160 L 96,160" stroke="#FF5A36" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M370,140 L 380,130 M375,126 L 375,144" stroke="#FFD23F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* Floating background doodles around the card                        */
/* ────────────────────────────────────────────────────────────────── */

function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 80" className={className} fill="none">
      <path d="M20,60 C 4,60 4,38 22,36 C 26,18 50,16 56,30 C 64,18 90,20 92,36 C 112,34 122,56 104,62 C 100,72 30,72 20,60 Z"
        fill="#fff" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round" />
      <path d="M30,52 C 36,56 44,54 48,50" stroke="#1B1B1F" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Sun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <circle cx="60" cy="60" r="26" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
      <g stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round">
        <path d="M60,12 L 60,26" /><path d="M60,94 L 60,108" />
        <path d="M12,60 L 26,60" /><path d="M94,60 L 108,60" />
        <path d="M22,22 L 32,32" /><path d="M88,88 L 98,98" />
        <path d="M22,98 L 32,88" /><path d="M88,32 L 98,22" />
      </g>
      <circle cx="52" cy="56" r="2.4" fill="#1B1B1F" />
      <circle cx="68" cy="56" r="2.4" fill="#1B1B1F" />
      <path d="M52,66 Q 60,72 68,66" stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Star({ color = "#FFD23F", className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none">
      <path d="M30,5 L 36,22 L 54,24 L 40,36 L 44,54 L 30,44 L 16,54 L 20,36 L 6,24 L 24,22 Z"
        fill={color} stroke="#1B1B1F" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.34-2.04 3.06l3.3 2.56c1.92-1.78 3.02-4.4 3.02-7.52 0-.72-.06-1.42-.2-2.1H12z" />
      <path fill="#34A853" d="M12 22c2.74 0 5.04-.9 6.72-2.44l-3.3-2.56c-.9.62-2.06.98-3.42.98-2.64 0-4.88-1.78-5.68-4.2l-3.4 2.62C4.58 19.72 8.04 22 12 22z" />
      <path fill="#4A90E2" d="M6.32 13.78A6.2 6.2 0 0 1 6 12c0-.62.12-1.22.32-1.78L2.92 7.6A9.9 9.9 0 0 0 2 12c0 1.58.38 3.08 1.04 4.4l3.28-2.62z" />
      <path fill="#FBBC05" d="M12 5.9c1.5 0 2.84.52 3.9 1.52l2.92-2.92A9.7 9.7 0 0 0 12 2C8.04 2 4.58 4.28 2.92 7.6l3.4 2.62c.8-2.42 3.04-4.32 5.68-4.32z" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* Main AuthPage                                                       */
/* ────────────────────────────────────────────────────────────────── */

export default function AuthPage() {
  const supabase = useMemo(() => createClient(), []);
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // entrance animation
  useEffect(() => {
    const context = gsap.context(() => {
      if (!cardRef.current) return;
      gsap.set(cardRef.current, {
        transformPerspective: 1100,
        transformOrigin: "50% 50%",
      });
      gsap.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 54, rotateX: 7 },
        { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.95, ease: "power3.out" }
      );
    }, pageRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    setFormError(null);
    setFormNotice(null);
  }, [role]);

  const handleGoogleSignIn = async () => {
    if (isOAuthLoading) return;
    setFormError(null);
    setFormNotice(null);
    setIsOAuthLoading(true);
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: { role },
      },
    });
    if (error) {
      setFormError(error.message);
      setIsOAuthLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isOAuthLoading) return;
    setIsSubmitting(true);
    setFormError(null);
    setFormNotice(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setFormError("Email and password are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (error) {
        setFormError(error.message);
        return;
      }
      setFormNotice("Logged in successfully.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStudent = role === "student";

  // Right panel theme tones
  const rightBg = isStudent ? "#FFD23F" : "#FF5A36"; // sun for student, tomato for driver
  const rightTextColor = isStudent ? "#1B1B1F" : "#FDF6E3";

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-hidden grain"
      style={{ background: "#FDF6E3", color: "#1B1B1F" }}
      data-testid="auth-page"
    >
      {/* floating background doodles */}
      <div className="pointer-events-none absolute top-6 left-[4%] w-24 float-a opacity-90"><Cloud /></div>
      <div className="pointer-events-none absolute top-24 right-[8%] w-28 float-b opacity-90"><Cloud /></div>
      <div className="pointer-events-none absolute top-8 right-[22%] w-20 float-c"><Sun /></div>
      <div className="pointer-events-none absolute bottom-10 left-[6%] w-14 float-c"><Star color="#9B5DE5" /></div>
      <div className="pointer-events-none absolute bottom-20 right-[6%] w-12 float-a"><Star color="#FF5A36" /></div>
      <div className="pointer-events-none absolute top-[40%] left-[2%] w-10 float-b"><Star color="#FFD23F" /></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <motion.div
          ref={cardRef}
          className="w-full max-w-5xl overflow-hidden"
          style={{
            background: "#fffdf5",
            border: "3px solid #1B1B1F",
            borderRadius: "44px 14px 40px 16px / 16px 40px 14px 44px",
            boxShadow: "10px 10px 0 #1B1B1F",
          }}
          data-testid="auth-card"
        >
          <div className="relative grid min-h-[640px] md:grid-cols-2">
            {/* ────────── LEFT: Form panel ────────── */}
            <section className="relative z-10 flex items-center px-6 py-10 sm:px-10">
              <div className="w-full max-w-[420px] mx-auto">
                {/* Logo / wordmark */}
                <div className="flex items-center gap-3 mb-8" data-testid="auth-logo">
                  <span
                    className="relative w-11 h-11 grid place-items-center rounded-full"
                    style={{ border: "2.5px solid #1B1B1F", background: "#FFD23F", boxShadow: "3px 3px 0 #1B1B1F" }}
                  >
                    <svg viewBox="0 0 40 40" className="w-7 h-7">
                      <path d="M6,26 C 6,20 10,16 16,16 L 24,16 C 30,16 34,20 34,26" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <circle cx="13" cy="28" r="3.5" fill="#1B1B1F" />
                      <circle cx="27" cy="28" r="3.5" fill="#1B1B1F" />
                      <path d="M14,16 L 18,10 L 22,10 L 26,16" stroke="#1B1B1F" strokeWidth="2.5" strokeLinejoin="round" fill="#FF5A36" />
                    </svg>
                  </span>
                  <span className="font-marker text-2xl tracking-wide">
                    Campus<span style={{ color: "#FF5A36" }}>Rides</span>
                  </span>
                </div>

                {/* Role tabs */}
                <div
                  className="relative inline-flex p-1 mb-7"
                  style={{
                    background: "#FDF6E3",
                    border: "2.5px solid #1B1B1F",
                    borderRadius: 999,
                    boxShadow: "3px 3px 0 #1B1B1F",
                  }}
                  data-testid="role-tabs"
                >
                  <RoleTab
                    label="I'm a Student"
                    active={isStudent}
                    onClick={() => setRole("student")}
                    activeBg="#FFD23F"
                    testId="role-tab-student"
                  />
                  <RoleTab
                    label="I'm a Driver"
                    active={!isStudent}
                    onClick={() => setRole("driver")}
                    activeBg="#FF5A36"
                    activeColor="#FDF6E3"
                    testId="role-tab-driver"
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.form
                    key={role}
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    className="space-y-5"
                    data-testid="auth-form"
                  >
                    <div>
                      <p className="font-scribble text-2xl" style={{ color: "#FF5A36" }} data-testid="form-eyebrow">
                        ~ {isStudent ? "hey scholar" : "hey roadster"} ~
                      </p>
                      <h1 className="font-marker leading-[0.95] text-5xl md:text-6xl mt-1" data-testid="form-title">
                        {isStudent ? (
                          <>Hop <span className="scribble">in</span>.</>
                        ) : (
                          <>Buckle <span className="marker">up</span>.</>
                        )}
                      </h1>
                      <p className="font-body text-xl mt-3" style={{ color: "rgba(27,27,31,0.78)" }}>
                        {isStudent
                          ? "Sign in and find your ride before the bus leaves the gate."
                          : "Sign in to pick up students and start your shift."}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="font-hand text-lg" htmlFor="auth-email">Email</label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2" style={{ color: "rgba(27,27,31,0.55)" }} />
                        <input
                          id="auth-email"
                          required
                          type="email"
                          autoComplete="email"
                          placeholder={isStudent ? "you@college.edu" : "driver@campus.in"}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          data-testid="auth-email-input"
                          className="w-full pl-12 pr-4 py-3 font-hand text-lg focus:outline-none"
                          style={{
                            background: "#FDF6E3",
                            border: "2.5px solid #1B1B1F",
                            borderRadius: "40px 8px 36px 10px / 10px 36px 8px 40px",
                            boxShadow: "4px 4px 0 #1B1B1F",
                          }}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="font-hand text-lg" htmlFor="auth-password">Password</label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2" style={{ color: "rgba(27,27,31,0.55)" }} />
                        <input
                          id="auth-password"
                          required
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          data-testid="auth-password-input"
                          className="w-full pl-12 pr-12 py-3 font-hand text-lg focus:outline-none"
                          style={{
                            background: "#FDF6E3",
                            border: "2.5px solid #1B1B1F",
                            borderRadius: "10px 36px 8px 40px / 40px 8px 36px 10px",
                            boxShadow: "4px 4px 0 #1B1B1F",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 transition hover:bg-black/10"
                          data-testid="toggle-password"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {formError && (
                      <p className="font-hand text-base" style={{ color: "#c41e1e" }} data-testid="form-error">{formError}</p>
                    )}
                    {formNotice && (
                      <p className="font-hand text-base" style={{ color: "#1f7a3f" }} data-testid="form-notice">{formNotice}</p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isOAuthLoading}
                      className="sketch-btn sketch-btn--tomato w-full justify-center"
                      data-testid="auth-submit"
                      style={{ fontSize: "1.25rem" }}
                    >
                      {isSubmitting ? "Logging in..." : isStudent ? "Login as Student" : "Login as Driver"}
                      <span aria-hidden>→</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 pt-1" data-testid="divider">
                      <span className="flex-1 h-px" style={{ background: "rgba(27,27,31,0.25)" }} />
                      <span className="font-scribble text-lg" style={{ color: "rgba(27,27,31,0.55)" }}>or, faster ↘</span>
                      <span className="flex-1 h-px" style={{ background: "rgba(27,27,31,0.25)" }} />
                    </div>

                    {/* Google */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isSubmitting || isOAuthLoading}
                      className="sketch-btn w-full justify-center"
                      data-testid="google-signin"
                      style={{ background: "#fff", fontSize: "1.15rem" }}
                    >
                      <GoogleMark />
                      {isOAuthLoading ? "Connecting..." : "Continue with Google"}
                    </button>

                    <p className="pt-2 text-center font-hand text-base" style={{ color: "rgba(27,27,31,0.7)" }} data-testid="form-footer">
                      By continuing, you join the doodle. Welcome aboard, friend ✿
                    </p>
                  </motion.form>
                </AnimatePresence>
              </div>
            </section>

            {/* ────────── RIGHT: Doodle panel ────────── */}
            <aside
              className="relative hidden md:flex items-center justify-center overflow-hidden"
              data-testid="doodle-panel"
            >
              {/* Animated background color swap */}
              <motion.div
                className="absolute inset-0"
                animate={{ background: rightBg }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
                style={{ background: rightBg }}
              />
              {/* paper dots overlay */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(27,27,31,0.18) 1.2px, transparent 1.2px)",
                  backgroundSize: "22px 22px",
                }}
              />

              {/* Floating side doodles */}
              <div className="absolute top-6 left-6 w-16 float-c"><Cloud /></div>
              <div className="absolute bottom-10 left-8 w-10 float-b"><Star color="#9B5DE5" /></div>
              <div className="absolute top-10 right-8 w-12 float-a"><Star color="#7BC950" /></div>

              {/* Title overlay */}
              <motion.div
                key={`title-${role}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="absolute top-10 left-10 right-10 z-10 max-w-[320px]"
                data-testid="doodle-headline"
              >
                <h2
                  className="font-marker text-5xl leading-[0.92]"
                  style={{ color: rightTextColor }}
                >
                  {isStudent ? (
                    <>WELCOME,<br />SCHOLAR!</>
                  ) : (
                    <>READY TO<br />DRIVE?</>
                  )}
                </h2>
                <p className="font-hand text-lg mt-4" style={{ color: rightTextColor, opacity: 0.85 }}>
                  {isStudent
                    ? "Find a ride, share petrol, never miss home."
                    : "Pick up students, run the route, earn the trip."}
                </p>
              </motion.div>

              {/* Animated doodle swap */}
              <div className="absolute inset-0 flex items-end justify-center pb-2">
                <div className="relative w-[88%] h-[78%]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, x: isStudent ? -60 : 60, rotate: isStudent ? -6 : 6, scale: 0.92 }}
                      animate={{ opacity: 1, x: 0, rotate: isStudent ? -2 : 2, scale: 1 }}
                      exit={{ opacity: 0, x: isStudent ? 60 : -60, rotate: isStudent ? 6 : -6, scale: 0.92 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                      data-testid={`doodle-scene-${role}`}
                    >
                      {isStudent ? <StudentDoodle /> : <DriverDoodle />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* sticky note label */}
              <motion.div
                key={`sticky-${role}`}
                initial={{ opacity: 0, y: 12, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: -8 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="absolute bottom-8 right-8 px-4 py-2 font-marker text-base z-10"
                style={{
                  background: "#fffdf5",
                  border: "2.5px solid #1B1B1F",
                  boxShadow: "4px 4px 0 #1B1B1F",
                }}
                data-testid="sticky-note"
              >
                {isStudent ? "for students ✿" : "for drivers ⚙"}
              </motion.div>
            </aside>
          </div>
        </motion.div>
      </div>

      {/* small footer hint */}
      <div className="relative z-10 pb-6 text-center font-scribble text-lg" style={{ color: "rgba(27,27,31,0.6)" }} data-testid="footer-hint">
        drawn by hand · drive friendly · split fairly
      </div>
    </div>
  );
}

/* ────────── Role tab button ────────── */

function RoleTab({
  label,
  active,
  onClick,
  activeBg,
  activeColor = "#1B1B1F",
  testId,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeBg: string;
  activeColor?: string;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={cn(
        "relative px-5 py-2 font-marker text-base tracking-wide rounded-full transition-colors duration-300"
      )}
      style={{
        color: active ? activeColor : "#1B1B1F",
        background: active ? activeBg : "transparent",
        border: active ? "2px solid #1B1B1F" : "2px solid transparent",
        boxShadow: active ? "2px 2px 0 #1B1B1F" : "none",
      }}
    >
      {label}
    </button>
  );
}