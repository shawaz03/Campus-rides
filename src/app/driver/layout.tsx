import type { ReactNode } from "react";

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="grain min-h-screen relative"
      style={{ background: "#FDF6E3", color: "#1B1B1F" }}
      data-testid="driver-shell"
    >
      {children}
    </div>
  );
}
