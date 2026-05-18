"use client";

import { create } from "zustand";
import type { RideType } from "./ride-data";

interface BookingState {
  pickup: { name: string; coords: [number, number] } | null;
  destination: { name: string; coords: [number, number] } | null;
  rideType: RideType;
  scheduled: boolean;
  scheduledFor: string;
  setPickup: (p: BookingState["pickup"]) => void;
  setDestination: (d: BookingState["destination"]) => void;
  setRideType: (t: RideType) => void;
  setScheduled: (s: boolean) => void;
  setScheduledFor: (s: string) => void;
  swap: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  pickup: null,
  destination: null,
  rideType: "auto",
  scheduled: false,
  scheduledFor: "",
  setPickup: (p) => set({ pickup: p }),
  setDestination: (d) => set({ destination: d }),
  setRideType: (t) => set({ rideType: t }),
  setScheduled: (s) => set({ scheduled: s }),
  setScheduledFor: (s) => set({ scheduledFor: s }),
  swap: () => {
    const { pickup, destination } = get();
    set({ pickup: destination, destination: pickup });
  },
  reset: () =>
    set({
      pickup: null,
      destination: null,
      rideType: "auto",
      scheduled: false,
      scheduledFor: "",
    }),
}));
