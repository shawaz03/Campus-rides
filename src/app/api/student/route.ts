import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  StudentApiResponse,
  StudentDriver,
  StudentProfile,
  StudentRide,
  StudentTransaction,
  StudentUser,
} from "@/lib/student-types";

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

const normalizeEmergencyContact = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  return value;
};

export async function GET() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userSummary: StudentUser = {
    id: user.id,
    email: user.email ?? null,
    name: (user.user_metadata?.full_name ?? user.user_metadata?.name ?? null) as string | null,
    avatarUrl: (user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null) as string | null,
  };

  let profile: StudentProfile | null = null;
  const profileRes = await supabase
    .from("students")
    .select(
      "user_id, name, email, college_id, coins_balance, ride_streak, emergency_contact, trusted_drivers"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profileRes.error && profileRes.data) {
    const row = profileRes.data as Record<string, unknown>;
    const trustedDrivers = Array.isArray(row.trusted_drivers)
      ? row.trusted_drivers.map((item) => String(item))
      : null;

    profile = {
      id: String(row.user_id ?? user.id),
      name: typeof row.name === "string" ? row.name : null,
      email: typeof row.email === "string" ? row.email : null,
      collegeId: (row.college_id as string | number | null | undefined) ?? null,
      coinsBalance: toNumber(row.coins_balance),
      rideStreak: toNumber(row.ride_streak),
      emergencyContact: normalizeEmergencyContact(row.emergency_contact),
      trustedDrivers,
    };
  } else if (!profileRes.error && !profileRes.data) {
    // Automatically create profile record if missing
    const defaultName = (user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Student") as string;
    const { data: newProfileData, error: insertError } = await supabase
      .from("students")
      .insert({
        user_id: user.id,
        name: defaultName,
        email: user.email ?? "",
        college_id: "CR-2026",
        coins_balance: 100, // welcome bonus
        ride_streak: 0,
      })
      .select(
        "user_id, name, email, college_id, coins_balance, ride_streak, emergency_contact, trusted_drivers"
      )
      .maybeSingle();

    if (!insertError && newProfileData) {
      const row = newProfileData as Record<string, unknown>;
      const trustedDrivers = Array.isArray(row.trusted_drivers)
        ? row.trusted_drivers.map((item) => String(item))
        : null;

      profile = {
        id: String(row.user_id ?? user.id),
        name: typeof row.name === "string" ? row.name : null,
        email: typeof row.email === "string" ? row.email : null,
        collegeId: (row.college_id as string | number | null | undefined) ?? null,
        coinsBalance: toNumber(row.coins_balance),
        rideStreak: toNumber(row.ride_streak),
        emergencyContact: normalizeEmergencyContact(row.emergency_contact),
        trustedDrivers,
      };
    } else {
      console.error("Auto profile creation failed:", insertError);
    }
  }

  const ridesRes = await supabase
    .from("rides")
    .select(
      `
        id, status, fare, ride_type, pickup_label, destination_label, distance_km, duration_min, scheduled_at, completed_at, created_at,
        pickup_lat, pickup_lng, destination_lat, destination_lng, current_lat, current_lng, driver_id
      `
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(40);

  // In-memory join: collect unique non-null driver IDs from the returned rides
  const driverIds = Array.isArray(ridesRes.data)
    ? Array.from(new Set(ridesRes.data.map((r) => r.driver_id).filter(Boolean)))
    : [];

  const driversMap: Record<
    string,
    {
      name?: string | null;
      rating?: number | null;
      vehicle_type?: string | null;
      is_approved?: boolean | null;
      driver_vehicles?: Array<{ vehicle_number: string }>;
    }
  > = {};

  if (driverIds.length > 0) {
    const { data: driversData } = await supabase
      .from("drivers")
      .select("user_id, name:full_name, rating, vehicle_type, is_approved, driver_vehicles(vehicle_number)")
      .in("user_id", driverIds);

    if (Array.isArray(driversData)) {
      driversData.forEach((d) => {
        driversMap[d.user_id] = d;
      });
    }
  }

  const rides: StudentRide[] = Array.isArray(ridesRes.data)
    ? ridesRes.data.map((ride) => {
        const row = ride as Record<string, unknown>;
        const driverRow = row.driver_id ? driversMap[row.driver_id as string] : null;
        const driverVehicles = driverRow?.driver_vehicles;
        const vehicleNo = Array.isArray(driverVehicles) && driverVehicles.length > 0
          ? driverVehicles[0].vehicle_number
          : null;

        return {
          id: String(row.id ?? ""),
          status: String(row.status ?? "unknown"),
          fare: toNumber(row.fare),
          rideType: pickLabel(row.ride_type, row.rideType),
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
          pickupLat: toNumber(row.pickup_lat),
          pickupLng: toNumber(row.pickup_lng),
          destinationLat: toNumber(row.destination_lat),
          destinationLng: toNumber(row.destination_lng),
          currentLat: toNumber(row.current_lat),
          currentLng: toNumber(row.current_lng),
          driver: driverRow ? {
            name: typeof driverRow.name === "string" ? driverRow.name : null,
            rating: toNumber(driverRow.rating),
            vehicle: typeof driverRow.vehicle_type === "string" ? driverRow.vehicle_type : null,
            plate: vehicleNo,
            trusted: Boolean(driverRow.is_approved),
            color: null,
          } : null,
        };
      })
    : [];

  const driversRes = await supabase
    .from("drivers")
    .select("user_id, name:full_name, rating, vehicle_type, is_approved, is_available, driver_vehicles(vehicle_number)")
    .eq("is_available", true)
    .eq("is_approved", true)
    .limit(6);

  const drivers: StudentDriver[] = Array.isArray(driversRes.data)
    ? driversRes.data.map((driver) => {
        const row = driver as Record<string, unknown>;
        const driverVehicles = row.driver_vehicles;
        const vehicleNo = Array.isArray(driverVehicles) && driverVehicles.length > 0
          ? (driverVehicles[0] as Record<string, unknown>).vehicle_number
          : null;

        return {
          id: String(row.user_id ?? ""),
          name: typeof row.name === "string" ? row.name : null,
          rating: toNumber(row.rating),
          vehicleType: typeof row.vehicle_type === "string" ? row.vehicle_type : null,
          vehicleNo: typeof vehicleNo === "string" ? vehicleNo : null,
          isTrusted: Boolean(row.is_approved),
        };
      })
    : [];

  const transactionsRes = await supabase
    .from("ride_payments")
    .select("id, amount, ride_id, created_at, payment_method, payment_status, rides!inner (student_id)")
    .eq("rides.student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(25);

  const transactions: StudentTransaction[] = Array.isArray(transactionsRes.data)
    ? transactionsRes.data.map((txn) => {
        const row = txn as Record<string, unknown>;
        const amountValue = toNumber(row.amount);
        return {
          id: String(row.id ?? ""),
          amount: amountValue === null ? null : -Math.abs(amountValue),
          type: "ride",
          rideId: typeof row.ride_id === "string" ? row.ride_id : null,
          createdAt: typeof row.created_at === "string" ? row.created_at : null,
        };
      })
    : [];

  const response: StudentApiResponse = {
    user: userSummary,
    profile,
    rides,
    drivers,
    transactions,
  };

  return NextResponse.json(response);
}
