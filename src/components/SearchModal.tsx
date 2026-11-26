import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { fetchBooks, fetchPublishedArticles } from '../services/lapasService';
import type { Article, Book } from '../types/lapas';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SECTION_LABEL: Record<Article['section'], string> = {
  berita: 'Berita',
  'artikel-opini': 'Artikel & Opini',
  rohani: 'Rubrik Rohani',
  motivasi: 'Motivasi',
  puisi: 'Puisi',
  'seni-lukis': 'Seni Lukis',
};

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [queryText, setQueryText] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    Promise.all([fetchPublishedArticles(), fetchBooks()])
      .then(([artRes, bookRes]) => {
        if (!active) return;
        setArticles(artRes.items);
        setBooks(bookRes.items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const q = queryText.trim().toLowerCase();
  const filteredArticles = q
    ? articles
        .filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.summary.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.authorName.toLowerCase().includes(q)
        )
        .slice(0, 8)
    : articles.slice(0, 5);

  const filteredBooks = q
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.authorName.toLowerCase().includes(q) ||
          b.synopsis.toLowerCase().includes(q)
      )
    : books.slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-[2px] flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian LapAs"
    >
      <div className="bg-[#FBF9F5] border border-stone-300 w-full max-w-2xl shadow-lg overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-stone-200">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="search"
            autoFocus
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Cari berita, opini, renungan, puisi, karya seni, atau buku..."
            className="w-full text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pencarian"
            className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5 space-y-6">
          {loading ? (
            <p className="text-sm text-stone-500 py-4 text-center">Memuat indeks bacaan...</p>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                  {q ? 'Hasil Publikasi & Karya' : 'Publikasi Terbaru'}
                </p>
                {filteredArticles.length === 0 ? (
                  <p className="text-sm text-stone-500">
                    Tidak ada publikasi yang cocok dengan kata kunci tersebut.
                  </p>
                ) : (
                  <div className="divide-y divide-stone-200 bg-white border border-stone-200">
                    {filteredArticles.map((art) => (
                      <Link
                        key={art.id}
                        to={`/baca/${art.slug}`}
                        onClick={onClose}
                        className="block p-4 hover:bg-[#F4EFE6]/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <span>{SECTION_LABEL[art.section]}</span>
                          <span aria-hidden="true">·</span>
                          <span>{art.category}</span>
                        </div>
                        <p className="font-serif text-base text-stone-900 font-medium">
                          {art.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-3">Katalog Buku</p>
                {filteredBooks.length === 0 ? (
                  <p className="text-sm text-stone-500">Tidak ada buku yang cocok.</p>
                ) : (
                  <div className="divide-y divide-stone-200 bg-white border border-stone-200">
                    {filteredBooks.map((book) => (
                      <Link
                        key={book.id}
                        to={`/buku/${book.slug}`}
                        onClick={onClose}
                        className="block p-4 hover:bg-[#F4EFE6]/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <span>Buku</span>
                          <span aria-hidden="true">·</span>
                          <span>{book.authorName}</span>
                        </div>
                        <p className="font-serif text-base text-stone-900 font-medium">
                          {book.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
