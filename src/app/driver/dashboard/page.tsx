"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Cloud, Star, Sun } from "@/components/driver/VehicleDoodles";
import {
  ArrowDoodle,
  CarMascot,
  CoinDoodle,
  PinDoodle,
  StarDoodle,
} from "@/components/doodles";
import { Skeleton } from "@/components/ui/skeleton";

type RideRow = Record<string, unknown>;

type DriverRide = {
  id: string;
  status: string;
  fare: number | null;
  rideType: string | null;
  pickupLabel: string | null;
  destinationLabel: string | null;
  distanceLabel: string | null;
  durationLabel: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
  studentId: string | null;
};

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const pickLabel = (...values: Array<unknown>) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
};

const formatDistance = (value: unknown) => {
  if (typeof value === "string" && value.trim()) {
    return value.includes("km") ? value : `${value} km`;
  }
  const parsed = toNumber(value);
  if (parsed === null) return null;
  return `${parsed.toFixed(1)} km`;
};

const formatDuration = (value: unknown) => {
  if (typeof value === "string" && value.trim()) {
    return value.includes("min") ? value : `${value} min`;
  }
  const parsed = toNumber(value);
  if (parsed === null) return null;
  return `${Math.round(parsed)} min`;
};

const toDriverRide = (row: RideRow): DriverRide => ({
  id: String(row.id ?? ""),
  status: String(row.status ?? "unknown"),
  fare: toNumber(row.fare),
  rideType: pickLabel(row.vehicle_type, row.ride_type, row.rideType),
  pickupLabel: pickLabel(row.pickup_label, row.pickup_name, row.pickup),
  destinationLabel: pickLabel(
    row.destination_label,
    row.destination_name,
    row.destination,
    row.dest_label,
    row.dest_name
  ),
  distanceLabel: formatDistance(row.distance_km ?? row.distance),
  durationLabel: formatDuration(row.duration_min ?? row.duration),
  scheduledAt: pickLabel(row.scheduled_at, row.scheduledAt),
  completedAt: pickLabel(row.completed_at, row.completedAt),
  createdAt: pickLabel(row.created_at, row.createdAt),
  studentId: typeof row.student_id === "string" ? row.student_id : null,
});

function DashboardLoading() {
  return (
    <motion.section
      key="dashboard-loading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="sketch-card !p-6 bg-white">
        <Skeleton className="h-6 w-40 bg-ink/10" />
        <Skeleton className="mt-3 h-4 w-72 bg-ink/10" />
      </div>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={`dashboard-loading-${index}`} className="sketch-card !p-6 bg-white">
            <Skeleton className="h-5 w-40 bg-ink/10" />
            <Skeleton className="mt-4 h-8 w-32 bg-ink/10" />
            <Skeleton className="mt-2 h-4 w-24 bg-ink/10" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="sketch-card !p-6 bg-white">
          <Skeleton className="h-5 w-40 bg-ink/10" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`req-loading-${index}`} className="rounded-2xl border-[2px] border-ink/10 p-4">
                <Skeleton className="h-4 w-32 bg-ink/10" />
                <Skeleton className="mt-2 h-3 w-48 bg-ink/10" />
                <Skeleton className="mt-3 h-8 w-32 bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
        <div className="sketch-card !p-6 bg-white">
          <Skeleton className="h-5 w-40 bg-ink/10" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`hist-loading-${index}`} className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-40 bg-ink/10" />
                <Skeleton className="h-4 w-16 bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function DriverDashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [driverName, setDriverName] = useState<string>("driver");
  const [requests, setRequests] = useState<DriverRide[]>([]);
  const [history, setHistory] = useState<DriverRide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [driverVehicleType, setDriverVehicleType] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const totalEarnings = useMemo(() => {
    return history
      .filter((ride) => ride.status === "completed" && typeof ride.fare === "number")
      .reduce((sum, ride) => sum + (ride.fare ?? 0) * 0.9, 0);
  }, [history]);

  const completedCount = useMemo(() => {
    return history.filter((ride) => ride.status === "completed").length;
  }, [history]);

  const loadDashboard = async () => {
    setError(null);
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setError("Sign in to see your driver dashboard.");
      setIsLoading(false);
      return;
    }

    setDriverId(user.id);
    const fullName = (user.user_metadata?.full_name ?? user.user_metadata?.name ?? "driver") as string;
    setDriverName(fullName.split(" ")[0] || "driver");

    const driverRes = await supabase
      .from("drivers")
      .select("vehicle_type, status, is_approved")
      .eq("user_id", user.id)
      .maybeSingle();

    if (driverRes.error) {
      setError("Unable to load driver data. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!driverRes.data) {
      router.push("/driver/onboarding");
      return;
    }

    const isApproved = driverRes.data.status === "approved" || driverRes.data.is_approved;
    if (!isApproved) {
      router.push("/driver/review");
      return;
    }

    const vehicleType =
      typeof driverRes.data?.vehicle_type === "string" ? driverRes.data.vehicle_type : null;
    setDriverVehicleType(vehicleType);

    let requestsQuery = supabase
      .from("rides")
      .select(
        "id, status, fare, vehicle_type, ride_type, pickup_label, destination_label, distance_km, duration_min, scheduled_at, created_at, student_id, driver_id"
      )
      .eq("status", "requested")
      .is("driver_id", null);

    if (vehicleType) {
      requestsQuery = requestsQuery.or(`ride_type.eq.${vehicleType},vehicle_type.eq.${vehicleType}`);
    }

    const requestsRes = await requestsQuery
      .order("created_at", { ascending: false })
      .limit(12);

    const historyRes = await supabase
      .from("rides")
      .select(
        "id, status, fare, vehicle_type, ride_type, pickup_label, destination_label, distance_km, duration_min, completed_at, created_at, student_id, driver_id"
      )
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12);

    if (requestsRes.error || historyRes.error) {
      setError("Unable to load driver data. Please try again.");
    }

    setRequests(Array.isArray(requestsRes.data) ? requestsRes.data.map(toDriverRide) : []);
    setHistory(Array.isArray(historyRes.data) ? historyRes.data.map(toDriverRide) : []);
    setIsLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!mounted) return;
      await loadDashboard();
    };
    run();
    const interval = setInterval(run, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [supabase]);

  const handleAccept = async (rideId: string) => {
    if (!driverId) return;
    setActionId(rideId);
    await supabase
      .from("rides")
      .update({ status: "active", driver_id: driverId })
      .eq("id", rideId)
      .is("driver_id", null);
    setActionId(null);
    loadDashboard();
  };

  const handleDecline = async (rideId: string) => {
    setActionId(rideId);
    await supabase
      .from("rides")
      .update({ status: "cancelled" })
      .eq("id", rideId)
      .is("driver_id", null);
    setActionId(null);
    loadDashboard();
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-6 left-[6%] w-24 float-a">
        <Cloud />
      </div>
      <div className="pointer-events-none absolute top-14 right-[8%] w-24 float-b">
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
          <p className="font-scribble text-2xl text-tomato">~ driver dashboard ~</p>
          <h1 className="font-marker text-4xl sm:text-5xl">
            Hey <span className="marker">{driverName}</span>, ready for rides?
          </h1>
          <p className="font-hand text-lg text-ink/70 max-w-2xl">
            Keep an eye on new requests, total earnings, and your ride history in one spot.
          </p>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <DashboardLoading />
          ) : (
            <motion.section
              key="dashboard-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="sketch-card !p-6 bg-sun/80 relative overflow-hidden">
                <div className="absolute -top-6 right-8 w-12 float-b">
                  <StarDoodle className="w-full h-auto" color="#1B1B1F" />
                </div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-scribble text-xl text-plum">~ daily drive ~</p>
                    <h2 className="font-marker text-3xl mt-1">Total earnings</h2>
                    <p className="mt-3 font-hand text-base text-ink/70">
                      Completed rides: <span className="font-marker">{completedCount}</span>
                    </p>
                  </div>
                  <div className="w-20 float-a">
                    <CoinDoodle className="w-full h-auto" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="font-marker text-4xl">₹{totalEarnings || "0"}</span>
                  <span className="font-hand text-base text-ink/70">after 10% platform fee</span>
                </div>
              </div>

              {error && (
                <div className="sketch-card !p-5 bg-peach/60 font-hand text-base text-ink">
                  {error}
                </div>
              )}

              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
                <div className="sketch-card !p-6 bg-white relative">
                  <div className="absolute -top-6 -left-3 w-12 float-c">
                    <Star color="#FFD23F" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-scribble text-xl text-leaf">~ ride requests ~</p>
                      <h2 className="font-marker text-3xl">New pickups</h2>
                      {driverVehicleType && (
                        <p className="font-hand text-sm text-ink/60 mt-1">
                          Showing {driverVehicleType} requests
                        </p>
                      )}
                    </div>
                    <div className="w-20 float-a">
                      <PinDoodle className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-4">
                    {requests.length === 0 ? (
                      <div className="rounded-2xl border-[2px] border-ink/15 px-4 py-5 text-center">
                        <p className="font-marker text-xl">No requests yet</p>
                        <p className="font-hand text-base text-ink/70 mt-2">
                          Once students book rides, they will appear here.
                        </p>
                      </div>
                    ) : (
                      requests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          className="rounded-2xl border-[2px] border-ink/15 px-4 py-4 bg-cream/80"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-marker text-lg">
                                {request.pickupLabel ?? "Pickup"} → {request.destinationLabel ?? "Drop"}
                              </p>
                              <p className="font-hand text-sm text-ink/70">
                                {request.distanceLabel ?? "—"} • {request.durationLabel ?? "—"}
                              </p>
                            </div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 border-[2px] border-ink rounded-full font-hand text-sm bg-sun">
                              ₹{request.fare ?? "—"}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleAccept(request.id)}
                              disabled={actionId === request.id}
                              className="sketch-btn sketch-btn--sun !py-2 !px-4 !text-base disabled:opacity-60"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecline(request.id)}
                              disabled={actionId === request.id}
                              className="sketch-btn !py-2 !px-4 !text-base disabled:opacity-60"
                            >
                              Decline
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="sketch-card !p-6 bg-white relative">
                    <div className="absolute -top-6 right-6 w-12 float-b">
                      <Star color="#FF5A36" />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-scribble text-xl text-tomato">~ ride history ~</p>
                        <h2 className="font-marker text-3xl">Recent rides</h2>
                      </div>
                      <div className="w-20 float-c">
                        <CarMascot className="w-full h-auto" />
                      </div>
                    </div>
                    <div className="mt-5 space-y-3">
                      {history.length === 0 ? (
                        <div className="rounded-2xl border-[2px] border-ink/15 px-4 py-5 text-center">
                          <p className="font-marker text-xl">No rides yet</p>
                          <p className="font-hand text-base text-ink/70 mt-2">
                            Accept a ride request to start logging history.
                          </p>
                        </div>
                      ) : (
                        history.map((ride) => {
                          const driverShare =
                            typeof ride.fare === "number"
                              ? Math.round(ride.fare * 0.9 * 100) / 100
                              : null;
                          return (
                          <div
                            key={ride.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-[2px] border-ink/15 px-4 py-3"
                          >
                            <div>
                              <p className="font-marker text-lg">
                                {ride.pickupLabel ?? "Pickup"} → {ride.destinationLabel ?? "Drop"}
                              </p>
                              <p className="font-hand text-sm text-ink/70">
                                {ride.completedAt ?? ride.createdAt ?? "—"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-marker text-lg">₹{driverShare ?? "—"}</p>
                              <p className="font-hand text-sm text-ink/60">{ride.status}</p>
                            </div>
                          </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="sketch-card !p-6 bg-cream relative">
                    <div className="absolute -top-6 left-6 w-14 float-a">
                      <Star color="#9B5DE5" />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-scribble text-xl text-plum">~ driver tools ~</p>
                        <h3 className="font-marker text-2xl mt-1">Need updates?</h3>
                      </div>
                      <div className="w-16 float-b">
                        <ArrowDoodle className="w-full h-auto" color="#FF5A36" />
                      </div>
                    </div>
                    <p className="mt-3 font-hand text-base text-ink/70">
                      Keep your documents up to date and track approval in the review page.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link href="/driver/review" className="sketch-btn sketch-btn--tomato">
                        Review status
                      </Link>
                      <Link href="/driver/onboarding" className="sketch-btn">
                        Update details
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
