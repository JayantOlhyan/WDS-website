import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wds-msit.org";
  const routes = [
    "",
    "/about",
    "/projects",
    "/opportunities",
    "/recruitment",
    "/recruitment/apply",
    "/terminal",
    "/hub",
    "/team",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/recruitment" || route === "/recruitment/apply" ? 0.9 : 0.8,
  }));
}
