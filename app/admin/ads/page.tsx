"use client";

import { useState } from "react";
import { DollarSign, Plus, Pencil, Trash2, Eye, EyeOff, TrendingUp } from "lucide-react";
import { toast } from "sonner";

type Ad = {
  id: string;
  name: string;
  type: "BANNER" | "SIDEBAR" | "INLINE" | "POPUP" | "NATIVE";
  position: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
};

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ads");
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      } else {
        toast.error("Failed to load ads");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const toggleAd = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (res.ok) {
        toast.success(`Ad ${isActive ? "activated" : "deactivated"}`);
        fetchAds();
      } else {
        toast.error("Failed to update ad");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm("Delete this ad? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Ad deleted");
        fetchAds();
      } else {
        toast.error("Failed to delete ad");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const getCTR = (impressions: number, clicks: number) => {
    if (impressions === 0) return "0.0%";
    return ((clicks / impressions) * 100).toFixed(2) + "%";
  };

  const filteredAds = filterType === "all"
    ? ads
    : ads.filter((ad) => ad.type === filterType);

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case "BANNER":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "SIDEBAR":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "INLINE":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "POPUP":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "NATIVE":
        return "bg-pink-500/20 text-pink-300 border-pink-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-400/20 text-green-200">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Marketing</p>
            <h1 className="text-2xl font-semibold text-white">Ads Management</h1>
          </div>
        </div>
        <a
          href="/admin/ads/new"
          className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-400"
        >
          <Plus className="h-4 w-4" />
          Create Ad
        </a>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
          <p className="text-sm text-slate-400">Total Ads</p>
          <p className="mt-1 text-3xl font-bold text-white">{ads.length}</p>
          <p className="mt-1 text-xs text-slate-500">
            {ads.filter((a) => a.isActive).length} active
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
          <p className="text-sm text-slate-400">Total Impressions</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {ads.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
          <p className="text-sm text-slate-400">Total Clicks</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {ads.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterType === "all"
                ? "bg-green-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-green-300/50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("BANNER")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterType === "BANNER"
                ? "bg-green-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-green-300/50"
            }`}
          >
            Banner
          </button>
          <button
            onClick={() => setFilterType("SIDEBAR")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterType === "SIDEBAR"
                ? "bg-green-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-green-300/50"
            }`}
          >
            Sidebar
          </button>
          <button
            onClick={() => setFilterType("INLINE")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterType === "INLINE"
                ? "bg-green-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-green-300/50"
            }`}
          >
            Inline
          </button>
          <button
            onClick={() => setFilterType("POPUP")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterType === "POPUP"
                ? "bg-green-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-green-300/50"
            }`}
          >
            Popup
          </button>
          <button
            onClick={() => setFilterType("NATIVE")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterType === "NATIVE"
                ? "bg-green-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-green-300/50"
            }`}
          >
            Native
          </button>
        </div>
      </div>

      {/* Ads List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
            Loading ads...
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
            No ads found. Create your first ad!
          </div>
        ) : (
          filteredAds.map((ad) => (
            <div
              key={ad.id}
              className={`flex items-center gap-4 rounded-xl border bg-slate-900/70 p-4 shadow-lg shadow-black/30 transition ${
                ad.isActive
                  ? "border-green-400/50 ring-1 ring-green-400/20"
                  : "border-white/10 opacity-75 hover:border-white/20"
              }`}
            >
              {/* Preview */}
              {ad.imageUrl && (
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.imageUrl}
                    alt={ad.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-semibold text-white">{ad.name}</h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getAdTypeColor(ad.type)}`}
                  >
                    {ad.type}
                  </span>
                  {ad.isActive && (
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-300">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">{ad.position}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {ad.impressions.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {ad.clicks.toLocaleString()} clicks
                  </span>
                  <span>CTR: {getCTR(ad.impressions, ad.clicks)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAd(ad.id, !ad.isActive)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    ad.isActive
                      ? "border-amber-300/50 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
                      : "border-green-300/50 bg-green-400/10 text-green-200 hover:bg-green-400/20"
                  }`}
                >
                  {ad.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <a
                  href={`/admin/ads/${ad.id}/edit`}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-blue-300/50 hover:text-blue-200"
                >
                  <Pencil className="h-4 w-4" />
                </a>
                <button
                  onClick={() => deleteAd(ad.id)}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-red-300/50 hover:text-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
