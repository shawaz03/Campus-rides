export type RideType = "bike" | "auto" | "cab" | "shared";

export const rideTypeInfo: Record<
  RideType,
  {
    label: string;
    blurb: string;
    perKm: number;
    base: number;
    eta: string;
    color: string;
  }
> = {
  bike: { label: "Bike", blurb: "Solo & speedy", perKm: 8, base: 18, eta: "3 min", color: "#FFD23F" },
  auto: { label: "Auto", blurb: "Classic & cheap", perKm: 14, base: 28, eta: "5 min", color: "#FF5A36" },
  cab: { label: "Cab", blurb: "Comfy & spacious", perKm: 22, base: 60, eta: "7 min", color: "#5BC0EB" },
  shared: { label: "Pool", blurb: "Split the fare", perKm: 9, base: 22, eta: "8 min", color: "#7BC950" },
};

export const DEFAULT_CENTER: [number, number] = [78.4867, 17.385];

export const campusPlaces = [
  { id: "p1", name: "Main Gate, St. Xavier's", coords: [78.4867, 17.385] as [number, number] },
  { id: "p2", name: "Hostel Block C", coords: [78.4892, 17.388] as [number, number] },
  { id: "p3", name: "Library Side Gate", coords: [78.4845, 17.387] as [number, number] },
  { id: "p4", name: "Secunderabad Station", coords: [78.5006, 17.435] as [number, number] },
  { id: "p5", name: "Inorbit Mall, Madhapur", coords: [78.3833, 17.435] as [number, number] },
  { id: "p6", name: "RGIA Airport", coords: [78.4294, 17.231] as [number, number] },
  { id: "p7", name: "Hi-Tech City MMTS", coords: [78.382, 17.444] as [number, number] },
  { id: "p8", name: "Charminar Bus Stop", coords: [78.474, 17.361] as [number, number] },
];
