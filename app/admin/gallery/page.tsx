import { Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const albums = [
    { id: '1', title: 'Chavang Kut 2025', count: 48, cover: null },
    { id: '2', title: 'Sports Meet 2025', count: 32, cover: null },
    { id: '3', title: 'Independence Day', count: 24, cover: null },
    { id: '4', title: 'Annual Meeting', count: 16, cover: null },
    { id: '5', title: 'Community Service', count: 20, cover: null },
    { id: '6', title: 'Youth Workshop', count: 12, cover: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Gallery
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Photo Gallery
          </h1>
        </div>
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500">
          + Upload Photos
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <div
            key={album.id}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:border-teal-400/30"
          >
            <div className="flex h-40 items-center justify-center bg-slate-800/50">
              <ImageIcon className="h-10 w-10 text-slate-600" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white">{album.title}</h3>
              <p className="text-sm text-slate-400">
                {album.count} photos
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
