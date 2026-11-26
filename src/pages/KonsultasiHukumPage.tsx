import React, { useState } from 'react';
import { CheckCircle2, Lock, Scale, ShieldAlert } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { submitConsultation } from '../services/lapasService';

const CONSULTATION_TYPES = [
  {
    title: 'Perdata & Perjanjian',
    desc: 'Pemahaman dasar mengenai surat perjanjian, wanprestasi, utang-piutang, dan penyelesaian sengketa secara musyawarah.',
  },
  {
    title: 'Hukum Keluarga & Waris',
    desc: 'Edukasi umum seputar hak dan kewajiban dalam keluarga, pencatatan sipil, serta pembagian waris.',
  },
  {
    title: 'Ketenagakerjaan & Usaha',
    desc: 'Pengenalan hak pekerja, kontrak kerja, serta etika kemitraan usaha kecil dan menengah.',
  },
  {
    title: 'Literasi Hukum & Mediasi',
    desc: 'Pemahaman prosedur pelaporan, hak warga negara, serta pendekatan damai sebelum menempuh jalur litigasi.',
  },
];

const LEGAL_TOPICS = [
  'Perdata & Perjanjian',
  'Hukum Keluarga & Waris',
  'Ketenagakerjaan',
  'Perlindungan Konsumen & Etika Digital',
  'Pertanahan & Properti',
  'Edukasi Hukum Umum Lainnya',
];

export function KonsultasiHukumPage() {
  const { settings } = useSiteSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [topic, setTopic] = useState(LEGAL_TOPICS[0]);
  const [description, setDescription] = useState('');
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Mohon masukkan nama lengkap Anda (minimal 2 karakter).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Mohon masukkan alamat email yang valid.');
      return;
    }
    const cleanWa = whatsapp.replace(/[\s()-]/g, '');
    if (!/^\+?[0-9]{8,20}$/.test(cleanWa)) {
      setError('Mohon masukkan nomor WhatsApp yang valid (8–20 digit angka).');
      return;
    }
    if (description.trim().length < 15) {
      setError('Mohon jelaskan pokok persoalan secara ringkas (minimal 15 karakter).');
      return;
    }
    if (!consentPrivacy) {
      setError('Anda wajib menyetujui pernyataan privasi dan edukasi hukum sebelum mengirim.');
      return;
    }

    setSubmitting(true);
    try {
      const id = await submitConsultation({
        name,
        email,
        whatsapp,
        topic,
        description,
        consentPrivacy,
      });
      setSubmittedRef(id);
    } catch {
      setError('Gagal mengirim formulir konsultasi. Silakan periksa koneksi Anda dan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title="Konsultasi Hukum — LapAs"
        description="Ruang edukasi hukum umum dan penyampaian pertanyaan hukum secara privat kepada tim pengelola LapAs."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pb-10 mb-12 border-b border-stone-200 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#172554] mb-3">
            <Scale className="w-4 h-4" />
            <span>Edukasi &amp; Literasi Hukum</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-900 font-medium mb-4">
            Ruang Edukasi &amp; Konsultasi Hukum
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            LapAs menyediakan kanal edukasi hukum agar masyarakat memiliki pemahaman awal yang
            jernih dan berimbang sebelum mengambil keputusan atau langkah hukum.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Explanation, Types, Disclaimer */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 mb-5">Bidang Edukasi Layanan</h2>
              <div className="space-y-4">
                {CONSULTATION_TYPES.map((item) => (
                  <div key={item.title} className="bg-white border border-stone-200 p-5">
                    <h3 className="font-serif text-lg text-stone-900 mb-1.5">{item.title}</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F4EFE6] border border-stone-300 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#78350F] font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>Pernyataan Penyangkalan (Disclaimer)</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                {settings.legalDisclaimer}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-300">
                Penjadwalan tanggapan dilakukan oleh pengelola sesuai antrean telaah yang masuk.
              </p>
            </div>

            <div className="flex items-start gap-3 text-xs text-stone-600 bg-white border border-stone-200 p-5">
              <Lock className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Data konsultasi Anda disimpan secara privat dan{' '}
                <strong>hanya dapat diakses oleh admin berwenang</strong> untuk keperluan
                penelaahan. Pengunjung lain tidak dapat membaca pertanyaan Anda.
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            {submittedRef ? (
              <div className="bg-white border border-stone-200 p-8 sm:p-12 text-center space-y-4">
                <CheckCircle2 className="w-11 h-11 text-[#14532D] mx-auto" />
                <h2 className="font-serif text-2xl text-stone-900">
                  Permohonan Konsultasi Diterima
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                  Terima kasih, <strong>{name}</strong>. Pesan konsultasi hukum Anda telah tercatat
                  secara aman dengan nomor referensi{' '}
                  <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 border border-stone-200">
                    {submittedRef}
                  </span>
                  . Tim pengelola akan menelaah dan menghubungi Anda melalui kontak yang tercantum.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setDescription('');
                      setConsentPrivacy(false);
                    }}
                    className="px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors cursor-pointer"
                  >
                    Kirim Pertanyaan Lain
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-stone-200 p-6 sm:p-10 space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 mb-1">
                    Formulir Pengajuan Konsultasi
                  </h2>
                  <p className="text-sm text-stone-500">
                    Lengkapi data berikut dengan jujur dan ringkas.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama sesuai identitas atau panggilan"
                    className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+62 812-xxxx-xxxx"
                      className="w-full px-3.5 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-[#14532D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                    Topik Hukum *
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#14532D]"
                  >
                    {LEGAL_TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2">
                    Deskripsi Masalah *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan kronologi singkat dan pertanyaan inti Anda (hindari mencantumkan kata sandi atau data perbankan rahasia)..."
                    className="w-full px-3.5 py-2.5 border border-stone-300 text-sm leading-relaxed focus:outline-none focus:border-[#14532D]"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#14532D]"
                  />
                  <span className="text-xs text-stone-600 leading-relaxed">
                    Saya menyetujui pengolahan data kontak ini secara privat oleh admin LapAs dan
                    memahami bahwa informasi yang diberikan bersifat{' '}
                    <strong>edukasi hukum umum</strong>, bukan pengganti nasihat hukum profesional.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-3 bg-[#172554] text-white text-sm font-medium hover:bg-[#1E3A8A] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Mengirim Konsultasi...' : 'Kirim Permohonan Konsultasi'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
