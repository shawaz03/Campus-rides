import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import { LenisProvider } from "@/components/lenis-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Campus Rides — Login or Sign Up",
  description:
    "Sign in to your Campus Rides account or create a new one to start booking rides across campus.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${spaceGrotesk.variable} ${syne.variable}`}>
      <LenisProvider>{children}</LenisProvider>
    </div>
  );
}
