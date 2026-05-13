// Mock data for the Student section.
// Replace these with Supabase queries when wiring the backend.

export type RideType = "bike" | "auto" | "cab" | "shared";

export interface MockRide {
  id: string;
  pickup: string;
  destination: string;
  rideType: RideType;
  fare: number;
  distance: string;
  duration: string;
  status: "active" | "scheduled" | "completed" | "cancelled";
  scheduledAt?: string;
  completedAt?: string;
  driver?: {
    name: string;
    rating: number;
    vehicle: string;
    plate: string;
    trusted: boolean;
    color: string;
  };
}

export const mockStudent = {
  id: "stu_001",
  name: "Riya Sharma",
  email: "riya.s@yourcollege.edu",
  college: "St. Xavier's College, Hyderabad",
  studentId: "SX-22B-0418",
  year: "2nd Year",
  branch: "B.Sc Computer Science",
  phone: "+91 98765 43210",
  avatarColor: "#FF5A36",
  favouriteRide: "auto" as RideType,
  trustedDrivers: 8,
  totalRides: 47,
  walletBalance: 285,
  emergencyContact: {
    name: "Mom",
    phone: "+91 98123 99887",
  },
};

export const mockDrivers = [
  { id: "d1", name: "Sundar K.", rating: 4.9, vehicle: "Honda Activa", plate: "TS 09 X 1124", trusted: true, color: "#FFD23F", eta: 3, ride: "bike" },
  { id: "d2", name: "Mahesh R.", rating: 4.8, vehicle: "Bajaj RE Auto", plate: "TS 07 B 7798", trusted: true, color: "#5BC0EB", eta: 5, ride: "auto" },
  { id: "d3", name: "Pooja V.", rating: 5.0, vehicle: "WagonR", plate: "TS 13 W 0021", trusted: true, color: "#7BC950", eta: 7, ride: "cab" },
  { id: "d4", name: "Kiran A.", rating: 4.7, vehicle: "TVS Jupiter", plate: "TS 08 J 4412", trusted: false, color: "#9B5DE5", eta: 9, ride: "bike" },
];

export const mockRides: MockRide[] = [
  {
    id: "r_act_01",
    pickup: "Main Gate, St. Xavier's College",
    destination: "Secunderabad Railway Station",
    rideType: "auto",
    fare: 142,
    distance: "6.4 km",
    duration: "18 min",
    status: "active",
    driver: { name: "Mahesh R.", rating: 4.8, vehicle: "Bajaj RE Auto", plate: "TS 07 B 7798", trusted: true, color: "#5BC0EB" },
  },
  {
    id: "r_sch_01",
    pickup: "Hostel Block C",
    destination: "RGIA Airport, Shamshabad",
    rideType: "cab",
    fare: 760,
    distance: "32 km",
    duration: "55 min",
    status: "scheduled",
    scheduledAt: "Sat, 18 Jan • 5:30 AM",
    driver: { name: "Pooja V.", rating: 5.0, vehicle: "WagonR", plate: "TS 13 W 0021", trusted: true, color: "#7BC950" },
  },
  {
    id: "r_sch_02",
    pickup: "Library Side Gate",
    destination: "Inorbit Mall, Madhapur",
    rideType: "shared",
    fare: 78,
    distance: "8.1 km",
    duration: "24 min",
    status: "scheduled",
    scheduledAt: "Sun, 19 Jan • 4:00 PM",
  },
  {
    id: "r_done_01",
    pickup: "Main Gate, St. Xavier's College",
    destination: "Charminar Bus Stop",
    rideType: "auto",
    fare: 95,
    distance: "4.2 km",
    duration: "14 min",
    status: "completed",
    completedAt: "Yesterday • 7:42 PM",
    driver: { name: "Sundar K.", rating: 4.9, vehicle: "Honda Activa", plate: "TS 09 X 1124", trusted: true, color: "#FFD23F" },
  },
  {
    id: "r_done_02",
    pickup: "Hostel Block C",
    destination: "Hi-Tech City MMTS",
    rideType: "shared",
    fare: 42,
    distance: "9.6 km",
    duration: "26 min",
    status: "completed",
    completedAt: "11 Jan • 9:10 AM",
    driver: { name: "Sundar K.", rating: 4.9, vehicle: "Honda Activa", plate: "TS 09 X 1124", trusted: true, color: "#FFD23F" },
  },
  {
    id: "r_done_03",
    pickup: "Banjara Hills Rd. 12",
    destination: "Main Gate, St. Xavier's",
    rideType: "cab",
    fare: 320,
    distance: "14.8 km",
    duration: "38 min",
    status: "completed",
    completedAt: "06 Jan • 11:55 PM",
    driver: { name: "Pooja V.", rating: 5.0, vehicle: "WagonR", plate: "TS 13 W 0021", trusted: true, color: "#7BC950" },
  },
];

export const mockTransactions = [
  { id: "t1", kind: "ride" as const, label: "Auto • Secunderabad station", amount: -142, date: "Today" },
  { id: "t2", kind: "topup" as const, label: "Wallet top-up — UPI", amount: 500, date: "Today" },
  { id: "t3", kind: "ride" as const, label: "Auto • Charminar", amount: -95, date: "Yesterday" },
  { id: "t4", kind: "ride" as const, label: "Shared pool • Hi-Tech City", amount: -42, date: "11 Jan" },
  { id: "t5", kind: "refund" as const, label: "Refund • cancelled cab", amount: 60, date: "09 Jan" },
  { id: "t6", kind: "ride" as const, label: "Cab • Banjara Hills", amount: -320, date: "06 Jan" },
];

export const rideTypeInfo: Record<RideType, {
  label: string;
  blurb: string;
  perKm: number;
  base: number;
  eta: string;
  color: string;
}> = {
  bike: { label: "Bike", blurb: "Solo & speedy", perKm: 8, base: 18, eta: "3 min", color: "#FFD23F" },
  auto: { label: "Auto", blurb: "Classic & cheap", perKm: 14, base: 28, eta: "5 min", color: "#FF5A36" },
  cab: { label: "Cab", blurb: "Comfy & spacious", perKm: 22, base: 60, eta: "7 min", color: "#5BC0EB" },
  shared: { label: "Pool", blurb: "Split the fare", perKm: 9, base: 22, eta: "8 min", color: "#7BC950" },
};

// Hyderabad area — used as default centre for the map.
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
