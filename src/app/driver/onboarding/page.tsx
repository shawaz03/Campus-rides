"use client";

import { useMemo, useState, type ChangeEvent, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AadhaarDoodle,
  AutoDoodle,
  BankDoodle,
  BikeDoodle,
  CabDoodle,
  Cloud,
  LicenseDoodle,
  RCDoodle,
  Star,
  Sun,
  UpiDoodle,
} from "@/components/driver/VehicleDoodles";

type VehicleType = "bike" | "auto" | "cab";

type DocKey = "aadhaar" | "license" | "rc";

type DocState = Record<DocKey, File | null>;

type Step = "vehicle" | "docs" | "payout";

const VEHICLES: Array<{
  id: VehicleType;
  label: string;
  hint: string;
  color: string;
  Doodle: typeof BikeDoodle;
}> = [
  {
    id: "bike",
    label: "Bike",
    hint: "Solo and quick",
    color: "#FFD23F",
    Doodle: BikeDoodle,
  },
  {
    id: "auto",
    label: "Auto",
    hint: "Budget friendly",
    color: "#7BC950",
    Doodle: AutoDoodle,
  },
  {
    id: "cab",
    label: "Cab",
    hint: "Comfort and space",
    color: "#5BC0EB",
    Doodle: CabDoodle,
  },
];

const DOCS: Array<{
  id: DocKey;
  label: string;
  description: string;
  Doodle: typeof AadhaarDoodle;
}> = [
  {
    id: "aadhaar",
    label: "Aadhaar",
    description: "Government ID for identity verification.",
    Doodle: AadhaarDoodle,
  },
  {
    id: "license",
    label: "Driver license",
    description: "Valid driver license for active rides.",
    Doodle: LicenseDoodle,
  },
  {
    id: "rc",
    label: "Vehicle RC",
    description: "Registration certificate for the vehicle.",
    Doodle: RCDoodle,
  },
];

const STEP_COPY: Record<
  Step,
  { kicker: string; titleLead: string; titleHighlight: string; description: string }
> = {
  vehicle: {
    kicker: "~ driver onboarding ~",
    titleLead: "Set up your",
    titleHighlight: "vehicle",
    description: "Pick your ride type, add basic details, then upload verification documents.",
  },
  docs: {
    kicker: "~ driver onboarding ~",
    titleLead: "Verify your",
    titleHighlight: "documents",
    description: "Upload clear scans or photos for each document so we can confirm your ride status.",
  },
  payout: {
    kicker: "~ driver onboarding ~",
    titleLead: "Set up your",
    titleHighlight: "payouts",
    description: "Add bank and UPI details so weekly earnings arrive without delays.",
  },
};

const vehicleCardVariants = {
  initial: (index: number) => ({
    opacity: 0,
    y: 12,
    rotate: index % 2 ? -0.6 : 0.6,
    boxShadow: "var(--card-shadow)",
  }),
  rest: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: index % 2 ? -0.3 : 0.3,
    boxShadow: "var(--card-shadow)",
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
  hover: {
    y: -6,
    scale: 1.02,
    rotate: 0,
    boxShadow: "var(--card-shadow-hover)",
    transition: { type: "spring", stiffness: 280, damping: 16 },
  },
  tap: {
    scale: 0.99,
    y: -2,
  },
};

type VehicleCardProps = {
  vehicle: (typeof VEHICLES)[number];
  selected: boolean;
  index: number;
  onSelect: (id: VehicleType) => void;
};

function VehicleCard({ vehicle, selected, index, onSelect }: VehicleCardProps) {
  const [boosted, setBoosted] = useState(false);
  const baseShadow = selected ? "8px 8px 0 #1B1B1F" : "5px 5px 0 #1B1B1F";
  const hoverShadow = selected ? "12px 12px 0 #1B1B1F" : "9px 9px 0 #1B1B1F";
  const cardStyle: CSSProperties = {
    background: selected ? vehicle.color : "#fffdf5",
    "--card-shadow": baseShadow,
    "--card-shadow-hover": hoverShadow,
  };

  return (
    <motion.button
      key={vehicle.id}
      type="button"
      onClick={() => onSelect(vehicle.id)}
      onPointerLeave={() => setBoosted(false)}
      className="vehicle-card group text-left sketch-card !p-5"
      style={cardStyle}
      data-boosted={boosted ? "true" : "false"}
      variants={vehicleCardVariants}
      custom={index}
      initial="initial"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      data-testid={`vehicle-${vehicle.id}`}
      aria-pressed={selected}
    >
      <div
        className="w-full max-w-[240px] mx-auto vehicle-float"
        onPointerEnter={() => setBoosted(true)}
        onPointerMove={() => setBoosted(true)}
        onPointerLeave={() => setBoosted(false)}
      >
        <vehicle.Doodle className="w-full h-auto vehicle-illustration" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <h3 className="font-marker text-2xl">{vehicle.label}</h3>
        <span
          className="px-2 py-1 border-[2px] border-ink rounded-full font-hand text-sm"
          style={{ background: "#FDF6E3" }}
        >
          {selected ? "Selected" : "Select"}
        </span>
      </div>
      <p className="font-hand text-base text-ink/80 mt-2">{vehicle.hint}</p>
    </motion.button>
  );
}

export default function DriverOnboardingPage() {
  const [step, setStep] = useState<Step>("vehicle");
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [docsSubmitted, setDocsSubmitted] = useState(false);
  const [docs, setDocs] = useState<DocState>({
    aadhaar: null,
    license: null,
    rc: null,
  });
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiQr, setUpiQr] = useState<File | null>(null);
  const [payoutSubmitted, setPayoutSubmitted] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);

  const canContinue =
    vehicleType !== null && vehicleNumber.trim().length > 0 && vehicleModel.trim().length > 0;

  const allDocsReady = useMemo(
    () => DOCS.every((doc) => Boolean(docs[doc.id])),
    [docs]
  );

  const payoutReady = useMemo(
    () =>
      accountHolderName.trim().length > 0 &&
      accountNumber.trim().length > 0 &&
      ifscCode.trim().length > 0 &&
      upiId.trim().length > 0 &&
      Boolean(upiQr),
    [accountHolderName, accountNumber, ifscCode, upiId, upiQr]
  );

  const handleFileChange = (key: DocKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setDocs((prev) => ({ ...prev, [key]: file }));
  };

  const handleUpiQrChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setUpiQr(file);
    setPayoutSubmitted(false);
    setPayoutModalOpen(false);
  };

  const handleDocSubmit = () => {
    if (!allDocsReady) return;
    setDocsSubmitted(true);
  };

  const handlePayoutSubmit = () => {
    if (!payoutReady) return;
    setPayoutSubmitted(true);
    setPayoutModalOpen(true);
  };

  const stepCopy = STEP_COPY[step];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-6 left-[6%] w-24 float-a">
        <Cloud />
      </div>
      <div className="pointer-events-none absolute top-12 right-[10%] w-24 float-b">
        <Cloud />
      </div>
      <div className="pointer-events-none absolute top-8 right-[24%] w-16 float-c">
        <Sun />
      </div>
      <div className="pointer-events-none absolute bottom-16 left-[10%] w-12 float-b">
        <Star color="#FF5A36" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <header className="space-y-3">
          <p className="font-scribble text-2xl text-tomato">{stepCopy.kicker}</p>
          <h1 className="font-marker text-4xl sm:text-5xl">
            {stepCopy.titleLead} <span className="scribble">{stepCopy.titleHighlight}</span>
          </h1>
          <p className="font-hand text-lg text-ink/70 max-w-2xl">{stepCopy.description}</p>
        </header>

        <div className="flex flex-wrap gap-4">
          {[
            { id: "vehicle", label: "Step 1", title: "Vehicle" },
            { id: "docs", label: "Step 2", title: "Documents" },
            { id: "payout", label: "Step 3", title: "Payouts" },
          ].map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "sketch-card !p-4 flex items-center gap-3",
                step === item.id ? "bg-sun" : "bg-white"
              )}
              style={{ boxShadow: step === item.id ? "6px 6px 0 #1B1B1F" : "4px 4px 0 #1B1B1F" }}
            >
              <span
                className="w-10 h-10 grid place-items-center rounded-full border-[2.5px] border-ink font-marker"
                style={{ background: step === item.id ? "#FDF6E3" : "#FFD23F" }}
              >
                {index + 1}
              </span>
              <div>
                <p className="font-scribble text-base text-tomato">{item.label}</p>
                <p className="font-marker text-lg">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === "vehicle" ? (
            <motion.section
              key="vehicle-step"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <section className="space-y-4">
                <div className="flex items-end justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-scribble text-xl text-plum">~ choose your ride ~</p>
                    <h2 className="font-marker text-3xl">Vehicle type</h2>
                  </div>
                  <p className="font-hand text-base text-ink/70">
                    Tap a card to select the vehicle you drive.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  {VEHICLES.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      selected={vehicleType === vehicle.id}
                      index={index}
                      onSelect={setVehicleType}
                    />
                  ))}
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-6">
                <div className="sketch-card !p-6 bg-white">
                  <p className="font-scribble text-xl text-tomato">~ add details ~</p>
                  <h3 className="font-marker text-2xl mt-1">Vehicle information</h3>
                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="font-hand text-base">Vehicle number</span>
                      <input
                        value={vehicleNumber}
                        onChange={(event) => setVehicleNumber(event.target.value)}
                        placeholder="TS 09 AB 1234"
                        className="mt-2 w-full px-4 py-3 font-hand text-lg bg-cream border-[2.5px] border-ink rounded-[40px_8px_36px_10px/10px_36px_8px_40px] focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="font-hand text-base">Vehicle model</span>
                      <input
                        value={vehicleModel}
                        onChange={(event) => setVehicleModel(event.target.value)}
                        placeholder="Bajaj RE Auto"
                        className="mt-2 w-full px-4 py-3 font-hand text-lg bg-cream border-[2.5px] border-ink rounded-[10px_36px_8px_40px/40px_8px_36px_10px] focus:outline-none"
                      />
                    </label>
                  </div>
                </div>

                <div className="sketch-card !p-6 bg-sun/80">
                  <p className="font-scribble text-xl text-plum">~ quick check ~</p>
                  <h3 className="font-marker text-2xl mt-1">Before you continue</h3>
                  <ul className="mt-4 space-y-2 font-hand text-base text-ink/80">
                    <li>Choose the vehicle you currently drive.</li>
                    <li>Enter the exact vehicle number and model.</li>
                    <li>Next step is document verification.</li>
                  </ul>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setStep("docs")}
                      disabled={!canContinue}
                      className="sketch-btn sketch-btn--tomato disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="driver-next"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
            </motion.section>
          ) : step === "docs" ? (
            <motion.section
              key="docs-step"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <section className="space-y-4">
                <div className="flex items-end justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-scribble text-xl text-leaf">~ verify your docs ~</p>
                    <h2 className="font-marker text-3xl">Document verification</h2>
                  </div>
                  <p className="font-hand text-base text-ink/70">
                    Upload clear scans or photos for each document.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  {DOCS.map((doc, index) => {
                    const file = docs[doc.id];
                    return (
                      <motion.div
                        key={doc.id}
                        className="sketch-card !p-5 bg-white"
                        style={{ boxShadow: "6px 6px 0 #1B1B1F" }}
                        initial={{ opacity: 0, y: 10, rotate: index % 2 ? -0.6 : 0.6 }}
                        animate={{ opacity: 1, y: 0, rotate: index % 2 ? -0.3 : 0.3 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="w-full max-w-[220px] mx-auto">
                          <doc.Doodle className="w-full h-auto" />
                        </div>
                        <h3 className="font-marker text-xl mt-3">{doc.label}</h3>
                        <p className="font-hand text-base text-ink/70 mt-2">{doc.description}</p>
                        <div className="mt-4">
                          <input
                            id={`upload-${doc.id}`}
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleFileChange(doc.id)}
                          />
                          <label
                            htmlFor={`upload-${doc.id}`}
                            className="sketch-btn sketch-btn--sun !py-2 !px-4 !text-base cursor-pointer"
                          >
                            {file ? "Replace file" : "Upload file"}
                          </label>
                          <p className="mt-2 font-hand text-sm text-ink/70">
                            {file ? `Selected: ${file.name}` : "No file selected"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              <section className="flex flex-wrap gap-4 items-center">
                <button
                  type="button"
                  onClick={() => setStep("vehicle")}
                  className="sketch-btn"
                  data-testid="driver-back"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleDocSubmit}
                  disabled={!allDocsReady}
                  className="sketch-btn sketch-btn--tomato disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="driver-submit"
                >
                  Submit for verification
                </button>
                <span className="font-hand text-base text-ink/70">
                  {allDocsReady
                    ? "All documents uploaded. Next: payout details."
                    : "Upload all documents to continue."}
                </span>
              </section>
            </motion.section>
          ) : (
            <motion.section
              key="payout-step"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <section className="space-y-4">
                <div className="flex items-end justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-scribble text-xl text-plum">~ get paid ~</p>
                    <h2 className="font-marker text-3xl">Bank and UPI details</h2>
                  </div>
                  <p className="font-hand text-base text-ink/70">
                    Add payout info so your earnings can be sent each week.
                  </p>
                </div>
              </section>

              <section className="grid lg:grid-cols-2 gap-6">
                <motion.div
                  className="sketch-card !p-6 bg-white relative"
                  initial={{ opacity: 0, y: 10, rotate: -0.8 }}
                  animate={{ opacity: 1, y: 0, rotate: -0.3 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="absolute -top-6 -right-3 w-14 float-b z-10">
                    <Star color="#FFD23F" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-scribble text-xl text-tomato">~ bank transfer ~</p>
                      <h3 className="font-marker text-2xl mt-1">Bank account</h3>
                    </div>
                    <div className="w-24 float-a">
                      <BankDoodle className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="font-hand text-base">Account holder name</span>
                      <input
                        value={accountHolderName}
                        onChange={(event) => {
                          setAccountHolderName(event.target.value);
                          setPayoutSubmitted(false);
                          setPayoutModalOpen(false);
                        }}
                        placeholder="Riya Sharma"
                        className="mt-2 w-full px-4 py-3 font-hand text-lg bg-cream border-[2.5px] border-ink rounded-[34px_10px_28px_12px/12px_28px_10px_34px] focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="font-hand text-base">Bank account number</span>
                      <input
                        value={accountNumber}
                        onChange={(event) => {
                          setAccountNumber(event.target.value);
                          setPayoutSubmitted(false);
                          setPayoutModalOpen(false);
                        }}
                        inputMode="numeric"
                        placeholder="091234567890"
                        className="mt-2 w-full px-4 py-3 font-hand text-lg bg-cream border-[2.5px] border-ink rounded-[10px_36px_8px_40px/40px_8px_36px_10px] focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="font-hand text-base">IFSC code</span>
                      <input
                        value={ifscCode}
                        onChange={(event) => {
                          setIfscCode(event.target.value);
                          setPayoutSubmitted(false);
                          setPayoutModalOpen(false);
                        }}
                        placeholder="HDFC0001234"
                        className="mt-2 w-full px-4 py-3 font-hand text-lg bg-cream border-[2.5px] border-ink rounded-[40px_8px_36px_10px/10px_36px_8px_40px] focus:outline-none"
                      />
                    </label>
                  </div>
                </motion.div>

                <motion.div
                  className="sketch-card !p-6 bg-white relative"
                  initial={{ opacity: 0, y: 10, rotate: 0.8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0.3 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="absolute -top-6 -left-3 w-14 float-c z-10">
                    <Star color="#FF5A36" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-scribble text-xl text-leaf">~ upi payouts ~</p>
                      <h3 className="font-marker text-2xl mt-1">UPI details</h3>
                    </div>
                    <div className="w-24 float-b">
                      <UpiDoodle className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="font-hand text-base">UPI ID</span>
                      <input
                        value={upiId}
                        onChange={(event) => {
                          setUpiId(event.target.value);
                          setPayoutSubmitted(false);
                          setPayoutModalOpen(false);
                        }}
                        placeholder="riya@upi"
                        className="mt-2 w-full px-4 py-3 font-hand text-lg bg-cream border-[2.5px] border-ink rounded-[10px_36px_8px_40px/40px_8px_36px_10px] focus:outline-none"
                      />
                    </label>
                    <div>
                      <input
                        id="upload-upi-qr"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpiQrChange}
                      />
                      <label
                        htmlFor="upload-upi-qr"
                        className="sketch-btn sketch-btn--sun !py-2 !px-4 !text-base cursor-pointer"
                      >
                        {upiQr ? "Replace QR code" : "Upload UPI QR"}
                      </label>
                      <p className="mt-2 font-hand text-sm text-ink/70">
                        {upiQr ? `Selected: ${upiQr.name}` : "No QR selected"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              <section className="grid md:grid-cols-2 gap-6">
                <div className="sketch-card !p-6 bg-peach/70">
                  <p className="font-scribble text-xl text-plum">~ payout checklist ~</p>
                  <h3 className="font-marker text-2xl mt-1">Before you finish</h3>
                  <ul className="mt-4 space-y-2 font-hand text-base text-ink/80">
                    <li>Use the same name as your bank account.</li>
                    <li>Double-check the account number and IFSC.</li>
                    <li>Upload a clear UPI QR for faster payouts.</li>
                  </ul>
                </div>
                <div className="sketch-card !p-6 bg-sun/80 relative">
                  <div className="absolute -top-6 right-8 w-12 float-c z-10">
                    <Star color="#FF5A36" />
                  </div>
                  <p className="font-scribble text-xl text-plum">~ finish setup ~</p>
                  <h3 className="font-marker text-2xl mt-1">Ready to cash out</h3>
                  <p className="mt-3 font-hand text-base text-ink/80">
                    We will use these details for weekly payouts once you are approved.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setStep("docs")} className="sketch-btn">
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePayoutSubmit}
                      disabled={!payoutReady}
                      className="sketch-btn sketch-btn--tomato disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Finish onboarding
                    </button>
                  </div>
                  <span className="mt-3 block font-hand text-base text-ink/70">
                    {payoutSubmitted
                      ? "Payout details saved. We will verify them during approval."
                      : payoutReady
                        ? "All payout details look good."
                        : "Fill all payout fields to finish."}
                  </span>
                  {payoutSubmitted && (
                    <Link
                      href="/driver/review"
                      className="mt-3 inline-flex items-center font-hand text-base text-ink underline decoration-[3px] decoration-tomato"
                    >
                      View review status
                    </Link>
                  )}
                </div>
              </section>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {docsSubmitted && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center px-6 py-10 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDocsSubmitted(false)}
            data-testid="driver-submit-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative w-full max-w-2xl sketch-card !p-7 bg-cream"
              style={{ boxShadow: "10px 10px 0 #1B1B1F" }}
              onClick={(event) => event.stopPropagation()}
              data-testid="driver-submit-card"
            >
              <button
                type="button"
                onClick={() => setDocsSubmitted(false)}
                className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full border-[2px] border-ink bg-white font-marker"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="absolute -top-5 right-10 w-14 float-b">
                <Star color="#FFD23F" />
              </div>
              <div className="absolute -bottom-6 left-8 w-16 float-c">
                <Star color="#FF5A36" />
              </div>
              <p className="font-scribble text-2xl text-leaf">~ sent to admin ~</p>
              <h3 className="font-marker text-3xl mt-2">Your documents are on the way</h3>
              <p className="font-hand text-lg text-ink/70 mt-3">
                Thanks for submitting your Aadhaar, license, and RC. Our team will review
                everything and update your driver status once approved.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 border-[2px] border-ink rounded-full bg-sun font-hand text-base">
                Status: pending approval
              </div>
              <p className="font-hand text-base text-ink/70 mt-4">
                Next, add your bank and UPI details so payouts can start right after approval.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setDocsSubmitted(false);
                    setStep("payout");
                  }}
                  className="sketch-btn sketch-btn--tomato"
                >
                  Continue to payout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {payoutModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center px-6 py-10 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPayoutModalOpen(false)}
            data-testid="driver-payout-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative w-full max-w-2xl sketch-card !p-7 bg-cream"
              style={{ boxShadow: "10px 10px 0 #1B1B1F" }}
              onClick={(event) => event.stopPropagation()}
              data-testid="driver-payout-card"
            >
              <button
                type="button"
                onClick={() => setPayoutModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full border-[2px] border-ink bg-white font-marker"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="absolute -top-5 right-10 w-14 float-b">
                <Star color="#FFD23F" />
              </div>
              <div className="absolute -bottom-6 left-8 w-16 float-c">
                <Star color="#FF5A36" />
              </div>
              <p className="font-scribble text-2xl text-leaf">~ sent for review ~</p>
              <h3 className="font-marker text-3xl mt-2">Payout details received</h3>
              <p className="font-hand text-lg text-ink/70 mt-3">
                Our admin team will verify your bank and UPI details along with your documents.
                Track the approval status on the review page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/driver/review" className="sketch-btn sketch-btn--tomato">
                  View review status
                </Link>
                <button type="button" onClick={() => setPayoutModalOpen(false)} className="sketch-btn">
                  Stay here
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
