"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
  driverId?: string | null;
  isEmergency?: boolean;
  pickupLat?: number | null;
  pickupLng?: number | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
  currentLat?: number | null;
  currentLng?: number | null;
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
  driverId: typeof row.driver_id === "string" ? row.driver_id : null,
  isEmergency: Boolean(row.is_emergency ?? false),
  pickupLat: toNumber(row.pickup_lat),
  pickupLng: toNumber(row.pickup_lng),
  destinationLat: toNumber(row.destination_lat),
  destinationLng: toNumber(row.destination_lng),
  currentLat: toNumber(row.current_lat),
  currentLng: toNumber(row.current_lng),
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

const MOCK_REQUESTS: DriverRide[] = [
  {
    id: "mock_ride_1",
    status: "requested",
    fare: 120,
    rideType: "auto",
    pickupLabel: "Main Library",
    destinationLabel: "Hostel Block C",
    distanceLabel: "2.4 km",
    durationLabel: "8 min",
    scheduledAt: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    studentId: "mock_student",
    pickupLat: 17.406,
    pickupLng: 78.474,
    destinationLat: 17.412,
    destinationLng: 78.481,
    currentLat: 17.406,
    currentLng: 78.474,
  },
  {
    id: "mock_ride_2",
    status: "requested",
    fare: 85,
    rideType: "bike",
    pickupLabel: "Engineering Block",
    destinationLabel: "Campus Gate 1",
    distanceLabel: "1.8 km",
    durationLabel: "5 min",
    scheduledAt: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    studentId: "mock_student_2",
    pickupLat: 17.408,
    pickupLng: 78.476,
    destinationLat: 17.415,
    destinationLng: 78.483,
    currentLat: 17.408,
    currentLng: 78.476,
  }
];

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
  const [isSandbox, setIsSandbox] = useState(false);
  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);
  const [acceptedRideDetails, setAcceptedRideDetails] = useState<DriverRide | null>(null);
  const [showDeclineSuccess, setShowDeclineSuccess] = useState(false);
  const [declinedRideDetails, setDeclinedRideDetails] = useState<DriverRide | null>(null);
  const declinedIdsRef = useRef<string[]>([]);
  const acceptedIdsRef = useRef<string[]>([]);

  const activeRide = useMemo(() => {
    return history.find((ride) => ride.status === "active");
  }, [history]);

  const totalEarnings = useMemo(() => {
    return history
      .filter((ride) => ride.status === "completed" && typeof ride.fare === "number")
      .reduce((sum, ride) => sum + (ride.fare ?? 0) * 0.9, 0);
  }, [history]);

  const completedCount = useMemo(() => {
    return history.filter((ride) => ride.status === "completed").length;
  }, [history]);

  // Stream live location coordinates to database when a ride is active
  useEffect(() => {
    if (!activeRide) return;

    let watchId: number | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (typeof window !== "undefined" && navigator.geolocation) {
      // 1. Start browser GPS watch
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await supabase
            .from("rides")
            .update({ current_lat: latitude, current_lng: longitude })
            .eq("id", activeRide.id);
        },
        (err) => {
          console.warn("watchPosition error:", err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // 2. Simulated route movement fallback (for stationary browser testing)
      if (
        activeRide.pickupLat &&
        activeRide.pickupLng &&
        activeRide.destinationLat &&
        activeRide.destinationLng
      ) {
        let step = 0;
        const totalSteps = 20;
        const startLat = activeRide.pickupLat;
        const startLng = activeRide.pickupLng;
        const endLat = activeRide.destinationLat;
        const endLng = activeRide.destinationLng;

        intervalId = setInterval(async () => {
          step = (step + 1) % (totalSteps + 1);
          const ratio = step / totalSteps;
          const simLat = startLat + (endLat - startLat) * ratio;
          const simLng = startLng + (endLng - startLng) * ratio;

          await supabase
            .from("rides")
            .update({ current_lat: simLat, current_lng: simLng })
            .eq("id", activeRide.id);
        }, 5000);
      }
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [activeRide, supabase]);

  const loadDashboard = async () => {
    setError(null);
    const { data: authData } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    const user = authData?.user;

    if (!user) {
      // Offline fallback / sandbox
      setDriverId("mock_driver");
      setDriverName("Vikram");
      setDriverVehicleType("auto");
      setRequests(MOCK_REQUESTS.filter(r => !declinedIdsRef.current.includes(r.id) && !acceptedIdsRef.current.includes(r.id)));
      setIsSandbox(true);
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
      setDriverVehicleType("auto");
      setRequests(MOCK_REQUESTS.filter(r => !declinedIdsRef.current.includes(r.id) && !acceptedIdsRef.current.includes(r.id)));
      setIsSandbox(true);
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
        "id, status, fare, vehicle_type, ride_type, pickup_label, destination_label, distance_km, duration_min, scheduled_at, created_at, student_id, driver_id, pickup_lat, pickup_lng, destination_lat, destination_lng, current_lat, current_lng, is_emergency"
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
        "id, status, fare, vehicle_type, ride_type, pickup_label, destination_label, distance_km, duration_min, completed_at, created_at, student_id, driver_id, pickup_lat, pickup_lng, destination_lat, destination_lng, current_lat, current_lng, is_emergency"
      )
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12);

    if (requestsRes.error || historyRes.error) {
      setRequests(MOCK_REQUESTS.filter(r => !declinedIdsRef.current.includes(r.id) && !acceptedIdsRef.current.includes(r.id)));
      setIsSandbox(true);
    } else {
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data.map(toDriverRide) : []);
      setHistory(Array.isArray(historyRes.data) ? historyRes.data.map(toDriverRide) : []);
      setIsSandbox(false);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const handleAccept = async (rideId: string) => {
    setActionId(rideId);
    const localRide = requests.find((r) => r.id === rideId);
    
    if (rideId.startsWith("mock_")) {
      acceptedIdsRef.current.push(rideId);
    }

    if (isSandbox || !driverId || rideId.startsWith("mock_")) {
      // Sandbox mode: immediately update local state to generate card
      if (localRide) {
        const updatedRide = { ...localRide, status: "active", driverId: driverId || "mock_driver" };
        setRequests((prev) => prev.filter((r) => r.id !== rideId));
        setHistory((prev) => [updatedRide, ...prev.filter((r) => r.id !== rideId)]);
        setAcceptedRideDetails(updatedRide);
      }
      setActionId(null);
      setShowAcceptSuccess(true);
      return;
    }

    try {
      const { error: err } = await supabase
        .from("rides")
        .update({ status: "active", driver_id: driverId })
        .eq("id", rideId)
        .is("driver_id", null);

      if (err) throw err;

      if (localRide) {
        setAcceptedRideDetails({ ...localRide, status: "active", driverId });
      }
      setShowAcceptSuccess(true);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      setError("Failed to accept ride. It may have already been accepted.");
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (rideId: string) => {
    setActionId(rideId);
    const localRide = requests.find((r) => r.id === rideId);

    if (rideId.startsWith("mock_")) {
      declinedIdsRef.current.push(rideId);
    }

    if (isSandbox || !driverId || rideId.startsWith("mock_")) {
      if (localRide) {
        setRequests((prev) => prev.filter((r) => r.id !== rideId));
        setDeclinedRideDetails(localRide);
      }
      setActionId(null);
      setShowDeclineSuccess(true);
      return;
    }
    try {
      await supabase
        .from("rides")
        .update({ status: "cancelled" })
        .eq("id", rideId)
        .is("driver_id", null);

      if (localRide) {
        setDeclinedRideDetails(localRide);
      }
      setShowDeclineSuccess(true);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      setError("Failed to decline ride.");
    } finally {
      setActionId(null);
    }
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
              <div className="sketch-card !p-6 bg-sun/80 relative">
                <div className="absolute top-6 right-8 w-12 float-b">
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

              {activeRide && (
                <div
                  className={`sketch-card !p-6 border-[2.5px] border-ink relative overflow-hidden transition-colors ${
                    activeRide.isEmergency ? "bg-tomato/15 border-tomato" : "bg-leaf/10"
                  }`}
                  style={{ boxShadow: "6px 6px 0 #1B1B1F" }}
                >
                  {activeRide.isEmergency && (
                    <div className="mb-4 p-4 bg-[#FF5A36] text-white border-[2.5px] border-ink rounded-xl flex items-start gap-3 animate-bounce">
                      <span className="text-2xl mt-0.5">🚨</span>
                      <div className="flex-1">
                        <p className="font-marker text-lg uppercase tracking-wide">Emergency SOS Active!</p>
                        <p className="font-hand text-sm opacity-95">
                          The student triggered SOS. Safely halt, check their status, and call Campus Security (100) or emergency contacts immediately!
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute -top-3 -right-3 w-12 float-c pointer-events-none">
                    <Star color={activeRide.isEmergency ? "#FF5A36" : "#7BC950"} />
                  </div>
                  <p className={`font-scribble text-xl ${activeRide.isEmergency ? "text-tomato" : "text-leaf"}`}>
                    {activeRide.isEmergency ? "~ emergency alert ~" : "~ trip in progress ~"}
                  </p>
                  <h3 className={`font-marker text-3xl mt-1 ${activeRide.isEmergency ? "text-tomato animate-pulse" : ""}`}>
                    {activeRide.isEmergency ? "EMERGENCY ACTIVE" : "Active Ride"}
                  </h3>
                  
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-hand text-sm text-ink/60">from</p>
                      <p className="font-marker text-lg">{activeRide.pickupLabel}</p>
                      <p className="font-hand text-sm text-ink/60 mt-2">to</p>
                      <p className="font-marker text-lg">{activeRide.destinationLabel}</p>
                    </div>
                    <div className="flex flex-col justify-between items-end text-right">
                      <div>
                        <p className="font-marker text-3xl text-tomato">₹{activeRide.fare}</p>
                        <p className="font-hand text-base text-ink/70 mt-1">
                          {activeRide.distanceLabel} • {activeRide.durationLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <span className="relative inline-flex w-3 h-3">
                          <span className="absolute inset-0 rounded-full bg-leaf opacity-70 animate-ping" />
                          <span className="relative w-3 h-3 rounded-full bg-leaf border-[1.5px] border-ink" />
                        </span>
                        <span className="font-hand text-sm text-ink/80 animate-pulse">📍 Sharing live location…</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        setActionId(activeRide.id);
                        await supabase
                          .from("rides")
                          .update({ status: "completed", completed_at: new Date().toISOString() })
                          .eq("id", activeRide.id);
                        setActionId(null);
                        loadDashboard();
                      }}
                      disabled={actionId === activeRide.id}
                      className="sketch-btn sketch-btn--tomato !py-3 !px-6 !text-lg w-full sm:w-auto disabled:opacity-60"
                    >
                      Complete Ride & Collect Cash
                    </button>
                  </div>
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
      {showAcceptSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md border-[2.5px] border-ink bg-white rounded-[28px_10px_24px_12px/12px_24px_10px_28px] p-6 text-center relative overflow-hidden"
            style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
            data-testid="driver-accept-success-card"
          >
            <div className="mx-auto w-16 h-16 rounded-full border-[2.5px] border-ink bg-leaf text-white flex items-center justify-center font-marker text-3xl mb-4 shadow-[3px_3px_0_#1B1B1F]">
              ✓
            </div>
            <h3 className="font-marker text-3xl mb-2 text-leaf">Ride Accepted!</h3>
            <p className="font-hand text-lg text-ink/80 mb-4">
              You have successfully accepted the ride request.
            </p>

            {acceptedRideDetails && (
              <div className="border-[2px] border-dashed border-ink/30 rounded-xl p-4 bg-cream/50 text-left mb-6 space-y-2">
                <p className="font-hand text-base"><span className="font-marker">Pickup:</span> {acceptedRideDetails.pickupLabel}</p>
                <p className="font-hand text-base"><span className="font-marker">Destination:</span> {acceptedRideDetails.destinationLabel}</p>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-ink/20">
                  <span className="font-hand text-base"><span className="font-marker">Fare:</span> ₹{acceptedRideDetails.fare}</span>
                  <span className="font-hand text-base"><span className="font-marker">ETA:</span> {acceptedRideDetails.durationLabel}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowAcceptSuccess(false)}
              className="sketch-btn sketch-btn--tomato w-full !text-base"
            >
              Start Navigating <ArrowDoodle className="inline-block w-5 h-3 ml-2" color="#fff" />
            </button>
          </motion.div>
        </div>
      )}

      {showDeclineSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md border-[2.5px] border-ink bg-white rounded-[28px_10px_24px_12px/12px_24px_10px_28px] p-6 text-center relative overflow-hidden"
            style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
            data-testid="driver-decline-success-card"
          >
            <div className="mx-auto w-16 h-16 rounded-full border-[2.5px] border-ink bg-tomato text-white flex items-center justify-center font-marker text-3xl mb-4 shadow-[3px_3px_0_#1B1B1F]">
              ✓
            </div>
            <h3 className="font-marker text-3xl mb-2 text-tomato">Ride Declined!</h3>
            <p className="font-hand text-lg text-ink/80 mb-4">
              You have successfully declined the ride request.
            </p>

            {declinedRideDetails && (
              <div className="border-[2px] border-dashed border-ink/30 rounded-xl p-4 bg-cream/50 text-left mb-6 space-y-2">
                <p className="font-hand text-base"><span className="font-marker">Pickup:</span> {declinedRideDetails.pickupLabel}</p>
                <p className="font-hand text-base"><span className="font-marker">Destination:</span> {declinedRideDetails.destinationLabel}</p>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-ink/20">
                  <span className="font-hand text-base"><span className="font-marker">Fare:</span> ₹{declinedRideDetails.fare}</span>
                  <span className="font-hand text-base"><span className="font-marker">ETA:</span> {declinedRideDetails.durationLabel}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDeclineSuccess(false)}
              className="sketch-btn sketch-btn--tomato w-full !text-base"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
