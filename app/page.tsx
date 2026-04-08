import Link from "next/link";
import type { Metadata } from "next";
import { Pill } from "@/components/ui/pill";
import { getSiteSettings } from "@/server/services/settings.service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Home",
    description: settings.siteDescription,
    openGraph: {
      title: settings.siteName,
      description: settings.siteDescription,
      type: "website",
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.siteDescription,
      images: settings.twitterImageUrl ? [settings.twitterImageUrl] : undefined,
    },
  };
}

export default function PublicHome() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
      <header className="glass-panel relative overflow-hidden border-white/15 px-8 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-amber-300/10" />
        <div className="relative flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <Pill label="KSO Chandigarh" tone="teal" />
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Kuki Students' Organisation, Chandigarh
          </h1>
          <p className="max-w-3xl text-lg text-slate-200/85">
            Welcome to the official portal of KSO Chandigarh. Stay connected with our community,
            access member services, and participate in upcoming events.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              Become a Member
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/50"
            >
              Member Login
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="glass-panel space-y-3 border-white/10 p-6">
          <div className="flex items-center gap-2">
            <Pill label="Events" tone="teal" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Community Events
          </h3>
          <p className="text-slate-200/80">
            Participate in cultural programs, sports activities, and social gatherings
            that celebrate our Kuki heritage.
          </p>
        </div>

        <div className="glass-panel space-y-3 border-white/10 p-6">
          <div className="flex items-center gap-2">
            <Pill label="Membership" tone="gold" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Member Services
          </h3>
          <p className="text-slate-200/80">
            Access exclusive member benefits, manage your profile, and stay updated
            with notifications and announcements.
          </p>
        </div>

        <div className="glass-panel space-y-3 border-white/10 p-6">
          <div className="flex items-center gap-2">
            <Pill label="Gallery" tone="slate" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Photo Gallery
          </h3>
          <p className="text-slate-200/80">
            Browse photos from past events and cultural celebrations that showcase
            our vibrant community spirit.
          </p>
        </div>
      </section>

      <section className="glass-panel border-white/10 p-8">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Join Our Community
          </h2>
          <p className="mx-auto max-w-2xl text-slate-200/85">
            KSO Chandigarh brings together Kuki students in the region. Whether you're
            looking to connect with your culture, make new friends, or participate in
            community service, we welcome you.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link
              href="/register"
              className="inline-flex items-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/50"
            >
              Already a Member?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
