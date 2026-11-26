import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Upload } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { EDITORIAL_IMAGES } from '../data/demoData';
import { submitArtwork, uploadImageToStorage } from '../services/lapasService';
import type { SubmissionType } from '../types/lapas';

export function KirimKaryaPage() {
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState<SubmissionType>('puisi');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5 MB.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImageToStorage(file, 'submissions');
      setImageUrl(url);
    } catch {
      setError(
        'Unggah langsung ke Firebase Storage belum aktif atau dibatasi aturan bucket. Anda dapat menempelkan tautan URL gambar atau melanjutkan tanpa gambar.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (submitterName.trim().length < 2) {
      setError('Mohon isi nama lengkap minimal 2 karakter.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail.trim())) {
      setError('Mohon masukkan alamat email yang valid.');
      return;
    }
    if (title.trim().length < 2) {
      setError('Mohon isi judul karya atau kutipan perkenalan.');
      return;
    }
    if (content.trim().length < 10) {
      setError('Isi karya atau perkenalan minimal 10 karakter.');
      return;
    }

    setSubmitting(true);
    try {
      const id = await submitArtwork({
        submitterName,
        submitterEmail,
        city,
        type,
        title,
        category: category || type,
        content,
        imageUrl: imageUrl || (type === 'seni-lukis' ? EDITORIAL_IMAGES.painting : ''),
        bio,
      });
      setSubmittedId(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? 'Gagal mengirim karya ke server. Pastikan koneksi stabil dan coba kembali.'
          : 'Terjadi kesalahan saat mengirim karya.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title="Kirim Karya — Ruang Ekspresi LapAs"
        description="Formulir pengiriman karya puisi, seni lukis, tulisan reflektif, dan perkenalan Salam Kenal untuk ditinjau redaksi LapAs."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pb-8 mb-8 border-b border-stone-200">
          <p className="text-xs uppercase tracking-[0.2em] text-[#14532D] mb-2">
            Ruang Ekspresi · Partisipasi Publik
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium mb-3">
            Kirim Karya ke LapAs
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Setiap karya puisi, seni lukis, esai reflektif, maupun perkenalan Salam Kenal yang
            Anda kirim akan berstatus <strong>menunggu moderasi</strong> dan ditinjau oleh admin
            sebelum ditampilkan di website.
          </p>
        </header>

        {submittedId ? (
          <div className="bg-white border border-stone-200 p-8 sm:p-10 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-[#14532D] mx-auto" />
            <h2 className="font-serif text-2xl text-stone-900">
              Karya Anda Berhasil Dikirim
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
              Terima kasih telah berbagi karya di Ruang Ekspresi LapAs. Kiriman Anda saat ini
              berstatus <strong>Menunggu Moderasi</strong> dan akan diperiksa oleh tim redaksi
              sebelum diterbitkan.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setSubmittedId(null);
                  setTitle('');
                  setContent('');
                  setImageUrl('');
                }}
                className="px-5 py-2.5 border border-stone-300 text-sm font-medium text-stone-700 hover:border-[#14532D] cursor-pointer"
              >
                Kirim Karya Lain
              </button>
              <Link
                to="/puisi"
                className="px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21]"
              >
                Lihat Ruang Ekspresi
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-stone-200 p-6 sm:p-10 space-y-6"
          >
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                  Nama Lengkap / Nama Pena *
                </label>
                <input
                  type="text"
                  required
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                  placeholder="Contoh: Ahmad Pratama"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                  Alamat Email (Privat untuk Redaksi) *
                </label>
                <input
                  type="email"
                  required
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                  Jenis Kiriman *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as SubmissionType)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#14532D]"
                >
                  <option value="puisi">Puisi</option>
                  <option value="seni-lukis">Seni Lukis</option>
                  <option value="tulisan">Tulisan / Refleksi</option>
                  <option value="salam-kenal">Profil Salam Kenal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                  Kota / Asal Daerah
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                  placeholder="Contoh: Bandung, Surabaya, Makassar"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                  {type === 'salam-kenal'
                    ? 'Kutipan Singkat / Moto Hidup *'
                    : 'Judul Karya *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                  placeholder="Tulis judul karya Anda"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                  {type === 'salam-kenal' ? 'Profesi / Peran' : 'Tema / Kategori'}
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                  placeholder={
                    type === 'salam-kenal'
                      ? 'Contoh: Pembaca & Guru Sastra'
                      : 'Contoh: Spiritualitas, Alam, Harapan'
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                {type === 'seni-lukis'
                  ? 'Deskripsi Karya & Makna Lukisan *'
                  : type === 'salam-kenal'
                    ? 'Perkenalan Diri Anda *'
                    : 'Isi Karya *'}
              </label>
              <textarea
                required
                rows={7}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 text-sm leading-relaxed focus:outline-none focus:border-[#14532D]"
                placeholder="Tuliskan naskah puisi, deskripsi karya seni, atau cerita perkenalan Anda..."
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                Unggah Gambar Karya / Foto Profil (Opsional)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-300 bg-[#FBF9F5] text-xs font-medium text-stone-700 hover:border-[#14532D] cursor-pointer whitespace-nowrap">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Mengunggah...' : 'Pilih File Gambar'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Atau tempel tautan URL gambar (https://...)"
                  className="flex-1 px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                Biografi Singkat Pengirim (Opsional)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                placeholder="Ceritakan sedikit tentang minat literasi atau seni Anda..."
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <p className="text-xs text-stone-500">
                Email Anda dijaga kerahasiaannya dan hanya dilihat oleh admin redaksi.
              </p>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="px-6 py-3 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {submitting ? 'Mengirim...' : 'Kirim untuk Moderasi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
