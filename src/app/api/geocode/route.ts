import { NextResponse } from "next/server";

type GeocodeResult = {
  name: string;
  coords: [number, number];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    limit: "6",
    addressdetails: "0",
  });

  const email = process.env.NOMINATIM_EMAIL;
  if (email) {
    params.set("email", email);
  }

  const userAgent = email
    ? `CampusRidesDemo/1.0 (${email})`
    : "CampusRidesDemo/1.0";

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        "User-Agent": userAgent,
        "Accept-Language": "en",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return NextResponse.json({ results: [] });
  }

  const data = (await res.json()) as Array<{
    display_name?: string;
    lat?: string;
    lon?: string;
  }>;

  const results: GeocodeResult[] = Array.isArray(data)
    ? data
        .map((item) => {
          const name = item.display_name ?? "";
          const lat = Number(item.lat);
          const lon = Number(item.lon);
          if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) {
            return null;
          }
          return { name, coords: [lon, lat] as [number, number] };
        })
        .filter((item): item is GeocodeResult => Boolean(item))
    : [];

  return NextResponse.json({ results });
}
