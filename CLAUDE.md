# Campus Rides - Project Reference

This document is a complete, self-contained reference for the Campus Rides codebase.
It is written so an AI agent can understand the project without scanning the repo.

## What this app is
Campus Rides is a doodle-styled ride booking web app centered on student life. It has:
- /driver (driver onboarding)
- / (landing page)
- /auth (login/signup page)
- /student (dashboard home)
- /student/book (booking flow + map)
- /student/activity (ride history)
- /student/profile (student profile)

- Driver layout: src/app/driver/layout.tsx
  - Applies grain background and cream/ink palette
- /api/geocode (Nominatim search)
- /api/student (Supabase-backed student data)

### Layouts
- Root layout: src/app/layout.tsx
  - Loads globals.css
  - Registers all fonts via next/font/google
4. OAuth callback is handled by /auth/callback; students redirect to /student and drivers to /driver.
5. /driver collects vehicle details and document uploads, then shows a confirmation modal.
6. /student home loads student data via /api/student (React Query).
7. /student/book uses local state + geocode search + map to simulate booking.
8. /student/activity, /student/wallet, /student/profile use mock data or Supabase data where available.
- Student layout: src/app/student/layout.tsx
  - Wraps pages with React Query Providers
  - Renders StudentSidebar and PageTransition
- students (profile data for student users)
- drivers (profile data for driver users)
- driver_vehicles (vehicle details per driver)
- driver_documents (doc metadata + storage path per driver)
- driver-documents storage bucket for Aadhaar/License/RC uploads

### User flow (end-to-end)
   - Email/password sign-in via Supabase

Note: /api/student currently queries the legacy users table and expects driver columns
like is_trusted and is_available. If you migrate to the new students/drivers tables,
update this route to match the new schema.
   - Google OAuth via Supabase
4. OAuth callback is handled by /auth/callback; successful logins redirect to /student.
6. /student/book uses local state + geocode search + map to simulate booking.

- Driver onboarding: src/app/driver/page.tsx
  - Vehicle selection, vehicle details, document upload UI, submit confirmation modal
- Driver doodles: src/components/driver/VehicleDoodles.tsx
  - Vehicle, document, and background doodle SVGs

### Supabase
Supabase clients:
- src/lib/supabase/client.ts for client components
- src/lib/supabase/server.ts for server components and route handlers

- vehicle-card, vehicle-float (driver vehicle card motion)
- road-dash-run, wind-line, sparkle-blink (driver doodle motion)
  - user, profile, rides, drivers, transactions

### /api/geocode
- Uses Nominatim (OpenStreetMap search)
- Accepts query param q
- Optional env var NOMINATIM_EMAIL sets email and User-Agent
- Returns a list of { name, coords } results

### Client data flow
- React Query: src/components/providers.tsx sets QueryClient
- useStudent hook: src/hooks/use-student.ts calls /api/student
- StudentSidebar, StudentHome, and Profile use useStudent
- Activity and Wallet pages currently use mock data in src/lib/mockData.ts

## State management
- Zustand store: src/lib/bookingStore.ts
  - pickup, destination, rideType, scheduled, scheduledFor
  - actions: setPickup, setDestination, setRideType, setScheduled, setScheduledFor, swap, reset

## Map and geocoding
- Map component: src/components/student/RideMap.tsx
- Uses maplibre-gl with dynamic import (no SSR issues)
- CARTO Voyager raster tiles with OSM attribution
- Adds markers for pickup/destination and draws a dashed route line
- Map CSS is imported globally in globals.css

## Styling system

### Core styling stack
- Tailwind CSS v4 (no tailwind.config.js)
- Tokens live in globals.css via @theme inline
- PostCSS uses @tailwindcss/postcss
- shadcn styles are imported from shadcn/tailwind.css
- tw-animate-css is imported for animation utilities

### Global CSS (src/app/globals.css)
Key imports:
- tailwindcss
- tw-animate-css
- shadcn/tailwind.css
- maplibre-gl/dist/maplibre-gl.css

Key design tokens (palette):
- cream: #FDF6E3
- ink: #1B1B1F
- sun: #FFD23F
- tomato: #FF5A36
- sky: #5BC0EB
- leaf: #7BC950
- plum: #9B5DE5
- peach: #FFB4A2

Custom classes and motifs used across the UI:
- sketch-btn, sketch-card
- glass-card
- grain (paper noise overlay)
- paper and paper-soft backgrounds
- float-a, float-b, float-c (doodle float animations)
- mascot-wobble, wheel-spin
- scribble and marker text treatments
- sticky-tape labels

## Fonts
Fonts loaded in src/app/layout.tsx via next/font/google:
- Geist (variable --font-sans)
- Geist Mono (variable --font-geist-mono)
- Syne (variable --font-syne)
- Space Grotesk (variable --font-space-grotesk)
- Caveat (variable --font-caveat)
- Patrick Hand (variable --font-patrick)
- Permanent Marker (variable --font-marker)
- Gaegu (variable --font-gaegu)

Font usage in CSS:
- body: Gaegu + Patrick Hand
- headings: Permanent Marker + Syne
- student-scope: Space Grotesk
- helpers: font-body, font-hand, font-marker, font-scribble

Auth pages (src/app/auth/layout.tsx) also apply Space Grotesk and Syne.

## Animation and motion
- Framer Motion for component-level animations and transitions
- GSAP + ScrollTrigger for landing page reveal sequences
- Lenis for smooth scrolling
- CSS keyframes for floating doodles and wheel spins

## Assets and illustrations
- Most visuals are inline SVGs inside:
  - src/components/doodles.tsx
  - src/components/meet-the-fleet.tsx
  - src/components/auth-page.tsx
- Public assets in /public:
  - file.svg
  - globe.svg
  - next.svg
  - vercel.svg
  - window.svg

## Component map (high level)
- Landing page: src/app/page.tsx
  - Uses doodle components and MeetTheFleet section
- Auth: src/components/auth-page.tsx
  - Student/Driver toggle, Supabase auth, Google OAuth
- Student UI:
  - Sidebar: src/components/student/StudentSidebar.tsx
  - Page transitions: src/components/student/PageTransition.tsx
  - Map: src/components/student/RideMap.tsx

## Utilities and types
- cn utility: src/lib/utils.ts
- Student types: src/lib/student-types.ts
- Student helpers: src/lib/student-utils.ts
- Mock data: src/lib/mockData.ts
- Ride data and campus places: src/lib/ride-data.ts
- Hooks: src/hooks/use-student.ts, src/hooks/useLenis.ts, src/hooks/use-mobile.ts

## Config and tooling
- next.config.ts
  - allowedDevOrigins: ["192.168.137.1"]
  - transpilePackages: ["maplibre-gl"]
- tsconfig.json
  - strict true
  - path alias: @/* -> src/*
- components.json (shadcn)
  - style: radix-nova
  - iconLibrary: lucide
  - cssVariables: true

## Environment variables
Required or optional:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NOMINATIM_EMAIL (optional, for geocode User-Agent)

## Scripts (package.json)
- npm run dev
- npm run build
- npm run start
- npm run lint

## Dependencies (package.json)
Dependencies:
- @base-ui/react ^1.4.0
- @supabase/ssr ^0.10.3
- @supabase/supabase-js ^2.105.3
- @tanstack/react-query ^5.100.10
- class-variance-authority ^0.7.1
- clsx ^2.1.1
- cmdk ^1.1.1
- date-fns ^4.1.0
- embla-carousel-react ^8.6.0
- framer-motion ^12.38.0
- gsap ^3.15.0
- input-otp ^1.4.2
- lenis ^1.3.23
- lucide-react ^1.8.0
- maplibre-gl ^5.24.0
- next ^16.2.6
- next-themes ^0.4.6
- radix-ui ^1.4.3
- react 19.2.4
- react-day-picker ^9.14.0
- react-dom 19.2.4
- react-resizable-panels ^4.10.0
- recharts ^3.8.0
- shadcn ^4.3.0
- sonner ^2.0.7
- tailwind-merge ^3.5.0
- tw-animate-css ^1.4.0
- vaul ^1.1.2
- zustand ^5.0.13

Dev dependencies:
- @tailwindcss/postcss ^4
- @types/node ^20
- @types/react ^19
- @types/react-dom ^19
- eslint ^9
- eslint-config-next ^16.2.6
- tailwindcss ^4
- typescript ^5

## Notes and constraints
- App Router only (no Pages Router).
- Many pages are client components due to animation and browser APIs.
- Use maplibre-gl via dynamic import to avoid SSR issues.
- Globals and doodle styling live in src/app/globals.css.
