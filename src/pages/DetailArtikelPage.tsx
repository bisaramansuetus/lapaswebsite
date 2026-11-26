import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { SeoHead } from '../components/SeoHead';
import { ShareButtons } from '../components/ShareButtons';
import { ArticleCard, EmptyState, formatDateId, LoadingState } from '../components/StateViews';
import { fetchArticleBySlug, fetchPublishedArticles } from '../services/lapasService';
import type { Article } from '../types/lapas';

const SECTION_ROUTE: Record<Article['section'], { label: string; to: string }> = {
  berita: { label: 'Berita', to: '/berita' },
  'artikel-opini': { label: 'Artikel & Opini', to: '/artikel-opini' },
  rohani: { label: 'Rubrik Rohani', to: '/rubrik-rohani' },
  motivasi: { label: 'Motivasi', to: '/motivasi' },
  puisi: { label: 'Puisi', to: '/puisi' },
  'seni-lukis': { label: 'Seni Lukis', to: '/seni-lukis' },
};

export function DetailArtikelPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    fetchArticleBySlug(slug)
      .then(async (found) => {
        if (!active) return;
        setArticle(found);
        if (found) {
          const sameSection = await fetchPublishedArticles(found.section);
          if (!active) return;
          setRelated(sameSection.items.filter((a) => a.slug !== found.slug).slice(0, 3));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <LoadingState message="Membuka naskah..." />;

  if (!article) {
    return (
      <div className="py-20 px-4">
        <EmptyState
          title="Tulisan Tidak Ditemukan"
          description="Naskah yang Anda cari mungkin telah dipindahkan atau belum dipublikasikan."
          actionLabel="Kembali ke Beranda"
          actionTo="/"
        />
      </div>
    );
  }

  const sectionInfo = SECTION_ROUTE[article.section];
  const paragraphs = article.content.split(/\n\s*\n/).filter(Boolean);
  const isPoem = article.section === 'puisi';

  return (
    <article className="py-12 lg:py-16">
      <SeoHead
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.summary}
        type="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={sectionInfo.to}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-[#14532D] mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke {sectionInfo.label}
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-4">
            <span className="font-medium text-[#14532D]">{sectionInfo.label}</span>
            <span aria-hidden="true">·</span>
            <span>{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDateId(article.publishedAt)}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-medium leading-[1.18] mb-5">
            {article.title}
          </h1>

          <p className="text-lg text-stone-600 leading-relaxed mb-6">{article.summary}</p>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-sm text-stone-700">
            <span>
              Ditulis oleh <strong className="font-medium text-stone-900">{article.authorName}</strong>
            </span>
          </div>
        </header>

        {article.imageUrl && (
          <figure className="mb-10">
            <EditorialImage
              src={article.imageUrl}
              alt={article.title}
              aspectClass="aspect-[16/10]"
              className="border border-stone-200"
            />
            <figcaption className="text-xs font-serif italic text-stone-500 mt-2.5">
              Ilustrasi editorial — {article.title}
              {article.medium ? ` (${article.medium})` : ''}
            </figcaption>
          </figure>
        )}

        {/* Comfortable Long-Form Reading Body (65-75ch) */}
        <div className="bg-white border border-stone-200 p-6 sm:p-10 lg:p-12">
          <div className="max-w-2xl mx-auto">
            {isPoem ? (
              <div className="font-serif text-lg sm:text-xl text-stone-800 leading-loose whitespace-pre-line italic py-4">
                {article.content}
              </div>
            ) : (
              <div className="space-y-6 text-base sm:text-[17px] text-stone-800 leading-[1.85]">
                {paragraphs.map((para, index) => (
                  <p key={index} className={index === 0 ? 'editorial-dropcap' : ''}>
                    {para}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-10">
              <ShareButtons title={article.title} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-stone-200">
          <h2 className="font-serif text-2xl text-stone-900 mb-8">Bacaan Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
