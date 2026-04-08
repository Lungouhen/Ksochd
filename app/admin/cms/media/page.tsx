"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, Trash2, Copy, Download } from "lucide-react";
import { toast } from "sonner";

type Media = {
  id: string;
  filename: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
  size: number;
  alt?: string;
  caption?: string;
  createdAt: string;
};

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      } else {
        toast.error("Failed to load media");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/cms/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success(`${files.length} file(s) uploaded`);
        fetchMedia();
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm("Delete this media file?")) return;

    try {
      const res = await fetch(`/api/cms/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Media deleted");
        fetchMedia();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
        return "🖼️";
      case "VIDEO":
        return "🎥";
      case "DOCUMENT":
        return "📄";
      case "AUDIO":
        return "🎵";
      default:
        return "📎";
    }
  };

  const filteredMedia = typeFilter === "all"
    ? media
    : media.filter((m) => m.type === typeFilter);

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-400/20 text-purple-200">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">CMS</p>
            <h1 className="text-2xl font-semibold text-white">Media Library</h1>
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-purple-400">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Files"}
          <input
            type="file"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
        </label>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              typeFilter === "all"
                ? "bg-purple-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-purple-300/50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter("IMAGE")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              typeFilter === "IMAGE"
                ? "bg-purple-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-purple-300/50"
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setTypeFilter("VIDEO")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              typeFilter === "VIDEO"
                ? "bg-purple-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-purple-300/50"
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setTypeFilter("DOCUMENT")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              typeFilter === "DOCUMENT"
                ? "bg-purple-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-purple-300/50"
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
            Loading media...
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
            No media files found. Upload your first file!
          </div>
        ) : (
          filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/30 transition hover:border-white/20"
            >
              {/* Preview */}
              <div className="aspect-video w-full bg-slate-800 flex items-center justify-center">
                {item.type === "IMAGE" ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">{getMediaIcon(item.type)}</span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="truncate text-sm font-medium text-white" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-xs text-slate-400">
                  {formatSize(item.size)} • {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="rounded-lg bg-slate-900/90 p-2 text-slate-200 backdrop-blur-sm transition hover:bg-blue-500 hover:text-white"
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <a
                  href={item.url}
                  download
                  className="rounded-lg bg-slate-900/90 p-2 text-slate-200 backdrop-blur-sm transition hover:bg-emerald-500 hover:text-white"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="rounded-lg bg-slate-900/90 p-2 text-slate-200 backdrop-blur-sm transition hover:bg-red-500 hover:text-white"
                  title="Delete"
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
