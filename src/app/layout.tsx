import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Gaegu,
  Geist,
  Geist_Mono,
  Patrick_Hand,
  Permanent_Marker,
  Space_Grotesk,
  Syne,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const gaegu = Gaegu({
  variable: "--font-gaegu",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FDF6E3",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://campus-rides.com"),
  title: "CAMPUS RIDES — Smart College Carpools & Shared Rides",
  description: "Share the road, split the cost, and make your campus commute friendly and easy with Campus Rides. Safe, peer-to-peer student ridesharing.",
  keywords: [
    "bike ride for students",
    "college transport app",
    "campus carpool",
    "campus rideshare",
    "university carpooling",
    "student ride sharing",
    "safe campus commute",
    "split ride cost college",
    "campus travel",
    "student commuting",
    "campus ride sharing app",
    "peer to peer student transit"
  ],
  openGraph: {
    title: "CAMPUS RIDES — Smart College Carpools & Shared Rides",
    description: "Share the road, split the cost, and make your campus commute friendly and easy with Campus Rides. Safe, peer-to-peer student ridesharing.",
    url: "https://campus-rides.com",
    siteName: "Campus Rides",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Campus Rides Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAMPUS RIDES — Smart College Carpools & Shared Rides",
    description: "Share the road, split the cost, and make your campus commute friendly and easy with Campus Rides. Safe, peer-to-peer student ridesharing.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png?v=3",
    apple: "/icon.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${spaceGrotesk.variable} ${caveat.variable} ${patrickHand.variable} ${permanentMarker.variable} ${gaegu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
