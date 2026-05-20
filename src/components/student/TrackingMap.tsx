"use client";

import { useEffect, useRef } from "react";
import { DEFAULT_CENTER } from "@/lib/ride-data";

interface TrackingMapProps {
  pickup: { name: string; coords: [number, number] } | null;
  destination: { name: string; coords: [number, number] } | null;
  currentCoords: [number, number] | null;
  rideType?: string | null;
}

export default function TrackingMap({
  pickup,
  destination,
  currentCoords,
  rideType = "bike",
}: TrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ pickup?: any; destination?: any; vehicle?: any }>({});
  const routeLayerRef = useRef<boolean>(false);

  // Initialize Map
  useEffect(() => {
    let maplibre: any;
    let map: any;

    async function initMap() {
      if (!containerRef.current) return;
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
        center: currentCoords || pickup?.coords || DEFAULT_CENTER,
        zoom: 14,
      });

      mapRef.current = map;
      map.addControl(new maplibre.NavigationControl(), "top-right");

      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [] },
            properties: {},
          },
        });

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

  // Update Markers & Route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const setupMarkersAndRoute = async () => {
      const maplibre = await import("maplibre-gl");

      // 1. Pickup Marker
      if (pickup && !markersRef.current.pickup) {
        const el = document.createElement("div");
        el.style.cssText = `
          width: 32px; height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid #1B1B1F;
          background: #7BC950;
          box-shadow: 2px 2px 0 #1B1B1F;
          display: grid; place-items: center;
        `;
        const inner = document.createElement("span");
        inner.style.cssText = "transform: rotate(45deg); font-family: 'Permanent Marker', sans-serif; font-size: 12px; color: #1B1B1F;";
        inner.textContent = "A";
        el.appendChild(inner);

        markersRef.current.pickup = new maplibre.Marker({ element: el, anchor: "bottom" })
          .setLngLat(pickup.coords)
          .addTo(map);
      }

      // 2. Destination Marker
      if (destination && !markersRef.current.destination) {
        const el = document.createElement("div");
        el.style.cssText = `
          width: 32px; height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid #1B1B1F;
          background: #FF5A36;
          box-shadow: 2px 2px 0 #1B1B1F;
          display: grid; place-items: center;
        `;
        const inner = document.createElement("span");
        inner.style.cssText = "transform: rotate(45deg); font-family: 'Permanent Marker', sans-serif; font-size: 12px; color: #1B1B1F;";
        inner.textContent = "B";
        el.appendChild(inner);

        markersRef.current.destination = new maplibre.Marker({ element: el, anchor: "bottom" })
          .setLngLat(destination.coords)
          .addTo(map);
      }

      // 3. Vehicle Marker
      const emoji = rideType === "cab" ? "🚗" : rideType === "auto" ? "🛺" : "🛵";
      const vehicleColor = rideType === "cab" ? "#FFD23F" : rideType === "auto" ? "#9B5DE5" : "#5BC0EB";

      if (currentCoords) {
        if (!markersRef.current.vehicle) {
          const el = document.createElement("div");
          el.style.cssText = `
            width: 44px; height: 44px;
            border-radius: 50%;
            border: 2.5px solid #1B1B1F;
            background: ${vehicleColor};
            box-shadow: 3px 3px 0 #1B1B1F;
            display: grid; place-items: center;
            font-size: 20px;
            position: relative;
          `;
          
          // Pulsing locator dot inside vehicle marker
          const pulse = document.createElement("div");
          pulse.style.cssText = `
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 2px solid ${vehicleColor};
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          `;
          el.appendChild(pulse);

          const emojiEl = document.createElement("span");
          emojiEl.textContent = emoji;
          el.appendChild(emojiEl);

          markersRef.current.vehicle = new maplibre.Marker({ element: el })
            .setLngLat(currentCoords)
            .addTo(map);
        } else {
          markersRef.current.vehicle.setLngLat(currentCoords);
        }
      }

      // 4. Update Route Line
      if (pickup && destination && routeLayerRef.current) {
        const source = map.getSource("route");
        if (source) {
          source.setData({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [pickup.coords, destination.coords],
            },
            properties: {},
          });
        }
      }

      // 5. Fit bounds to keep everything in view
      if (pickup && destination) {
        const boundsCoords = [pickup.coords, destination.coords];
        if (currentCoords) boundsCoords.push(currentCoords);

        const lngs = boundsCoords.map((c) => c[0]);
        const lats = boundsCoords.map((c) => c[1]);
        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 80, duration: 600 }
        );
      }
    };

    setupMarkersAndRoute();
  }, [pickup, destination, currentCoords, rideType]);

  return (
    <div
      className="relative w-full h-full rounded-[28px_10px_24px_12px/12px_24px_10px_28px] overflow-hidden border-[2.5px] border-ink bg-cream"
      style={{ boxShadow: "8px 8px 0 #1B1B1F" }}
    >
      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
