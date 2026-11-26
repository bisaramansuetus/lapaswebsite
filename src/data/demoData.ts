import type { Article, Book, Contributor, SiteSettings } from '../types/lapas';

export const EDITORIAL_IMAGES = {
  hero: '/src/assets/images/hero_editorial_serenity_1795611304300.jpg',
  spiritual: '/src/assets/images/article_spiritual_reflection_1795611298441.jpg',
  literacyLaw: '/src/assets/images/article_literacy_law_1795611298388.jpg',
  painting: '/src/assets/images/artwork_gallery_serenity_1795611314209.jpg',
  bookCover: '/src/assets/images/book_cover_perdana_1795611298830.jpg',
} as const;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'general',
  siteName: 'LapAs',
  tagline: 'Lepaskan Amarahmu Panggil Allah Selalu',
  heroHeadline: 'Temukan Makna, Lepaskan Amarah, dan Kembali pada Nilai Kehidupan.',
  heroSubheadline:
    'LapAs adalah ruang literasi, refleksi, dan ekspresi untuk berbagi pemikiran, karya, serta inspirasi bagi kehidupan yang lebih bermakna.',
  aboutProfile:
    'LapAs (Lepaskan Amarahmu Panggil Allah Selalu) adalah media literasi, publikasi pemikiran, refleksi rohani, edukasi hukum, dan ruang ekspresi digital independen yang hadir untuk menjangkau masyarakat dari seluruh Indonesia. Platform ini lahir dari keyakinan bahwa kata-kata yang jujur, tenang, dan berakar pada nilai kemanusiaan mampu menuntun siapa pun melewati badai kehidupan. [Konten Profil Demo — dapat diperbarui oleh Admin di Pengaturan Website]',
  aboutMeaning:
    'Nama LapAs merupakan akronim spiritual dari "Lepaskan Amarahmu Panggil Allah Selalu". Akronim ini bukan merujuk pada lembaga pemasyarakatan, melainkan sebuah pengingat batin tentang keberanian menanggalkan kebencian, meredam gejolak ego, dan menghadirkan Allah dalam setiap keputusan hidup.',
  vision:
    'Menjadi ruang literasi, refleksi rohani, edukasi hukum, dan apresiasi seni yang teduh, tepercaya, serta mencerahkan masyarakat Indonesia lintas wilayah dan generasi.',
  mission:
    '1. Menyajikan publikasi berita, opini, dan esai yang mendalam serta menyejukkan.\n2. Menghadirkan rubrik rohani dan tulisan motivasi yang membumi.\n3. Menyediakan ruang edukasi hukum yang informatif bagi masyarakat awam.\n4. Membuka ruang ekspresi puisi, seni lukis, dan salam kenal bagi penulis maupun pembaca Nusantara.\n5. Menjadi rumah resmi publikasi buku karya penulis LapAs.',
  goals:
    'Membangun ekosistem membaca dan menulis yang penuh kesadaran batin, mempertemukan gagasan literasi dengan keadilan sosial, serta menjembatani karya buku penulis menuju pembaca di seluruh pelosok Indonesia.',
  founderName: 'Penulis & Pemrakarsa LapAs (Data Demo)',
  founderRole: 'Penulis Buku & Penggagas LapAs',
  founderBio:
    'Profil resmi penulis dan pendiri LapAs dapat dilengkapi secara penuh melalui menu Pengaturan Website di Dashboard Admin menjelang peluncuran buku perdana.',
  contactEmail: 'redaksi@lapas-literasi.example',
  contactWhatsapp: '+62 811-0000-0000',
  contactAddress: 'Indonesia — Redaksi Literasi & Ruang Ekspresi Digital',
  socialInstagram: 'https://instagram.com',
  socialYoutube: 'https://youtube.com',
  socialFacebook: 'https://facebook.com',
  legalDisclaimer:
    'Seluruh informasi dan tanggapan pada kanal Konsultasi Hukum LapAs bersifat edukasi hukum umum, bukan merupakan nasihat hukum resmi ataupun pengganti pendampingan advokat/konsultan hukum profesional.',
};

export const DEMO_ARTICLES: Article[] = [
  {
    id: 'demo-berita-1',
    title: 'Menghidupkan Kembali Budaya Membaca Panjang di Tengah Riuh Informasi Digital',
    slug: 'menghidupkan-budaya-membaca-panjang-digital',
    section: 'berita',
    category: 'Literasi Nasional',
    authorName: 'Tim Redaksi LapAs',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.hero,
    summary:
      'Inisiatif komunitas literasi dari berbagai daerah di Indonesia mulai menggerakkan kembali ruang baca sunyi untuk melatih kedalaman berpikir dan kejernihan hati.',
    content:
      'Di tengah arus informasi serba cepat yang kerap memicu reaksi emosional sesaat, sejumlah pegiat literasi di berbagai kota Indonesia mulai menghidupkan kembali tradisi membaca teks panjang secara bersama-sama.\n\nMelalui forum diskusi mingguan yang terbuka untuk umum, peserta diajak membaca esai, karya sastra, hingga catatan refleksi spiritual tanpa distraksi gawai selama satu jam penuh. Setelah sesi membaca hening selesai, forum dilanjutkan dengan dialog santun mengenai nilai-nilai kehidupan yang ditemukan dalam bacaan.\n\nPenggerak literasi menilai bahwa kedewasaan sosial berbanding lurus dengan kesabaran membaca. Ketika seseorang memberi jeda antara membaca kabar dan menyimpulkan makna, ruang bagi amarah dan prasangka menyempit dengan sendirinya.\n\nLapAs hadir menjadi bagian dari ekosistem ini dengan menghadirkan kanal berita, opini, refleksi rohani, dan ruang ekspresi seni yang dapat diakses dari mana saja di seluruh Indonesia.',
    metaTitle: 'Menghidupkan Budaya Membaca Panjang — Berita LapAs',
    metaDescription:
      'Gerakan literasi Nusantara menghidupkan kembali ruang baca hening untuk melatih kedalaman berpikir dan ketenangan batin.',
    status: 'published',
    publishedAt: '2026-11-18',
    featured: true,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-berita-2',
    title: 'Dialog Publik Edukasi Hukum Warga: Memahami Hak dan Kewajiban Secara Sederhana',
    slug: 'dialog-publik-edukasi-hukum-warga',
    section: 'berita',
    category: 'Edukasi & Masyarakat',
    authorName: 'Tim Redaksi LapAs',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.literacyLaw,
    summary:
      'Kesadaran hukum masyarakat tidak cukup dibangun lewat pasal-pasal kaku, melainkan lewat bahasa yang jernih dan contoh persoalan sehari-hari.',
    content:
      'Banyak persoalan hukum di tingkat warga bermula dari ketidaktahuan terhadap prosedur dasar perjanjian, waris, hingga batas etika bermedia sosial.\n\nDalam berbagai diskusi literasi hukum belakangan ini, para praktisi dan akademisi menekankan pentingnya penerjemahan istilah yuridis ke dalam bahasa publik yang mudah dipahami. Masyarakat berhak mengerti hak dan kewajiban mereka sebelum menandatangani kesepakatan atau mengambil langkah hukum.\n\nMelalui rubrik Konsultasi Hukum di LapAs, pembaca dapat mempelajari kerangka edukasi hukum umum sekaligus mengajukan pertanyaan tertulis yang akan ditelaah secara terstruktur oleh tim pengelola.',
    metaTitle: 'Dialog Publik Edukasi Hukum Warga — LapAs',
    metaDescription:
      'Pentingnya literasi hukum dengan bahasa yang sederhana dan membumi bagi masyarakat Indonesia.',
    status: 'published',
    publishedAt: '2026-11-12',
    featured: false,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-opini-1',
    title: 'Seni Melepaskan Amarah Sebelum Kata Menjadi Luka yang Tak Terhapus',
    slug: 'seni-melepaskan-amarah-sebelum-kata-menjadi-luka',
    section: 'artikel-opini',
    category: 'Refleksi Kehidupan',
    authorName: 'Kontributor Utama LapAs',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.spiritual,
    summary:
      'Amarah sering menyamar sebagai pembelaan diri yang sah, padahal ketenangan batinlah yang menjaga martabat kita di hadapan sesama dan Tuhan.',
    content:
      'Setiap manusia pernah berada di titik ketika dada terasa sesak oleh kekecewaan, ketidakadilan, atau kesalahpahaman. Pada detik seperti itulah amarah mengetuk paling keras, menuntut kita membalas dengan kalimat yang sama tajamnya.\n\nNamun pengalaman panjang kehidupan mengajarkan satu kebenaran sederhana: kata-kata yang lahir dari kemarahan jarang menyelesaikan masalah. Ia hanya memindahkan luka dari satu hati ke hati yang lain, lalu menyisakan penyesalan ketika kepala kembali dingin.\n\nMelepaskan amarah bukanlah tanda kelemahan. Sebaliknya, menahan diri untuk tidak merusak, lalu memilih menyebut nama Allah dalam keheningan, adalah bentuk kematangan jiwa yang paling tinggi. Dari ketenangan itulah pikiran jernih tumbuh, sehingga langkah perbaikan—termasuk langkah hukum atau musyawarah yang adil—dapat ditempuh tanpa kebencian.',
    metaTitle: 'Seni Melepaskan Amarah — Artikel & Opini LapAs',
    metaDescription:
      'Refleksi mendalam tentang keberanian menahan amarah, memanggil Allah, dan menjaga kejernihan akal budi.',
    status: 'published',
    publishedAt: '2026-11-20',
    featured: true,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-opini-2',
    title: 'Literasi sebagai Jalan Sunyi Membangun Peradaban yang Lebih Berempati',
    slug: 'literasi-jalan-sunyi-membangun-peradaban-berempati',
    section: 'artikel-opini',
    category: 'Pemikiran Sosial',
    authorName: 'Nadia Kusuma (Kontributor Demo)',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.literacyLaw,
    summary:
      'Membaca dan menulis bukan sekadar keterampilan teknis, melainkan latihan merasakan denyut kehidupan orang lain sebelum kita menghakimi.',
    content:
      'Ketika ruang publik dipenuhi komentar singkat yang saling menyalahkan, esai panjang mengundang kita melambat. Di dalam paragraf yang tersusun sabar, pembaca diajak menelusuri latar belakang suatu peristiwa secara utuh.\n\nMenulis dengan tanggung jawab moral berarti menjaga keseimbangan antara ketajaman analisis dan keadaban bahasa. Sebuah tulisan yang baik tidak membakar suasana, melainkan menerangi persoalan sehingga pembaca menemukan jalan keluar yang bermartabat.',
    metaTitle: 'Literasi sebagai Jalan Sunyi Empati — Opini LapAs',
    metaDescription:
      'Pemikiran sosial tentang peran literasi mendalam dalam menumbuhkan empati dan keadaban ruang publik.',
    status: 'published',
    publishedAt: '2026-11-10',
    featured: false,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-rohani-1',
    title: 'Ketika Doa Menjadi Pelabuhan Pertama, Bukan Pilihan Terakhir',
    slug: 'ketika-doa-menjadi-pelabuhan-pertama',
    section: 'rohani',
    category: 'Refleksi Iman',
    authorName: 'Rubrik Rohani LapAs',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.spiritual,
    summary:
      'Sering kali kita memanggil Allah baru setelah semua rencana manusiawi buntu, padahal mengingat-Nya sejak awal menenangkan seluruh perjalanan.',
    content:
      'Ada perbedaan besar antara hati yang panik lalu mencari pertolongan, dengan hati yang sejak langkah pertama bersandar kepada Sang Pencipta.\n\nPrinsip "Lepaskan Amarahmu Panggil Allah Selalu" mengajak kita menata ulang urutan batin. Sebelum membalas pesan yang menyakitkan, sebelum mengambil keputusan penting, dan sebelum larut dalam kesedihan atas ujian hidup, berhenti sejenak dan panggillah Allah dalam doa yang paling jujur.\n\nDi hadapan-Nya, tidak ada keresahan yang terlalu kecil untuk diceritakan, dan tidak ada beban yang terlalu berat untuk diringankan.',
    metaTitle: 'Ketika Doa Menjadi Pelabuhan Pertama — Rubrik Rohani LapAs',
    metaDescription:
      'Renungan iman tentang menjadikan doa sebagai sandaran pertama dalam setiap langkah dan ujian hidup.',
    status: 'published',
    publishedAt: '2026-11-19',
    featured: true,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-rohani-2',
    title: 'Menemukan Kelapangan Dada dalam Kesederhanaan Syukur',
    slug: 'menemukan-kelapangan-dada-dalam-syukur',
    section: 'rohani',
    category: 'Renungan',
    authorName: 'Rubrik Rohani LapAs',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.hero,
    summary:
      'Ketenangan hidup tidak selalu menunggu seluruh keinginan terwujud, melainkan lahir saat hati belajar membaca nikmat yang hari ini sudah hadir.',
    content:
      'Pagi yang tenang, napas yang masih terhela, serta kesempatan memperbaiki diri hari ini sering terlewat karena pikiran kita sibuk mengejar hari esok yang belum tiba.\n\nDalam keheningan syukur, manusia menyadari bahwa kekayaan batin tumbuh dari penerimaan yang penuh ikhtiar: bekerja sungguh-sungguh, berbuat adil kepada sesama, lalu menyerahkan hasil akhirnya kepada ketetapan Allah.',
    metaTitle: 'Menemukan Kelapangan Dada dalam Syukur — Rubrik Rohani LapAs',
    metaDescription:
      'Renungan harian tentang ketenangan jiwa dan makna syukur di tengah rutinitas kehidupan.',
    status: 'published',
    publishedAt: '2026-11-08',
    featured: false,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-motivasi-1',
    title: 'Ketekunan Kecil yang Mengubah Arah Hidup Perlahan Namun Pasti',
    slug: 'ketekunan-kecil-mengubah-arah-hidup',
    section: 'motivasi',
    category: 'Ketekunan',
    authorName: 'Redaksi Motivasi LapAs',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.hero,
    summary:
      'Perubahan besar jarang lahir dari letupan semangat sesaat; ia ditempa oleh langkah-langkah konsisten saat tidak ada seorang pun yang bertepuk tangan.',
    content:
      'Banyak orang berhenti di tengah jalan bukan karena mereka tidak mampu, melainkan karena mereka mengukur langkah hari ini dengan hasil akhir yang masih jauh.\n\nPadahal setiap halaman yang ditulis, setiap pagi yang dimulai dengan niat baik, dan setiap amarah yang berhasil diredam adalah bata demi bata yang membangun masa depan lebih kukuh. Jangan meremehkan langkah kecil yang dilakukan terus-menerus dengan hati yang ikhlas.',
    metaTitle: 'Ketekunan Kecil yang Mengubah Arah Hidup — Motivasi LapAs',
    metaDescription:
      'Tulisan motivasi tentang kekuatan konsistensi, kesabaran proses, dan ketekunan dalam perjalanan hidup.',
    status: 'published',
    publishedAt: '2026-11-17',
    featured: true,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-motivasi-2',
    title: 'Bangkit dengan Harapan Baru Setelah Masa-Masa Tersulit',
    slug: 'bangkit-dengan-harapan-baru-setelah-masa-sulit',
    section: 'motivasi',
    category: 'Harapan',
    authorName: 'Redaksi Motivasi LapAs',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.spiritual,
    summary:
      'Kegagalan dan kehilangan bukan akhir dari cerita hidupmu; keduanya adalah jeda untuk menata ulang arah dengan kebijaksanaan baru.',
    content:
      'Tidak ada perjalanan hidup yang selalu lurus dan tanpa kabut. Ada kalanya rencana yang kita susun bertahun-tahun harus berubah arah.\n\nNamun selama seseorang masih memelihara harapan dan tidak membiarkan keputusasaan merampas niat baiknya, selalu ada bab baru yang layak diperjuangkan. Mulailah dari hal paling nyata yang bisa diperbaiki hari ini.',
    metaTitle: 'Bangkit dengan Harapan Baru — Motivasi LapAs',
    metaDescription:
      'Refleksi motivasi tentang memelihara harapan dan keberanian memulai kembali setelah ujian hidup.',
    status: 'published',
    publishedAt: '2026-11-05',
    featured: false,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-puisi-1',
    title: 'Pada Jeda Sebelum Subuh',
    slug: 'pada-jeda-sebelum-subuh',
    section: 'puisi',
    category: 'Spiritualitas',
    authorName: 'A. Rahman (Kontributor Demo)',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.spiritual,
    summary:
      'Sebuah sajak tentang meletakkan beban amarah di sajadah sunyi sebelum fajar menyapa.',
    content:
      'Di batas malam yang nyaris selesai,\nkulepas gaduh yang seharian kupikul di dada,\nkata-kata tajam yang tak jadi kuucap,\nkuserahkan kembali kepada-Mu dalam sepi.\n\nSebab Engkau lebih dekat daripada urat leherku,\nlebih mengerti getar suara yang tak sempat terucap,\nmaka ajarilah aku menjadi sungai yang sabar,\nmengalir tenang meski batu-batu mengadang di muara.\n\nSebelum fajar mengetuk jendela kayu,\nhatiku telah pulang kepada nama-Mu.',
    metaTitle: 'Pada Jeda Sebelum Subuh — Puisi LapAs',
    metaDescription: 'Puisi reflektif tentang ketenangan doa dan keikhlasan melepaskan amarah.',
    status: 'published',
    publishedAt: '2026-11-16',
    featured: true,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-puisi-2',
    title: 'Surat untuk Langkah yang Sempat Ragu',
    slug: 'surat-untuk-langkah-yang-sempat-ragu',
    section: 'puisi',
    category: 'Perjalanan Hidup',
    authorName: 'Siti Aminah (Kontributor Demo)',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.hero,
    summary:
      'Baris-baris lembut pengingat bagi jiwa yang sedang mencari keteguhan di tengah perubahan.',
    content:
      'Jangan tergesa mengutuk jalan berbatu,\nbarangkali di sanalah kakimu belajar tabah,\nbarangkali di sanalah matamu belajar melihat\ncahaya kecil yang selama ini kau lewatkan.\n\nTulis ulang harapanmu di lembar paling bersih,\ntanpa dendam, tanpa tergesa,\nsebab setiap fajar selalu memberi ruang\nbagi hati yang mau belajar memaafkan.',
    metaTitle: 'Surat untuk Langkah yang Sempat Ragu — Puisi LapAs',
    metaDescription: 'Puisi tentang ketabahan dan harapan dalam perjalanan kehidupan.',
    status: 'published',
    publishedAt: '2026-11-09',
    featured: false,
    medium: '',
    dimensions: '',
  },
  {
    id: 'demo-lukis-1',
    title: 'Sungai Teduh Menuju Fajar',
    slug: 'sungai-teduh-menuju-fajar',
    section: 'seni-lukis',
    category: 'Lukisan Alam & Refleksi',
    authorName: 'Raka Pratama (Seniman Demo)',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.painting,
    summary:
      'Karya cat minyak dan aksen lembaran emas di atas kanvas linen yang menggambarkan kejernihan hati setelah melewati kabut kegelisahan.',
    content:
      'Lukisan ini memadukan sapuan hijau hutan yang mendalam dengan pantulan cahaya keemasan di garis cakrawala. Aliran sungai yang tenang di tengah lembah menjadi metafora bagi jiwa yang belajar melepaskan amarah dan bergerak menuju kedamaian.',
    metaTitle: 'Sungai Teduh Menuju Fajar — Galeri Seni Lukis LapAs',
    metaDescription: 'Karya seni lukis kontemporer bertema ketenangan alam dan refleksi batin.',
    status: 'published',
    publishedAt: '2026-11-15',
    featured: true,
    medium: 'Cat minyak & lembaran emas di atas kanvas linen',
    dimensions: '90 x 120 cm',
  },
  {
    id: 'demo-lukis-2',
    title: 'Cahaya Pagi di Serambi Kayu',
    slug: 'cahaya-pagi-di-serambi-kayu',
    section: 'seni-lukis',
    category: 'Studi Cahaya & Arsitektur',
    authorName: 'Dewi Lestari (Seniman Demo)',
    authorId: 'demo-redaksi',
    imageUrl: EDITORIAL_IMAGES.spiritual,
    summary:
      'Eksplorasi bayangan lembut dan pantulan air di beranda tradisional Nusantara sebagai simbol tempat berteduh batin.',
    content:
      'Melalui komposisi ruang terbuka dan pantulan air yang jernih, karya ini mengajak penikmat seni berhenti sejenak dari kebisingan kota dan merasakan kehadiran cahaya pagi yang menenteramkan.',
    metaTitle: 'Cahaya Pagi di Serambi Kayu — Galeri Seni Lukis LapAs',
    metaDescription: 'Karya visual bertema serambi teduh dan refleksi cahaya pagi.',
    status: 'published',
    publishedAt: '2026-11-04',
    featured: false,
    medium: 'Akrilik dan tempera di atas kanvas',
    dimensions: '70 x 90 cm',
  },
];

export const DEMO_BOOKS: Book[] = [
  {
    id: 'demo-buku-perdana-lapas',
    title: 'Buku Perdana LapAs (Data Demo)',
    slug: 'buku-perdana-lapas-demo',
    authorName: 'Penulis Utama LapAs (Segera Diumumkan)',
    authorBio:
      'Profil resmi penulis beserta perjalanan kepenulisan akan ditampilkan secara lengkap saat buku resmi diluncurkan melalui Dashboard Admin.',
    coverUrl: EDITORIAL_IMAGES.bookCover,
    synopsis:
      'Ini adalah entri katalog buku demo untuk mempersiapkan peluncuran resmi Buku Perdana LapAs.\n\nSaat buku resmi diluncurkan, Admin cukup mengubah judul, nama penulis, sampul, sinopsis, harga, stok, tautan pemesanan, serta mengganti status buku menjadi "Tersedia" langsung dari Dashboard Admin tanpa menyentuh kode program.',
    launchDate: 'Segera Diumumkan (Data Demo)',
    price: 0,
    stock: 0,
    status: 'segera_hadir',
    orderLink: '',
    isDemo: true,
    featured: true,
  },
];

export const DEMO_CONTRIBUTORS: Contributor[] = [
  {
    id: 'demo-kontributor-1',
    name: 'Hendra Wijaya (Profil Demo)',
    role: 'Penulis Esai & Pemerhati Literasi',
    city: 'Yogyakarta',
    bio: 'Aktif mendampingi komunitas baca daerah dan menulis refleksi sosial tentang kesabaran, etika publik, dan kemanusiaan.',
    quote: 'Menulis adalah cara paling jujur untuk berdialog dengan diri sendiri sebelum berbicara kepada dunia.',
    avatarUrl: EDITORIAL_IMAGES.hero,
    status: 'published',
  },
  {
    id: 'demo-kontributor-2',
    name: 'Rahmawati Putri (Profil Demo)',
    role: 'Penyair & Pendidik',
    city: 'Bandung',
    bio: 'Mengajar sastra dan membina klub puisi remaja sebagai sarana mengekspresikan emosi secara sehat dan bermartabat.',
    quote: 'Setiap puisi yang tulus selalu membuka jalan menuju hati yang lebih lapang.',
    avatarUrl: EDITORIAL_IMAGES.spiritual,
    status: 'published',
  },
  {
    id: 'demo-kontributor-3',
    name: 'Raka Pratama (Profil Demo)',
    role: 'Perupa Kanvas',
    city: 'Surabaya',
    bio: 'Berkarya dengan medium cat minyak dan elemen alam Nusantara yang merefleksikan ketenangan spiritual.',
    quote: 'Warna-warna yang paling lembut sering kali berbicara lebih nyaring daripada teriakan.',
    avatarUrl: EDITORIAL_IMAGES.painting,
    status: 'published',
  },
];
