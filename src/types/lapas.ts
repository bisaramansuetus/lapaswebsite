export type ArticleSection =
  | 'berita'
  | 'artikel-opini'
  | 'rohani'
  | 'motivasi'
  | 'puisi'
  | 'seni-lukis';

export type PublishStatus = 'draft' | 'published';

export type BookStatus = 'segera_hadir' | 'tersedia' | 'habis';

export type ConsultationStatus = 'baru' | 'ditinjau' | 'selesai';

export type SubmissionType = 'puisi' | 'seni-lukis' | 'tulisan' | 'salam-kenal';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type UserRole = 'admin' | 'editor' | 'reader';

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoUrl: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  section: ArticleSection;
  category: string;
  authorName: string;
  authorId: string;
  imageUrl: string;
  summary: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  status: PublishStatus;
  publishedAt: string;
  featured: boolean;
  medium: string;
  dimensions: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  authorName: string;
  authorBio: string;
  coverUrl: string;
  synopsis: string;
  launchDate: string;
  price: number;
  stock: number;
  status: BookStatus;
  orderLink: string;
  isDemo: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  topic: string;
  description: string;
  consentPrivacy: boolean;
  status: ConsultationStatus;
  adminNotes: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ArtworkSubmission {
  id: string;
  submitterName: string;
  submitterEmail: string;
  city: string;
  type: SubmissionType;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  bio: string;
  status: SubmissionStatus;
  moderatorNote: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Contributor {
  id: string;
  name: string;
  role: string;
  city: string;
  bio: string;
  quote: string;
  avatarUrl: string;
  status: PublishStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutProfile: string;
  aboutMeaning: string;
  vision: string;
  mission: string;
  goals: string;
  founderName: string;
  founderRole: string;
  founderBio: string;
  contactEmail: string;
  contactWhatsapp: string;
  contactAddress: string;
  socialInstagram: string;
  socialYoutube: string;
  socialFacebook: string;
  legalDisclaimer: string;
  updatedAt?: unknown;
}

export const FIELD_LIMITS = {
  TITLE_MAX: 200,
  SLUG_MAX: 200,
  CATEGORY_MAX: 80,
  NAME_MAX: 120,
  EMAIL_MAX: 200,
  URL_MAX: 1500,
  SUMMARY_MAX: 600,
  CONTENT_MAX: 50000,
  META_TITLE_MAX: 160,
  META_DESC_MAX: 320,
  BIO_MAX: 2000,
  SYNOPSIS_MAX: 10000,
  CONSULT_DESC_MAX: 5000,
  SUBMISSION_CONTENT_MAX: 20000,
  NOTE_MAX: 2000,
} as const;
