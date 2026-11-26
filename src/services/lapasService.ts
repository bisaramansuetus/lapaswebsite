import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, handleFirestoreError, OperationType, storage } from '../lib/firebase';
import {
  DEFAULT_SITE_SETTINGS,
  DEMO_ARTICLES,
  DEMO_BOOKS,
  DEMO_CONTRIBUTORS,
} from '../data/demoData';
import type {
  Article,
  ArticleSection,
  ArtworkSubmission,
  Book,
  Consultation,
  Contributor,
  SiteSettings,
  UserProfile,
} from '../types/lapas';
import { FIELD_LIMITS } from '../types/lapas';

export function slugify(text: string): string {
  const cleaned = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
  return cleaned || `item-${Date.now()}`;
}

export function generateSafeId(prefix = 'doc'): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

function clamp(val: string | undefined, maxLen: number): string {
  return (val ?? '').trim().slice(0, maxLen);
}

// ---------- Image Upload (Firebase Storage) ----------
export async function uploadImageToStorage(file: File, folder: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const path = `${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' });
  return getDownloadURL(storageRef);
}

// ---------- Public Queries (Enforcing status == 'published' for Pillar 8) ----------
export async function fetchPublishedArticles(section?: ArticleSection): Promise<{
  items: Article[];
  usingDemo: boolean;
}> {
  const path = 'articles';
  try {
    const colRef = collection(db, path);
    const q = section
      ? query(
          colRef,
          where('status', '==', 'published'),
          where('section', '==', section),
          orderBy('publishedAt', 'desc')
        )
      : query(colRef, where('status', '==', 'published'), orderBy('publishedAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      const demo = section
        ? DEMO_ARTICLES.filter((a) => a.section === section)
        : DEMO_ARTICLES;
      return { items: demo, usingDemo: true };
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, 'id'>) }));
    return { items, usingDemo: false };
  } catch (err) {
    // If composite index is still building or offline, try simpler published query before falling back
    try {
      const qSimple = query(collection(db, path), where('status', '==', 'published'));
      const snap = await getDocs(qSimple);
      if (!snap.empty) {
        let items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, 'id'>) }));
        if (section) items = items.filter((a) => a.section === section);
        items.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
        return { items, usingDemo: false };
      }
    } catch (innerErr) {
      handleFirestoreError(innerErr, OperationType.LIST, path);
    }
    const demo = section ? DEMO_ARTICLES.filter((a) => a.section === section) : DEMO_ARTICLES;
    console.warn('Menggunakan data demo artikel:', err);
    return { items: demo, usingDemo: true };
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const path = 'articles';
  try {
    const q = query(
      collection(db, path),
      where('status', '==', 'published'),
      where('slug', '==', slug)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...(d.data() as Omit<Article, 'id'>) };
    }
  } catch (err) {
    console.warn('Gagal mengambil artikel berdasarkan slug dari Firestore:', err);
  }
  return DEMO_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function fetchBooks(): Promise<{ items: Book[]; usingDemo: boolean }> {
  const path = 'books';
  try {
    const q = query(
      collection(db, path),
      where('status', 'in', ['segera_hadir', 'tersedia', 'habis'])
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return { items: DEMO_BOOKS, usingDemo: true };
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Book, 'id'>) }));
    return { items, usingDemo: false };
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function fetchBookBySlug(slug: string): Promise<Book | null> {
  const path = 'books';
  try {
    const q = query(
      collection(db, path),
      where('status', 'in', ['segera_hadir', 'tersedia', 'habis']),
      where('slug', '==', slug)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...(d.data() as Omit<Book, 'id'>) };
    }
  } catch (err) {
    console.warn('Gagal mengambil buku berdasarkan slug dari Firestore:', err);
  }
  return DEMO_BOOKS.find((b) => b.slug === slug) ?? null;
}

export async function fetchPublishedContributors(): Promise<{
  items: Contributor[];
  usingDemo: boolean;
}> {
  const path = 'contributors';
  try {
    const q = query(collection(db, path), where('status', '==', 'published'));
    const snap = await getDocs(q);
    if (snap.empty) {
      return { items: DEMO_CONTRIBUTORS, usingDemo: true };
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Contributor, 'id'>) }));
    return { items, usingDemo: false };
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const path = 'site_settings/general';
  try {
    const snap = await getDoc(doc(db, 'site_settings', 'general'));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<SiteSettings, 'id'>) };
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (err) {
    console.warn('Menggunakan pengaturan situs bawaan:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}

// ---------- Public Submissions (Create-only with strict blueprint defaults) ----------
export async function submitConsultation(input: {
  name: string;
  email: string;
  whatsapp: string;
  topic: string;
  description: string;
  consentPrivacy: boolean;
}): Promise<string> {
  const id = generateSafeId('konsul');
  const path = `consultations/${id}`;
  try {
    await setDoc(doc(db, 'consultations', id), {
      name: clamp(input.name, FIELD_LIMITS.NAME_MAX),
      email: clamp(input.email, FIELD_LIMITS.EMAIL_MAX),
      whatsapp: clamp(input.whatsapp, 30),
      topic: clamp(input.topic, 120),
      description: clamp(input.description, FIELD_LIMITS.CONSULT_DESC_MAX),
      consentPrivacy: Boolean(input.consentPrivacy),
      status: 'baru',
      adminNotes: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function submitArtwork(input: {
  submitterName: string;
  submitterEmail: string;
  city: string;
  type: ArtworkSubmission['type'];
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  bio: string;
}): Promise<string> {
  const id = generateSafeId('karya');
  const path = `artwork_submissions/${id}`;
  try {
    await setDoc(doc(db, 'artwork_submissions', id), {
      submitterName: clamp(input.submitterName, FIELD_LIMITS.NAME_MAX),
      submitterEmail: clamp(input.submitterEmail, FIELD_LIMITS.EMAIL_MAX),
      city: clamp(input.city, 100),
      type: input.type,
      title: clamp(input.title, FIELD_LIMITS.TITLE_MAX),
      category: clamp(input.category || input.type, FIELD_LIMITS.CATEGORY_MAX),
      content: clamp(input.content, FIELD_LIMITS.SUBMISSION_CONTENT_MAX),
      imageUrl: clamp(input.imageUrl, FIELD_LIMITS.URL_MAX),
      bio: clamp(input.bio, 1000),
      status: 'pending',
      moderatorNote: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// ---------- Admin Queries & CRUD ----------
export async function fetchAllArticlesAdmin(): Promise<Article[]> {
  const path = 'articles';
  try {
    const snap = await getDocs(collection(db, path));
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, 'id'>) }));
    items.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
    return items;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveArticleAdmin(
  article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>,
  existingId?: string
): Promise<string> {
  const id = existingId || generateSafeId('art');
  const path = `articles/${id}`;
  const cleanSlug = slugify(article.slug || article.title);
  const payload = {
    title: clamp(article.title, FIELD_LIMITS.TITLE_MAX),
    slug: clamp(cleanSlug, FIELD_LIMITS.SLUG_MAX),
    section: article.section,
    category: clamp(article.category, FIELD_LIMITS.CATEGORY_MAX),
    authorName: clamp(article.authorName, FIELD_LIMITS.NAME_MAX),
    authorId: clamp(article.authorId || 'admin', 128).replace(/[^a-zA-Z0-9_-]/g, '') || 'admin',
    imageUrl: clamp(article.imageUrl, FIELD_LIMITS.URL_MAX),
    summary: clamp(article.summary, FIELD_LIMITS.SUMMARY_MAX),
    content: clamp(article.content, FIELD_LIMITS.CONTENT_MAX),
    metaTitle: clamp(article.metaTitle || article.title, FIELD_LIMITS.META_TITLE_MAX),
    metaDescription: clamp(article.metaDescription || article.summary, FIELD_LIMITS.META_DESC_MAX),
    status: article.status,
    publishedAt: clamp(article.publishedAt || new Date().toISOString().slice(0, 10), 40),
    featured: Boolean(article.featured),
    medium: clamp(article.medium, 120),
    dimensions: clamp(article.dimensions, 80),
    updatedAt: serverTimestamp(),
  };

  try {
    if (existingId) {
      await updateDoc(doc(db, 'articles', id), payload);
    } else {
      await setDoc(doc(db, 'articles', id), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
    return id;
  } catch (err) {
    handleFirestoreError(err, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function deleteArticleAdmin(id: string): Promise<void> {
  const path = `articles/${id}`;
  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function fetchAllBooksAdmin(): Promise<Book[]> {
  const path = 'books';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Book, 'id'>) }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveBookAdmin(
  book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  existingId?: string
): Promise<string> {
  const id = existingId || generateSafeId('book');
  const path = `books/${id}`;
  const cleanSlug = slugify(book.slug || book.title);
  const payload = {
    title: clamp(book.title, FIELD_LIMITS.TITLE_MAX),
    slug: clamp(cleanSlug, FIELD_LIMITS.SLUG_MAX),
    authorName: clamp(book.authorName, FIELD_LIMITS.NAME_MAX),
    authorBio: clamp(book.authorBio, FIELD_LIMITS.BIO_MAX),
    coverUrl: clamp(book.coverUrl, FIELD_LIMITS.URL_MAX),
    synopsis: clamp(book.synopsis, FIELD_LIMITS.SYNOPSIS_MAX),
    launchDate: clamp(book.launchDate, 60),
    price: Math.max(0, Number(book.price) || 0),
    stock: Math.max(0, Math.floor(Number(book.stock) || 0)),
    status: book.status,
    orderLink: clamp(book.orderLink, 1000),
    isDemo: Boolean(book.isDemo),
    featured: Boolean(book.featured),
    updatedAt: serverTimestamp(),
  };

  try {
    if (existingId) {
      await updateDoc(doc(db, 'books', id), payload);
    } else {
      await setDoc(doc(db, 'books', id), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
    return id;
  } catch (err) {
    handleFirestoreError(err, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function deleteBookAdmin(id: string): Promise<void> {
  const path = `books/${id}`;
  try {
    await deleteDoc(doc(db, 'books', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function fetchAllConsultationsAdmin(): Promise<Consultation[]> {
  const path = 'consultations';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Consultation, 'id'>) }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function updateConsultationAdmin(
  id: string,
  status: Consultation['status'],
  adminNotes: string
): Promise<void> {
  const path = `consultations/${id}`;
  try {
    await updateDoc(doc(db, 'consultations', id), {
      status,
      adminNotes: clamp(adminNotes, FIELD_LIMITS.NOTE_MAX),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteConsultationAdmin(id: string): Promise<void> {
  const path = `consultations/${id}`;
  try {
    await deleteDoc(doc(db, 'consultations', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function fetchAllSubmissionsAdmin(): Promise<ArtworkSubmission[]> {
  const path = 'artwork_submissions';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ArtworkSubmission, 'id'>) }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function moderateSubmissionAdmin(
  submission: ArtworkSubmission,
  decision: 'approved' | 'rejected',
  moderatorNote: string,
  adminUid: string
): Promise<void> {
  const path = `artwork_submissions/${submission.id}`;
  try {
    await updateDoc(doc(db, 'artwork_submissions', submission.id), {
      status: decision,
      moderatorNote: clamp(moderatorNote, 1000),
      updatedAt: serverTimestamp(),
    });

    if (decision === 'approved') {
      if (submission.type === 'salam-kenal') {
        const contribId = generateSafeId('contrib');
        await setDoc(doc(db, 'contributors', contribId), {
          name: clamp(submission.submitterName, FIELD_LIMITS.NAME_MAX),
          role: clamp(submission.category || 'Sahabat LapAs', 120),
          city: clamp(submission.city || 'Indonesia', 100),
          bio: clamp(submission.bio || submission.content, FIELD_LIMITS.BIO_MAX),
          quote: clamp(submission.title, 400),
          avatarUrl: clamp(submission.imageUrl, FIELD_LIMITS.URL_MAX),
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        const section: ArticleSection =
          submission.type === 'puisi'
            ? 'puisi'
            : submission.type === 'seni-lukis'
              ? 'seni-lukis'
              : 'artikel-opini';
        const articleId = generateSafeId('pub');
        const cleanSlug = slugify(`${submission.title}-${articleId.slice(-4)}`);
        await setDoc(doc(db, 'articles', articleId), {
          title: clamp(submission.title, FIELD_LIMITS.TITLE_MAX),
          slug: clamp(cleanSlug, FIELD_LIMITS.SLUG_MAX),
          section,
          category: clamp(submission.category || 'Karya Pembaca', FIELD_LIMITS.CATEGORY_MAX),
          authorName: clamp(submission.submitterName, FIELD_LIMITS.NAME_MAX),
          authorId: adminUid.replace(/[^a-zA-Z0-9_-]/g, '') || 'admin',
          imageUrl: clamp(submission.imageUrl, FIELD_LIMITS.URL_MAX),
          summary: clamp(submission.content.slice(0, 220), FIELD_LIMITS.SUMMARY_MAX),
          content: clamp(submission.content, FIELD_LIMITS.CONTENT_MAX),
          metaTitle: clamp(submission.title, FIELD_LIMITS.META_TITLE_MAX),
          metaDescription: clamp(submission.content.slice(0, 155), FIELD_LIMITS.META_DESC_MAX),
          status: 'published',
          publishedAt: new Date().toISOString().slice(0, 10),
          featured: false,
          medium: submission.type === 'seni-lukis' ? 'Karya Kiriman Pembaca' : '',
          dimensions: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteSubmissionAdmin(id: string): Promise<void> {
  const path = `artwork_submissions/${id}`;
  try {
    await deleteDoc(doc(db, 'artwork_submissions', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function fetchAllContributorsAdmin(): Promise<Contributor[]> {
  const path = 'contributors';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Contributor, 'id'>) }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveContributorAdmin(
  contributor: Omit<Contributor, 'id' | 'createdAt' | 'updatedAt'>,
  existingId?: string
): Promise<string> {
  const id = existingId || generateSafeId('contrib');
  const path = `contributors/${id}`;
  const payload = {
    name: clamp(contributor.name, FIELD_LIMITS.NAME_MAX),
    role: clamp(contributor.role, FIELD_LIMITS.NAME_MAX),
    city: clamp(contributor.city, 100),
    bio: clamp(contributor.bio, FIELD_LIMITS.BIO_MAX),
    quote: clamp(contributor.quote, 400),
    avatarUrl: clamp(contributor.avatarUrl, FIELD_LIMITS.URL_MAX),
    status: contributor.status,
    updatedAt: serverTimestamp(),
  };
  try {
    if (existingId) {
      await updateDoc(doc(db, 'contributors', id), payload);
    } else {
      await setDoc(doc(db, 'contributors', id), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
    return id;
  } catch (err) {
    handleFirestoreError(err, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function deleteContributorAdmin(id: string): Promise<void> {
  const path = `contributors/${id}`;
  try {
    await deleteDoc(doc(db, 'contributors', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function saveSiteSettingsAdmin(settings: Omit<SiteSettings, 'id' | 'updatedAt'>): Promise<void> {
  const path = 'site_settings/general';
  try {
    await setDoc(doc(db, 'site_settings', 'general'), {
      siteName: clamp(settings.siteName, 120),
      tagline: clamp(settings.tagline, 200),
      heroHeadline: clamp(settings.heroHeadline, 250),
      heroSubheadline: clamp(settings.heroSubheadline, 600),
      aboutProfile: clamp(settings.aboutProfile, 5000),
      aboutMeaning: clamp(settings.aboutMeaning, 3000),
      vision: clamp(settings.vision, 2000),
      mission: clamp(settings.mission, 4000),
      goals: clamp(settings.goals, 3000),
      founderName: clamp(settings.founderName, 120),
      founderRole: clamp(settings.founderRole, 120),
      founderBio: clamp(settings.founderBio, 3000),
      contactEmail: clamp(settings.contactEmail, 200),
      contactWhatsapp: clamp(settings.contactWhatsapp, 40),
      contactAddress: clamp(settings.contactAddress, 300),
      socialInstagram: clamp(settings.socialInstagram, 300),
      socialYoutube: clamp(settings.socialYoutube, 300),
      socialFacebook: clamp(settings.socialFacebook, 300),
      legalDisclaimer: clamp(settings.legalDisclaimer, 2000),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchAllUsersAdmin(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserProfile, 'id'>) }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function seedDemoContentToFirestore(adminUid: string): Promise<void> {
  const batch = writeBatch(db);
  const safeUid = adminUid.replace(/[^a-zA-Z0-9_-]/g, '') || 'admin';

  for (const art of DEMO_ARTICLES) {
    const refDoc = doc(db, 'articles', art.id);
    batch.set(refDoc, {
      title: art.title,
      slug: art.slug,
      section: art.section,
      category: art.category,
      authorName: art.authorName,
      authorId: safeUid,
      imageUrl: art.imageUrl,
      summary: art.summary,
      content: art.content,
      metaTitle: art.metaTitle,
      metaDescription: art.metaDescription,
      status: art.status,
      publishedAt: art.publishedAt,
      featured: art.featured,
      medium: art.medium,
      dimensions: art.dimensions,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  for (const book of DEMO_BOOKS) {
    const refDoc = doc(db, 'books', book.id);
    batch.set(refDoc, {
      title: book.title,
      slug: book.slug,
      authorName: book.authorName,
      authorBio: book.authorBio,
      coverUrl: book.coverUrl,
      synopsis: book.synopsis,
      launchDate: book.launchDate,
      price: book.price,
      stock: book.stock,
      status: book.status,
      orderLink: book.orderLink,
      isDemo: book.isDemo,
      featured: book.featured,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  for (const contrib of DEMO_CONTRIBUTORS) {
    const refDoc = doc(db, 'contributors', contrib.id);
    batch.set(refDoc, {
      name: contrib.name,
      role: contrib.role,
      city: contrib.city,
      bio: contrib.bio,
      quote: contrib.quote,
      avatarUrl: contrib.avatarUrl,
      status: contrib.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  const settingsRef = doc(db, 'site_settings', 'general');
  batch.set(settingsRef, {
    siteName: DEFAULT_SITE_SETTINGS.siteName,
    tagline: DEFAULT_SITE_SETTINGS.tagline,
    heroHeadline: DEFAULT_SITE_SETTINGS.heroHeadline,
    heroSubheadline: DEFAULT_SITE_SETTINGS.heroSubheadline,
    aboutProfile: DEFAULT_SITE_SETTINGS.aboutProfile,
    aboutMeaning: DEFAULT_SITE_SETTINGS.aboutMeaning,
    vision: DEFAULT_SITE_SETTINGS.vision,
    mission: DEFAULT_SITE_SETTINGS.mission,
    goals: DEFAULT_SITE_SETTINGS.goals,
    founderName: DEFAULT_SITE_SETTINGS.founderName,
    founderRole: DEFAULT_SITE_SETTINGS.founderRole,
    founderBio: DEFAULT_SITE_SETTINGS.founderBio,
    contactEmail: DEFAULT_SITE_SETTINGS.contactEmail,
    contactWhatsapp: DEFAULT_SITE_SETTINGS.contactWhatsapp,
    contactAddress: DEFAULT_SITE_SETTINGS.contactAddress,
    socialInstagram: DEFAULT_SITE_SETTINGS.socialInstagram,
    socialYoutube: DEFAULT_SITE_SETTINGS.socialYoutube,
    socialFacebook: DEFAULT_SITE_SETTINGS.socialFacebook,
    legalDisclaimer: DEFAULT_SITE_SETTINGS.legalDisclaimer,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'batch_seed');
  }
}
