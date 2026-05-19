import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const normalizeText = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown> | null = null;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const pickupLabel = normalizeText(payload.pickupLabel);
  const destinationLabel = normalizeText(payload.destinationLabel);
  const rideType = normalizeText(payload.rideType);
  const paymentMethod = normalizeText(payload.paymentMethod);
  const distanceKm = toNumber(payload.distanceKm);
  const durationMin = toNumber(payload.durationMin);
  const fare = toNumber(payload.fare);
  const scheduledAt = normalizeText(payload.scheduledAt) ?? null;

  if (!pickupLabel || !destinationLabel || !rideType || !paymentMethod) {
    return NextResponse.json({ error: "Missing ride details" }, { status: 400 });
  }

  if (distanceKm === null || durationMin === null || fare === null) {
    return NextResponse.json({ error: "Invalid ride metrics" }, { status: 400 });
  }

  if (paymentMethod !== "cash" && paymentMethod !== "upi") {
    return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
  }

  const platformFee = Math.round(fare * 0.1 * 100) / 100;
  const driverAmount = Math.round((fare - platformFee) * 100) / 100;

  const rideInsert = {
    student_id: user.id,
    status: "requested",
    ride_type: rideType,
    vehicle_type: rideType,
    pickup_label: pickupLabel,
    destination_label: destinationLabel,
    distance_km: distanceKm,
    duration_min: durationMin,
    fare,
    scheduled_at: scheduledAt,
  };

  const { data: rideData, error: rideError } = await supabase
    .from("rides")
    .insert(rideInsert)
    .select("id")
    .single();

  if (rideError || !rideData) {
    return NextResponse.json(
      { error: rideError?.message ?? "Could not create ride" },
      { status: 400 }
    );
  }

  const paymentInsert = {
    ride_id: rideData.id,
    amount: fare,
    platform_fee: platformFee,
    driver_amount: driverAmount,
    payment_method: paymentMethod,
    payment_status: "paid",
    paid_at: new Date().toISOString(),
  };

  const { error: paymentError } = await supabase.from("ride_payments").insert(paymentInsert);

  if (paymentError) {
    await supabase.from("rides").delete().eq("id", rideData.id);
    return NextResponse.json(
      { error: paymentError.message ?? "Could not capture payment" },
      { status: 400 }
    );
  }

  return NextResponse.json({ rideId: rideData.id });
}
