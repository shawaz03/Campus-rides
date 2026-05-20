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
      "id, user_id, name, email, college_id, coins_balance, ride_streak, emergency_contact, trusted_drivers"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profileRes.error && profileRes.data) {
    const row = profileRes.data as Record<string, unknown>;
    const trustedDrivers = Array.isArray(row.trusted_drivers)
      ? row.trusted_drivers.map((item) => String(item))
      : null;

    profile = {
      id: String(row.user_id ?? row.id ?? user.id),
      name: typeof row.name === "string" ? row.name : null,
      email: typeof row.email === "string" ? row.email : null,
      collegeId: (row.college_id as string | number | null | undefined) ?? null,
      coinsBalance: toNumber(row.coins_balance),
      rideStreak: toNumber(row.ride_streak),
      emergencyContact: normalizeEmergencyContact(row.emergency_contact),
      trustedDrivers,
    };
  }

  const ridesRes = await supabase
    .from("rides")
    .select(
      "id, status, fare, ride_type, pickup_label, destination_label, distance_km, duration_min, scheduled_at, completed_at, created_at"
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(40);

  const rides: StudentRide[] = Array.isArray(ridesRes.data)
    ? ridesRes.data.map((ride) => {
        const row = ride as Record<string, unknown>;
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
        };
      })
    : [];

  const driversRes = await supabase
    .from("drivers")
    .select("id, name, rating, vehicle_type, vehicle_no, is_approved, is_available")
    .eq("is_available", true)
    .eq("is_approved", true)
    .limit(6);

  const drivers: StudentDriver[] = Array.isArray(driversRes.data)
    ? driversRes.data.map((driver) => {
        const row = driver as Record<string, unknown>;
        return {
          id: String(row.id ?? ""),
          name: typeof row.name === "string" ? row.name : null,
          rating: toNumber(row.rating),
          vehicleType: typeof row.vehicle_type === "string" ? row.vehicle_type : null,
          vehicleNo: typeof row.vehicle_no === "string" ? row.vehicle_no : null,
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
