import { config } from "@/config/index";
import type { Metadata } from "next";

interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}

export function createMetadata(options: SeoOptions = {}): Metadata {
  const {
    title,
    description = config.app.description,
    image = "/og-image.png",
    url,
    noIndex = false,
  } = options;

  const fullTitle = title ? `${title} | ${config.app.name}` : config.app.name;
  const fullUrl = url ? `${config.app.url}${url}` : config.app.url;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(config.app.url),
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: config.app.name,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
