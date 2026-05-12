"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const bubbleLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = bubbleLayerRef.current;
    if (!layer) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) return;

    let lastTime = 0;
    const handleMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 60) return;
      lastTime = now;

      const bubble = document.createElement("span");
      bubble.className = "cursor-bubble";
      bubble.style.setProperty("--x", `${event.clientX}px`);
      bubble.style.setProperty("--y", `${event.clientY}px`);
      layer.appendChild(bubble);

      bubble.addEventListener("animationend", () => {
        bubble.remove();
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return (
    <div className="grain paper sketch-body">
      <div ref={bubbleLayerRef} className="cursor-bubbles" aria-hidden="true" />
      <header className="hero">
        <div className="doodle cloud cloud-left float-a" aria-hidden="true">
          <svg viewBox="0 0 140 80" fill="none">
            <path
              d="M20,60 C 4,60 4,38 22,36 C 26,18 50,16 56,30 C 64,18 90,20 92,36 C 112,34 122,56 104,62 C 100,72 30,72 20,60 Z"
              fill="#fff"
              stroke="#1B1B1F"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M30,52 C 36,56 44,54 48,50"
              stroke="#1B1B1F"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <div className="doodle cloud cloud-right float-b" aria-hidden="true">
          <svg viewBox="0 0 140 80" fill="none">
            <path
              d="M20,60 C 4,60 4,38 22,36 C 26,18 50,16 56,30 C 64,18 90,20 92,36 C 112,34 122,56 104,62 C 100,72 30,72 20,60 Z"
              fill="#fff"
              stroke="#1B1B1F"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M30,52 C 36,56 44,54 48,50"
              stroke="#1B1B1F"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <div className="doodle sun float-c" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="22" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3.5" />
            <line x1="92" y1="60" x2="110" y2="60" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="60" y1="92" x2="60" y2="110" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="28" y1="60" x2="10" y2="60" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="60" y1="28" x2="60" y2="10" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="82.6" y1="82.6" x2="95.3" y2="95.3" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="37.3" y1="37.3" x2="24.6" y2="24.6" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="54" cy="58" r="1.6" fill="#1B1B1F" />
            <circle cx="66" cy="58" r="1.6" fill="#1B1B1F" />
            <path d="M53,66 Q60,72 67,66" stroke="#1B1B1F" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div className="doodle star star-left float-c" aria-hidden="true">
          <svg viewBox="0 0 60 60" fill="none">
            <path
              d="M30,5 L 36,22 L 54,24 L 40,36 L 44,54 L 30,44 L 16,54 L 20,36 L 6,24 L 24,22 Z"
              fill="#FFD23F"
              stroke="#1B1B1F"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="doodle star star-right float-a" aria-hidden="true">
          <svg viewBox="0 0 60 60" fill="none">
            <path
              d="M30,5 L 36,22 L 54,24 L 40,36 L 44,54 L 30,44 L 16,54 L 20,36 L 6,24 L 24,22 Z"
              fill="#9B5DE5"
              stroke="#1B1B1F"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="doodle scribble-line" aria-hidden="true">
          <svg viewBox="0 0 120 30" fill="none">
            <path
              d="M2,15 C 16,2 28,28 42,15 C 56,2 68,28 82,15 C 96,2 108,28 118,15"
              stroke="#FF5A36"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        <nav className="nav">
          <a className="brand" href="#">
            <span className="brand-badge">CR</span>
            <span className="brand-name">
              Campus<span className="text-tomato">Rides</span>
            </span>
          </a>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#why">Why us</a>
            <a href="#voices">Voices</a>
            <a href="#faq">FAQ</a>
          </div>
          <a href="#join" className="sketch-btn sketch-btn--tomato sketch-btn--small">
            Hop in <span aria-hidden="true">-&gt;</span>
          </a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="font-scribble kicker">~ for students, by students ~</p>
            <h1 className="font-marker hero-title">
              SHARE THE <span className="scribble">ROAD</span>.
              <br />
              SPLIT THE <span className="marker">GAS</span>.
              <br />
              MAKE A <span className="text-tomato">FRIEND</span>.
            </h1>
            <p className="font-body hero-subtitle">
              Campus Rides is a doodly little carpool for college kids
              <br />
              - find a lift to lecture, home for the weekend, or that
              <br />
              gig three towns over. No taxis. No surge. Just
              <br />
              classmates.
            </p>
            <div className="hero-actions">
              <a href="#join" className="sketch-btn sketch-btn--tomato btn-primary">
                Find a ride
                <svg viewBox="0 0 140 80" className="btn-arrow" fill="none" aria-hidden="true">
                  <path d="M6,40 C 30,12 70,68 110,30" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M96,22 L 112,28 L 106,44" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </a>
              <a href="#how" className="sketch-btn sketch-btn--sun">
                How it works
              </a>
              <span className="font-scribble hero-hint">&lt;- start here, friend</span>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="font-marker stat-value">12k+</span>
                <span className="font-hand stat-label">students lifted</span>
              </div>
              <div className="stat">
                <span className="font-marker stat-value">Rs 38L</span>
                <span className="font-hand stat-label">petrol saved</span>
              </div>
              <div className="stat">
                <span className="font-marker stat-value">84</span>
                <span className="font-hand stat-label">campuses</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-blob" aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none">
                <path
                  d="M44,72 C 60,28 142,18 168,62 C 196,108 162,168 116,176 C 64,184 18,148 28,108 C 32,92 36,80 44,72 Z"
                  fill="#FFB4A2"
                  stroke="#1B1B1F"
                  strokeWidth="3"
                />
              </svg>
            </div>
            <div className="car-wrap mascot-wobble">
              <svg viewBox="0 0 420 280" className="hero-car" fill="none">
                <ellipse cx="210" cy="248" rx="160" ry="12" fill="#1B1B1F" opacity="0.15" />
                <path
                  d="M40,200 C 40,160 70,140 110,135 L 150,100 C 170,80 200,76 230,76 L 290,76 C 320,76 340,90 358,118 L 376,148 C 392,152 402,168 402,188 L 402,210 C 402,222 392,232 380,232 L 360,232"
                  stroke="#1B1B1F"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#FFD23F"
                />
                <path d="M40,232 L 60,232" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                <path d="M120,232 L 300,232" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                <path d="M150,116 L 180,90 L 246,90 L 268,116 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
                <path d="M276,116 L 286,92 L 322,92 C 332,92 340,98 346,108 L 352,116 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
                <path d="M210,90 L 210,116" stroke="#1B1B1F" strokeWidth="4" />
                <circle cx="386" cy="178" r="8" fill="#fff" stroke="#1B1B1F" strokeWidth="3" />
                <path d="M196,150 L 220,150" stroke="#1B1B1F" strokeWidth="4" strokeLinecap="round" />
                <g>
                  <circle cx="100" cy="232" r="28" fill="#1B1B1F" />
                  <circle cx="100" cy="232" r="14" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" className="wheel-spin" />
                  <path d="M100,222 L 100,242 M90,232 L 110,232" stroke="#1B1B1F" strokeWidth="3" />
                </g>
                <g>
                  <circle cx="330" cy="232" r="28" fill="#1B1B1F" />
                  <circle cx="330" cy="232" r="14" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="3" className="wheel-spin" />
                  <path d="M330,222 L 330,242 M320,232 L 340,232" stroke="#1B1B1F" strokeWidth="3" />
                </g>
                <circle cx="210" cy="108" r="11" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="2.5" />
                <circle cx="207" cy="107" r="1.3" fill="#1B1B1F" />
                <circle cx="213" cy="107" r="1.3" fill="#1B1B1F" />
                <path d="M205,112 Q 210,116 215,112" stroke="#1B1B1F" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M0,150 L 30,150" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" />
                <path d="M-4,178 L 26,178" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" />
                <path d="M6,206 L 34,206" stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="hero-note">
              "Saved Rs 400 + made 3 friends"
              <span>- Riya, 2nd yr</span>
            </div>
            <div className="doodle coin float-b" aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none">
                <ellipse cx="40" cy="44" rx="30" ry="28" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
                <ellipse cx="40" cy="40" rx="30" ry="28" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
                <text x="40" y="48" textAnchor="middle" className="coin-text">Rs</text>
              </svg>
            </div>
            <div className="doodle heart float-c" aria-hidden="true">
              <svg viewBox="0 0 80 76" fill="none">
                <path
                  d="M40,68 C 8,46 8,18 24,12 C 32,8 38,14 40,20 C 42,14 48,8 56,12 C 72,18 72,46 40,68 Z"
                  fill="#FF5A36"
                  stroke="#1B1B1F"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="hero-path">
          <svg viewBox="0 0 1400 220" fill="none" preserveAspectRatio="none">
            <path
              d="M0,170 C 200,40 380,260 580,140 C 760,30 940,250 1140,150 C 1280,90 1360,180 1400,140"
              stroke="#1B1B1F"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="14 14"
              fill="none"
              className="draw-path draw-path--slow"
            />
          </svg>
        </div>
      </header>

      <div className="marquee" aria-label="Popular ride types">
        <div className="marq-track">
          <span>Mid-sem break?</span>
          <span>Airport runs</span>
          <span>Hostel &lt;-&gt; Home</span>
          <span>Friday gigs</span>
          <span>Match-day pile-ons</span>
          <span>Library raids @ 2am</span>
          <span>Bestie's wedding</span>
          <span>Mid-sem break?</span>
          <span>Airport runs</span>
          <span>Hostel &lt;-&gt; Home</span>
          <span>Friday gigs</span>
          <span>Match-day pile-ons</span>
          <span>Library raids @ 2am</span>
          <span>Bestie's wedding</span>
        </div>
      </div>

      <section id="how" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="font-scribble kicker text-plum">three little steps</p>
              <h2 className="font-marker section-title">
                How it <span className="scribble">works</span>
              </h2>
            </div>
            <p className="font-body section-note">
              Built so chaotic college calendars do not break it. (We tested it
              during finals week.)
            </p>
          </div>
          <div className="card-grid">
            <article className="sketch-card rotate-a">
              <span className="sticky-tape">Step 01</span>
              <div className="card-title">
                <h3 className="font-marker">Doodle a route</h3>
                <svg viewBox="0 0 60 80" className="icon" fill="none">
                  <path
                    d="M30,4 C 14,4 6,18 8,32 C 10,46 30,72 30,72 C 30,72 50,46 52,32 C 54,18 46,4 30,4 Z"
                    fill="#FF5A36"
                    stroke="#1B1B1F"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <circle cx="30" cy="30" r="8" fill="#FDF6E3" stroke="#1B1B1F" strokeWidth="2.5" />
                </svg>
              </div>
              <p className="font-body">
                Type where you are going. Or tap the map. The car listens, we
                promise.
              </p>
            </article>
            <article className="sketch-card rotate-b">
              <span className="sticky-tape tape-sky">Step 02</span>
              <div className="card-title">
                <h3 className="font-marker">Match a classmate</h3>
                <svg viewBox="0 0 120 100" className="icon" fill="none">
                  <path
                    d="M14,18 C 14,10 22,6 30,6 L 92,6 C 102,6 110,12 110,22 L 110,58 C 110,68 102,74 92,74 L 50,74 L 32,92 L 36,74 L 30,74 C 22,74 14,68 14,58 Z"
                    fill="#fff"
                    stroke="#1B1B1F"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <circle cx="40" cy="40" r="3" fill="#1B1B1F" />
                  <circle cx="60" cy="40" r="3" fill="#1B1B1F" />
                  <circle cx="80" cy="40" r="3" fill="#1B1B1F" />
                </svg>
              </div>
              <p className="font-body">
                We find someone on the same path. Verified by college email - no
                randos.
              </p>
            </article>
            <article className="sketch-card rotate-a">
              <span className="sticky-tape tape-leaf">Step 03</span>
              <div className="card-title">
                <h3 className="font-marker">Split and roll out</h3>
                <svg viewBox="0 0 80 80" className="icon" fill="none">
                  <ellipse cx="40" cy="44" rx="30" ry="28" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
                  <ellipse cx="40" cy="40" rx="30" ry="28" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
                  <text x="40" y="48" textAnchor="middle" className="coin-text">Rs</text>
                </svg>
              </div>
              <p className="font-body">
                Petrol split fairly. Pay in-app. High-five at drop-off (optional
                but encouraged).
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="why" className="section paper-soft">
        <div className="container">
          <div className="section-center">
            <p className="font-scribble kicker text-tomato">six reasons (we counted)</p>
            <h2 className="font-marker section-title">
              Why students <span className="marker">love</span> us
            </h2>
            <p className="font-body section-note">
              We did not build a taxi app. We built the in-between space where
              strangers become study buddies.
            </p>
          </div>
          <div className="card-grid">
            <article className="sketch-card">
              <div className="card-title">
                <div className="icon-badge peach">
                  <svg viewBox="0 0 80 76" className="icon" fill="none">
                    <path
                      d="M40,68 C 8,46 8,18 24,12 C 32,8 38,14 40,20 C 42,14 48,8 56,12 C 72,18 72,46 40,68 Z"
                      fill="#FF5A36"
                      stroke="#1B1B1F"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-marker">Verified classmates</h3>
              </div>
              <p className="font-body">College email required. Real people, real campuses.</p>
            </article>
            <article className="sketch-card">
              <div className="card-title">
                <div className="icon-badge sun">
                  <svg viewBox="0 0 80 80" className="icon" fill="none">
                    <ellipse cx="40" cy="44" rx="30" ry="28" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
                    <ellipse cx="40" cy="40" rx="30" ry="28" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3" />
                    <text x="40" y="48" textAnchor="middle" className="coin-text">Rs</text>
                  </svg>
                </div>
                <h3 className="font-marker">Fair-share petrol</h3>
              </div>
              <p className="font-body">Auto-split by distance. No awkward late-night math.</p>
            </article>
            <article className="sketch-card">
              <div className="card-title">
                <div className="icon-badge sky">
                  <svg viewBox="0 0 120 100" className="icon" fill="none">
                    <path d="M10,50 L 110,12 L 78,90 L 62,62 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M62,62 L 110,12" stroke="#1B1B1F" strokeWidth="3" />
                  </svg>
                </div>
                <h3 className="font-marker">Doodle-fast booking</h3>
              </div>
              <p className="font-body">Tap, swipe, ride. Most matches happen in under 4 minutes.</p>
            </article>
            <article className="sketch-card">
              <div className="card-title">
                <div className="icon-badge leaf">
                  <svg viewBox="0 0 120 100" className="icon" fill="none">
                    <path
                      d="M14,18 C 14,10 22,6 30,6 L 92,6 C 102,6 110,12 110,22 L 110,58 C 110,68 102,74 92,74 L 50,74 L 32,92 L 36,74 L 30,74 C 22,74 14,68 14,58 Z"
                      fill="#fff"
                      stroke="#1B1B1F"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <circle cx="40" cy="40" r="3" fill="#1B1B1F" />
                    <circle cx="60" cy="40" r="3" fill="#1B1B1F" />
                    <circle cx="80" cy="40" r="3" fill="#1B1B1F" />
                  </svg>
                </div>
                <h3 className="font-marker">Safe ratings</h3>
              </div>
              <p className="font-body">Two-way reviews plus SOS share-trip. Mom-approved.</p>
            </article>
            <article className="sketch-card">
              <div className="card-title">
                <div className="icon-badge plum">
                  <svg viewBox="0 0 120 120" className="icon" fill="none">
                    <circle cx="60" cy="60" r="22" fill="#FFD23F" stroke="#1B1B1F" strokeWidth="3.5" />
                    <line x1="92" y1="60" x2="110" y2="60" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="60" y1="92" x2="60" y2="110" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="28" y1="60" x2="10" y2="60" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="60" y1="28" x2="60" y2="10" stroke="#1B1B1F" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="54" cy="58" r="1.6" fill="#1B1B1F" />
                    <circle cx="66" cy="58" r="1.6" fill="#1B1B1F" />
                    <path d="M53,66 Q60,72 67,66" stroke="#1B1B1F" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-marker">Greener footprint</h3>
              </div>
              <p className="font-body">Each shared ride means one less car. Sad polar bears stay happy.</p>
            </article>
            <article className="sketch-card">
              <div className="card-title">
                <div className="icon-badge tomato">
                  <svg viewBox="0 0 160 100" className="icon" fill="none">
                    <path d="M18,52 L 142,52" stroke="#1B1B1F" strokeWidth="6" strokeLinecap="round" />
                    <path d="M18,52 C 22,38 138,38 142,52" stroke="#7BC950" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <circle cx="38" cy="74" r="12" fill="#1B1B1F" />
                    <circle cx="122" cy="74" r="12" fill="#1B1B1F" />
                    <circle cx="38" cy="74" r="5" fill="#FDF6E3" />
                    <circle cx="122" cy="74" r="5" fill="#FDF6E3" />
                  </svg>
                </div>
                <h3 className="font-marker">Late-night-friendly</h3>
              </div>
              <p className="font-body">Library closes at 2? We have a 2:01 lift home.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="voices" className="section">
        <div className="container">
          <div className="section-center">
            <p className="font-scribble kicker text-leaf">notes from the back-seat</p>
            <h2 className="font-marker section-title">
              What riders are <span className="scribble">scribbling</span>
            </h2>
          </div>
          <div className="quote-grid">
            <article className="quote-card sun rotate-b">
              <div className="mascot" aria-hidden="true">
                <svg viewBox="0 0 140 180" fill="none">
                  <path d="M58,156 L 56,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M82,156 L 84,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M48,178 L 64,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round" />
                  <path d="M76,178 L 92,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round" />
                  <path d="M40,100 C 40,84 56,76 70,76 C 84,76 100,84 100,100 L 100,140 C 100,150 90,158 70,158 C 50,158 40,150 40,140 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" />
                  <circle cx="70" cy="52" r="28" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="4" />
                  <path d="M42,46 C 44,22 96,22 98,46 L 100,52 C 80,46 60,46 40,52 Z" fill="#FF5A36" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
                  <circle cx="60" cy="54" r="2.4" fill="#1B1B1F" />
                  <circle cx="80" cy="54" r="2.4" fill="#1B1B1F" />
                  <path d="M58,64 Q 70,74 82,64" stroke="#1B1B1F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <p className="font-body">"Met my lab partner on a 40km ride. We submitted a thesis together. Wild."</p>
              <p className="font-marker quote-name">Anaya <span className="font-scribble text-tomato">- BITS Pilani</span></p>
            </article>
            <article className="quote-card sky rotate-a">
              <div className="mascot" aria-hidden="true">
                <svg viewBox="0 0 140 180" fill="none">
                  <path d="M58,156 L 56,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M82,156 L 84,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M48,178 L 64,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round" />
                  <path d="M76,178 L 92,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round" />
                  <path d="M40,100 C 40,84 56,76 70,76 C 84,76 100,84 100,100 L 100,140 C 100,150 90,158 70,158 C 50,158 40,150 40,140 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" />
                  <circle cx="70" cy="52" r="28" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="4" />
                  <path d="M42,46 C 44,22 96,22 98,46 L 100,52 C 80,46 60,46 40,52 Z" fill="#9B5DE5" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
                  <circle cx="60" cy="54" r="2.4" fill="#1B1B1F" />
                  <circle cx="80" cy="54" r="2.4" fill="#1B1B1F" />
                  <path d="M58,64 Q 70,74 82,64" stroke="#1B1B1F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <p className="font-body">"I literally use it 3x a week. My hostel WiFi is jealous."</p>
              <p className="font-marker quote-name">Karthik <span className="font-scribble text-tomato">- IIT-M</span></p>
            </article>
            <article className="quote-card peach rotate-b">
              <div className="mascot" aria-hidden="true">
                <svg viewBox="0 0 140 180" fill="none">
                  <path d="M58,156 L 56,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M82,156 L 84,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M48,178 L 64,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round" />
                  <path d="M76,178 L 92,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round" />
                  <path d="M40,100 C 40,84 56,76 70,76 C 84,76 100,84 100,100 L 100,140 C 100,150 90,158 70,158 C 50,158 40,150 40,140 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" />
                  <circle cx="70" cy="52" r="28" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="4" />
                  <path d="M42,46 C 44,22 96,22 98,46 L 100,52 C 80,46 60,46 40,52 Z" fill="#7BC950" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
                  <circle cx="60" cy="54" r="2.4" fill="#1B1B1F" />
                  <circle cx="80" cy="54" r="2.4" fill="#1B1B1F" />
                  <path d="M58,64 Q 70,74 82,64" stroke="#1B1B1F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <p className="font-body">"Saved enough on petrol to buy noise-cancelling headphones. Worth."</p>
              <p className="font-marker quote-name">Sara <span className="font-scribble text-tomato">- Christ U</span></p>
            </article>
            <article className="quote-card leaf rotate-a">
              <div className="mascot" aria-hidden="true">
                <svg viewBox="0 0 140 180" fill="none">
                  <path d="M58,156 L 56,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M82,156 L 84,178" stroke="#1B1B1F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M48,178 L 64,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round" />
                  <path d="M76,178 L 92,178" stroke="#1B1B1F" strokeWidth="7" strokeLinecap="round" />
                  <path d="M40,100 C 40,84 56,76 70,76 C 84,76 100,84 100,100 L 100,140 C 100,150 90,158 70,158 C 50,158 40,150 40,140 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" />
                  <circle cx="70" cy="52" r="28" fill="#FFB4A2" stroke="#1B1B1F" strokeWidth="4" />
                  <path d="M42,46 C 44,22 96,22 98,46 L 100,52 C 80,46 60,46 40,52 Z" fill="#5BC0EB" stroke="#1B1B1F" strokeWidth="4" strokeLinejoin="round" />
                  <circle cx="60" cy="54" r="2.4" fill="#1B1B1F" />
                  <circle cx="80" cy="54" r="2.4" fill="#1B1B1F" />
                  <path d="M58,64 Q 70,74 82,64" stroke="#1B1B1F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <p className="font-body">"My dad finally trusts me with road trips. Big W."</p>
              <p className="font-marker quote-name">Vihaan <span className="font-scribble text-tomato">- VIT Vellore</span></p>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" className="section paper-soft">
        <div className="container narrow">
          <div className="section-center">
            <p className="font-scribble kicker text-plum">questions, scribbled</p>
            <h2 className="font-marker section-title">FAQ <span className="marker">corner</span></h2>
          </div>
          <div className="faq-list">
            <details open className="sketch-card">
              <summary className="font-marker">Is it only for my college?</summary>
              <p className="font-body">
                You can match with anyone on the platform, but your verified
                college badge unlocks classmate-only filters for late-night and
                long routes.
              </p>
            </details>
            <details className="sketch-card">
              <summary className="font-marker">What about safety?</summary>
              <p className="font-body">
                Driver IDs are verified, live trip sharing is built in, and SOS
                tools stay one tap away.
              </p>
            </details>
            <details className="sketch-card">
              <summary className="font-marker">How is petrol split?</summary>
              <p className="font-body">
                The fare splits by distance and seats, so everyone chips in
                fairly without the awkward math.
              </p>
            </details>
            <details className="sketch-card">
              <summary className="font-marker">Can I drive my parents' car?</summary>
              <p className="font-body">
                Yes - just upload license plus a quick selfie verification. It
                takes about 90 seconds.
              </p>
            </details>
            <details className="sketch-card">
              <summary className="font-marker">Do you take a cut?</summary>
              <p className="font-body">
                We only keep a tiny platform fee to keep the rides smooth and the
                doodles flowing.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section id="join" className="section">
        <div className="container narrow join">
          <div className="join-blob" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none">
              <path
                d="M44,72 C 60,28 142,18 168,62 C 196,108 162,168 116,176 C 64,184 18,148 28,108 C 32,92 36,80 44,72 Z"
                fill="#FFD23F"
                stroke="#1B1B1F"
                strokeWidth="3"
              />
            </svg>
          </div>
          <p className="font-scribble kicker text-tomato">last stop</p>
          <h2 className="font-marker join-title">Hop in. <span className="scribble">Let's roll.</span></h2>
          <p className="font-body section-note">
            Drop your college email - we will send your campus an invite when we
            land.
          </p>
          <form className="join-form">
            <label className="sr-only" htmlFor="join-email">
              College email
            </label>
            <input
              id="join-email"
              type="email"
              placeholder="you@yourcollege.edu"
              className="join-input font-hand"
            />
            <button type="submit" className="sketch-btn sketch-btn--tomato">
              Save my seat
            </button>
          </form>
          <div className="join-mascots" aria-hidden="true">
            <div className="mini-mascot mascot-wobble">CR</div>
            <div className="mini-mascot mascot-wobble delay-1">CR</div>
            <div className="mini-mascot mascot-wobble delay-2">CR</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="scribble-divider" aria-hidden="true"></div>
        <div className="container footer-grid">
          <div>
            <div className="brand">
              <span className="brand-badge">CR</span>
              <span className="brand-name">
                Campus<span className="text-sun">Rides</span>
              </span>
            </div>
            <p className="font-body footer-note">A little doodle of a carpool, drawn for student life.</p>
          </div>
          <div>
            <h4 className="font-marker text-sun">Riding</h4>
            <ul className="font-hand">
              <li>Find a ride</li>
              <li>Offer a seat</li>
              <li>Safety</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-marker text-sun">Company</h4>
            <ul className="font-hand">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-marker text-sun">Stay close</h4>
            <ul className="font-hand">
              <li>Instagram</li>
              <li>Twitter</li>
              <li>Discord</li>
              <li>Campus reps</li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <p className="font-hand">Copyright 2026 Campus Rides - drawn by hand, mostly.</p>
          <p className="font-scribble text-sun">drive friendly - split fairly - doodle daily</p>
        </div>
      </footer>
    </div>
  );
}
