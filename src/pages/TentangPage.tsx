import { Link } from 'react-router-dom';
import { LogoMark } from '../components/Logo';
import { SeoHead } from '../components/SeoHead';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export function TentangPage() {
  const { settings } = useSiteSettings();

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title="Tentang LapAs — Lepaskan Amarahmu Panggil Allah Selalu"
        description="Profil, makna nama LapAs, visi, misi, tujuan, profil penulis, dan informasi kontak resmi LapAs."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <header className="pb-8 border-b border-stone-200">
          <div className="inline-flex items-center gap-2.5 text-[#14532D] mb-4">
            <LogoMark className="w-7 h-7" />
            <span className="text-xs uppercase tracking-[0.2em] font-medium">
              Identitas &amp; Manifestasi
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-medium mb-4">
            Tentang {settings.siteName}
          </h1>
          <p className="text-lg font-serif italic text-[#78350F]">{settings.tagline}</p>
        </header>

        {/* Profil & Makna Nama */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-200 p-8">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">Profil LapAs</h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
              {settings.aboutProfile}
            </p>
          </div>
          <div className="bg-[#F4EFE6] border border-stone-300 p-8">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">Makna Nama LapAs</h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
              {settings.aboutMeaning}
            </p>
          </div>
        </section>

        {/* Visi, Misi, Tujuan */}
        <section className="bg-white border border-stone-200 p-8 sm:p-10 space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-stone-900 mb-3">Visi</h2>
            <p className="text-base text-stone-700 leading-relaxed whitespace-pre-line">
              {settings.vision}
            </p>
          </div>

          <div className="pt-8 border-t border-stone-200">
            <h2 className="font-serif text-2xl text-stone-900 mb-3">Misi</h2>
            <p className="text-base text-stone-700 leading-relaxed whitespace-pre-line">
              {settings.mission}
            </p>
          </div>

          <div className="pt-8 border-t border-stone-200">
            <h2 className="font-serif text-2xl text-stone-900 mb-3">Tujuan</h2>
            <p className="text-base text-stone-700 leading-relaxed whitespace-pre-line">
              {settings.goals}
            </p>
          </div>
        </section>

        {/* Profil Pendiri / Penulis */}
        <section className="bg-white border border-stone-200 p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
            Pemrakarsa &amp; Penulis
          </p>
          <h2 className="font-serif text-2xl text-stone-900 mb-1">{settings.founderName}</h2>
          <p className="text-sm text-[#14532D] font-medium mb-4">{settings.founderRole}</p>
          <p className="text-base text-stone-700 leading-relaxed whitespace-pre-line max-w-3xl">
            {settings.founderBio}
          </p>
        </section>

        {/* Kontak */}
        <section className="bg-[#111D16] text-stone-200 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-white">Kontak Redaksi</h2>
            <p className="text-sm text-stone-300">Email: {settings.contactEmail}</p>
            <p className="text-sm text-stone-300">WhatsApp: {settings.contactWhatsapp}</p>
            <p className="text-xs text-stone-400">{settings.contactAddress}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/kirim-karya"
              className="px-5 py-2.5 bg-white text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors"
            >
              Kirim Karya
            </Link>
            <Link
              to="/konsultasi-hukum"
              className="px-5 py-2.5 border border-white/30 text-white text-sm font-medium hover:border-white transition-colors"
            >
              Konsultasi Hukum
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
