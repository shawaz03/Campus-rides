"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Cloud, Star, Sun } from "@/components/driver/VehicleDoodles";
import { ChatDoodle, CoinDoodle, PaperPlane, PinDoodle } from "@/components/doodles";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";

type ReviewStatus = "approved" | "pending" | "rejected";

const STATUS_META: Record<ReviewStatus, { label: string; bg: string; color: string; note: string }> = {
  approved: {
    label: "Approved",
    bg: "#7BC950",
    color: "#1B1B1F",
    note: "All checks passed. You can start driving now.",
  },
  pending: {
    label: "Pending",
    bg: "#FFD23F",
    color: "#1B1B1F",
    note: "Admin review is in progress. You will be notified shortly.",
  },
  rejected: {
    label: "Needs update",
    bg: "#FF5A36",
    color: "#FDF6E3",
    note: "One or more items need a quick fix. Check the notes below.",
  },
};

const REVIEW_ITEMS = [
  {
    id: "vehicle",
    title: "Vehicle details",
    detail: "Waiting for admin review.",
    status: "pending" as ReviewStatus,
  },
  {
    id: "documents",
    title: "Document verification",
    detail: "Waiting for admin review.",
    status: "pending" as ReviewStatus,
  },
  {
    id: "payout",
    title: "Payout details",
    detail: "Waiting for admin review.",
    status: "pending" as ReviewStatus,
  },
];

function StatusPill({ status }: { status: ReviewStatus }) {
  const meta = STATUS_META[status];

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 border-[2px] border-ink rounded-full font-hand text-sm"
      style={{ background: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

function ReviewLoading() {
  return (
    <motion.section
      key="review-loading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="grid gap-6"
    >
      <div className="sketch-card !p-6 bg-white">
        <Skeleton className="h-6 w-40 bg-ink/10" />
        <Skeleton className="mt-3 h-5 w-72 bg-ink/10" />
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`review-loading-pill-${index}`} className="rounded-2xl border-[2px] border-ink/20 p-4">
              <Skeleton className="h-4 w-24 bg-ink/10" />
              <Skeleton className="mt-3 h-3 w-full bg-ink/10" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="sketch-card !p-6 bg-white">
          <Skeleton className="h-5 w-48 bg-ink/10" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`review-loading-row-${index}`} className="flex items-start justify-between gap-3">
                <Skeleton className="h-4 w-40 bg-ink/10" />
                <Skeleton className="h-4 w-24 bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
        <div className="sketch-card !p-6 bg-white">
          <Skeleton className="h-5 w-40 bg-ink/10" />
          <Skeleton className="mt-4 h-4 w-full bg-ink/10" />
          <Skeleton className="mt-2 h-4 w-3/4 bg-ink/10" />
          <Skeleton className="mt-6 h-10 w-40 bg-ink/10" />
        </div>
      </div>
    </motion.section>
  );
}

export default function DriverReviewPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isLoading, setIsLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<ReviewStatus>("pending");
  const [adminNote, setAdminNote] = useState<string | null>(null);

  const [checklist, setChecklist] = useState<
    Array<{ id: string; title: string; detail: string; status: ReviewStatus }>
  >([
    { id: "vehicle", title: "Vehicle details", detail: "Waiting for admin review.", status: "pending" },
    { id: "documents", title: "Document verification", detail: "Waiting for admin review.", status: "pending" },
    { id: "payout", title: "Payout details", detail: "Waiting for admin review.", status: "pending" },
  ]);

  useEffect(() => {
    async function loadStatus() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
          router.push("/auth");
          return;
        }

        // 1. Fetch drivers profile
        const { data: driver } = await supabase
          .from("drivers")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        // 2. Fetch vehicle details
        const { data: vehicle } = await supabase
          .from("driver_vehicles")
          .select("*")
          .eq("driver_id", user.id)
          .maybeSingle();

        // 3. Fetch documents
        const { data: documents } = await supabase
          .from("driver_documents")
          .select("*")
          .eq("driver_id", user.id);

        if (!driver) {
          router.push("/driver/onboarding");
          return;
        }

        // Parse driver overall status
        let statusVal: ReviewStatus = "pending";
        let commentText: string | null = null;
        if (driver.status === "approved" || driver.is_approved) {
          statusVal = "approved";
        } else if (driver.status && driver.status.startsWith("rejected")) {
          statusVal = "rejected";
          commentText = driver.status.replace("rejected:", "").trim() || "One or more items need correction.";
          setAdminNote(commentText);
        } else {
          statusVal = "pending";
        }
        setOverallStatus(statusVal);

        // Check documents statuses
        const docsList = documents || [];
        const hasAadhaar = docsList.some((d) => d.doc_type === "aadhaar");
        const hasLicense = docsList.some((d) => d.doc_type === "license");
        const hasRC = docsList.some((d) => d.doc_type === "rc");

        // Fetch storage files for payouts directly
        let hasPayout = false;
        let hasQr = false;
        try {
          const { data: storageFiles } = await supabase.storage
            .from("driver-documents")
            .list(user.id);

          hasPayout = storageFiles?.some((f) => f.name === "payout_details.png") || false;
          hasQr = storageFiles?.some((f) => f.name.startsWith("upi_qr")) || false;
        } catch (storageErr) {
          console.error("Error reading storage for review check", storageErr);
        }

        const getDocStatus = (docType: string): ReviewStatus => {
          const doc = docsList.find((d) => d.doc_type === docType);
          if (!doc) return "pending";
          if (doc.status === "approved") return "approved";
          if (doc.status === "rejected") return "rejected";
          return "pending";
        };

        // Vehicle checklist
        let vehicleStatus: ReviewStatus = "pending";
        let vehicleDetail = "Waiting for admin review.";
        if (vehicle) {
          vehicleDetail = `${vehicle.vehicle_model} (${vehicle.vehicle_number})`;
          vehicleStatus = statusVal; // aligns with overall review
        }

        // Documents checklist
        let docsStatus: ReviewStatus = "pending";
        let docsDetail = "Aadhaar, License, RC pending.";
        if (hasAadhaar && hasLicense && hasRC) {
          docsDetail = "All identity documents uploaded.";
          const aadhaarStatus = getDocStatus("aadhaar");
          const licenseStatus = getDocStatus("license");
          const rcStatus = getDocStatus("rc");

          if (aadhaarStatus === "approved" && licenseStatus === "approved" && rcStatus === "approved") {
            docsStatus = "approved";
          } else if (aadhaarStatus === "rejected" || licenseStatus === "rejected" || rcStatus === "rejected") {
            docsStatus = "rejected";
            docsDetail = "One or more documents were rejected by admin.";
          }
        }

        // Payout details checklist
        let payoutStatus: ReviewStatus = "pending";
        let payoutDetail = "Bank details and UPI QR pending.";
        if (hasPayout && hasQr) {
          payoutDetail = "Bank info and UPI QR uploaded.";
          if (statusVal === "approved") {
            payoutStatus = "approved";
          } else if (statusVal === "rejected") {
            payoutStatus = "rejected";
            payoutDetail = "Payout information rejected or pending correction.";
          } else {
            payoutStatus = "pending";
          }
        }

        setChecklist([
          { id: "vehicle", title: "Vehicle details", detail: vehicleDetail, status: vehicleStatus },
          { id: "documents", title: "Document verification", detail: docsDetail, status: docsStatus },
          { id: "payout", title: "Payout details", detail: payoutDetail, status: payoutStatus },
        ]);
      } catch (err) {
        console.error("Error fetching review progress", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStatus();
  }, [supabase, router]);

  const statusMeta = useMemo(() => STATUS_META[overallStatus], [overallStatus]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-6 left-[6%] w-24 float-a">
        <Cloud />
      </div>
      <div className="pointer-events-none absolute top-16 right-[8%] w-24 float-b">
        <Cloud />
      </div>
      <div className="pointer-events-none absolute top-10 right-[24%] w-16 float-c">
        <Sun />
      </div>
      <div className="pointer-events-none absolute bottom-16 left-[8%] w-12 float-b">
        <Star color="#FF5A36" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <header className="space-y-3">
          <p className="font-scribble text-2xl text-tomato">~ driver review ~</p>
          <h1 className="font-marker text-4xl sm:text-5xl">
            Track your <span className="scribble">approval</span>
          </h1>
          <p className="font-hand text-lg text-ink/70 max-w-2xl">
            Admins verify your vehicle, documents, and payout details. Once approved, you can head
            to the dashboard.
          </p>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <ReviewLoading />
          ) : (
            <motion.section
              key="review-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="sketch-card !p-6 bg-white relative">
                <div className="absolute -top-6 right-8 w-14 float-b">
                  <Star color="#FFD23F" />
                </div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-scribble text-xl text-leaf">~ overall status ~</p>
                    <h2 className="font-marker text-3xl mt-1">Review decision</h2>
                    <p className="mt-3 font-hand text-base text-ink/70">
                      {adminNote ? `Review update: ${adminNote}` : statusMeta.note}
                    </p>
                  </div>
                  <div className="w-20 float-a">
                    <CoinDoodle className="w-full h-auto" />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <StatusPill status={overallStatus} />
                  <span className="font-hand text-sm text-ink/60">Last updated: Just now</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
                <div className="sketch-card !p-6 bg-white relative">
                  <div className="absolute -top-6 -left-3 w-12 float-c">
                    <Star color="#9B5DE5" />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-scribble text-xl text-plum">~ admin checklist ~</p>
                      <h3 className="font-marker text-2xl mt-1">Verification steps</h3>
                    </div>
                    <div className="w-16 float-b">
                      <ChatDoodle className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-4">
                    {checklist.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-3 border-[2px] border-ink/15 rounded-2xl px-4 py-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div>
                          <p className="font-marker text-lg">{item.title}</p>
                          <p className="font-hand text-sm text-ink/70">{item.detail}</p>
                        </div>
                        <StatusPill status={item.status} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="sketch-card !p-6 bg-peach/70 relative">
                    <div className="absolute -top-6 right-6 w-12 float-a">
                      <Star color="#FF5A36" />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-scribble text-xl text-tomato">~ admin notes ~</p>
                        <h3 className="font-marker text-2xl mt-1">Latest updates</h3>
                      </div>
                      <div className="w-16 float-c">
                        <PaperPlane className="w-full h-auto" />
                      </div>
                    </div>
                    <p className="mt-4 font-hand text-base text-ink/80">
                      {adminNote ? (
                        <span className="font-bold text-tomato">Correction Required: {adminNote}</span>
                      ) : (
                        "If anything is rejected, you will see a fix request here with the exact steps to update your submission."
                      )}
                    </p>
                    <div className="mt-4 rounded-2xl border-[2px] border-ink/20 bg-white/60 px-4 py-3 font-hand text-sm text-ink/70">
                      Tip: keep your documents bright and readable to avoid delays.
                    </div>
                  </div>

                  <div className="sketch-card !p-6 bg-sun/80 relative">
                    <div className="absolute -top-6 left-6 w-12 float-b">
                      <Star color="#1B1B1F" />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-scribble text-xl text-plum">~ next up ~</p>
                        <h3 className="font-marker text-2xl mt-1">Go to dashboard</h3>
                      </div>
                      <div className="w-16 float-a">
                        <PinDoodle className="w-full h-auto" />
                      </div>
                    </div>
                    <p className="mt-3 font-hand text-base text-ink/80">
                      {overallStatus === "approved"
                        ? "Congratulations! Your profile has been approved. Jump into the dashboard to start driving."
                        : "Once approved, you can start accepting ride requests and track earnings."}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {overallStatus === "approved" ? (
                        <Link href="/driver/dashboard" className="sketch-btn sketch-btn--tomato">
                          Continue to dashboard
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="sketch-btn sketch-btn--tomato opacity-50 cursor-not-allowed"
                          title="Pending approval"
                        >
                          Dashboard locked
                        </button>
                      )}
                      <Link href="/driver/onboarding" className="sketch-btn">
                        Back to onboarding
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
