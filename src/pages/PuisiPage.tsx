import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Feather } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { EmptyState, ErrorState, formatDateId, LoadingState } from '../components/StateViews';
import { fetchPublishedArticles } from '../services/lapasService';
import type { Article } from '../types/lapas';

export function PuisiPage() {
  const [poems, setPoems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('Semua');

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPublishedArticles('puisi')
      .then((res) => setPoems(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat puisi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const themes = useMemo(() => {
    return ['Semua', ...Array.from(new Set(poems.map((p) => p.category).filter(Boolean)))];
  }, [poems]);

  const filtered = useMemo(() => {
    if (theme === 'Semua') return poems;
    return poems.filter((p) => p.category === theme);
  }, [poems, theme]);

  return (
    <div className="py-12 lg:py-16 bg-[#FBF9F5]">
      <SeoHead
        title="Puisi — Ruang Ekspresi LapAs"
        description="Kumpulan puisi kontemplatif tentang doa, kehidupan, harapan, dan ketenangan jiwa di Ruang Ekspresi LapAs."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pb-8 mb-10 border-b border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#78350F] mb-2">
              Ruang Ekspresi · Sastra
            </p>
            <h1 className="font-serif text-4xl text-stone-900 font-medium mb-3">Antologi Puisi</h1>
            <p className="text-base text-stone-600 max-w-2xl">
              Sajak-sajak jujur dari para penulis dan pembaca yang merangkai doa, kesabaran, serta
              makna kehidupan dalam bait kata.
            </p>
          </div>
          <Link
            to="/kirim-karya"
            className="px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            Kirim Karya Puisi
          </Link>
        </header>

        <div className="flex flex-wrap items-center gap-2 mb-10">
          {themes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`px-3.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                theme === t
                  ? 'bg-[#14532D] text-white border-[#14532D]'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-[#14532D]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState message="Memuat antologi puisi..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Belum Ada Puisi"
            description="Jadilah yang pertama membagikan karya puisi Anda untuk ditinjau redaksi."
            actionLabel="Kirim Karya"
            actionTo="/kirim-karya"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((poem) => (
              <article
                key={poem.id}
                className="bg-white border border-stone-200 p-8 sm:p-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[#78350F] font-medium">
                      <Feather className="w-3.5 h-3.5" />
                      {poem.category}
                    </span>
                    <span>{formatDateId(poem.publishedAt)}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium mb-6">
                    <Link
                      to={`/baca/${poem.slug}`}
                      className="hover:text-[#14532D] transition-colors"
                    >
                      {poem.title}
                    </Link>
                  </h2>
                  <div className="font-serif italic text-stone-700 leading-loose whitespace-pre-line text-base border-t border-b border-stone-100 py-6 mb-6">
                    {poem.content}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>Karya: {poem.authorName}</span>
                  <Link
                    to={`/baca/${poem.slug}`}
                    className="font-medium text-[#14532D] hover:underline underline-offset-4"
                  >
                    Bagikan &amp; Detail →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
