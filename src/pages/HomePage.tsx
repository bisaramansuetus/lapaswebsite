import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Feather, Scale, Sparkles } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { LogoMark } from '../components/Logo';
import { SeoHead } from '../components/SeoHead';
import { ArticleCard, formatDateId, LoadingState } from '../components/StateViews';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { EDITORIAL_IMAGES } from '../data/demoData';
import {
  fetchBooks,
  fetchPublishedArticles,
  fetchPublishedContributors,
} from '../services/lapasService';
import type { Article, Book, Contributor } from '../types/lapas';

const BOOK_STATUS_LABEL: Record<Book['status'], string> = {
  segera_hadir: 'Segera Hadir',
  tersedia: 'Tersedia',
  habis: 'Habis',
};

export function HomePage() {
  const { settings } = useSiteSettings();
  const [articles, setArticles] = useState<Article[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchPublishedArticles(),
      fetchBooks(),
      fetchPublishedContributors(),
    ])
      .then(([artRes, bookRes, contribRes]) => {
        if (!active) return;
        setArticles(artRes.items);
        setBooks(bookRes.items);
        setContributors(contribRes.items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const newsAndOpinions = articles.filter(
    (a) => a.section === 'berita' || a.section === 'artikel-opini'
  );
  const leadArticle = newsAndOpinions[0];
  const secondaryArticles = newsAndOpinions.slice(1, 4);

  const poems = articles.filter((a) => a.section === 'puisi').slice(0, 2);
  const paintings = articles.filter((a) => a.section === 'seni-lukis').slice(0, 2);
  const rohaniList = articles.filter((a) => a.section === 'rohani').slice(0, 2);
  const motivasiList = articles.filter((a) => a.section === 'motivasi').slice(0, 2);
  const featuredBook = books.find((b) => b.featured) || books[0];

  return (
    <div>
      <SeoHead
        title="LapAs — Lepaskan Amarahmu Panggil Allah Selalu"
        description={settings.heroSubheadline}
      />

      {/* Hero Section */}
      <section className="border-b border-stone-200 bg-[#FBF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2.5 text-[#14532D] mb-4">
                <LogoMark className="w-7 h-7" />
                <span className="font-serif text-lg font-semibold tracking-tight text-stone-900">
                  {settings.siteName}
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#78350F] font-medium mb-5">
                {settings.tagline}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-medium text-stone-900 leading-[1.15] mb-6 max-w-2xl">
                {settings.heroHeadline}
              </h1>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mb-8">
                {settings.heroSubheadline}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/artikel-opini"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors whitespace-nowrap"
                >
                  Mulai Membaca
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/buku"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-300 text-stone-800 text-sm font-medium hover:border-[#14532D] hover:text-[#14532D] transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4" />
                  Jelajahi Buku
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] sm:min-h-[380px] bg-stone-100 border border-stone-200 overflow-hidden">
                <img
                  src={EDITORIAL_IMAGES.hero}
                  alt="Buku terbuka di atas meja kayu dengan cahaya pagi yang tenang — Ruang Literasi LapAs"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingState message="Menyiapkan sajian editorial LapAs..." />
      ) : (
        <>
          {/* Berita dan Artikel Pilihan */}
          <section id="pilihan-editorial" className="py-16 lg:py-20 border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-stone-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
                    Pilihan Redaksi
                  </p>
                  <h2 className="font-serif text-3xl text-stone-900 font-medium">
                    Berita &amp; Artikel Pilihan
                  </h2>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <Link
                    to="/berita"
                    className="text-[#14532D] font-medium hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    Semua Berita →
                  </Link>
                  <Link
                    to="/artikel-opini"
                    className="text-[#14532D] font-medium hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    Artikel &amp; Opini →
                  </Link>
                </div>
              </div>

              {leadArticle && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 bg-white border border-stone-200">
                  <Link
                    to={`/baca/${leadArticle.slug}`}
                    className="lg:col-span-7 block overflow-hidden group"
                  >
                    <EditorialImage
                      src={leadArticle.imageUrl}
                      alt={leadArticle.title}
                      aspectClass="aspect-[16/10] lg:h-full"
                    />
                  </Link>
                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                      <span className="font-medium text-[#14532D]">{leadArticle.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDateId(leadArticle.publishedAt)}</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium leading-snug mb-4">
                      <Link
                        to={`/baca/${leadArticle.slug}`}
                        className="hover:text-[#14532D] transition-colors"
                      >
                        {leadArticle.title}
                      </Link>
                    </h3>
                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
                      {leadArticle.summary}
                    </p>
                    <div className="pt-5 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-600">{leadArticle.authorName}</span>
                      <Link
                        to={`/baca/${leadArticle.slug}`}
                        className="font-medium text-[#14532D] hover:underline underline-offset-4"
                      >
                        Baca Selengkapnya →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {secondaryArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          </section>

          {/* Ruang Ekspresi (Gallery Layout — Distinct from News Cards) */}
          <section className="py-16 lg:py-20 bg-[#F4EFE6] border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-stone-300">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-600 mb-2">
                    Galeri Sastra &amp; Rupa
                  </p>
                  <h2 className="font-serif text-3xl text-stone-900 font-medium">
                    Ruang Ekspresi
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <Link
                    to="/puisi"
                    className="text-stone-800 hover:text-[#14532D] font-medium underline underline-offset-4"
                  >
                    Puisi
                  </Link>
                  <Link
                    to="/seni-lukis"
                    className="text-stone-800 hover:text-[#14532D] font-medium underline underline-offset-4"
                  >
                    Seni Lukis
                  </Link>
                  <Link
                    to="/kirim-karya"
                    className="px-4 py-2 bg-[#14532D] text-white text-xs font-medium hover:bg-[#0F3D21] transition-colors whitespace-nowrap"
                  >
                    Kirim Karya
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Visual Art Showcase */}
                <div className="lg:col-span-7 space-y-6">
                  {paintings.map((art) => (
                    <Link
                      key={art.id}
                      to={`/seni-lukis`}
                      className="group block bg-white p-5 sm:p-6 border border-stone-200 hover:border-stone-400 transition-colors"
                    >
                      <div className="bg-stone-100 p-3 sm:p-5 mb-5">
                        <EditorialImage
                          src={art.imageUrl}
                          alt={art.title}
                          aspectClass="aspect-[16/10]"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-xl text-stone-900 group-hover:text-[#14532D] transition-colors">
                            {art.title}
                          </h3>
                          <p className="text-xs text-stone-500 mt-1">
                            {art.authorName}
                            {art.medium ? ` · ${art.medium}` : ''}
                            {art.dimensions ? ` · ${art.dimensions}` : ''}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#14532D] whitespace-nowrap">
                          Lihat Galeri →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Poetic Typography Showcase */}
                <div className="lg:col-span-5 space-y-6">
                  {poems.map((poem) => (
                    <div
                      key={poem.id}
                      className="bg-white border border-stone-200 p-8 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
                          <span className="inline-flex items-center gap-1.5 text-[#78350F] font-medium">
                            <Feather className="w-3.5 h-3.5" />
                            Puisi · {poem.category}
                          </span>
                          <span>{formatDateId(poem.publishedAt)}</span>
                        </div>
                        <h3 className="font-serif text-2xl text-stone-900 mb-4">
                          <Link
                            to={`/baca/${poem.slug}`}
                            className="hover:text-[#14532D] transition-colors"
                          >
                            {poem.title}
                          </Link>
                        </h3>
                        <blockquote className="font-serif italic text-stone-700 leading-loose whitespace-pre-line text-sm sm:text-base border-t border-b border-stone-100 py-5 mb-5">
                          {poem.content.split('\n\n')[0]}
                        </blockquote>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600">{poem.authorName}</span>
                        <Link
                          to={`/baca/${poem.slug}`}
                          className="font-medium text-[#14532D] hover:underline underline-offset-4"
                        >
                          Baca Utuh →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Rubrik Rohani & Motivasi */}
          <section className="py-16 lg:py-20 bg-[#FBF9F5] border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Rubrik Rohani */}
                <div>
                  <div className="flex items-end justify-between pb-4 mb-8 border-b border-stone-200">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-1">
                        Pencerahan Jiwa
                      </p>
                      <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium">
                        Rubrik Rohani
                      </h2>
                    </div>
                    <Link
                      to="/rubrik-rohani"
                      className="text-sm font-medium text-[#14532D] hover:underline underline-offset-4 whitespace-nowrap"
                    >
                      Lihat Semua →
                    </Link>
                  </div>
                  <div className="space-y-6">
                    {rohaniList.map((item) => (
                      <article
                        key={item.id}
                        className="bg-white border border-stone-200 p-6 sm:p-7 hover:border-stone-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                          <span className="text-[#14532D] font-medium">{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDateId(item.publishedAt)}</span>
                        </div>
                        <h3 className="font-serif text-xl text-stone-900 mb-3">
                          <Link
                            to={`/baca/${item.slug}`}
                            className="hover:text-[#14532D] transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-stone-600 leading-relaxed mb-4">
                          {item.summary}
                        </p>
                        <Link
                          to={`/baca/${item.slug}`}
                          className="text-xs font-medium text-[#14532D] hover:underline underline-offset-4"
                        >
                          Renungkan Selengkapnya →
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Motivasi */}
                <div>
                  <div className="flex items-end justify-between pb-4 mb-8 border-b border-stone-200">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-1">
                        Langkah &amp; Ketekunan
                      </p>
                      <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium">
                        Motivasi
                      </h2>
                    </div>
                    <Link
                      to="/motivasi"
                      className="text-sm font-medium text-[#14532D] hover:underline underline-offset-4 whitespace-nowrap"
                    >
                      Lihat Semua →
                    </Link>
                  </div>
                  <div className="space-y-6">
                    {motivasiList.map((item) => (
                      <article
                        key={item.id}
                        className="bg-white border border-stone-200 p-6 sm:p-7 hover:border-stone-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                          <span className="text-[#78350F] font-medium">{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDateId(item.publishedAt)}</span>
                        </div>
                        <h3 className="font-serif text-xl text-stone-900 mb-3">
                          <Link
                            to={`/baca/${item.slug}`}
                            className="hover:text-[#14532D] transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-stone-600 leading-relaxed mb-4">
                          {item.summary}
                        </p>
                        <Link
                          to={`/baca/${item.slug}`}
                          className="text-xs font-medium text-[#14532D] hover:underline underline-offset-4"
                        >
                          Baca Selengkapnya →
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Konsultasi Hukum Banner */}
          <section className="py-14 bg-[#172554] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-300 mb-3">
                  <Scale className="w-4 h-4" />
                  <span>Edukasi &amp; Literasi Yuridis</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-3">
                  Ruang Edukasi dan Konsultasi Hukum LapAs
                </h2>
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                  LapAs menyediakan ruang edukasi hukum umum untuk membantu masyarakat memahami
                  hak, kewajiban, dan langkah penyelesaian masalah secara tenang dan terarah.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  to="/konsultasi-hukum"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#172554] text-sm font-medium hover:bg-stone-100 transition-colors whitespace-nowrap"
                >
                  Pelajari Layanan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Buku Pilihan LapAs */}
          {featuredBook && (
            <section className="py-16 lg:py-20 bg-white border-b border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-stone-200">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
                      Pustaka Penulis
                    </p>
                    <h2 className="font-serif text-3xl text-stone-900 font-medium">
                      Buku Pilihan LapAs
                    </h2>
                  </div>
                  <Link
                    to="/buku"
                    className="text-sm font-medium text-[#14532D] hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    Lihat Katalog Buku →
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#FBF9F5] border border-stone-200 p-6 sm:p-10">
                  <div className="lg:col-span-4 max-w-xs mx-auto w-full">
                    <EditorialImage
                      src={featuredBook.coverUrl}
                      alt={featuredBook.title}
                      aspectClass="aspect-[3/4]"
                      className="border border-stone-200"
                    />
                  </div>
                  <div className="lg:col-span-8 space-y-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                      <span className="font-medium text-[#14532D]">
                        Status: {BOOK_STATUS_LABEL[featuredBook.status]}
                      </span>
                      {featuredBook.isDemo && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Data Demo Siap Peluncuran</span>
                        </>
                      )}
                      {featuredBook.launchDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Jadwal: {featuredBook.launchDate}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif text-3xl text-stone-900 font-medium">
                      {featuredBook.title}
                    </h3>
                    <p className="text-sm text-stone-600">
                      Oleh <span className="font-medium text-stone-800">{featuredBook.authorName}</span>
                    </p>
                    <p className="text-base text-stone-700 leading-relaxed whitespace-pre-line max-w-2xl">
                      {featuredBook.synopsis}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Link
                        to={`/buku/${featuredBook.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors"
                      >
                        Lihat Buku
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      {featuredBook.status === 'segera_hadir' && (
                        <span className="text-xs text-stone-500">
                          Akan tersedia saat peluncuran resmi diumumkan admin.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Salam Kenal */}
          <section className="py-16 lg:py-20 bg-[#FBF9F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-stone-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
                    Jejaring Penulis &amp; Pembaca
                  </p>
                  <h2 className="font-serif text-3xl text-stone-900 font-medium">Salam Kenal</h2>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  <Link
                    to="/salam-kenal"
                    className="text-[#14532D] font-medium hover:underline underline-offset-4"
                  >
                    Semua Profil →
                  </Link>
                  <Link
                    to="/kirim-karya"
                    className="inline-flex items-center gap-1.5 text-stone-800 hover:text-[#14532D] font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Perkenalkan Diri
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {contributors.slice(0, 3).map((person) => (
                  <div
                    key={person.id}
                    className="bg-white border border-stone-200 p-7 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <img
                            src={person.avatarUrl}
                            alt={person.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg text-stone-900 truncate">
                            {person.name}
                          </h3>
                          <p className="text-xs text-stone-500 truncate">
                            {person.role} · {person.city}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed mb-4">{person.bio}</p>
                    </div>
                    {person.quote && (
                      <p className="text-xs font-serif italic text-stone-500 pt-4 border-t border-stone-100">
                        &ldquo;{person.quote}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
