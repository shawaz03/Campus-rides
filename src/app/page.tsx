"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  CarMascot, CloudDoodle, SunDoodle, StarDoodle, BlobDoodle,
  SquiggleDoodle, ArrowDoodle, PinDoodle, CoinDoodle, HeartDoodle,
  SkateDoodle, ChatDoodle, PaperPlane, FriendMascot, RoadPath,
} from "@/components/doodles";

const Nav = () => (
  <nav data-testid="nav" className="relative z-40 mx-auto max-w-7xl px-6 pt-6 flex items-center justify-between">
    <a href="#" className="flex items-center gap-3" data-testid="logo">
      <span className="relative w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink bg-sun" style={{ boxShadow: "3px 3px 0 #1B1B1F" }}>
        <svg viewBox="0 0 40 40" className="w-7 h-7">
          <path d="M6,26 C 6,20 10,16 16,16 L 24,16 C 30,16 34,20 34,26" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <circle cx="13" cy="28" r="3.5" fill="#1B1B1F"/>
          <circle cx="27" cy="28" r="3.5" fill="#1B1B1F"/>
          <path d="M14,16 L 18,10 L 22,10 L 26,16" stroke="#1B1B1F" strokeWidth="2.5" strokeLinejoin="round" fill="#FF5A36"/>
        </svg>
      </span>
      <span className="font-marker text-2xl tracking-wide">Campus<span className="text-tomato">Rides</span></span>
    </a>
    <div className="hidden md:flex items-center gap-8 font-hand text-xl">
      <a href="#how" className="hover:text-tomato transition-colors" data-testid="nav-how">How it works</a>
      <a href="#why" className="hover:text-tomato transition-colors" data-testid="nav-why">Why us</a>
      <a href="#voices" className="hover:text-tomato transition-colors" data-testid="nav-voices">Voices</a>
      <a href="#faq" className="hover:text-tomato transition-colors" data-testid="nav-faq">FAQ</a>
    </div>
    <Link href="/auth" data-testid="nav-cta" className="sketch-btn sketch-btn--tomato !py-2 !px-4 !text-base">
      Get Started <span aria-hidden>→</span>
    </Link>
  </nav>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const yCloud = useTransform(scrollY, [0, 600], [0, -120]);
  const ySun = useTransform(scrollY, [0, 600], [0, -60]);
  const rotateCar = useTransform(scrollY, [0, 600], [0, -6]);

  return (
    <header className="relative overflow-hidden pt-6 pb-28">
      <motion.div style={{ y: yCloud }} className="absolute top-20 left-[6%] w-28 float-a">
        <CloudDoodle />
      </motion.div>
      <motion.div style={{ y: yCloud }} className="absolute top-40 right-[14%] w-36 float-b">
        <CloudDoodle />
      </motion.div>
      <motion.div style={{ y: ySun }} className="absolute top-10 right-[6%] w-24 float-c">
        <SunDoodle />
      </motion.div>
      <div className="absolute top-[42%] left-[3%] w-12 float-c">
        <StarDoodle color="#FFD23F" />
      </div>
      <div className="absolute top-[58%] right-[5%] w-14 float-a">
        <StarDoodle color="#9B5DE5" />
      </div>
      <div className="absolute top-[18%] right-[40%] w-10 opacity-80">
        <SquiggleDoodle color="#FF5A36" />
      </div>

      <Nav />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 md:pt-20 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-scribble text-2xl text-tomato"
            data-testid="hero-eyebrow"
          >
            ~ for students, by students ~
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-3 font-marker leading-[1] text-[clamp(2rem,5.5vw,5rem)] whitespace-nowrap"
            data-testid="hero-title"
          >
            Book your <span className="scribble">ride</span>.<br />
            Catch your <span className="marker">Bus/Train</span>.<br />
            Never miss <span className="text-tomato">home</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-7 font-body text-2xl max-w-xl text-ink/80"
            data-testid="hero-subtitle"
          >
            CampusRide is the little app that saves big panic. Festival season, end of semester,
            or just a random Tuesday evening — open the app, tap your bus stop, and an auto finds
            you in minutes. No haggling, no waiting at the gate, no missed trains.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-4 items-center"
          >
            <a href="#join" data-testid="hero-cta-primary" className="sketch-btn sketch-btn--tomato">
              Find a ride <ArrowDoodle className="w-8 h-5" color="#fff" />
            </a>
            <a href="#how" data-testid="hero-cta-secondary" className="sketch-btn sketch-btn--sun">
              How it works
            </a>
            <span className="font-scribble text-xl text-ink/70 ml-2 hidden sm:inline">
              ↖ start here, friend
            </span>
          </motion.div>

          <div className="mt-12 flex flex-wrap gap-8" data-testid="hero-stats">
            {[
              { n: "12k+", l: "students lifted" },
              { n: "₹38L", l: "petrol saved" },
              { n: "84", l: "campuses" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="font-marker text-4xl">{s.n}</span>
                <span className="font-hand text-lg text-ink/70 leading-tight max-w-[110px]">{s.l}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 relative">
          <motion.div
            style={{ rotate: rotateCar }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" as const }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10">
              <BlobDoodle className="w-full h-full" color="#FFB4A2" />
            </div>
            <div className="mascot-wobble">
              <CarMascot className="w-full" />
            </div>
            <motion.div
              initial={{ opacity: 0, rotate: -12, y: 20 }}
              animate={{ opacity: 1, rotate: -8, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-2 -left-4 bg-cream border-[2.5px] border-ink p-3 font-hand text-lg max-w-[180px]"
              style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
              data-testid="hero-sticky"
            >
              &quot;Saved ₹400 + made 3 friends&quot; <br />
              <span className="font-scribble text-tomato text-xl">— Riya, 2nd yr</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, type: "spring" as const }}
              className="absolute -top-4 -right-2 w-20 float-b"
            >
              <CoinDoodle />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.15, type: "spring" as const }}
              className="absolute top-10 -left-10 w-16 float-c"
            >
              <HeartDoodle />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-10 mx-auto max-w-[1500px] px-2">
        <RoadPath className="w-full h-40" />
      </div>
    </header>
  );
};

const Marquee = () => {
  const items = ["Mid-sem break? ⇢", "Airport runs", "Hostel ↔ Home", "Friday gigs", "Match-day pile-ons", "Library raids @ 2am", "Bestie's wedding ↗"];
  const row = [...items, ...items];
  return (
    <div className="relative bg-ink text-cream py-5 border-y-[3px] border-ink overflow-hidden" data-testid="marquee">
      <div className="flex gap-12 whitespace-nowrap w-[200%] animate-[marq_32s_linear_infinite]">
        {row.map((t, i) => (
          <span key={i} className="font-marker text-2xl tracking-wide flex items-center gap-12">
            <StarDoodle className="inline-block w-7 h-7" color="#FFD23F" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

const How = () => {
  const steps = [
    {
      n: "01", t: "Choose your ride", d: "Pick what suits your trip. Bike for solo quick trips, auto for short city hops, cab for comfort or group travel. One app, every option — no switching between platforms.",
      color: "#FFD23F", icon: <PinDoodle className="w-16 h-16" />,
    },
    {
      n: "02", t: "Get matched instantly", d: "The nearest available driver gets your request the moment you book. They confirm within 30 seconds. If they don't, we automatically move to the next driver — you never wait on a maybe.",
      color: "#5BC0EB", icon: <ChatDoodle className="w-20 h-16" />,
    },
    {
      n: "03", t: "Track and ride", d: "Watch your driver arrive live on the map. Get an alert when they're 2 minutes away. Hop in, sit back — your fare is shown upfront, no surprises at the end.",
      color: "#7BC950", icon: <CoinDoodle className="w-16 h-16" />,
    },
  ];
  return (
    <section id="how" className="relative py-24" data-testid="section-how">
      <div className="absolute top-10 left-8 w-24 float-c opacity-90"><BlobDoodle color="#FFD23F" /></div>
      <div className="absolute bottom-20 right-10 w-28 float-a opacity-80"><BlobDoodle color="#5BC0EB" /></div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-scribble text-2xl text-plum">~ three taps. one ride. zero stress. ~</p>
            <h2 className="font-marker text-5xl md:text-6xl mt-2">How it <span className="scribble">works</span></h2>
          </div>
          <p className="font-body text-xl text-ink/70 max-w-md">
            Built so chaotic college calendars don&apos;t break it. (We tested it during finals week.)
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-7">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? -1.5 : 1.5 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, type: "spring" as const, stiffness: 80 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="sketch-card"
              style={{ background: "#fffdf5" }}
              data-testid={`how-step-${i}`}
            >
              <div className="sticky-tape" style={{ background: s.color }}>Step {s.n}</div>
              <div className="flex items-start justify-between mt-2">
                <h3 className="font-marker text-3xl">{s.t}</h3>
                <div className="float-b">{s.icon}</div>
              </div>
              <p className="font-body text-xl text-ink/80 mt-3">{s.d}</p>
              <div className="mt-5">
                <SquiggleDoodle className="w-28 h-5" color={s.color} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Why = () => {
  const cards = [
    { t: "Verified classmates", d: "College email required. Real people, real campuses.", color: "#FFB4A2", icon: <HeartDoodle className="w-14 h-14" /> },
    { t: "Fair-share petrol", d: "Auto-split by distance. No awkward Venmo math at 1am.", color: "#FFD23F", icon: <CoinDoodle className="w-14 h-14" /> },
    { t: "Doodle-fast booking", d: "Tap, swipe, ride. Most matches happen in under 4 minutes.", color: "#5BC0EB", icon: <PaperPlane className="w-16 h-12" /> },
    { t: "Safe ratings", d: "Two-way reviews + SOS share-trip. Mom-approved.", color: "#7BC950", icon: <ChatDoodle className="w-16 h-12" /> },
    { t: "Greener footprint", d: "Each shared ride = one less car. Sad polar bears stay happy.", color: "#9B5DE5", icon: <SunDoodle className="w-14 h-14" /> },
    { t: "Late-night-friendly", d: "Library closes at 2? We've got a 2:01 lift home, probably.", color: "#FF5A36", icon: <SkateDoodle className="w-20 h-12" /> },
  ];
  return (
    <section id="why" className="relative py-24 paper" data-testid="section-why">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-scribble text-2xl text-tomato">six reasons (we counted)</p>
          <h2 className="font-marker text-5xl md:text-6xl mt-2">
            Why students <span className="marker">love</span> us
          </h2>
          <p className="font-body text-xl text-ink/70 mt-5">
            We didn&apos;t build a taxi app. We built the in-between space where strangers become study buddies.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6, rotate: i % 2 ? -1 : 1 }}
              className="sketch-card"
              data-testid={`why-card-${i}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 grid place-items-center rounded-full border-[2.5px] border-ink" style={{ background: c.color, boxShadow: "3px 3px 0 #1B1B1F" }}>
                  {c.icon}
                </div>
                <h3 className="font-marker text-2xl">{c.t}</h3>
              </div>
              <p className="font-body text-xl text-ink/80 mt-4">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Voices = () => {
  const quotes = [
    { q: "Met my lab partner on a 40km ride. We submitted a thesis together. Wild.", n: "Anaya", c: "BITS Pilani", color: "#FFD23F" },
    { q: "I literally use it 3x a week. My hostel WiFi is jealous.", n: "Karthik", c: "IIT-M", color: "#5BC0EB" },
    { q: "Saved enough on petrol to buy noise-cancelling headphones. Worth.", n: "Sara", c: "Christ U", color: "#FFB4A2" },
    { q: "My dad finally trusts me with road trips. Big W.", n: "Vihaan", c: "VIT Vellore", color: "#7BC950" },
  ];
  return (
    <section id="voices" className="relative py-24" data-testid="section-voices">
      <div className="absolute -top-2 right-[8%] w-20 float-b"><PaperPlane /></div>
      <div className="absolute bottom-10 left-[5%] w-16 float-c"><StarDoodle color="#FF5A36" /></div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="font-scribble text-2xl text-leaf">notes from the back-seat</p>
          <h2 className="font-marker text-5xl md:text-6xl mt-2">
            What riders are <span className="scribble">scribbling</span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-7">
          {quotes.map((qq, i) => (
            <motion.div
              key={qq.n}
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.2 : -1.2 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="sketch-card relative"
              style={{ background: qq.color }}
              data-testid={`voice-${i}`}
            >
              <div className="absolute -top-7 -left-3 w-16 mascot-wobble">
                <FriendMascot hat={["#FF5A36", "#9B5DE5", "#7BC950", "#5BC0EB"][i % 4]} />
              </div>
              <div className="pl-16">
                <p className="font-body text-2xl text-ink leading-snug">&quot;{qq.q}&quot;</p>
                <p className="mt-4 font-marker text-xl">{qq.n} <span className="font-scribble text-tomato">— {qq.c}</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [open, setOpen] = useState<number>(-1);
  const items = [
    { q: "Is it only for my college?", a: "You can match with anyone on the platform, but your verified college badge unlocks &apos;classmate-only&apos; filters for late-night & long routes." },
    { q: "What about safety?", a: "Two-way ratings, live trip-share, SOS button, and a verified email wall. We also nudge drivers who tend to ghost (don't be that person)." },
    { q: "How is petrol split?", a: "Auto-calculated by GPS distance + current fuel rate in your city. Riders pay in-app, drivers cash out weekly." },
    { q: "Can I drive my parents&apos; car?", a: "Yep — just upload license + a quick selfie verification. Takes about 90 seconds." },
    { q: "Do you take a cut?", a: "A tiny ₹5 platform fee per matched ride. That's it. No surge, no peak-hour drama." },
  ];
  return (
    <section id="faq" className="relative py-24 paper" data-testid="section-faq">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="font-scribble text-2xl text-plum">questions, scribbled</p>
          <h2 className="font-marker text-5xl md:text-6xl mt-2">FAQ <span className="marker">corner</span></h2>
        </div>
        <div className="mt-12 space-y-4">
          {items.map((it, i) => (
            <div
              key={i}
              className="sketch-card cursor-pointer"
              onClick={() => setOpen(open === i ? -1 : i)}
              data-testid={`faq-${i}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-marker text-2xl">{it.q}</h3>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  className="w-10 h-10 grid place-items-center rounded-full border-[2.5px] border-ink bg-sun font-marker text-2xl"
                  style={{ boxShadow: "2px 2px 0 #1B1B1F" }}
                >
                  +
                </motion.span>
              </div>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-xl text-ink/80 mt-4">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Join = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section id="join" className="relative py-24 overflow-hidden" data-testid="section-join">
      <div className="absolute -top-10 left-10 w-32 float-a"><CloudDoodle /></div>
      <div className="absolute top-20 right-10 w-28 float-c"><SunDoodle /></div>
      <div className="absolute bottom-10 left-[40%] w-20 float-b"><StarDoodle color="#FFD23F" /></div>

      <div className="mx-auto max-w-3xl px-6 text-center relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-72 -z-10 opacity-70">
          <BlobDoodle color="#FFD23F" className="w-full" />
        </div>
        <p className="font-scribble text-2xl text-tomato">last stop ↓</p>
        <h2 className="font-marker text-5xl md:text-7xl mt-2 leading-[0.95]">
          Hop in. <br /> <span className="scribble">Let&apos;s roll.</span>
        </h2>
        <p className="font-body text-xl mt-6 text-ink/80">
          Drop your college email — we&apos;ll send your campus an invite when we land.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
          className="mt-9 flex flex-col sm:flex-row gap-4 items-center justify-center"
          data-testid="join-form"
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="you@yourcollege.edu"
            data-testid="join-email"
            className="w-full sm:w-[360px] px-5 py-3 font-hand text-xl bg-cream border-[2.5px] border-ink rounded-[40px_8px_36px_10px/10px_36px_8px_40px] focus:outline-none focus:ring-0"
            style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
          />
          <button type="submit" className="sketch-btn sketch-btn--tomato" data-testid="join-submit">
            {sent ? "On the list ✓" : "Save my seat"} <ArrowDoodle className="w-7 h-5" color="#fff" />
          </button>
        </form>
        {sent && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 font-scribble text-2xl text-leaf" data-testid="join-success">
            see you in the back-seat, friend ✿
          </motion.p>
        )}

        <div className="mt-10 flex items-center justify-center gap-6">
          <div className="w-20 mascot-wobble"><FriendMascot hat="#FF5A36" /></div>
          <div className="w-24 mascot-wobble" style={{ animationDelay: "-1s" }}><FriendMascot hat="#5BC0EB" /></div>
          <div className="w-20 mascot-wobble" style={{ animationDelay: "-2s" }}><FriendMascot hat="#7BC950" /></div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="relative bg-ink text-cream pt-16 pb-10" data-testid="footer">
    <div className="scribble-divider absolute -top-1 left-0 right-0" style={{ filter: "invert(1)" }} />
    <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 grid place-items-center rounded-full border-[2.5px] border-cream bg-sun">
            <span className="text-ink font-marker text-lg">CR</span>
          </span>
          <span className="font-marker text-2xl">Campus<span className="text-sun">Rides</span></span>
        </div>
        <p className="font-body text-lg mt-4 text-cream/70">
          A little doodle of a carpool, drawn for student life.
        </p>
      </div>
      {[
        { t: "Riding", l: ["Find a ride", "Offer a seat", "Safety", "Pricing"] },
        { t: "Company", l: ["About", "Careers", "Press", "Blog"] },
        { t: "Stay close", l: ["Instagram", "Twitter", "Discord", "Campus reps"] },
      ].map((col) => (
        <div key={col.t}>
          <h4 className="font-marker text-xl text-sun">{col.t}</h4>
          <ul className="mt-3 space-y-2 font-hand text-lg text-cream/80">
            {col.l.map((x) => (
              <li key={x} className="hover:text-sun transition-colors cursor-pointer">{x}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="mt-12 mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-cream/20 pt-6">
      <p className="font-hand text-cream/70">© {new Date().getFullYear()} Campus Rides — drawn by hand, mostly.</p>
      <p className="font-scribble text-xl text-sun">drive friendly · split fairly · doodle daily</p>
    </div>
  </footer>
);

export default function Home() {
  // tiny cursor sparkle effect (subtle, performant)
  useEffect(() => {
    let last = 0;
    const handler = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < 80) return;
      last = now;
      const dot = document.createElement("span");
      dot.style.cssText = `
        position:fixed; left:${e.clientX}px; top:${e.clientY}px;
        width:8px; height:8px; pointer-events:none; z-index:80;
        background:#FFD23F; border:1.5px solid #1B1B1F; border-radius:50%;
        transform:translate(-50%,-50%); transition: all .8s ease-out; opacity:.9;
      `;
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = `translate(-50%,-50%) translateY(-30px) scale(0)`;
        dot.style.opacity = "0";
      });
      setTimeout(() => dot.remove(), 800);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="grain min-h-screen relative">
      <Hero />
      <Marquee />
      <How />
      <Why />
      <Voices />
      <FAQ />
      <Join />
      <Footer />
    </div>
  );
}
