import { useQuery } from "@tanstack/react-query";
import type { StudentApiResponse } from "@/lib/student-types";

async function fetchStudent(): Promise<StudentApiResponse | null> {
  const res = await fetch("/api/student", { cache: "no-store" });
  if (res.status === 401) return null;
  if (!res.ok) {
    throw new Error("Failed to load student data");
  }
  return res.json();
}

export function useStudent() {
  return useQuery({
    queryKey: ["student-data"],
    queryFn: fetchStudent,
    refetchInterval: 3000,
  });
}
