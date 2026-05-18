export type StudentUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

export type StudentProfile = {
  id: string;
  name: string | null;
  email: string | null;
  collegeId: string | number | null;
  coinsBalance: number | null;
  rideStreak: number | null;
  emergencyContact: unknown;
  trustedDrivers: string[] | null;
  favouriteRide?: string | null;
};

export type StudentRide = {
  id: string;
  status: string;
  fare: number | null;
  rideType: string | null;
  pickupLabel: string | null;
  destinationLabel: string | null;
  distanceLabel: string | null;
  durationLabel: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  driver?: {
    name: string | null;
    rating: number | null;
    vehicle: string | null;
    plate: string | null;
    trusted: boolean;
    color: string | null;
  } | null;
};

export type StudentDriver = {
  id: string;
  name: string | null;
  rating: number | null;
  vehicleType: string | null;
  vehicleNo: string | null;
  isTrusted: boolean;
};

export type StudentTransaction = {
  id: string;
  amount: number | null;
  type: string | null;
  rideId: string | null;
  createdAt: string | null;
};

export type StudentApiResponse = {
  user: StudentUser;
  profile: StudentProfile | null;
  rides: StudentRide[];
  drivers: StudentDriver[];
  transactions: StudentTransaction[];
};
