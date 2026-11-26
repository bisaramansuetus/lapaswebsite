import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { LogoMark } from './Logo';
import { SearchModal } from './SearchModal';

const PUBLIKASI_LINKS = [
  { label: 'Berita', to: '/berita' },
  { label: 'Artikel & Opini', to: '/artikel-opini' },
  { label: 'Rubrik Rohani', to: '/rubrik-rohani' },
  { label: 'Motivasi', to: '/motivasi' },
];

const EKSPRESI_LINKS = [
  { label: 'Puisi', to: '/puisi' },
  { label: 'Seni Lukis', to: '/seni-lukis' },
  { label: 'Salam Kenal', to: '/salam-kenal' },
];

export function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<'publikasi' | 'ekspresi' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
      isActive
        ? 'text-[#14532D] border-[#14532D]'
        : 'text-stone-700 border-transparent hover:text-[#14532D] hover:border-stone-300'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-[#14532D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
            aria-label="Beranda LapAs"
          >
            <LogoMark className="w-7 h-7" />
            <span className="font-serif text-xl font-semibold tracking-tight text-stone-900">
              LapAs
            </span>
          </Link>

          {/* Zone 2: Primary Navigation Links */}
          <nav
            ref={navRef}
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-6"
          >
            <NavLink to="/" end className={navLinkClass}>
              Beranda
            </NavLink>

            {/* Dropdown Publikasi */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'publikasi'}
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'publikasi' ? null : 'publikasi'))
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Publikasi
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDropdown === 'publikasi' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'publikasi' && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-stone-200 shadow-sm py-2 z-50">
                  {PUBLIKASI_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block px-4 py-2 text-sm text-stone-700 hover:bg-[#F4EFE6] hover:text-[#14532D] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Ruang Ekspresi */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'ekspresi'}
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'ekspresi' ? null : 'ekspresi'))
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Ruang Ekspresi
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDropdown === 'ekspresi' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'ekspresi' && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-stone-200 shadow-sm py-2 z-50">
                  {EKSPRESI_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block px-4 py-2 text-sm text-stone-700 hover:bg-[#F4EFE6] hover:text-[#14532D] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/konsultasi-hukum" className={navLinkClass}>
              Konsultasi Hukum
            </NavLink>
            <NavLink to="/buku" className={navLinkClass}>
              Buku
            </NavLink>
            <NavLink to="/tentang" className={navLinkClass}>
              Tentang LapAs
            </NavLink>
          </nav>

          {/* Zone 3: Search Action & Mobile Drawer Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Cari tulisan atau buku"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:text-[#14532D] border border-stone-300 bg-white hover:border-[#14532D] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Cari</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden p-2.5 text-stone-700 hover:text-[#14532D] border border-stone-300 bg-white cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 px-4 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <Link
              to="/"
              className="block py-2 text-base font-medium text-stone-900 border-b border-stone-100"
            >
              Beranda
            </Link>

            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">Publikasi</p>
              <div className="pl-3 space-y-1.5 border-l border-stone-200">
                {PUBLIKASI_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block py-1.5 text-sm text-stone-700 hover:text-[#14532D]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">
                Ruang Ekspresi
              </p>
              <div className="pl-3 space-y-1.5 border-l border-stone-200">
                {EKSPRESI_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block py-1.5 text-sm text-stone-700 hover:text-[#14532D]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-2">
              <Link to="/konsultasi-hukum" className="block py-1.5 text-sm font-medium text-stone-800">
                Konsultasi Hukum
              </Link>
              <Link to="/buku" className="block py-1.5 text-sm font-medium text-stone-800">
                Buku
              </Link>
              <Link to="/tentang" className="block py-1.5 text-sm font-medium text-stone-800">
                Tentang LapAs
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
