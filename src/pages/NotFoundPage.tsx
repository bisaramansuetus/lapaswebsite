import { Link } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';

export function NotFoundPage() {
  return (
    <div className="py-24 px-4">
      <SeoHead
        title="Halaman Tidak Ditemukan — LapAs"
        description="Halaman yang Anda tuju tidak tersedia di LapAs."
      />
      <div className="max-w-lg mx-auto bg-white border border-stone-200 p-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3">404</p>
        <h1 className="font-serif text-3xl text-stone-900 mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-stone-600 leading-relaxed mb-8">
          Tautan yang Anda buka mungkin telah berpindah atau tidak lagi tersedia. Silakan kembali
          ke beranda LapAs.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
