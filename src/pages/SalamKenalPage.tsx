import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews';
import { fetchPublishedContributors } from '../services/lapasService';
import type { Contributor } from '../types/lapas';

export function SalamKenalPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchPublishedContributors()
      .then((res) => setContributors(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat profil.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title="Salam Kenal — Ruang Ekspresi LapAs"
        description="Profil penulis, seniman, kontributor, dan pembaca LapAs dari seluruh Indonesia."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pb-8 mb-10 border-b border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
              Ruang Ekspresi · Jejaring Komunitas
            </p>
            <h1 className="font-serif text-4xl text-stone-900 font-medium mb-3">Salam Kenal</h1>
            <p className="text-base text-stone-600 max-w-2xl">
              Mengenal lebih dekat para penulis, kontributor, perupa, dan pembaca yang ikut merawat
              ruang literasi LapAs dari berbagai daerah di Indonesia.
            </p>
          </div>
          <Link
            to="/kirim-karya"
            className="px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            Kirim Karya / Perkenalan
          </Link>
        </header>

        {loading ? (
          <LoadingState message="Memuat profil kontributor..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : contributors.length === 0 ? (
          <EmptyState
            title="Belum Ada Profil Dipublikasikan"
            description="Perkenalkan diri Anda atau kirimkan karya melalui formulir Ruang Ekspresi."
            actionLabel="Kirim Karya"
            actionTo="/kirim-karya"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((person) => (
              <article
                key={person.id}
                className="bg-white border border-stone-200 p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                      <img
                        src={person.avatarUrl}
                        alt={person.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-serif text-xl text-stone-900 truncate">{person.name}</h2>
                      <p className="text-xs text-[#14532D] font-medium mt-0.5 truncate">
                        {person.role}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5 truncate">{person.city}</p>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-5">{person.bio}</p>
                </div>
                {person.quote && (
                  <blockquote className="font-serif italic text-xs text-stone-500 pt-4 border-t border-stone-100">
                    &ldquo;{person.quote}&rdquo;
                  </blockquote>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
