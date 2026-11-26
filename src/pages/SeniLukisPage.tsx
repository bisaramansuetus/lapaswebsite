import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { SeoHead } from '../components/SeoHead';
import { EmptyState, ErrorState, formatDateId, LoadingState } from '../components/StateViews';
import { fetchPublishedArticles } from '../services/lapasService';
import type { Article } from '../types/lapas';

export function SeniLukisPage() {
  const [artworks, setArtworks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWork, setActiveWork] = useState<Article | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPublishedArticles('seni-lukis')
      .then((res) => setArtworks(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat galeri.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="py-12 lg:py-16 bg-[#F4EFE6]">
      <SeoHead
        title="Galeri Seni Lukis — Ruang Ekspresi LapAs"
        description="Pameran visual karya seni lukis kontemplatif dari seniman dan kontributor Ruang Ekspresi LapAs."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pb-8 mb-12 border-b border-stone-300 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-600 mb-2">
              Ruang Ekspresi · Galeri Visual
            </p>
            <h1 className="font-serif text-4xl text-stone-900 font-medium mb-3">
              Galeri Seni Lukis
            </h1>
            <p className="text-base text-stone-700 max-w-2xl">
              Karya rupa yang merekam keheningan, alam, cahaya, dan perjalanan jiwa dalam sapuan
              kuas yang teduh.
            </p>
          </div>
          <Link
            to="/kirim-karya"
            className="px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            Kirim Karya Seni
          </Link>
        </header>

        {loading ? (
          <LoadingState message="Menata galeri seni lukis..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : artworks.length === 0 ? (
          <EmptyState
            title="Galeri Masih Kosong"
            description="Kirimkan karya seni lukis Anda untuk dikurasi oleh tim redaksi LapAs."
            actionLabel="Kirim Karya"
            actionTo="/kirim-karya"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {artworks.map((work) => (
              <figure
                key={work.id}
                className="bg-white border border-stone-200 p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWork(work)}
                    className="w-full text-left bg-stone-100 p-4 sm:p-6 mb-6 cursor-pointer group block"
                  >
                    <EditorialImage
                      src={work.imageUrl}
                      alt={work.title}
                      aspectClass="aspect-[4/3]"
                    />
                  </button>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span>{work.category}</span>
                    <span>{formatDateId(work.publishedAt)}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-stone-900 font-medium mb-1">
                    {work.title}
                  </h2>
                  <p className="text-sm font-medium text-[#14532D] mb-4">{work.authorName}</p>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">{work.summary}</p>
                </div>

                {(work.medium || work.dimensions) && (
                  <dl className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-4 text-xs text-stone-500">
                    {work.medium && (
                      <div>
                        <dt className="uppercase tracking-wider text-stone-400">Medium</dt>
                        <dd className="text-stone-700 mt-0.5">{work.medium}</dd>
                      </div>
                    )}
                    {work.dimensions && (
                      <div>
                        <dt className="uppercase tracking-wider text-stone-400">Dimensi</dt>
                        <dd className="text-stone-700 mt-0.5">{work.dimensions}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>

      {/* Exhibition Lightbox */}
      {activeWork && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setActiveWork(null)}
              aria-label="Tutup tampilan karya"
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-stone-100 p-4 mb-6">
              <img
                src={activeWork.imageUrl}
                alt={activeWork.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[55vh] object-contain mx-auto"
              />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-1">{activeWork.title}</h3>
            <p className="text-sm text-[#14532D] font-medium mb-3">
              {activeWork.authorName}
              {activeWork.medium ? ` · ${activeWork.medium}` : ''}
              {activeWork.dimensions ? ` · ${activeWork.dimensions}` : ''}
            </p>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {activeWork.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
