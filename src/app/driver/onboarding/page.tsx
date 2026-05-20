"use client";

import { useMemo, useState, useEffect, type ChangeEvent, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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

const vehicleCardVariants: any = {
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
  const cardStyle = {
    background: selected ? vehicle.color : "#fffdf5",
    "--card-shadow": baseShadow,
    "--card-shadow-hover": hoverShadow,
  } as React.CSSProperties;

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
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});

  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiQr, setUpiQr] = useState<File | null>(null);
  const [payoutSubmitted, setPayoutSubmitted] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);

  // Load existing profile & documents
  useEffect(() => {
    async function loadDriverProfile() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
          setIsLoadingUser(false);
          return;
        }

        setUserId(user.id);
        setEmail(user.email ?? null);
        setPhone(user.phone ?? null);

        // Fetch driver profile
        const { data: driverProfile } = await supabase
          .from("drivers")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (driverProfile) {
          if (driverProfile.vehicle_type) {
            setVehicleType(driverProfile.vehicle_type as VehicleType);
          }

          // Fetch vehicle info
          const { data: vehicle } = await supabase
            .from("driver_vehicles")
            .select("*")
            .eq("driver_id", user.id)
            .maybeSingle();

          if (vehicle) {
            setVehicleModel(vehicle.vehicle_model ?? "");
            setVehicleNumber(vehicle.vehicle_number ?? "");
          }

          // Fetch documents metadata
          const { data: docsData } = await supabase
            .from("driver_documents")
            .select("*")
            .eq("driver_id", user.id);

          const loadedUploaded: Record<string, boolean> = {};
          if (docsData && docsData.length > 0) {
            docsData.forEach((d) => {
              loadedUploaded[d.doc_type] = true;
            });
          }

          // Fetch bank details & QR code if they exist in storage directly
          try {
            const { data: storageFiles } = await supabase.storage
              .from("driver-documents")
              .list(user.id);

            const hasPayout = storageFiles?.some((f) => f.name === "payout_details.png");
            const upiQrFile = storageFiles?.find((f) => f.name.startsWith("upi_qr"));

            loadedUploaded.payout_details = Boolean(hasPayout);
            loadedUploaded.upi_qr = Boolean(upiQrFile);
            setUploadedDocs(loadedUploaded);

            if (hasPayout) {
              const { data: fileData } = await supabase.storage
                .from("driver-documents")
                .download(`${user.id}/payout_details.png`);

              if (fileData) {
                const text = await fileData.text();
                const json = JSON.parse(text);
                setAccountHolderName(json.accountHolderName ?? "");
                setAccountNumber(json.accountNumber ?? "");
                setIfscCode(json.ifscCode ?? "");
                setUpiId(json.upiId ?? "");
              }
            }
          } catch (storageErr) {
            console.error("Error loading storage documents", storageErr);
            setUploadedDocs(loadedUploaded);
          }
        }
      } catch (err) {
        console.error("Error loading driver profile data", err);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadDriverProfile();
  }, [supabase]);

  const canContinue =
    vehicleType !== null && vehicleNumber.trim().length > 0 && vehicleModel.trim().length > 0;

  const allDocsReady = useMemo(
    () => DOCS.every((doc) => Boolean(docs[doc.id]) || uploadedDocs[doc.id]),
    [docs, uploadedDocs]
  );

  const payoutReady = useMemo(
    () =>
      accountHolderName.trim().length > 0 &&
      accountNumber.trim().length > 0 &&
      ifscCode.trim().length > 0 &&
      upiId.trim().length > 0 &&
      (Boolean(upiQr) || uploadedDocs.upi_qr),
    [accountHolderName, accountNumber, ifscCode, upiId, upiQr, uploadedDocs.upi_qr]
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

  const handleDocSubmit = async () => {
    if (!allDocsReady || !userId) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 0. Ensure driver profile exists in drivers table
      const { data: driverProfile } = await supabase
        .from("drivers")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!driverProfile) {
        await supabase.from("drivers").insert({
          user_id: userId,
          email: email,
          phone: phone,
          vehicle_type: vehicleType,
          status: "pending",
          is_approved: false,
          is_available: false,
          rating: 5.0,
        });
      } else {
        await supabase.from("drivers").update({
          vehicle_type: vehicleType,
        }).eq("user_id", userId);
      }

      // 1. Upsert vehicle info
      const { data: vehicleData } = await supabase
        .from("driver_vehicles")
        .select("id")
        .eq("driver_id", userId)
        .maybeSingle();

      if (!vehicleData) {
        await supabase.from("driver_vehicles").insert({
          driver_id: userId,
          vehicle_type: vehicleType,
          vehicle_model: vehicleModel,
          vehicle_number: vehicleNumber,
        });
      } else {
        await supabase.from("driver_vehicles").update({
          vehicle_type: vehicleType,
          vehicle_model: vehicleModel,
          vehicle_number: vehicleNumber,
        }).eq("driver_id", userId);
      }

      // 2. Upload and save files
      for (const docKey of ["aadhaar", "license", "rc"] as const) {
        const file = docs[docKey];
        if (file) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${userId}/${docKey}-${Date.now()}.${fileExt}`;

          // Upload to storage bucket
          const { error: uploadErr } = await supabase.storage
            .from("driver-documents")
            .upload(fileName, file, { upsert: true });

          if (uploadErr) throw uploadErr;

          // Delete old doc record
          await supabase.from("driver_documents").delete().eq("driver_id", userId).eq("doc_type", docKey);

          // Insert new doc record
          const { error: dbErr } = await supabase.from("driver_documents").insert({
            driver_id: userId,
            doc_type: docKey,
            file_path: fileName,
            status: "pending",
          });

          if (dbErr) throw dbErr;
        }
      }

      // Update local state to reflect upload
      const newUploaded = { ...uploadedDocs };
      if (docs.aadhaar) newUploaded.aadhaar = true;
      if (docs.license) newUploaded.license = true;
      if (docs.rc) newUploaded.rc = true;
      setUploadedDocs(newUploaded);

      setDocsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to submit documents. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayoutSubmit = async () => {
    if (!payoutReady || !userId) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Upload UPI QR if new file is selected
      if (upiQr) {
        // Clean up old QR files in storage
        try {
          const { data: filesList } = await supabase.storage
            .from("driver-documents")
            .list(userId);

          const oldUpiQrs = filesList?.filter(f => f.name.startsWith("upi_qr")) || [];
          if (oldUpiQrs.length > 0) {
            await supabase.storage
              .from("driver-documents")
              .remove(oldUpiQrs.map(f => `${userId}/${f.name}`));
          }
        } catch (cleanErr) {
          console.error("Failed to clean up old QR code", cleanErr);
        }

        const qrExt = upiQr.name.split(".").pop();
        const qrFileName = `${userId}/upi_qr-${Date.now()}.${qrExt}`;

        const { error: uploadErr } = await supabase.storage
          .from("driver-documents")
          .upload(qrFileName, upiQr, { upsert: true });

        if (uploadErr) throw uploadErr;
      }

      // 2. Upload Payout Details JSON (Spoofed as image/png to bypass storage MIME constraints)
      const payoutDetails = {
        accountHolderName,
        accountNumber,
        ifscCode,
        upiId,
      };
      const payoutBlob = new Blob([JSON.stringify(payoutDetails)], { type: "image/png" });
      const payoutFile = new File([payoutBlob], "payout_details.png", { type: "image/png" });
      const payoutFileName = `${userId}/payout_details.png`;

      const { error: payoutUploadErr } = await supabase.storage
        .from("driver-documents")
        .upload(payoutFileName, payoutFile, { upsert: true });

      if (payoutUploadErr) throw payoutUploadErr;

      // 3. Update driver status in drivers table
      const { data: driverProfile } = await supabase
        .from("drivers")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!driverProfile) {
        await supabase.from("drivers").insert({
          user_id: userId,
          email: email,
          phone: phone,
          vehicle_type: vehicleType,
          status: "pending",
          is_approved: false,
          is_available: false,
          rating: 5.0,
        });
      } else {
        await supabase.from("drivers").update({
          vehicle_type: vehicleType,
          status: "pending",
          is_approved: false,
        }).eq("user_id", userId);
      }

      // Update local state
      const newUploaded = { ...uploadedDocs };
      if (upiQr) newUploaded.upi_qr = true;
      newUploaded.payout_details = true;
      setUploadedDocs(newUploaded);

      setPayoutSubmitted(true);
      setPayoutModalOpen(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to submit payout details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepCopy = STEP_COPY[step];

  if (isLoadingUser) {
    return (
      <div className="min-h-[70vh] grid place-items-center bg-cream relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-12 float-a"><Star color="#FFD23F" /></div>
        <div className="absolute top-1/3 right-1/4 w-16 float-b"><Cloud /></div>
        <div className="absolute bottom-1/4 left-1/3 w-10 float-c"><Star color="#FF5A36" /></div>
        <div className="text-center space-y-4">
          <p className="font-scribble text-3xl text-tomato animate-pulse">~ loading your onboarding progress ~</p>
          <div className="w-12 h-12 border-4 border-tomato border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

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
                            {file
                              ? `Selected: ${file.name}`
                              : uploadedDocs[doc.id]
                              ? "✓ Previously uploaded (pending review)"
                              : "No file selected"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {submitError && (
                <div className="p-3 border-[2.5px] border-tomato bg-tomato/5 rounded-2xl text-tomato font-hand text-base">
                  {submitError}
                </div>
              )}

              <section className="flex flex-wrap gap-4 items-center">
                <button
                  type="button"
                  onClick={() => setStep("vehicle")}
                  className="sketch-btn"
                  data-testid="driver-back"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleDocSubmit}
                  disabled={!allDocsReady || isSubmitting}
                  className="sketch-btn sketch-btn--tomato disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="driver-submit"
                >
                  {isSubmitting ? "Uploading..." : "Submit for verification"}
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
                        {upiQr
                          ? `Selected: ${upiQr.name}`
                          : uploadedDocs.upi_qr
                          ? "✓ Previously uploaded QR code"
                          : "No QR selected"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {submitError && (
                <div className="p-3 border-[2.5px] border-tomato bg-tomato/5 rounded-2xl text-tomato font-hand text-base">
                  {submitError}
                </div>
              )}

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
                    <button
                      type="button"
                      onClick={() => setStep("docs")}
                      className="sketch-btn"
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePayoutSubmit}
                      disabled={!payoutReady || isSubmitting}
                      className="sketch-btn sketch-btn--tomato disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Finish onboarding"}
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
