"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthMode = "login" | "signup";

type Pointer = {
  x: number;
  y: number;
};

type ShapeKind = "rectangle" | "semicircle";

type CharacterSpec = {
  id: string;
  left: number;
  width: number;
  height: number;
  color: string;
  shape: ShapeKind;
  eyeSize: number;
  pupilRange: number;
  floatOffset: number;
  zIndex: number;
};

const CHARACTER_SPECS: CharacterSpec[] = [
  {
    id: "orange",
    left: 6,
    width: 30,
    height: 54,
    color: "#f4a15d",
    shape: "semicircle",
    eyeSize: 18,
    pupilRange: 5,
    floatOffset: 8,
    zIndex: 3,
  },
  {
    id: "purple",
    left: 28,
    width: 22,
    height: 96,
    color: "#5c4cf3",
    shape: "rectangle",
    eyeSize: 20,
    pupilRange: 7,
    floatOffset: 12,
    zIndex: 1,
  },
  {
    id: "charcoal",
    left: 50,
    width: 16,
    height: 72,
    color: "#1f1f1f",
    shape: "rectangle",
    eyeSize: 17,
    pupilRange: 6,
    floatOffset: 10,
    zIndex: 2,
  },
  {
    id: "yellow",
    left: 66,
    width: 22,
    height: 60,
    color: "#d9d45b",
    shape: "semicircle",
    eyeSize: 16,
    pupilRange: 5,
    floatOffset: 8,
    zIndex: 4,
  },
];

function useRandomBlink(minMs = 2000, maxMs = 4500) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let openTimer = 0;
    let closeTimer = 0;

    const scheduleBlink = () => {
      const delay = Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);

      openTimer = window.setTimeout(() => {
        setIsBlinking(true);

        closeTimer = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 140);
      }, delay);
    };

    scheduleBlink();

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
    };
  }, [maxMs, minMs]);

  return isBlinking;
}

function TrackingEye({
  pointer,
  size,
  pupilRange,
  blink,
}: {
  pointer: Pointer;
  size: number;
  pupilRange: number;
  blink: boolean;
}) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!eyeRef.current) {
      return;
    }

    const rect = eyeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = pointer.x - centerX;
    const deltaY = pointer.y - centerY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(
      pupilRange,
      Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.08
    );

    setOffset({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    });
  }, [pointer.x, pointer.y, pupilRange]);

  return (
    <div
      ref={eyeRef}
      style={{
        width: size,
        height: blink ? Math.max(3, Math.round(size * 0.14)) : size,
        background: "#ffffff",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "height 120ms ease, transform 140ms ease",
      }}
    >
      {!blink && (
        <div
          style={{
            width: size * 0.44,
            height: size * 0.44,
            borderRadius: "50%",
            background: "#1e1e1e",
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: "transform 120ms ease-out",
          }}
        />
      )}
    </div>
  );
}

function CartoonCharacter({
  pointer,
  spec,
}: {
  pointer: Pointer;
  spec: CharacterSpec;
}) {
  const blink = useRandomBlink();

  return (
    <motion.div
      className="character-shape absolute bottom-0"
      style={{
        left: `${spec.left}%`,
        width: `${spec.width}%`,
        height: `${spec.height}%`,
        borderRadius: spec.shape === "rectangle" ? "14px 14px 0 0" : "999px 999px 0 0",
        background: spec.color,
        zIndex: spec.zIndex,
        boxShadow:
          "0 16px 34px -24px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.16)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: spec.shape === "rectangle" ? "20%" : "28%",
      }}
      animate={{ y: [0, -spec.floatOffset, 0] }}
      transition={{
        duration: 3.5 + spec.floatOffset / 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <div style={{ display: "flex", gap: sizeToGap(spec.eyeSize) }}>
        <TrackingEye
          pointer={pointer}
          size={spec.eyeSize}
          pupilRange={spec.pupilRange}
          blink={blink}
        />
        <TrackingEye
          pointer={pointer}
          size={spec.eyeSize}
          pupilRange={spec.pupilRange}
          blink={blink}
        />
      </div>
    </motion.div>
  );
}

function sizeToGap(eyeSize: number) {
  return Math.max(10, Math.round(eyeSize * 0.6));
}

function AnimatedCartoonCharacters({ pointer }: { pointer: Pointer }) {
  return (
    <div className="absolute inset-x-0 bottom-0 h-full">
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/10 to-transparent" />
      {CHARACTER_SPECS.map((character) => (
        <CartoonCharacter key={character.id} pointer={pointer} spec={character} />
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.34-2.04 3.06l3.3 2.56c1.92-1.78 3.02-4.4 3.02-7.52 0-.72-.06-1.42-.2-2.1H12z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.74 0 5.04-.9 6.72-2.44l-3.3-2.56c-.9.62-2.06.98-3.42.98-2.64 0-4.88-1.78-5.68-4.2l-3.4 2.62C4.58 19.72 8.04 22 12 22z"
      />
      <path
        fill="#4A90E2"
        d="M6.32 13.78A6.2 6.2 0 0 1 6 12c0-.62.12-1.22.32-1.78L2.92 7.6A9.9 9.9 0 0 0 2 12c0 1.58.38 3.08 1.04 4.4l3.28-2.62z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.9c1.5 0 2.84.52 3.9 1.52l2.92-2.92A9.7 9.7 0 0 0 12 2C8.04 2 4.58 4.28 2.92 7.6l3.4 2.62c.8-2.42 3.04-4.32 5.68-4.32z"
      />
    </svg>
  );
}

function OutlookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path fill="#0A5FD8" d="M9 3h12v18H9z" />
      <path fill="#1B73E8" d="M3 6h12v12H3z" />
      <path
        fill="#fff"
        d="M9.3 16.2c-1.8 0-3.1-1.3-3.1-3.2s1.3-3.2 3.1-3.2 3.1 1.3 3.1 3.2-1.3 3.2-3.1 3.2zm0-1.6c.8 0 1.3-.7 1.3-1.6s-.5-1.6-1.3-1.6S8 12.1 8 13s.5 1.6 1.3 1.6z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [pointer, setPointer] = useState<Pointer>(() => {
    if (typeof window === "undefined") {
      return { x: 0, y: 0 };
    }

    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  });

  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const latest = {
      x: typeof window === "undefined" ? 0 : window.innerWidth / 2,
      y: typeof window === "undefined" ? 0 : window.innerHeight / 2,
    };
    let frame = 0;

    const handleMove = (event: MouseEvent) => {
      latest.x = event.clientX;
      latest.y = event.clientY;

      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setPointer({ x: latest.x, y: latest.y });
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      if (!cardRef.current) {
        return;
      }

      gsap.set(cardRef.current, {
        transformPerspective: 1100,
        transformOrigin: "50% 50%",
      });

      gsap.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 54, rotateX: 7 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.95,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".character-shape",
        { autoAlpha: 0, y: 56 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "back.out(1.45)",
          delay: 0.2,
        }
      );
    }, pageRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!cardRef.current) {
      return;
    }

    const card = cardRef.current;
    const xTo = gsap.quickTo(card, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(card, "y", { duration: 0.45, ease: "power3.out" });
    const rxTo = gsap.quickTo(card, "rotationX", {
      duration: 0.45,
      ease: "power3.out",
    });
    const ryTo = gsap.quickTo(card, "rotationY", {
      duration: 0.45,
      ease: "power3.out",
    });

    const handleMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const normalizedX =
        (event.clientX - (rect.left + rect.width / 2)) / Math.max(rect.width, 1);
      const normalizedY =
        (event.clientY - (rect.top + rect.height / 2)) / Math.max(rect.height, 1);

      xTo(normalizedX * 8);
      yTo(normalizedY * 6);
      rxTo(-normalizedY * 9);
      ryTo(normalizedX * 9);
    };

    const reset = () => {
      xTo(0);
      yTo(0);
      rxTo(0);
      ryTo(0);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("blur", reset);
    };
  }, []);

  useEffect(() => {
    setFormError(null);
    setFormNotice(null);
  }, [mode]);

  const submitLabel =
    mode === "login"
      ? isSubmitting
        ? "Logging in..."
        : "Login"
      : isSubmitting
        ? "Creating account..."
        : "Sign Up";
  const googleLabel = isOAuthLoading ? "Connecting..." : "Google";

  const handleGoogleSignIn = async () => {
    if (isOAuthLoading) {
      return;
    }

    setFormError(null);
    setFormNotice(null);
    setIsOAuthLoading(true);

    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });

    if (error) {
      setFormError(error.message);
      setIsOAuthLoading(false);
    }
  };

  const handleOutlookSignIn = () => {
    setFormError(null);
    setFormNotice("Outlook OAuth is not configured yet.");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || isOAuthLoading) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormNotice(null);

    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    if (!trimmedEmail || !password) {
      setFormError("Email and password are required.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "signup" && !trimmedName) {
      setFormError("Full name is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setFormError(error.message);
          return;
        }

        setFormNotice("Logged in successfully.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      setFormNotice(
        data.session
          ? "Account created. You're signed in."
          : "Account created. Check your email to confirm."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-[#eceae4] text-[#111111]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.92),transparent_52%),radial-gradient(circle_at_85%_8%,rgba(0,0,0,0.08),transparent_45%)]" />

      <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <motion.div
          ref={cardRef}
          className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-black/15 bg-[#f8f7f3] shadow-[0_35px_95px_-36px_rgba(0,0,0,0.65)]"
        >
          <div className="relative min-h-[620px] md:h-[620px]">
            <motion.div
              className="pointer-events-none absolute inset-0 hidden bg-black md:block"
              animate={{
                clipPath:
                  mode === "login"
                    ? "polygon(58% 0,100% 0,100% 100%,46% 100%)"
                    : "polygon(0 0,54% 0,42% 100%,0 100%)",
              }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={cn(
                  "absolute bottom-0 h-[60%] w-[42%] overflow-hidden",
                  mode === "login" ? "right-0" : "left-0"
                )}
              >
                <AnimatedCartoonCharacters pointer={pointer} />
              </div>
            </motion.div>

            <div className="relative grid min-h-[620px] md:h-[620px] md:grid-cols-2">
              <section
                className={cn(
                  "z-10 flex items-center px-6 py-8 sm:px-10",
                  mode === "login"
                    ? "md:col-start-1 md:pr-20"
                    : "md:col-start-2 md:pl-20",
                  mode === "signup" && "py-6"
                )}
              >
                <div className="w-full max-w-[390px]">
                  <div
                    className={cn(
                      "mb-6 inline-flex rounded-full border border-black/15 bg-white p-1",
                      mode === "signup" && "mb-4"
                    )}
                  >
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setMode("login")}
                      className={cn(
                        "rounded-full px-5",
                        mode === "login"
                          ? "bg-black text-white hover:bg-black/90"
                          : "bg-transparent text-black hover:bg-black/10"
                      )}
                    >
                      Login
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setMode("signup")}
                      className={cn(
                        "rounded-full px-5",
                        mode === "signup"
                          ? "bg-black text-white hover:bg-black/90"
                          : "bg-transparent text-black hover:bg-black/10"
                      )}
                    >
                      Sign Up
                    </Button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.form
                      key={mode}
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className={cn("space-y-4", mode === "signup" && "space-y-3")}
                    >
                      <motion.h1
                        className="font-[var(--font-syne)] text-4xl font-bold tracking-tight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.28 }}
                      >
                        {mode === "login" ? "Login" : "Sign Up"}
                      </motion.h1>

                      <p className="text-sm text-black/65">
                        {mode === "login"
                          ? "Welcome back. Enter your details to continue."
                          : "Create your account and start booking rides in seconds."}
                      </p>

                      {mode === "signup" && (
                        <div className="space-y-3 pt-1">
                          <label className="block text-sm font-medium text-black/80">
                            Full name
                          </label>
                          <div className="relative">
                            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/45" />
                            <Input
                              required
                              autoComplete="name"
                              placeholder="Jane Rider"
                              value={fullName}
                              onChange={(event) => setFullName(event.target.value)}
                              className="h-11 rounded-full border-black/20 bg-white/90 pl-11 pr-4"
                            />
                          </div>
                        </div>
                      )}

                      <div className={cn("space-y-3", mode === "signup" ? "pt-0" : "pt-1")}>
                        <label className="block text-sm font-medium text-black/80">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/45" />
                          <Input
                            required
                            type="email"
                            autoComplete="email"
                            placeholder="you@campus.edu"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="h-11 rounded-full border-black/20 bg-white/90 pl-11 pr-4"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-black/80">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/45" />
                          <Input
                            required
                            type={showPassword ? "text" : "password"}
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            placeholder={mode === "login" ? "Enter password" : "Create password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="h-11 rounded-full border-black/20 bg-white/90 pl-11 pr-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-black/50 transition hover:bg-black/8 hover:text-black"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {formError && (
                        <p className="text-sm font-medium text-red-600">{formError}</p>
                      )}

                      {formNotice && (
                        <p className="text-sm font-medium text-emerald-700">{formNotice}</p>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting || isOAuthLoading}
                        className="h-11 w-full rounded-full bg-black text-base font-semibold text-white hover:bg-black/90"
                      >
                        {submitLabel}
                      </Button>

                      <div
                        className={cn(
                          "grid grid-cols-2 gap-3 pt-1",
                          mode === "signup" && "pt-0"
                        )}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGoogleSignIn}
                          disabled={isSubmitting || isOAuthLoading}
                          className="h-11 rounded-full border-black/20 bg-white/85 text-black hover:bg-white"
                        >
                          <GoogleMark />
                          {googleLabel}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleOutlookSignIn}
                          disabled={isSubmitting || isOAuthLoading}
                          className="h-11 rounded-full border-black/20 bg-white/85 text-black hover:bg-white"
                        >
                          <OutlookMark />
                          Outlook
                        </Button>
                      </div>

                      <p
                        className={cn(
                          "pt-1 text-center text-sm text-black/65",
                          mode === "signup" && "pt-0"
                        )}
                      >
                        {mode === "login"
                          ? "Don't have an account?"
                          : "Already have an account?"}{" "}
                        <button
                          type="button"
                          onClick={() =>
                            setMode((value) => (value === "login" ? "signup" : "login"))
                          }
                          className="font-semibold text-black underline-offset-4 hover:underline"
                        >
                          {mode === "login" ? "Sign Up" : "Login"}
                        </button>
                      </p>
                    </motion.form>
                  </AnimatePresence>
                </div>
              </section>

              <aside
                className={cn(
                  "relative hidden overflow-hidden text-white md:flex",
                  mode === "login" ? "md:col-start-2" : "md:col-start-1"
                )}
              >
                <motion.div
                  key={`message-${mode}`}
                  initial={{ opacity: 0, x: mode === "login" ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className={cn(
                    "absolute top-8 z-10 max-w-[260px]",
                    mode === "login" ? "right-10" : "left-10"
                  )}
                >
                  <h2
                    className={cn(
                      "font-[var(--font-syne)] text-5xl leading-[0.9] font-extrabold tracking-tight",
                      mode === "signup" && "text-[44px] leading-[0.95]"
                    )}
                  >
                    {mode === "login" ? (
                      <>
                        WELCOME
                        <br />
                        BACK!
                      </>
                    ) : (
                      <>
                        SIGN UP
                        <br />
                        TODAY
                      </>
                    )}
                  </h2>
                  <p className="mt-5 text-base text-white/72">
                    {mode === "login"
                      ? "Secure campus access with smooth motion, playful details, and fast login from any device."
                      : "Create your account and unlock quick ride booking, saved preferences, and priority campus access."}
                  </p>
                </motion.div>
              </aside>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}