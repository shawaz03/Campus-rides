"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
const TrackingMap = dynamic(() => import("@/components/student/TrackingMap"), {
  ssr: false,
});
import {
  MapPin,
  Clock,
  Navigation,
  ShieldCheck,
  Star,
  CheckCircle2,
  Phone,
  AlertTriangle,
} from "lucide-react";
import { CoinDoodle, StarDoodle, SquiggleDoodle } from "@/components/doodles";

type TrackedRide = {
  id: string;
  status: string;
  fare: number | null;
  rideType: string | null;
  pickupLabel: string | null;
  destinationLabel: string | null;
  distanceKm: number | null;
  durationMin: number | null;
  pickupLat: number | null;
  pickupLng: number | null;
  destinationLat: number | null;
  destinationLng: number | null;
  currentLat: number | null;
  currentLng: number | null;
  completedAt: string | null;
  driver?: {
    name: string | null;
    rating: number | null;
    vehicle: string | null;
    trusted: boolean;
  } | null;
};

export default function PublicTrackingPage() {
  const params = useParams();
  const rideId = params?.rideId as string;
  const supabase = useMemo(() => createClient(), []);

  const [ride, setRide] = useState<TrackedRide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Poll ride info every 3 seconds
  useEffect(() => {
    if (!rideId) return;

    const fetchRideData = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from("rides")
          .select(`
            id, status, fare, ride_type, vehicle_type,
            pickup_label, destination_label, distance_km, duration_min,
            pickup_lat, pickup_lng, destination_lat, destination_lng,
            current_lat, current_lng, completed_at, created_at,
            driver_id
          `)
          .eq("id", rideId)
          .maybeSingle();

        if (dbError) throw dbError;

        if (!data) {
          setError("This tracking link is invalid or has expired.");
          setLoading(false);
          return;
        }

        let driverRow = null;
        if (data.driver_id) {
          const { data: driverRes, error: driverErr } = await supabase
            .from("drivers")
            .select("user_id, name, rating, vehicle_type, is_approved")
            .eq("user_id", data.driver_id)
            .maybeSingle();

          if (!driverErr && driverRes) {
            driverRow = driverRes;
          }
        }

        const row = data as Record<string, any>;

        const mappedRide: TrackedRide = {
          id: String(row.id),
          status: String(row.status ?? "requested"),
          fare: row.fare ? Number(row.fare) : null,
          rideType: row.ride_type || row.vehicle_type || "bike",
          pickupLabel: row.pickup_label,
          destinationLabel: row.destination_label,
          distanceKm: row.distance_km ? Number(row.distance_km) : null,
          durationMin: row.duration_min ? Number(row.duration_min) : null,
          pickupLat: row.pickup_lat ? Number(row.pickup_lat) : null,
          pickupLng: row.pickup_lng ? Number(row.pickup_lng) : null,
          destinationLat: row.destination_lat ? Number(row.destination_lat) : null,
          destinationLng: row.destination_lng ? Number(row.destination_lng) : null,
          currentLat: row.current_lat ? Number(row.current_lat) : null,
          currentLng: row.current_lng ? Number(row.current_lng) : null,
          completedAt: row.completed_at,
          driver: driverRow
            ? {
                name: driverRow.name,
                rating: driverRow.rating ? Number(driverRow.rating) : null,
                vehicle: driverRow.vehicle_type,
                trusted: Boolean(driverRow.is_approved),
              }
            : null,
        };

        setRide(mappedRide);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching live tracking ride data:", err);
        setError("Failed to fetch tracking data. Retrying...");
      }
    };

    fetchRideData();
    const interval = setInterval(fetchRideData, 3000);

    return () => clearInterval(interval);
  }, [rideId, supabase]);

  const activeCoords = useMemo<[number, number] | null>(() => {
    if (!ride) return null;
    if (ride.currentLat && ride.currentLng) {
      return [ride.currentLng, ride.currentLat];
    }
    // Fallback: If current location is missing but pickup exists, center on pickup
    if (ride.pickupLng && ride.pickupLat) {
      return [ride.pickupLng, ride.pickupLat];
    }
    return null;
  }, [ride]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-t-4 border-tomato rounded-full animate-spin border-[3px] border-ink" />
        <p className="font-marker text-2xl mt-4 text-ink animate-pulse">Initializing Live Tracking Map…</p>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <div className="sketch-card !p-8 bg-peach/40 border-[2.5px] border-ink max-w-md text-center" style={{ boxShadow: "6px 6px 0 #1B1B1F" }}>
          <AlertTriangle className="text-tomato mx-auto mb-4" size={48} />
          <h2 className="font-marker text-3xl mb-2">Tracking Error</h2>
          <p className="font-hand text-lg text-ink/80 leading-relaxed">
            {error || "Could not retrieve the requested ride details."}
          </p>
        </div>
      </div>
    );
  }

  const isCompleted = ride.status === "completed";

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar - Ride Details */}
      <div className="w-full lg:w-96 bg-white border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-ink flex flex-col h-1/2 lg:h-full z-10 overflow-y-auto">
        <div className="p-5 border-b-[2.5px] border-dashed border-ink/20 bg-sun relative">
          <div className="absolute top-2 right-4 w-12 opacity-80 float-b pointer-events-none">
            <CoinDoodle />
          </div>
          <h1 className="font-marker text-3xl">Live Tracking</h1>
          <p className="font-scribble text-lg text-tomato mt-0.5">Campus Rides Safety Link</p>
        </div>

        <div className="p-5 flex-1 space-y-6">
          {/* Status Panel */}
          <div className="sketch-card !p-4 bg-white relative">
            <p className="font-hand text-xs text-ink/50 uppercase tracking-wider">Ride Status</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-leaf"></span>
              </span>
              <h2 className="font-marker text-2xl capitalize">
                {isCompleted ? "Completed" : ride.status === "active" ? "In Transit" : "Requested"}
              </h2>
            </div>
            
            {isCompleted && (
              <div className="mt-3 p-3 bg-leaf/10 border-[2px] border-leaf rounded-xl flex items-center gap-2">
                <CheckCircle2 className="text-leaf" size={18} />
                <p className="font-hand text-sm text-ink/85">The ride finished safely.</p>
              </div>
            )}
          </div>

          {/* Route Details */}
          <div className="space-y-4">
            <h3 className="font-marker text-xl">Journey Route</h3>
            <div className="space-y-3 font-hand text-base">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full border-[1.5px] border-ink bg-leaf text-ink font-bold flex items-center justify-center shrink-0 text-xs">A</span>
                <div>
                  <p className="font-bold text-sm text-ink/65 uppercase tracking-wide">Pickup Point</p>
                  <p className="font-marker text-lg text-ink/90">{ride.pickupLabel ?? "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full border-[1.5px] border-ink bg-tomato text-white font-bold flex items-center justify-center shrink-0 text-xs">B</span>
                <div>
                  <p className="font-bold text-sm text-ink/65 uppercase tracking-wide">Destination Point</p>
                  <p className="font-marker text-lg text-ink/90">{ride.destinationLabel ?? "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          {ride.driver ? (
            <div className="sketch-card !p-4 bg-white relative">
              <h3 className="font-marker text-xl mb-3">Your Driver</h3>
              <div className="flex items-center gap-3">
                <span
                  className="w-12 h-12 grid place-items-center rounded-full border-[2px] border-ink text-white font-marker text-lg uppercase"
                  style={{ background: "#9B5DE5", boxShadow: "2px 2px 0 #1B1B1F" }}
                >
                  {ride.driver.name?.slice(0, 2) ?? "Dr"}
                </span>
                <div>
                  <h4 className="font-marker text-lg leading-snug flex items-center gap-1.5">
                    {ride.driver.name}
                    {ride.driver.trusted && (
                      <span className="text-leaf inline-flex" title="Police Verified Trusted Driver">
                        <ShieldCheck size={16} strokeWidth={2.5} />
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5 font-hand text-sm text-ink/80">
                      <Star size={13} className="fill-sun text-sun" /> {ride.driver.rating ?? "5.0"}
                    </span>
                    <span className="text-ink/30">•</span>
                    <span className="font-hand text-sm text-ink/75 capitalize">{ride.driver.vehicle}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="sketch-card !p-4 bg-cream/40 border-[2px] border-ink border-dashed text-center">
              <p className="font-hand text-base text-ink/65">Waiting for a driver to accept the ride request...</p>
            </div>
          )}

          {/* Help & Support */}
          <div className="pt-2 border-t border-dashed border-ink/20">
            <a
              href="tel:100"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-[2.5px] border-ink bg-tomato text-white hover:bg-tomato/90 transition-colors font-marker text-base uppercase tracking-wider"
              style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
            >
              <Phone size={16} /> Campus Emergency Help
            </a>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 relative h-1/2 lg:h-full">
        {ride.pickupLng && ride.pickupLat && ride.destinationLng && ride.destinationLat ? (
          <TrackingMap
            pickup={{ name: ride.pickupLabel || "A", coords: [ride.pickupLng, ride.pickupLat] }}
            destination={{ name: ride.destinationLabel || "B", coords: [ride.destinationLng, ride.destinationLat] }}
            currentCoords={activeCoords}
            rideType={ride.rideType}
          />
        ) : (
          <div className="absolute inset-0 bg-cream/70 grid place-items-center">
            <p className="font-hand text-lg text-ink/60">No route coordinates available for this ride.</p>
          </div>
        )}

        {/* Overlay Completion Screen */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm z-20 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="sketch-card !p-8 bg-white border-[2.5px] border-ink max-w-sm text-center relative overflow-hidden"
                style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
              >
                <div className="absolute -top-4 -right-4 w-12 float-c pointer-events-none">
                  <StarDoodle color="#7BC950" />
                </div>
                <div className="w-16 h-16 rounded-full border-[2.5px] border-ink bg-leaf/20 text-leaf grid place-items-center mx-auto mb-4" style={{ boxShadow: "3px 3px 0 #1B1B1F" }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-marker text-3xl mb-2">Ride Completed</h3>
                <p className="font-hand text-lg text-ink/80 leading-relaxed">
                  This ride has reached its destination safely. Thank you for using Campus Rides!
                </p>
                <div className="w-24 mx-auto mt-4"><SquiggleDoodle color="#7BC950" /></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
