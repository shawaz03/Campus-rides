import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user session
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized on server (no user session in cookies)" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await req.json().catch(() => ({}));
    const { latitude, longitude } = body;

    // 3. Create SOS alert row
    const { data: alertData, error: alertErr } = await supabase
      .from("sos_alerts")
      .insert({
        student_id: user.id,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        status: "active",
      })
      .select()
      .single();

    if (alertErr) {
      console.error("Failed to insert SOS alert:", alertErr);
      return NextResponse.json({ error: alertErr.message }, { status: 500 });
    }

    // 4. If student has an active or requested ride, mark it as emergency
    await supabase
      .from("rides")
      .update({ is_emergency: true })
      .eq("student_id", user.id)
      .in("status", ["requested", "active"]);

    return NextResponse.json({ success: true, alert: alertData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized on server (no user session in cookies)" },
        { status: 401 }
      );
    }

    // 2. Parse body
    const body = await req.json().catch(() => ({}));
    const { alertId } = body;

    if (!alertId) {
      return NextResponse.json({ error: "Missing alertId parameter" }, { status: 400 });
    }

    // 3. Update SOS alert to resolved
    const { error: alertErr } = await supabase
      .from("sos_alerts")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", alertId)
      .eq("student_id", user.id);

    if (alertErr) {
      console.error("Failed to resolve SOS alert:", alertErr);
      return NextResponse.json({ error: alertErr.message }, { status: 500 });
    }

    // 4. Reset active rides emergency flag
    await supabase
      .from("rides")
      .update({ is_emergency: false })
      .eq("student_id", user.id)
      .in("status", ["requested", "active"]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
