import { useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { AdminPage } from './pages/AdminPage';
import { ArtikelOpiniPage } from './pages/ArtikelOpiniPage';
import { BeritaPage } from './pages/BeritaPage';
import { BukuPage } from './pages/BukuPage';
import { DetailArtikelPage } from './pages/DetailArtikelPage';
import { DetailBukuPage } from './pages/DetailBukuPage';
import { HomePage } from './pages/HomePage';
import { KirimKaryaPage } from './pages/KirimKaryaPage';
import { KonsultasiHukumPage } from './pages/KonsultasiHukumPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PuisiPage } from './pages/PuisiPage';
import { ReflectiveRubricPage } from './pages/ReflectiveRubricPage';
import { SalamKenalPage } from './pages/SalamKenalPage';
import { SeniLukisPage } from './pages/SeniLukisPage';
import { TentangPage } from './pages/TentangPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SiteSettingsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/berita" element={<BeritaPage />} />
                <Route path="/artikel-opini" element={<ArtikelOpiniPage />} />
                <Route path="/rubrik-rohani" element={<ReflectiveRubricPage section="rohani" />} />
                <Route path="/motivasi" element={<ReflectiveRubricPage section="motivasi" />} />
                <Route path="/puisi" element={<PuisiPage />} />
                <Route path="/seni-lukis" element={<SeniLukisPage />} />
                <Route path="/salam-kenal" element={<SalamKenalPage />} />
                <Route path="/kirim-karya" element={<KirimKaryaPage />} />
                <Route path="/konsultasi-hukum" element={<KonsultasiHukumPage />} />
                <Route path="/buku" element={<BukuPage />} />
                <Route path="/buku/:slug" element={<DetailBukuPage />} />
                <Route path="/baca/:slug" element={<DetailArtikelPage />} />
                <Route path="/tentang" element={<TentangPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </BrowserRouter>
        </SiteSettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
