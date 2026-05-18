import type { StudentProfile, StudentUser } from "@/lib/student-types";

const AVATAR_COLORS = ["#FF5A36", "#FFD23F", "#5BC0EB", "#7BC950", "#9B5DE5", "#FFB4A2"];

export function getDisplayName(user: StudentUser | null | undefined, profile: StudentProfile | null | undefined) {
  const profileName = profile?.name?.trim();
  if (profileName) return profileName;
  const userName = user?.name?.trim();
  if (userName) return userName;
  if (user?.email) {
    const emailPrefix = user.email.split("@")[0];
    if (emailPrefix) return emailPrefix;
  }
  return "Student";
}

export function getFirstName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "Student";
  const parts = trimmed.split(/\s+/);
  return parts[0] ?? trimmed;
}

export function getInitials(name: string, email?: string | null) {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "S";
  }
  if (email) {
    return email[0]?.toUpperCase() ?? "S";
  }
  return "S";
}

export function getAvatarColor(seed?: string | null) {
  const value = seed?.trim() || "campus";
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function parseEmergencyContact(value: StudentProfile["emergencyContact"]) {
  if (!value) return { name: null, phone: null };
  if (typeof value === "string") {
    return { name: value, phone: null };
  }
  if (typeof value === "object") {
    const record = value as { name?: string; phone?: string };
    return { name: record.name ?? null, phone: record.phone ?? null };
  }
  return { name: null, phone: null };
}
