"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Plus, TrendingDown, TrendingUp, CreditCard, Smartphone } from "lucide-react";
import { CoinDoodle, SquiggleDoodle, StarDoodle, ArrowDoodle } from "@/components/doodles";
import { useStudent } from "@/hooks/use-student";

const METHODS = [
  { id: "upi", label: "UPI", sub: "riya@upi", icon: Smartphone, color: "#7BC950" },
  { id: "card", label: "HDFC ••4421", sub: "Visa Debit", icon: CreditCard, color: "#5BC0EB" },
];

export default function WalletPage() {
  const [topupOpen, setTopupOpen] = useState(false);
  const { data } = useStudent();
  const rides = data?.rides ?? [];
  const transactions = data?.transactions ?? [];
  const balance = data?.profile?.coinsBalance ?? 0;

  const rideLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    rides.forEach((ride) => {
      if (!ride.id) return;
      const from = ride.pickupLabel ?? "Pickup";
      const to = ride.destinationLabel ?? "Destination";
      map.set(ride.id, `${from} → ${to}`);
    });
    return map;
  }, [rides]);

  const enrichedTransactions = useMemo(() => {
    return transactions.map((txn) => {
      const rawAmount = txn.amount ?? 0;
      const normalizedAmount = txn.type === "ride" ? -Math.abs(rawAmount) : rawAmount;
      const kind = txn.type === "topup" ? "topup" : txn.type === "refund" ? "refund" : "ride";
      const label = rideLabelMap.get(txn.rideId ?? "") ?? (kind === "ride" ? "Ride payment" : "Wallet update");
      const date = txn.createdAt
        ? new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
        : "recent";
      return { ...txn, amount: normalizedAmount, kind, label, date };
    });
  }, [transactions, rideLabelMap]);

  const monthSpend = enrichedTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const monthIn = enrichedTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8" data-testid="page-wallet">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="font-scribble text-2xl text-tomato">~ pocket map ~</p>
          <h1 className="font-marker text-4xl sm:text-5xl">My <span className="scribble">wallet</span></h1>
        </div>
        <button
          onClick={() => setTopupOpen(true)}
          className="sketch-btn sketch-btn--tomato"
          data-testid="topup-btn"
        >
          <Plus size={16} /> Top up
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Balance card */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 relative border-[2.5px] border-ink rounded-[36px_12px_32px_14px/14px_32px_12px_36px] p-7 bg-sun overflow-hidden"
          style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
          data-testid="balance-card"
        >
          <div className="absolute -top-4 -right-2 w-24 float-c"><CoinDoodle /></div>
          <div className="absolute bottom-3 right-8 w-10 float-a"><StarDoodle color="#FF5A36" /></div>
          <p className="font-scribble text-2xl text-plum">~ current balance ~</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="font-marker text-6xl sm:text-7xl">₹{balance}</span>
            <span className="font-hand text-lg mb-3 text-ink/70">.00</span>
          </div>
          <p className="font-body text-lg text-ink/80 max-w-md mt-2">
            Auto top-up kicks in below ₹50. Your last ride was charged from this balance — no card swipes needed.
          </p>
          <SquiggleDoodle className="absolute bottom-3 left-5 w-32 h-4" color="#FF5A36" />
        </motion.section>

        {/* In/Out widgets */}
        <div className="lg:col-span-5 grid sm:grid-cols-2 gap-4 lg:flex lg:flex-col">
          <motion.div
            initial={{ opacity: 0, y: 14, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 1 }}
            whileHover={{ rotate: 0, y: -3 }}
            className="sketch-card !p-5 bg-white"
            data-testid="spent-card"
          >
            <div className="flex items-center justify-between">
              <span
                className="w-11 h-11 grid place-items-center rounded-full border-[2.5px] border-ink"
                style={{ background: "#FFB4A2", boxShadow: "2px 2px 0 #1B1B1F" }}
              >
                <TrendingDown size={16} strokeWidth={2.5} />
              </span>
              <p className="font-scribble text-tomato text-lg">this month</p>
            </div>
            <p className="font-marker text-3xl mt-3">₹{monthSpend}</p>
            <p className="font-hand text-base text-ink/70">spent on rides</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            whileHover={{ rotate: 0, y: -3 }}
            className="sketch-card !p-5 bg-white"
            data-testid="topup-card"
          >
            <div className="flex items-center justify-between">
              <span
                className="w-11 h-11 grid place-items-center rounded-full border-[2.5px] border-ink"
                style={{ background: "#7BC950", boxShadow: "2px 2px 0 #1B1B1F" }}
              >
                <TrendingUp size={16} strokeWidth={2.5} />
              </span>
              <p className="font-scribble text-leaf text-lg">added in</p>
            </div>
            <p className="font-marker text-3xl mt-3">₹{monthIn}</p>
            <p className="font-hand text-base text-ink/70">top-ups + refunds</p>
          </motion.div>
        </div>
      </div>

      {/* Payment methods */}
      <section data-testid="methods-section">
        <div className="flex items-end justify-between mb-3">
          <h3 className="font-marker text-2xl">Payment methods</h3>
          <button className="font-hand underline decoration-tomato underline-offset-4">+ add new</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {METHODS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="flex items-center gap-4 border-[2.5px] border-ink rounded-[22px_8px_22px_10px/10px_22px_8px_22px] p-4 bg-cream"
              style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
              data-testid={`method-${m.id}`}
            >
              <span
                className="w-12 h-12 grid place-items-center rounded-full border-[2.5px] border-ink"
                style={{ background: m.color, boxShadow: "2px 2px 0 #1B1B1F" }}
              >
                <m.icon size={18} strokeWidth={2.5} />
              </span>
              <div className="flex-1">
                <p className="font-marker text-xl">{m.label}</p>
                <p className="font-hand text-base text-ink/70">{m.sub}</p>
              </div>
              <span className="px-2 py-0.5 border-[2px] border-ink rounded-full font-marker text-xs bg-sun">default</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* History */}
      <section data-testid="history-section">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="font-scribble text-xl text-plum">~ paper trail ~</p>
            <h3 className="font-marker text-2xl">Payment history</h3>
          </div>
        </div>
        <div
          className="border-[2.5px] border-ink rounded-[24px_8px_22px_10px/10px_22px_8px_24px] bg-white overflow-hidden"
          style={{ boxShadow: "5px 5px 0 #1B1B1F" }}
        >
          {enrichedTransactions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-marker text-2xl">no payments yet ✿</p>
              <p className="font-hand text-base text-ink/60 mt-2">
                Book a ride to see charges here.
              </p>
            </div>
          ) : (
            enrichedTransactions.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 p-4 ${i !== 0 ? "border-t-[2px] border-dashed border-ink/30" : ""}`}
                data-testid={`txn-${t.id}`}
              >
                <span
                  className="w-11 h-11 grid place-items-center rounded-full border-[2.5px] border-ink font-marker text-base"
                  style={{
                    background:
                      t.kind === "topup" ? "#7BC950" : t.kind === "refund" ? "#5BC0EB" : "#FFD23F",
                    boxShadow: "2px 2px 0 #1B1B1F",
                  }}
                >
                  {t.kind === "topup" ? "↑" : t.kind === "refund" ? "↺" : "🚗"}
                </span>
                <div className="flex-1">
                  <p className="font-marker text-lg">{t.label}</p>
                  <p className="font-hand text-base text-ink/60">{t.date}</p>
                </div>
                <p
                  className={`font-marker text-xl ${
                    t.amount < 0 ? "text-ink" : "text-leaf"
                  }`}
                >
                  {t.amount < 0 ? "−" : "+"}₹{Math.abs(t.amount)}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Top-up modal */}
      {topupOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/40 backdrop-blur-sm"
          onClick={() => setTopupOpen(false)}
          data-testid="topup-modal"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-cream border-[2.5px] border-ink rounded-[28px_10px_26px_12px/12px_26px_10px_28px] p-6 max-w-md w-full"
            style={{ boxShadow: "10px 10px 0 #1B1B1F" }}
          >
            <p className="font-scribble text-2xl text-tomato">~ add cash ~</p>
            <h3 className="font-marker text-3xl">Quick top-up</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[100, 250, 500, 1000, 2000, 5000].map((a) => (
                <button
                  key={a}
                  className="px-3 py-2 border-[2.5px] border-ink rounded-full font-marker text-lg bg-white hover:bg-sun transition-colors"
                  style={{ boxShadow: "3px 3px 0 #1B1B1F" }}
                  data-testid={`topup-${a}`}
                >
                  ₹{a}
                </button>
              ))}
            </div>
            <button
              onClick={() => setTopupOpen(false)}
              className="sketch-btn sketch-btn--tomato w-full justify-center mt-5"
              data-testid="topup-confirm"
            >
              proceed to pay <ArrowDoodle className="w-7 h-5" color="#fff" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
