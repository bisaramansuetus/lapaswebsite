import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Check,
  Database,
  Edit3,
  Feather,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Palette,
  Plus,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  ArticleFormModal,
  BookFormModal,
  ContributorFormModal,
} from '../components/admin/AdminForms';
import { LogoMark } from '../components/Logo';
import { SeoHead } from '../components/SeoHead';
import { LoadingState } from '../components/StateViews';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { BOOTSTRAPPED_ADMIN_EMAIL } from '../lib/firebase';
import {
  deleteArticleAdmin,
  deleteBookAdmin,
  deleteConsultationAdmin,
  deleteContributorAdmin,
  deleteSubmissionAdmin,
  fetchAllArticlesAdmin,
  fetchAllBooksAdmin,
  fetchAllConsultationsAdmin,
  fetchAllContributorsAdmin,
  fetchAllSubmissionsAdmin,
  moderateSubmissionAdmin,
  saveArticleAdmin,
  saveBookAdmin,
  saveContributorAdmin,
  saveSiteSettingsAdmin,
  seedDemoContentToFirestore,
  updateConsultationAdmin,
} from '../services/lapasService';
import type {
  Article,
  ArticleSection,
  ArtworkSubmission,
  Book,
  Consultation,
  Contributor,
  SiteSettings,
} from '../types/lapas';

type AdminTab =
  | 'dashboard'
  | 'berita'
  | 'artikel-opini'
  | 'rohani'
  | 'motivasi'
  | 'puisi'
  | 'seni-lukis'
  | 'salam-kenal'
  | 'konsultasi'
  | 'buku'
  | 'pengiriman-karya'
  | 'pengaturan';

const SIDEBAR_ITEMS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'berita', label: 'Berita', icon: Newspaper },
  { id: 'artikel-opini', label: 'Artikel & Opini', icon: FileText },
  { id: 'rohani', label: 'Rubrik Rohani', icon: Sparkles },
  { id: 'motivasi', label: 'Motivasi', icon: FileText },
  { id: 'puisi', label: 'Puisi', icon: Feather },
  { id: 'seni-lukis', label: 'Seni Lukis', icon: Palette },
  { id: 'salam-kenal', label: 'Salam Kenal', icon: Users },
  { id: 'konsultasi', label: 'Konsultasi Hukum', icon: Scale },
  { id: 'buku', label: 'Buku', icon: BookOpen },
  { id: 'pengiriman-karya', label: 'Pengiriman Karya', icon: Inbox },
  { id: 'pengaturan', label: 'Pengaturan Website', icon: Settings },
];

const ARTICLE_TABS: ArticleSection[] = [
  'berita',
  'artikel-opini',
  'rohani',
  'motivasi',
  'puisi',
  'seni-lukis',
];

export function AdminPage() {
  const { user, isAdmin, authReady, authError, signInWithGoogle, logout } = useAuth();
  const { settings, refreshSettings } = useSiteSettings();

  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [articles, setArticles] = useState<Article[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [submissions, setSubmissions] = useState<ArtworkSubmission[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Modal states
  const [articleModal, setArticleModal] = useState<{
    section: ArticleSection;
    item?: Article | null;
  } | null>(null);
  const [bookModal, setBookModal] = useState<{ item?: Book | null } | null>(null);
  const [contribModal, setContribModal] = useState<{ item?: Contributor | null } | null>(null);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [consultNotes, setConsultNotes] = useState('');
  const [consultStatus, setConsultStatus] = useState<Consultation['status']>('baru');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Omit<SiteSettings, 'id' | 'updatedAt'>>(settings);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setSettingsForm({
      siteName: settings.siteName,
      tagline: settings.tagline,
      heroHeadline: settings.heroHeadline,
      heroSubheadline: settings.heroSubheadline,
      aboutProfile: settings.aboutProfile,
      aboutMeaning: settings.aboutMeaning,
      vision: settings.vision,
      mission: settings.mission,
      goals: settings.goals,
      founderName: settings.founderName,
      founderRole: settings.founderRole,
      founderBio: settings.founderBio,
      contactEmail: settings.contactEmail,
      contactWhatsapp: settings.contactWhatsapp,
      contactAddress: settings.contactAddress,
      socialInstagram: settings.socialInstagram,
      socialYoutube: settings.socialYoutube,
      socialFacebook: settings.socialFacebook,
      legalDisclaimer: settings.legalDisclaimer,
    });
  }, [settings]);

  const loadAllAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    try {
      const [art, bk, con, sub, ctr] = await Promise.all([
        fetchAllArticlesAdmin(),
        fetchAllBooksAdmin(),
        fetchAllConsultationsAdmin(),
        fetchAllSubmissionsAdmin(),
        fetchAllContributorsAdmin(),
      ]);
      setArticles(art);
      setBooks(bk);
      setConsultations(con);
      setSubmissions(sub);
      setContributors(ctr);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      void loadAllAdminData();
    }
  }, [isAdmin, loadAllAdminData]);

  const notify = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Gate 1: Auth loading
  if (!authReady) {
    return <LoadingState message="Memeriksa sesi autentikasi Firebase..." />;
  }

  // Gate 2: Not signed in
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <SeoHead title="Masuk Admin — LapAs" description="Portal autentikasi admin redaksi LapAs." />
        <div className="bg-white border border-stone-200 max-w-md w-full p-8 sm:p-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-[#14532D] mx-auto">
            <LogoMark className="w-7 h-7" />
            <span className="font-serif text-xl font-semibold text-stone-900">LapAs Admin</span>
          </div>
          <h1 className="font-serif text-2xl text-stone-900">Masuk ke Dashboard Redaksi</h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Gunakan akun Google Admin yang telah terdaftar di sistem Firebase Authentication untuk
            mengelola berita, artikel, buku, konsultasi hukum, dan moderasi karya.
          </p>
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
              {authError}
            </div>
          )}
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full px-5 py-3 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors cursor-pointer"
          >
            Masuk dengan Akun Google
          </button>
          <p className="text-xs text-stone-500">
            <Link to="/" className="hover:underline">
              ← Kembali ke Beranda Publik
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Gate 3: Signed in, but not authorized admin
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <SeoHead title="Akses Terbatas — LapAs" description="Akses dashboard hanya untuk admin." />
        <div className="bg-white border border-stone-200 max-w-md w-full p-8 sm:p-10 text-center space-y-5">
          <ShieldCheck className="w-9 h-9 text-amber-700 mx-auto" />
          <h1 className="font-serif text-2xl text-stone-900">Akses Khusus Admin</h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Anda masuk sebagai <strong>{user.email}</strong>, namun akun ini belum memiliki peran
            Admin di Firestore. Masuklah menggunakan akun pemilik ({BOOTSTRAPPED_ADMIN_EMAIL}) atau
            minta admin utama menetapkan peran Anda di koleksi <code>users</code>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={logout}
              className="px-5 py-2.5 border border-stone-300 text-sm font-medium text-stone-700 hover:border-stone-500 cursor-pointer"
            >
              Keluar Akun
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21]"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin Stats
  const totalBerita = articles.filter((a) => a.section === 'berita').length;
  const totalArtikel = articles.filter((a) => a.section !== 'berita').length;
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending').length;

  const isArticleSectionTab = ARTICLE_TABS.includes(tab as ArticleSection);
  const tabArticles = isArticleSectionTab
    ? articles.filter((a) => a.section === tab)
    : [];

  const handleSeedDemo = async () => {
    await seedDemoContentToFirestore(user.uid);
    await loadAllAdminData();
    await refreshSettings();
    notify('Data demo berhasil dimuat ke Cloud Firestore.');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col lg:flex-row">
      <SeoHead title="Dashboard Admin — LapAs" description="Panel pengelolaan konten LapAs." />

      {/* Sidebar */}
      <aside className="lg:w-64 bg-[#111D16] text-stone-200 shrink-0 border-r border-[#1E3327]">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <LogoMark className="w-6 h-6 text-[#D6CEBE]" />
            <span className="font-serif text-lg font-semibold">LapAs Admin</span>
          </Link>
        </div>

        <nav className="p-3 space-y-1 overflow-x-auto lg:overflow-visible flex lg:block gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap lg:w-full text-left ${
                  active
                    ? 'bg-[#14532D] text-white'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.id === 'pengiriman-karya' && pendingSubmissions > 0 && (
                  <span className="ml-auto text-xs font-mono tabular-nums text-[#D6CEBE]">
                    {pendingSubmissions}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto hidden lg:block">
          <p className="text-xs text-stone-400 truncate mb-2">{user.email}</p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 text-xs text-stone-300 hover:text-white cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-500">Panel Redaksi</p>
            <h1 className="font-serif text-3xl text-stone-900 font-medium">
              {SIDEBAR_ITEMS.find((i) => i.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 border border-stone-300 bg-white text-xs font-medium text-stone-700 hover:border-[#14532D]"
            >
              Lihat Website Publik
            </Link>
            <button
              type="button"
              onClick={logout}
              className="lg:hidden px-3 py-2 border border-stone-300 bg-white text-xs text-stone-700 cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-6 p-4 bg-[#F4EFE6] border border-[#14532D]/30 text-sm text-[#14532D]">
            {actionMessage}
          </div>
        )}

        {loadingData ? (
          <LoadingState message="Memuat data Firestore..." />
        ) : (
          <>
            {/* 1. Dashboard Overview */}
            {tab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white border border-stone-200 p-5">
                    <p className="text-xs text-stone-500 mb-1">Jumlah Artikel</p>
                    <p className="font-serif text-3xl text-stone-900 tabular-nums">{totalArtikel}</p>
                  </div>
                  <div className="bg-white border border-stone-200 p-5">
                    <p className="text-xs text-stone-500 mb-1">Jumlah Berita</p>
                    <p className="font-serif text-3xl text-stone-900 tabular-nums">{totalBerita}</p>
                  </div>
                  <div className="bg-white border border-stone-200 p-5">
                    <p className="text-xs text-stone-500 mb-1">Jumlah Buku</p>
                    <p className="font-serif text-3xl text-stone-900 tabular-nums">{books.length}</p>
                  </div>
                  <div className="bg-white border border-stone-200 p-5">
                    <p className="text-xs text-stone-500 mb-1">Konsultasi Hukum</p>
                    <p className="font-serif text-3xl text-stone-900 tabular-nums">
                      {consultations.length}
                    </p>
                  </div>
                  <div className="bg-white border border-stone-200 p-5">
                    <p className="text-xs text-stone-500 mb-1">Menunggu Moderasi</p>
                    <p className="font-serif text-3xl text-[#78350F] tabular-nums">
                      {pendingSubmissions}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="max-w-xl">
                    <h2 className="font-serif text-xl text-stone-900 mb-2">
                      Inisialisasi Data Awal di Firestore
                    </h2>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Jika koleksi Firestore masih kosong, Anda dapat memuat seluruh contoh berita,
                      artikel, puisi, seni lukis, profil Salam Kenal, pengaturan website, dan Buku
                      Perdana LapAs (Data Demo) ke database dengan satu klik untuk langsung disunting.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSeedDemo}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Database className="w-4 h-4" />
                    Muat Data Demo ke Firestore
                  </button>
                </div>
              </div>
            )}

            {/* 2. Articles / Berita / Rohani / Motivasi / Puisi / Seni Lukis */}
            {isArticleSectionTab && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setArticleModal({ section: tab as ArticleSection, item: null })}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Konten Baru
                  </button>
                </div>

                {tabArticles.length === 0 ? (
                  <div className="bg-white border border-stone-200 p-10 text-center text-sm text-stone-600">
                    Belum ada data tersimpan di Firestore untuk rubrik ini. Klik &ldquo;Tambah
                    Konten Baru&rdquo; atau muat data demo dari Dashboard.
                  </div>
                ) : (
                  <div className="bg-white border border-stone-200 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#FBF9F5] border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500">
                        <tr>
                          <th className="px-4 py-3">Judul</th>
                          <th className="px-4 py-3">Kategori</th>
                          <th className="px-4 py-3">Penulis</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Tanggal</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {tabArticles.map((art) => (
                          <tr key={art.id} className="hover:bg-stone-50">
                            <td className="px-4 py-3 font-medium text-stone-900 max-w-xs truncate">
                              {art.title}
                            </td>
                            <td className="px-4 py-3 text-stone-600">{art.category}</td>
                            <td className="px-4 py-3 text-stone-600">{art.authorName}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-medium ${
                                  art.status === 'published' ? 'text-[#14532D]' : 'text-amber-700'
                                }`}
                              >
                                {art.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-stone-500 tabular-nums">
                              {art.publishedAt}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setArticleModal({ section: art.section, item: art })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 border border-stone-300 text-xs text-stone-700 hover:border-[#14532D] cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  await deleteArticleAdmin(art.id);
                                  await loadAllAdminData();
                                  notify('Konten berhasil dihapus.');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 border border-red-200 text-xs text-red-700 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. Buku CRUD */}
            {tab === 'buku' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setBookModal({ item: null })}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Buku Baru
                  </button>
                </div>

                {books.length === 0 ? (
                  <div className="bg-white border border-stone-200 p-10 text-center text-sm text-stone-600">
                    Belum ada buku di Firestore. Tambahkan data buku resmi atau muat data demo
                    terlebih dahulu.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {books.map((bk) => (
                      <div
                        key={bk.id}
                        className="bg-white border border-stone-200 p-6 flex gap-5 items-start"
                      >
                        <img
                          src={bk.coverUrl}
                          alt={bk.title}
                          referrerPolicy="no-referrer"
                          className="w-24 aspect-[3/4] object-cover border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="text-xs text-stone-500">
                            Status:{' '}
                            <strong className="text-[#14532D] uppercase">{bk.status}</strong>
                            {bk.isDemo && ' · Data Demo'}
                          </div>
                          <h3 className="font-serif text-xl text-stone-900 truncate">{bk.title}</h3>
                          <p className="text-xs text-stone-600">{bk.authorName}</p>
                          <p className="text-xs text-stone-500 tabular-nums">
                            Harga: Rp {bk.price.toLocaleString('id-ID')} · Stok: {bk.stock}
                          </p>
                          <div className="pt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setBookModal({ item: bk })}
                              className="px-3 py-1.5 border border-stone-300 text-xs text-stone-700 hover:border-[#14532D] cursor-pointer"
                            >
                              Edit &amp; Atur Status
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteBookAdmin(bk.id);
                                await loadAllAdminData();
                                notify('Buku berhasil dihapus.');
                              }}
                              className="px-3 py-1.5 border border-red-200 text-xs text-red-700 hover:bg-red-50 cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Salam Kenal CRUD */}
            {tab === 'salam-kenal' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setContribModal({ item: null })}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Profil Salam Kenal
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contributors.map((c) => (
                    <div key={c.id} className="bg-white border border-stone-200 p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-serif text-lg text-stone-900">{c.name}</h3>
                          <p className="text-xs text-stone-500">
                            {c.role} · {c.city}
                          </p>
                        </div>
                        <span className="text-xs text-[#14532D] font-medium">{c.status}</span>
                      </div>
                      <p className="text-sm text-stone-600 line-clamp-2">{c.bio}</p>
                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setContribModal({ item: c })}
                          className="px-3 py-1.5 border border-stone-300 text-xs text-stone-700 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteContributorAdmin(c.id);
                            await loadAllAdminData();
                            notify('Profil kontributor dihapus.');
                          }}
                          className="px-3 py-1.5 border border-red-200 text-xs text-red-700 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Konsultasi Hukum (Private Admin Inbox) */}
            {tab === 'konsultasi' && (
              <div className="space-y-6">
                {consultations.length === 0 ? (
                  <div className="bg-white border border-stone-200 p-10 text-center text-sm text-stone-600">
                    Belum ada permohonan konsultasi hukum yang masuk.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultations.map((con) => (
                      <div key={con.id} className="bg-white border border-stone-200 p-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-serif text-xl text-stone-900">{con.name}</h3>
                            <p className="text-xs text-stone-500">
                              {con.topic} · {con.email} · {con.whatsapp}
                            </p>
                          </div>
                          <span className="text-xs font-medium uppercase tracking-wider text-[#172554]">
                            Status: {con.status}
                          </span>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-[#FBF9F5] p-4 border border-stone-100">
                          {con.description}
                        </p>
                        {con.adminNotes && (
                          <p className="text-xs text-stone-600">
                            <strong>Catatan Admin:</strong> {con.adminNotes}
                          </p>
                        )}
                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveConsultation(con);
                              setConsultStatus(con.status);
                              setConsultNotes(con.adminNotes || '');
                            }}
                            className="px-3.5 py-1.5 bg-[#172554] text-white text-xs font-medium cursor-pointer"
                          >
                            Kelola Status &amp; Catatan
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await deleteConsultationAdmin(con.id);
                              await loadAllAdminData();
                              notify('Data konsultasi dihapus.');
                            }}
                            className="px-3.5 py-1.5 border border-red-200 text-xs text-red-700 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeConsultation && (
                  <div className="fixed inset-0 z-50 bg-stone-950/50 flex items-center justify-center p-4">
                    <div className="bg-white border border-stone-200 max-w-lg w-full p-6 space-y-4">
                      <h3 className="font-serif text-xl text-stone-900">
                        Tindak Lanjut Konsultasi — {activeConsultation.name}
                      </h3>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                          Status Penanganan
                        </label>
                        <select
                          value={consultStatus}
                          onChange={(e) =>
                            setConsultStatus(e.target.value as Consultation['status'])
                          }
                          className="w-full px-3 py-2 border border-stone-300 text-sm bg-white"
                        >
                          <option value="baru">Baru</option>
                          <option value="ditinjau">Ditinjau</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                          Catatan Internal Admin
                        </label>
                        <textarea
                          rows={4}
                          value={consultNotes}
                          onChange={(e) => setConsultNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 text-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveConsultation(null)}
                          className="px-4 py-2 border border-stone-300 text-xs text-stone-700 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await updateConsultationAdmin(
                              activeConsultation.id,
                              consultStatus,
                              consultNotes
                            );
                            setActiveConsultation(null);
                            await loadAllAdminData();
                            notify('Status konsultasi diperbarui.');
                          }}
                          className="px-4 py-2 bg-[#14532D] text-white text-xs font-medium cursor-pointer"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. Pengiriman Karya (Moderasi) */}
            {tab === 'pengiriman-karya' && (
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="bg-white border border-stone-200 p-10 text-center text-sm text-stone-600">
                    Belum ada karya kiriman pengunjung yang menunggu moderasi.
                  </div>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub.id} className="bg-white border border-stone-200 p-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-stone-500">
                            {sub.type} · {sub.category} · {sub.submitterName} ({sub.submitterEmail})
                            {sub.city ? ` · ${sub.city}` : ''}
                          </p>
                          <h3 className="font-serif text-xl text-stone-900 mt-1">{sub.title}</h3>
                        </div>
                        <span
                          className={`text-xs font-semibold uppercase ${
                            sub.status === 'approved'
                              ? 'text-[#14532D]'
                              : sub.status === 'rejected'
                                ? 'text-red-700'
                                : 'text-amber-700'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {sub.imageUrl && (
                        <img
                          src={sub.imageUrl}
                          alt={sub.title}
                          referrerPolicy="no-referrer"
                          className="w-48 h-32 object-cover border border-stone-200"
                        />
                      )}

                      <p className="text-sm text-stone-700 whitespace-pre-line bg-[#FBF9F5] p-4 border border-stone-100">
                        {sub.content}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {sub.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={async () => {
                                await moderateSubmissionAdmin(sub, 'approved', 'Disetujui admin', user.uid);
                                await loadAllAdminData();
                                notify('Karya disetujui dan langsung diterbitkan.');
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#14532D] text-white text-xs font-medium cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Setujui &amp; Publikasikan
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await moderateSubmissionAdmin(sub, 'rejected', 'Belum sesuai kriteria redaksi', user.uid);
                                await loadAllAdminData();
                                notify('Kiriman ditandai ditolak.');
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 border border-amber-300 text-amber-800 text-xs font-medium cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              Tolak
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteSubmissionAdmin(sub.id);
                            await loadAllAdminData();
                            notify('Kiriman dihapus dari antrean.');
                          }}
                          className="px-3.5 py-2 border border-red-200 text-xs text-red-700 cursor-pointer"
                        >
                          Hapus Permanen
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 7. Pengaturan Website */}
            {tab === 'pengaturan' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSavingSettings(true);
                  try {
                    await saveSiteSettingsAdmin(settingsForm);
                    await refreshSettings();
                    notify('Pengaturan website berhasil disimpan ke Firestore.');
                  } finally {
                    setSavingSettings(false);
                  }
                }}
                className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Nama Situs
                    </label>
                    <input
                      type="text"
                      value={settingsForm.siteName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, siteName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, tagline: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                    Headline Hero Beranda
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                    Subheadline Hero Beranda
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubheadline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroSubheadline: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Profil LapAs (Halaman Tentang)
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.aboutProfile}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, aboutProfile: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Makna Nama LapAs
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.aboutMeaning}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, aboutMeaning: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Visi
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.vision}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, vision: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Misi
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.mission}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, mission: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Tujuan
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.goals}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, goals: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Nama Pendiri / Penulis Utama
                    </label>
                    <input
                      type="text"
                      value={settingsForm.founderName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, founderName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Peran Pendiri
                    </label>
                    <input
                      type="text"
                      value={settingsForm.founderRole}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, founderRole: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                    Biografi Pendiri / Penulis
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.founderBio}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, founderBio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Email Kontak
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      WhatsApp Kontak
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contactWhatsapp}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactWhatsapp: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                      Alamat / Lokasi
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contactAddress}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactAddress: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5">
                    Disclaimer Konsultasi Hukum
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.legalDisclaimer}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, legalDisclaimer: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] disabled:opacity-50 cursor-pointer"
                  >
                    {savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan Website'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {articleModal && (
        <ArticleFormModal
          section={articleModal.section}
          initial={articleModal.item}
          authorId={user.uid}
          onClose={() => setArticleModal(null)}
          onSave={async (data, existingId) => {
            await saveArticleAdmin(data, existingId);
            await loadAllAdminData();
            notify('Konten berhasil disimpan ke Firestore.');
          }}
        />
      )}

      {bookModal && (
        <BookFormModal
          initial={bookModal.item}
          onClose={() => setBookModal(null)}
          onSave={async (data, existingId) => {
            await saveBookAdmin(data, existingId);
            await loadAllAdminData();
            notify('Data buku berhasil disimpan.');
          }}
        />
      )}

      {contribModal && (
        <ContributorFormModal
          initial={contribModal.item}
          onClose={() => setContribModal(null)}
          onSave={async (data, existingId) => {
            await saveContributorAdmin(data, existingId);
            await loadAllAdminData();
            notify('Profil Salam Kenal berhasil disimpan.');
          }}
        />
      )}
    </div>
  );
}
