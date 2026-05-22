import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/driver/dashboard",
        "/student/book",
        "/student/activity",
        "/student/profile",
        "/student/wallet",
        "/track/",
      ],
    },
    sitemap: "https://campus-rides.com/sitemap.xml",
  };
}
