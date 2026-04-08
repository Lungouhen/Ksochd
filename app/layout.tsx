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
