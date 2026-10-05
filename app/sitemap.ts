import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://archai-website-navy.vercel.app";

  const locales = ["en", "ar"];

  const routes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/blog",
    "/services/software",
    "/services/embedded",
    "/services/ai",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      let priority = 0.8;
      if (route === "") priority = 1.0;
      else if (route.includes("/services/")) priority = 0.7;

      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority,
      });
    });
  });

  return sitemapEntries;
}