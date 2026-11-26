import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';
import { EmptyState, ErrorState, formatDateId, LoadingState } from '../components/StateViews';
import { EditorialImage } from '../components/EditorialImage';
import { fetchPublishedArticles } from '../services/lapasService';
import type { Article } from '../types/lapas';

interface ReflectiveRubricPageProps {
  section: 'rohani' | 'motivasi';
}

const CONFIG = {
  rohani: {
    seoTitle: 'Rubrik Rohani — LapAs',
    seoDescription:
      'Renungan, refleksi iman, nilai kehidupan, dan pemikiran spiritual untuk menenteramkan hati.',
    kicker: 'Publikasi · Pencerahan Batin',
    title: 'Rubrik Rohani',
    subtitle:
      'Renungan, refleksi iman, nilai kehidupan, dan pemikiran spiritual yang mengajak kita melepaskan amarah dan memanggil Allah dalam setiap langkah.',
    defaultCategories: [
      'Semua',
      'Renungan',
      'Refleksi Iman',
      'Nilai Kehidupan',
      'Pemikiran Spiritual',
    ],
  },
  motivasi: {
    seoTitle: 'Motivasi — LapAs',
    seoDescription:
      'Tulisan motivasi kehidupan, pengembangan diri, ketekunan, harapan, dan perjalanan hidup.',
    kicker: 'Publikasi · Keteguhan Langkah',
    title: 'Motivasi',
    subtitle:
      'Motivasi kehidupan, pengembangan diri, ketekunan, harapan, dan refleksi perjalanan hidup yang hangat dan membumi.',
    defaultCategories: [
      'Semua',
      'Motivasi Kehidupan',
      'Pengembangan Diri',
      'Ketekunan',
      'Harapan',
      'Perjalanan Hidup',
    ],
  },
} as const;

export function ReflectiveRubricPage({ section }: ReflectiveRubricPageProps) {
  const cfg = CONFIG[section];
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const loadData = () => {
    setLoading(true);
    setError(null);
    setSelectedCategory('Semua');
    fetchPublishedArticles(section)
      .then((res) => setArticles(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat tulisan.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [section]);

  const categories = useMemo(() => {
    const extra = articles
      .map((a) => a.category)
      .filter((c) => c && !cfg.defaultCategories.includes(c as never));
    return [...cfg.defaultCategories, ...Array.from(new Set(extra))];
  }, [articles, cfg.defaultCategories]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'Semua') return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <div className="py-12 lg:py-16 bg-[#FBF9F5]">
      <SeoHead title={cfg.seoTitle} description={cfg.seoDescription} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pb-8 mb-10 border-b border-stone-200 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#14532D] mb-2">{cfg.kicker}</p>
          <h1 className="font-serif text-4xl text-stone-900 font-medium mb-3">{cfg.title}</h1>
          <p className="text-base text-stone-600 leading-relaxed">{cfg.subtitle}</p>
        </header>

        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
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

        {loading ? (
          <LoadingState message={`Memuat tulisan ${cfg.title}...`} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={`Belum Ada Tulisan di ${cfg.title}`}
            description="Pilih tema lain atau nantikan pembaruan tulisan terbaru dari redaksi LapAs."
          />
        ) : (
          <div className="space-y-8">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-stone-200 grid grid-cols-1 md:grid-cols-12 overflow-hidden hover:border-stone-300 transition-colors"
              >
                <Link to={`/baca/${item.slug}`} className="md:col-span-4 block overflow-hidden group">
                  <EditorialImage
                    src={item.imageUrl}
                    alt={item.title}
                    aspectClass="aspect-[4/3] md:h-full"
                  />
                </Link>
                <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2.5">
                    <span className="font-medium text-[#14532D]">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatDateId(item.publishedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.authorName}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-stone-900 font-medium mb-3">
                    <Link
                      to={`/baca/${item.slug}`}
                      className="hover:text-[#14532D] transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-5 max-w-2xl">
                    {item.summary}
                  </p>
                  <div>
                    <Link
                      to={`/baca/${item.slug}`}
                      className="text-xs font-medium text-[#14532D] hover:underline underline-offset-4"
                    >
                      Baca Refleksi Utuh →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
