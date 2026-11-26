import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { ArticleCard, EmptyState, ErrorState, LoadingState } from '../components/StateViews';
import { fetchPublishedArticles } from '../services/lapasService';
import type { Article } from '../types/lapas';

const DEFAULT_CATEGORIES = ['Semua', 'Opini', 'Esai', 'Pemikiran Sosial', 'Refleksi Kehidupan'];
const PAGE_SIZE = 6;

export function ArtikelOpiniPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPublishedArticles('artikel-opini')
      .then((res) => setArticles(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat artikel.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = useMemo(() => {
    const extra = articles.map((a) => a.category).filter((c) => c && !DEFAULT_CATEGORIES.includes(c));
    return [...DEFAULT_CATEGORIES, ...Array.from(new Set(extra))];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter((a) => {
      const catOk = selectedCategory === 'Semua' || a.category === selectedCategory;
      const qOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [articles, selectedCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title="Artikel & Opini — LapAs"
        description="Kumpulan opini, esai, pemikiran sosial, dan refleksi kehidupan dengan tata letak editorial yang nyaman dibaca."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pb-8 mb-10 border-b border-stone-200">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
            Publikasi · Wacana &amp; Gagasan
          </p>
          <h1 className="font-serif text-4xl text-stone-900 font-medium mb-3">
            Artikel &amp; Opini
          </h1>
          <p className="text-base text-stone-600 max-w-2xl">
            Esai, opini, pemikiran sosial, dan refleksi kehidupan yang ditulis dengan tenang untuk
            menjernihkan pandangan.
          </p>
        </header>

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
              placeholder="Cari artikel atau penulis..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#14532D]"
            />
          </div>
        </div>

        {loading ? (
          <LoadingState message="Memuat artikel & opini..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="Belum Ada Artikel pada Kategori Ini"
            description="Silakan pilih kategori lain atau kembali ke semua tulisan."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  );
}
