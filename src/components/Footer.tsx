import { Link } from 'react-router-dom';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { LogoMark } from './Logo';

export function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111D16] text-stone-200 border-t border-[#1E3327]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white">
              <LogoMark className="w-7 h-7 text-[#D6CEBE]" />
              <span className="font-serif text-xl font-semibold tracking-tight">
                {settings.siteName}
              </span>
            </Link>
            <p className="text-xs uppercase tracking-widest text-[#D6CEBE]">
              {settings.tagline}
            </p>
            <p className="text-sm text-stone-300 leading-relaxed">
              Media literasi, publikasi, refleksi rohani, edukasi hukum, dan ruang ekspresi digital
              bagi masyarakat Indonesia.
            </p>
          </div>

          {/* Navigasi Website */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-white tracking-wide mb-4">
              Navigasi Website
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/konsultasi-hukum" className="hover:text-white transition-colors">
                  Konsultasi Hukum
                </Link>
              </li>
              <li>
                <Link to="/buku" className="hover:text-white transition-colors">
                  Katalog Buku
                </Link>
              </li>
              <li>
                <Link to="/salam-kenal" className="hover:text-white transition-colors">
                  Salam Kenal
                </Link>
              </li>
              <li>
                <Link to="/kirim-karya" className="hover:text-white transition-colors">
                  Kirim Karya
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-white transition-colors">
                  Tentang LapAs
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori Publikasi */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-white tracking-wide mb-4">
              Kategori Publikasi
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link to="/berita" className="hover:text-white transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link to="/artikel-opini" className="hover:text-white transition-colors">
                  Artikel &amp; Opini
                </Link>
              </li>
              <li>
                <Link to="/rubrik-rohani" className="hover:text-white transition-colors">
                  Rubrik Rohani
                </Link>
              </li>
              <li>
                <Link to="/motivasi" className="hover:text-white transition-colors">
                  Motivasi
                </Link>
              </li>
              <li>
                <Link to="/puisi" className="hover:text-white transition-colors">
                  Puisi
                </Link>
              </li>
              <li>
                <Link to="/seni-lukis" className="hover:text-white transition-colors">
                  Seni Lukis
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Sosial */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-white tracking-wide">
              Kontak &amp; Media Sosial
            </h3>
            <div className="space-y-2 text-sm text-stone-300">
              <p>{settings.contactEmail}</p>
              <p>{settings.contactWhatsapp}</p>
              <p className="text-stone-400 text-xs leading-relaxed">{settings.contactAddress}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
              {settings.socialInstagram && (
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-white underline underline-offset-4"
                >
                  Instagram
                </a>
              )}
              {settings.socialYoutube && (
                <a
                  href={settings.socialYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-white underline underline-offset-4"
                >
                  YouTube
                </a>
              )}
              {settings.socialFacebook && (
                <a
                  href={settings.socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-white underline underline-offset-4"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            &copy; {year} {settings.siteName} — {settings.tagline}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/tentang" className="hover:text-stone-200 transition-colors">
              Identitas &amp; Visi
            </Link>
            <Link to="/admin" className="hover:text-stone-200 transition-colors">
              Dashboard Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
