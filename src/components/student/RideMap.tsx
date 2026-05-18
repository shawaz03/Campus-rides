"use client";

import { useEffect, useRef } from "react";
import { DEFAULT_CENTER } from "@/lib/ride-data";

interface RideMapProps {
  pickup: { name: string; coords: [number, number] } | null;
  destination: { name: string; coords: [number, number] } | null;
  center?: [number, number];
}

export default function RideMap({ pickup, destination, center = DEFAULT_CENTER }: RideMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<boolean>(false);

  useEffect(() => {
    let maplibre: any;
    let map: any;

    async function initMap() {
      if (!containerRef.current) return;
      // Dynamically import to avoid SSR issues
      maplibre = await import("maplibre-gl");

      if (mapRef.current) return; // already initialized

      map = new maplibre.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            "carto-light": {
              type: "raster",
              tiles: [
                "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
                "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
                "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: "© OpenStreetMap © CARTO",
            },
          },
          layers: [
            {
              id: "background",
              type: "raster",
              source: "carto-light",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
        center: center,
        zoom: 12,
      });

      mapRef.current = map;

      // Add nav controls
      map.addControl(new maplibre.NavigationControl(), "top-right");

      // Add route source (empty to start)
      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", geometry: { type: "LineString", coordinates: [] }, properties: {} },
        });

        // Dashed animated route line
        map.addLayer({
          id: "route-dashed",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#1B1B1F",
            "line-width": 4,
            "line-dasharray": [0, 2, 1],
          },
        });

        // Animated dash
        let step = 0;
        const dashPatterns = [
          [0, 4, 3],
          [0.5, 4, 2.5],
          [1, 4, 2],
          [1.5, 4, 1.5],
          [2, 4, 1],
          [2.5, 4, 0.5],
          [3, 4, 0],
          [0, 3, 3],
        ];
        const animateDash = () => {
          if (!mapRef.current) return;
          const pattern = dashPatterns[step % dashPatterns.length];
          if (map.getLayer("route-dashed")) {
            map.setPaintProperty("route-dashed", "line-dasharray", pattern);
          }
          step++;
          requestAnimationFrame(animateDash);
        };
        animateDash();

        routeLayerRef.current = true;
      });
    }

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        routeLayerRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers and route whenever pickup/destination changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const addMarker = async (coords: [number, number], letter: string, color: string) => {
      const maplibre = await import("maplibre-gl");
      const el = document.createElement("div");
      el.style.cssText = `
        width: 36px; height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2.5px solid #1B1B1F;
        background: ${color};
        box-shadow: 3px 3px 0 #1B1B1F;
        display: grid; place-items: center;
      `;
      const inner = document.createElement("span");
      inner.style.cssText = `
        transform: rotate(45deg);
        font-family: 'Permanent Marker', cursive;
        font-size: 14px;
        color: #1B1B1F;
      `;
      inner.textContent = letter;
      el.appendChild(inner);

      const marker = new maplibre.Marker({ element: el, anchor: "bottom" })
        .setLngLat(coords)
        .addTo(map);
      markersRef.current.push(marker);
    };

    const updateRoute = (coords: [number, number][]) => {
      if (!routeLayerRef.current) return;
      const source = map.getSource("route");
      if (source) {
        source.setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: coords },
          properties: {},
        });
      }
    };

    const fitBounds = (coords: [number, number][]) => {
      if (coords.length < 2) return;
      const lngs = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 80, duration: 700 }
      );
    };

    if (pickup) {
      addMarker(pickup.coords, "A", "#7BC950");
    }
    if (destination) {
      addMarker(destination.coords, "B", "#FF5A36");
    }

    if (pickup && destination) {
      const coords = [pickup.coords, destination.coords];
      updateRoute(coords);
      fitBounds(coords);
    } else {
      updateRoute([]);
    }
  }, [pickup, destination]);

  return (
    <div className="relative w-full h-full rounded-[28px_10px_24px_12px/12px_24px_10px_28px] overflow-hidden border-[2.5px] border-ink" style={{ boxShadow: "6px 6px 0 #1B1B1F" }}>
      <div ref={containerRef} className="w-full h-full" />
      {!pickup && !destination && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="bg-cream/90 border-[2px] border-ink rounded-[18px_6px_18px_8px/8px_18px_6px_18px] px-4 py-2 text-center" style={{ boxShadow: "3px 3px 0 #1B1B1F" }}>
            <p className="font-scribble text-xl text-tomato">pick a start & end ↑</p>
            <p className="font-hand text-base text-ink/70">the route will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}
