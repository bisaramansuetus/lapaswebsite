import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import {
  ArticleCard,
  EmptyState,
  ErrorState,
  formatDateId,
  LoadingState,
} from '../components/StateViews';
import { fetchPublishedArticles } from '../services/lapasService';
import type { Article } from '../types/lapas';

const PAGE_SIZE = 4;

export function BeritaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [page, setPage] = useState(1);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPublishedArticles('berita')
      .then((res) => setArticles(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat berita.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));
    return ['Semua', ...cats];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter((a) => {
      const catOk = selectedCategory === 'Semua' || a.category === selectedCategory;
      const searchOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [articles, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const latest = articles.slice(0, 4);
  const popular = articles.filter((a) => a.featured).concat(articles).slice(0, 4);

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title="Berita — LapAs"
        description="Kabar literasi, dialog masyarakat, dan perkembangan ruang ekspresi LapAs dari seluruh Indonesia."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pb-8 mb-10 border-b border-stone-200">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
            Publikasi · Kabar Terkini
          </p>
          <h1 className="font-serif text-4xl text-stone-900 font-medium mb-3">Berita LapAs</h1>
          <p className="text-base text-stone-600 max-w-2xl">
            Liputan literasi, kegiatan komunitas baca, edukasi masyarakat, dan kabar peluncuran
            karya terbaru di Nusantara.
          </p>
        </header>

        {/* Search and Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#14532D] text-white border-[#14532D]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-[#14532D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari berita..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#14532D]"
            />
          </div>
        </div>

        {loading ? (
          <LoadingState message="Memuat daftar berita..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Column */}
            <div className="lg:col-span-8">
              {paginated.length === 0 ? (
                <EmptyState
                  title="Belum Ada Berita yang Cocok"
                  description="Coba ubah kata kunci pencarian atau pilih kategori lain."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {paginated.map((item) => (
                      <ArticleCard key={item.id} article={item} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 pt-6 border-t border-stone-200 flex items-center justify-between">
                      <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 text-xs font-medium border border-stone-300 bg-white text-stone-700 disabled:opacity-40 cursor-pointer"
                      >
                        ← Sebelumnya
                      </button>
                      <span className="text-xs text-stone-500 tabular-nums">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 text-xs font-medium border border-stone-300 bg-white text-stone-700 disabled:opacity-40 cursor-pointer"
                      >
                        Berikutnya →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar: Berita Terbaru & Populer */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-white border border-stone-200 p-6">
                <h2 className="font-serif text-lg text-stone-900 pb-3 mb-4 border-b border-stone-200">
                  Artikel Terbaru
                </h2>
                <div className="space-y-4">
                  {latest.map((art) => (
                    <div key={art.id} className="pb-4 border-b border-stone-100 last:border-b-0 last:pb-0">
                      <p className="text-xs text-stone-500 mb-1">{formatDateId(art.publishedAt)}</p>
                      <Link
                        to={`/baca/${art.slug}`}
                        className="font-serif text-sm text-stone-900 hover:text-[#14532D] leading-snug block"
                      >
                        {art.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-6">
                <h2 className="font-serif text-lg text-stone-900 pb-3 mb-4 border-b border-stone-200">
                  Berita Pilihan
                </h2>
                <div className="space-y-4">
                  {popular.map((art, idx) => (
                    <div key={`${art.id}-${idx}`} className="flex gap-3 items-baseline">
                      <span className="font-serif text-lg text-stone-300 tabular-nums">
                        0{idx + 1}
                      </span>
                      <Link
                        to={`/baca/${art.slug}`}
                        className="font-serif text-sm text-stone-900 hover:text-[#14532D] leading-snug"
                      >
                        {art.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
