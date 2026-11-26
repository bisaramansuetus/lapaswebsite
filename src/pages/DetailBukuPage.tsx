import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, ExternalLink } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { SeoHead } from '../components/SeoHead';
import { ShareButtons } from '../components/ShareButtons';
import { EmptyState, LoadingState } from '../components/StateViews';
import { fetchBookBySlug } from '../services/lapasService';
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

export function DetailBukuPage() {
  const { slug } = useParams<{ slug: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    fetchBookBySlug(slug)
      .then((found) => {
        if (active) setBook(found);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <LoadingState message="Memuat detail buku..." />;

  if (!book) {
    return (
      <div className="py-20 px-4">
        <EmptyState
          title="Buku Tidak Ditemukan"
          description="Entri buku yang Anda cari tidak tersedia atau telah diperbarui."
          actionLabel="Kembali ke Katalog Buku"
          actionTo="/buku"
        />
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={`${book.title} — Buku LapAs`}
        description={book.synopsis.slice(0, 155)}
        type="book"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/buku"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-[#14532D] mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Katalog Buku
        </Link>

        <div className="bg-white border border-stone-200 p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 max-w-sm mx-auto w-full">
            <EditorialImage
              src={book.coverUrl}
              alt={book.title}
              aspectClass="aspect-[3/4]"
              className="border border-stone-200"
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
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
                  <span>Data Demo</span>
                </>
              )}
              {book.launchDate && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Tanggal Peluncuran: {book.launchDate}</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium leading-tight">
              {book.title}
            </h1>

            <p className="text-base text-stone-700">
              Penulis: <strong className="text-stone-900 font-medium">{book.authorName}</strong>
            </p>

            {/* Info Grid */}
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-stone-200 text-sm tabular-nums">
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-400">Status</dt>
                <dd className="font-medium text-stone-900 mt-1">{STATUS_LABEL[book.status]}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-400">Harga</dt>
                <dd className="font-medium text-stone-900 mt-1">
                  {book.status === 'segera_hadir'
                    ? 'Menunggu Peluncuran'
                    : book.price > 0
                      ? formatRupiah(book.price)
                      : 'Segera Diumumkan'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-stone-400">Ketersediaan</dt>
                <dd className="font-medium text-stone-900 mt-1">
                  {book.status === 'tersedia' ? `${book.stock} eksemplar` : STATUS_LABEL[book.status]}
                </dd>
              </div>
            </dl>

            <div>
              <h2 className="font-serif text-xl text-stone-900 mb-3">Sinopsis</h2>
              <p className="text-base text-stone-700 leading-relaxed whitespace-pre-line">
                {book.synopsis}
              </p>
            </div>

            {book.authorBio && (
              <div className="bg-[#FBF9F5] border border-stone-200 p-6">
                <h2 className="font-serif text-lg text-stone-900 mb-2">Tentang Penulis</h2>
                <p className="text-sm text-stone-600 leading-relaxed">{book.authorBio}</p>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-4">
              {book.status === 'segera_hadir' && (
                <button
                  type="button"
                  onClick={() => setNotified(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors"
                >
                  Pesan Buku Sekarang
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {book.status === 'habis' && (
                <span className="px-5 py-2.5 bg-stone-100 text-stone-600 text-sm border border-stone-200">
                  Stok Sedang Habis — Nantikan Cetakan Berikutnya
                </span>
              )}
            </div>

            {notified && (
              <p className="text-xs text-[#14532D] bg-[#F4EFE6] border border-stone-200 p-3">
                Informasi resmi pemesanan dan harga akan langsung aktif di halaman ini segera
                setelah Admin memperbarui status peluncuran buku.
              </p>
            )}

            <ShareButtons title={book.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
