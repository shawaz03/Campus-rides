"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDoodle,
  BlobDoodle,
  CarMascot,
  CoinDoodle,
  HeartDoodle,
  PaperPlane,
  PinDoodle,
  StarDoodle,
} from "@/components/doodles";
import { Cloud, Star, Sun } from "@/components/driver/VehicleDoodles";

const DRIVER_STEPS = [
  {
    id: "signup",
    title: "Finish onboarding",
    desc: "Add vehicle + documents so admin can review.",
    icon: PinDoodle,
    color: "#FFD23F",
    cta: { label: "Start onboarding", href: "/driver/onboarding" },
  },
  {
    id: "review",
    title: "Track approval",
    desc: "See if your docs and payout are pending or approved.",
    icon: PaperPlane,
    color: "#5BC0EB",
    cta: { label: "View review", href: "/driver/review" },
  },
  {
    id: "dashboard",
    title: "Go live",
    desc: "Open the dashboard to accept ride requests.",
    icon: CoinDoodle,
    color: "#7BC950",
    cta: { label: "Driver dashboard", href: "/driver/dashboard" },
  },
];

export default function DriverLandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-6 left-[6%] w-24 float-a">
        <Cloud />
      </div>
      <div className="pointer-events-none absolute top-14 right-[10%] w-24 float-b">
        <Cloud />
      </div>
      <div className="pointer-events-none absolute top-8 right-[24%] w-16 float-c">
        <Sun />
      </div>
      <div className="pointer-events-none absolute bottom-16 left-[8%] w-12 float-b">
        <Star color="#FF5A36" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <header className="space-y-3">
          <p className="font-scribble text-2xl text-tomato">~ driver hub ~</p>
          <h1 className="font-marker text-4xl sm:text-5xl">
            Drive with <span className="scribble">confidence</span>
          </h1>
          <p className="font-hand text-lg text-ink/70 max-w-2xl">
            Keep your rides smooth, track approvals, and get paid on time. This is your driver
            control room before you go live.
          </p>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden border-[2.5px] border-ink rounded-[40px_12px_36px_14px/14px_36px_12px_40px] bg-sun p-7 sm:p-9"
          style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
        >
          <div className="absolute top-3 right-5 w-20 float-c">
            <Cloud />
          </div>
          <div className="absolute bottom-4 right-8 w-16 float-b opacity-90">
            <Sun />
          </div>
          <div className="absolute top-1/2 right-[42%] w-10 float-a hidden md:block">
            <StarDoodle color="#FF5A36" />
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-center relative">
            <div className="md:col-span-7">
              <p className="font-scribble text-2xl text-plum">onboard → review → earn</p>
              <h2 className="font-marker text-3xl sm:text-4xl mt-1 leading-tight">
                Keep your docs ready,<br />
                get <span className="text-tomato">ride-ready</span> faster.
              </h2>
              <p className="font-body text-xl text-ink/85 mt-4 max-w-md">
                We make it easy to finish onboarding, track approval, and jump into requests once
                you are verified.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/driver/onboarding" className="sketch-btn sketch-btn--tomato">
                  Start onboarding <ArrowDoodle className="w-7 h-5" color="#fff" />
                </Link>
                <Link href="/driver/review" className="sketch-btn">
                  Check review
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 relative">
              <div className="absolute -inset-6 -z-10 opacity-90">
                <BlobDoodle color="#FFB4A2" />
              </div>
              <div className="mascot-wobble">
                <CarMascot className="w-full max-w-[340px] mx-auto" />
              </div>
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: -6 }}
                transition={{ delay: 0.35, type: "spring" }}
                className="absolute -bottom-4 left-2 bg-cream border-[2.5px] border-ink px-3 py-2 font-hand text-base"
                style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
              >
                <span className="font-marker text-tomato">steady rides</span> every day
              </motion.div>
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-4 -right-1 w-16 float-b"
              >
                <CoinDoodle />
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="grid md:grid-cols-3 gap-5" data-testid="driver-next-steps">
          {DRIVER_STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 14, rotate: index % 2 ? -1 : 1 }}
              animate={{ opacity: 1, y: 0, rotate: index % 2 ? -0.6 : 0.6 }}
              transition={{ delay: 0.1 + index * 0.06 }}
              whileHover={{ rotate: 0, y: -4 }}
              className="sketch-card !p-5 bg-white"
            >
              <div className="flex items-start justify-between">
                <span
                  className="w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink"
                  style={{ background: step.color, boxShadow: "2px 2px 0 #1B1B1F" }}
                >
                  <step.icon className="w-6 h-6" />
                </span>
                <HeartDoodle className="w-7 h-7" />
              </div>
              <p className="font-scribble text-tomato text-lg mt-3">{step.title}</p>
              <p className="font-hand text-base text-ink/70 mt-1">{step.desc}</p>
              <Link href={step.cta.href} className="sketch-btn sketch-btn--small mt-4">
                {step.cta.label}
              </Link>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}
