import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, ExternalLink } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { SeoHead } from '../components/SeoHead';
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews';
import { fetchBooks } from '../services/lapasService';
import type { Book } from '../types/lapas';

const STATUS_LABEL: Record<Book['status'], string> = {
  segera_hadir: 'Segera Hadir',
  tersedia: 'Tersedia',
  habis: 'Habis',
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BukuPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [awaitedBookId, setAwaitedBookId] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchBooks()
      .then((res) => setBooks(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat katalog buku.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title="Katalog Buku — LapAs"
        description="Katalog buku karya penulis LapAs. Informasi sinopsis, status peluncuran, profil penulis, dan tautan pemesanan resmi."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pb-8 mb-12 border-b border-stone-200 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#14532D] mb-2">
            Pustaka LapAs
          </p>
          <h1 className="font-serif text-4xl text-stone-900 font-medium mb-3">
            Katalog Buku Penulis
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            Rumah penerbitan karya buku LapAs. Katalog ini dirancang siap sebelum peluncuran resmi
            sehingga pembaca dapat mengikuti kabar terbit maupun melakukan pemesanan saat buku
            tersedia.
          </p>
        </header>

        {loading ? (
          <LoadingState message="Memuat katalog buku..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : books.length === 0 ? (
          <EmptyState
            title="Katalog Buku Masih Kosong"
            description="Admin dapat menambahkan data buku langsung melalui Dashboard Admin."
          />
        ) : (
          <div className="space-y-10">
            {books.map((book) => (
              <article
                key={book.id}
                className="bg-white border border-stone-200 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-4 max-w-xs mx-auto w-full">
                  <Link to={`/buku/${book.slug}`} className="block group">
                    <EditorialImage
                      src={book.coverUrl}
                      alt={book.title}
                      aspectClass="aspect-[3/4]"
                      className="border border-stone-200"
                    />
                  </Link>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span
                      className={`font-semibold ${
                        book.status === 'tersedia'
                          ? 'text-[#14532D]'
                          : book.status === 'habis'
                            ? 'text-red-700'
                            : 'text-[#78350F]'
                      }`}
                    >
                      Status: {STATUS_LABEL[book.status]}
                    </span>
                    {book.isDemo && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Data Demo (Siap Diperbarui Admin)</span>
                      </>
                    )}
                    {book.launchDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Peluncuran: {book.launchDate}</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-serif text-3xl text-stone-900 font-medium">
                    <Link
                      to={`/buku/${book.slug}`}
                      className="hover:text-[#14532D] transition-colors"
                    >
                      {book.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-stone-600">
                    Penulis: <strong className="text-stone-900 font-medium">{book.authorName}</strong>
                  </p>

                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line max-w-2xl">
                    {book.synopsis}
                  </p>

                  {book.status === 'tersedia' && (
                    <div className="pt-2 flex flex-wrap items-center gap-6 text-sm tabular-nums">
                      <div>
                        <span className="text-stone-500 mr-2">Harga:</span>
                        <span className="font-semibold text-stone-900">
                          {book.price > 0 ? formatRupiah(book.price) : 'Hubungi Admin'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 mr-2">Stok:</span>
                        <span className="font-semibold text-stone-900">{book.stock} eksemplar</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link
                      to={`/buku/${book.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 text-stone-800 text-sm font-medium hover:border-[#14532D] hover:text-[#14532D] transition-colors"
                    >
                      Detail Buku
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {book.status === 'segera_hadir' && (
                      <button
                        type="button"
                        onClick={() => setAwaitedBookId(book.id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors cursor-pointer"
                      >
                        <Bell className="w-4 h-4" />
                        Nantikan Peluncurannya
                      </button>
                    )}

                    {book.status === 'tersedia' && book.orderLink && (
                      <a
                        href={book.orderLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors"
                      >
                        Pesan Buku Sekarang
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {awaitedBookId === book.id && (
                    <p className="text-xs text-[#14532D] bg-[#F4EFE6] border border-stone-200 p-3 mt-3 max-w-xl">
                      Buku ini sedang dipersiapkan menuju peluncuran resmi. Pantau terus beranda
                      LapAs atau hubungi redaksi untuk kabar tanggal terbit resmi.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
