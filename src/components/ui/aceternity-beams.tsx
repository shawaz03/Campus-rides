"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BEAMS = [
  { top: "10%", duration: 10.5, delay: 0, className: "h-px w-56 via-cyan-300/60" },
  { top: "24%", duration: 13, delay: 1.1, className: "h-px w-72 via-sky-200/55" },
  { top: "38%", duration: 11.7, delay: 0.5, className: "h-px w-60 via-indigo-200/45" },
  { top: "56%", duration: 14.2, delay: 2.2, className: "h-px w-80 via-emerald-200/40" },
  { top: "72%", duration: 12.4, delay: 1.7, className: "h-px w-64 via-zinc-100/45" },
  { top: "86%", duration: 9.9, delay: 0.8, className: "h-px w-44 via-slate-300/50" },
];

export function AceternityBeams({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(133,214,255,0.24),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(255,255,255,0.14),transparent_40%)]" />

      {BEAMS.map((beam, index) => (
        <motion.div
          key={index}
          className={cn(
            "absolute left-[-34%] rounded-full bg-gradient-to-r from-transparent to-transparent blur-[0.6px]",
            beam.className
          )}
          style={{ top: beam.top }}
          animate={{
            x: ["0%", "210%"],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: beam.duration,
            delay: beam.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
