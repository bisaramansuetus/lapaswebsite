import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { EDITORIAL_IMAGES } from '../../data/demoData';
import { slugify, uploadImageToStorage } from '../../services/lapasService';
import type {
  Article,
  ArticleSection,
  Book,
  BookStatus,
  Contributor,
  PublishStatus,
} from '../../types/lapas';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  defaultAsset?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  defaultAsset = EDITORIAL_IMAGES.hero,
}: ImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5 MB.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImageToStorage(file, folder);
      onChange(url);
    } catch {
      setUploadError(
        'Unggah ke Firebase Storage gagal (pastikan Storage aktif di Firebase Console). Anda bisa menempelkan URL gambar atau memilih aset bawaan.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-wider text-stone-600">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-stone-300 bg-[#FBF9F5] text-xs font-medium text-stone-700 hover:border-[#14532D] cursor-pointer whitespace-nowrap">
          <Upload className="w-3.5 h-3.5" />
          {uploading ? 'Mengunggah...' : 'Unggah Gambar'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL gambar atau path aset..."
          className="flex-1 px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
        />
        <button
          type="button"
          onClick={() => onChange(defaultAsset)}
          className="px-3 py-2 border border-stone-300 text-xs text-stone-600 hover:text-stone-900 cursor-pointer whitespace-nowrap"
        >
          Pakai Aset Default
        </button>
      </div>
      {uploadError && <p className="text-xs text-amber-800">{uploadError}</p>}
      {value && (
        <div className="w-36 h-24 border border-stone-200 bg-stone-100 overflow-hidden">
          <img
            src={value}
            alt="Pratinjau"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

interface ArticleFormModalProps {
  section: ArticleSection;
  initial?: Article | null;
  authorId: string;
  onClose: () => void;
  onSave: (data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => Promise<void>;
}

const SECTION_DEFAULT_CAT: Record<ArticleSection, string> = {
  berita: 'Literasi Nasional',
  'artikel-opini': 'Opini',
  rohani: 'Renungan',
  motivasi: 'Motivasi Kehidupan',
  puisi: 'Spiritualitas',
  'seni-lukis': 'Lukisan Alam & Refleksi',
};

export function ArticleFormModal({
  section,
  initial,
  authorId,
  onClose,
  onSave,
}: ArticleFormModalProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [category, setCategory] = useState(initial?.category || SECTION_DEFAULT_CAT[section]);
  const [authorName, setAuthorName] = useState(initial?.authorName || 'Tim Redaksi LapAs');
  const [imageUrl, setImageUrl] = useState(
    initial?.imageUrl ||
      (section === 'seni-lukis' ? EDITORIAL_IMAGES.painting : EDITORIAL_IMAGES.hero)
  );
  const [summary, setSummary] = useState(initial?.summary || '');
  const [content, setContent] = useState(initial?.content || '');
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription || '');
  const [status, setStatus] = useState<PublishStatus>(initial?.status || 'published');
  const [publishedAt, setPublishedAt] = useState(
    initial?.publishedAt || new Date().toISOString().slice(0, 10)
  );
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [medium, setMedium] = useState(initial?.medium || '');
  const [dimensions, setDimensions] = useState(initial?.dimensions || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 3 || content.trim().length < 10) {
      setError('Judul minimal 3 karakter dan isi artikel minimal 10 karakter.');
      return;
    }
    setSaving(true);
    try {
      await onSave(
        {
          title: title.trim(),
          slug: slugify(slug || title),
          section,
          category: category.trim() || SECTION_DEFAULT_CAT[section],
          authorName: authorName.trim() || 'Tim Redaksi LapAs',
          authorId,
          imageUrl: imageUrl.trim(),
          summary: summary.trim() || content.trim().slice(0, 160),
          content: content.trim(),
          metaTitle: metaTitle.trim() || title.trim(),
          metaDescription: metaDescription.trim() || summary.trim().slice(0, 160),
          status,
          publishedAt,
          featured,
          medium: medium.trim(),
          dimensions: dimensions.trim(),
        },
        initial?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
          <h2 className="font-serif text-2xl text-stone-900">
            {initial ? 'Edit Konten' : 'Tambah Konten Baru'} ({section})
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 text-stone-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Judul *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!initial) setSlug(slugify(e.target.value));
                }}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Slug URL *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Kategori *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Penulis / Seniman *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Tanggal Publikasi
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          {section === 'seni-lukis' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                  Medium Karya
                </label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="Contoh: Cat minyak di atas kanvas"
                  className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                  Dimensi
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="Contoh: 80 x 100 cm"
                  className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                />
              </div>
            </div>
          )}

          <ImageUploadField
            label="Gambar Utama"
            value={imageUrl}
            onChange={setImageUrl}
            folder={`articles/${section}`}
            defaultAsset={
              section === 'seni-lukis' ? EDITORIAL_IMAGES.painting : EDITORIAL_IMAGES.hero
            }
          />

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
              Ringkasan *
            </label>
            <textarea
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
              Isi Lengkap *
            </label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 text-sm leading-relaxed focus:outline-none focus:border-[#14532D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Meta Title (SEO)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Meta Description (SEO)
              </label>
              <input
                type="text"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PublishStatus)}
                className="w-full px-3 py-2 border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#14532D]"
              >
                <option value="published">Published (Tampil di Publik)</option>
                <option value="draft">Draft (Disimpan Privat)</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-2.5 pt-5 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#14532D]"
              />
              <span className="text-sm text-stone-700">Jadikan Pilihan Utama (Featured)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-sm text-stone-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Menyimpan...' : 'Simpan Konten'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface BookFormModalProps {
  initial?: Book | null;
  onClose: () => void;
  onSave: (data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => Promise<void>;
}

export function BookFormModal({ initial, onClose, onSave }: BookFormModalProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [authorName, setAuthorName] = useState(initial?.authorName || '');
  const [authorBio, setAuthorBio] = useState(initial?.authorBio || '');
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl || EDITORIAL_IMAGES.bookCover);
  const [synopsis, setSynopsis] = useState(initial?.synopsis || '');
  const [launchDate, setLaunchDate] = useState(initial?.launchDate || '');
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [status, setStatus] = useState<BookStatus>(initial?.status || 'segera_hadir');
  const [orderLink, setOrderLink] = useState(initial?.orderLink || '');
  const [isDemo, setIsDemo] = useState(initial?.isDemo ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 2 || synopsis.trim().length < 10) {
      setError('Judul buku dan sinopsis minimal 10 karakter wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      await onSave(
        {
          title: title.trim(),
          slug: slugify(slug || title),
          authorName: authorName.trim(),
          authorBio: authorBio.trim(),
          coverUrl: coverUrl.trim(),
          synopsis: synopsis.trim(),
          launchDate: launchDate.trim(),
          price: Number(price) || 0,
          stock: Number(stock) || 0,
          status,
          orderLink: orderLink.trim(),
          isDemo,
          featured,
        },
        initial?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan buku.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
          <h2 className="font-serif text-2xl text-stone-900">
            {initial ? 'Edit Data Buku' : 'Tambah Buku Baru'}
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 text-stone-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Judul Buku *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!initial) setSlug(slugify(e.target.value));
                }}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Slug URL *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Nama Penulis *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Tanggal Peluncuran
              </label>
              <input
                type="text"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
                placeholder="Contoh: 15 Januari 2027 atau Segera"
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <ImageUploadField
            label="Cover Buku"
            value={coverUrl}
            onChange={setCoverUrl}
            folder="books"
            defaultAsset={EDITORIAL_IMAGES.bookCover}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Status Buku
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full px-3 py-2 border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#14532D]"
              >
                <option value="segera_hadir">Segera Hadir</option>
                <option value="tersedia">Tersedia</option>
                <option value="habis">Habis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Harga (IDR)
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm tabular-nums focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Stok
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm tabular-nums focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
              Link Pembelian / Pemesanan WhatsApp
            </label>
            <input
              type="url"
              value={orderLink}
              onChange={(e) => setOrderLink(e.target.value)}
              placeholder="https://wa.me/628... atau tautan toko resmi"
              className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
              Sinopsis Buku *
            </label>
            <textarea
              rows={5}
              required
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 text-sm leading-relaxed focus:outline-none focus:border-[#14532D]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
              Biografi Singkat Penulis
            </label>
            <textarea
              rows={3}
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#14532D]"
              />
              <span className="text-sm text-stone-700">Tampilkan di Beranda (Buku Pilihan)</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDemo}
                onChange={(e) => setIsDemo(e.target.checked)}
                className="w-4 h-4 accent-[#14532D]"
              />
              <span className="text-sm text-stone-700">Tandai sebagai Data Demo</span>
            </label>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-sm text-stone-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Menyimpan...' : 'Simpan Buku'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ContributorFormModalProps {
  initial?: Contributor | null;
  onClose: () => void;
  onSave: (
    data: Omit<Contributor, 'id' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => Promise<void>;
}

export function ContributorFormModal({ initial, onClose, onSave }: ContributorFormModalProps) {
  const [name, setName] = useState(initial?.name || '');
  const [role, setRole] = useState(initial?.role || 'Kontributor');
  const [city, setCity] = useState(initial?.city || '');
  const [bio, setBio] = useState(initial?.bio || '');
  const [quote, setQuote] = useState(initial?.quote || '');
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl || EDITORIAL_IMAGES.hero);
  const [status, setStatus] = useState<PublishStatus>(initial?.status || 'published');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2 || bio.trim().length < 10) {
      setError('Nama dan biografi singkat (min 10 karakter) wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      await onSave(
        {
          name: name.trim(),
          role: role.trim(),
          city: city.trim(),
          bio: bio.trim(),
          quote: quote.trim(),
          avatarUrl: avatarUrl.trim(),
          status,
        },
        initial?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
          <h2 className="font-serif text-2xl text-stone-900">
            {initial ? 'Edit Profil Salam Kenal' : 'Tambah Profil Salam Kenal'}
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 text-stone-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Nama *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Peran / Profesi *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Kota / Daerah
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PublishStatus)}
                className="w-full px-3 py-2 border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#14532D]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <ImageUploadField
            label="Foto Profil"
            value={avatarUrl}
            onChange={setAvatarUrl}
            folder="contributors"
            defaultAsset={EDITORIAL_IMAGES.hero}
          />

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
              Biografi Singkat *
            </label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
              Kutipan / Moto
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-sm text-stone-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
