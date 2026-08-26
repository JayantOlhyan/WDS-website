import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wds-msit.vercel.app";
  const lastModified = new Date();

  const routes = [
    "",
    "/about",
    "/projects",
    "/opportunities",
    "/recruitment",
    "/recruitment/apply",
    "/terminal",
    "/team",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" || route.startsWith("/recruitment") ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/recruitment" || route === "/projects" ? 0.9 : 0.8,
  }));
}
