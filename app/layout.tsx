import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GTMScript, GTMNoScript } from "@/components/seo/GoogleTagManager";

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

export const metadata: Metadata = {
  title: "KSO Chandigarh Portal",
  description:
    "Single-stream portal for Kuki Students Organisation (Chandigarh) members, admins, and guests.",
  applicationName: "KSO Chandigarh Portal",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KSO Portal",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "KSO Chandigarh Portal",
    title: "KSO Chandigarh Portal",
    description:
      "Single-stream portal for Kuki Students Organisation (Chandigarh) members, admins, and guests.",
  },
  twitter: {
    card: "summary",
    title: "KSO Chandigarh Portal",
    description:
      "Single-stream portal for Kuki Students Organisation (Chandigarh) members, admins, and guests.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5a6" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

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
