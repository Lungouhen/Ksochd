import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GTMScript, GTMNoScript } from "@/components/seo/GoogleTagManager";
import { getSiteSettings } from "@/server/services/settings.service";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    applicationName: settings.siteName,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: settings.siteName,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      title: settings.siteName,
      description: settings.siteDescription,
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.siteDescription,
      images: settings.twitterImageUrl
        ? [settings.twitterImageUrl]
        : undefined,
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
      userScalable: true,
    },
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: settings.primaryColor },
      { media: "(prefers-color-scheme: dark)", color: "#030712" },
    ],
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: settings.faviconUrl, sizes: "any" },
        { url: settings.icon192Url, sizes: "192x192", type: "image/png" },
        { url: settings.icon512Url, sizes: "512x512", type: "image/png" },
      ],
      apple: [
        {
          url: settings.appleTouchIconUrl,
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
  };
}

// GTM Container ID - should be loaded from settings in production
const GTM_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-50 flex flex-col">
        {GTM_ID && <GTMScript containerId={GTM_ID} />}
        {GTM_ID && <GTMNoScript containerId={GTM_ID} />}
        {children}
      </body>
    </html>
  );
}
