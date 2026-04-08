import { Metadata } from "next";

export type SEOConfig = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
};

export function generateSEOMetadata(config: SEOConfig, defaults?: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard = "summary_large_image",
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl,
    noindex = false,
    nofollow = false,
  } = { ...defaults, ...config };

  const metadata: Metadata = {
    title: title || defaults?.title || "KSO Chandigarh Portal",
    description: description || defaults?.description || "",
  };

  // Keywords
  if (keywords) {
    metadata.keywords = keywords;
  }

  // Robots
  if (noindex || nofollow) {
    metadata.robots = {
      index: !noindex,
      follow: !nofollow,
    };
  }

  // Open Graph
  metadata.openGraph = {
    title: ogTitle || title || defaults?.title,
    description: ogDescription || description || defaults?.description,
    images: ogImage ? [{ url: ogImage }] : undefined,
    type: "website",
  };

  // Twitter
  metadata.twitter = {
    card: twitterCard,
    title: twitterTitle || ogTitle || title || defaults?.title,
    description: twitterDescription || ogDescription || description || defaults?.description,
    images: twitterImage || ogImage ? [twitterImage || ogImage || ""] : undefined,
  };

  // Canonical URL
  if (canonicalUrl) {
    metadata.alternates = {
      canonical: canonicalUrl,
    };
  }

  return metadata;
}

export function generateStructuredData(type: "Organization" | "WebPage", data: Record<string, unknown>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ksochd.org";

  if (type === "Organization") {
    return {
      "@context": "https://schema.org",
      "@type": data.type || "Organization",
      name: data.name,
      url: baseUrl,
      logo: data.logo,
      description: data.description,
      sameAs: data.sameAs || [],
    };
  }

  if (type === "WebPage") {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: data.name,
      description: data.description,
      url: data.url || baseUrl,
      inLanguage: data.inLanguage || "en",
      isPartOf: {
        "@type": "WebSite",
        name: data.siteName || "KSO Chandigarh Portal",
        url: baseUrl,
      },
    };
  }

  return data;
}
