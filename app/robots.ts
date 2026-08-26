import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://wds-msit.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/hub", "/hub/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
