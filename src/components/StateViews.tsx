import { Link } from 'react-router-dom';
import { AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import { EditorialImage } from './EditorialImage';
import type { Article } from '../types/lapas';

export function formatDateId(dateStr: string): string {
  if (!dateStr) return '';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export function LoadingState({ message = 'Memuat konten...' }: { message?: string }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-stone-500 gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-[#14532D]" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="bg-white border border-stone-200 p-10 text-center max-w-xl mx-auto">
      <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-3" strokeWidth={1.5} />
      <h3 className="font-serif text-xl text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed mb-6">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-block px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-white border border-red-200 p-8 text-center max-w-xl mx-auto">
      <AlertCircle className="w-7 h-7 text-red-700 mx-auto mb-3" strokeWidth={1.5} />
      <h3 className="font-serif text-lg text-stone-900 mb-2">Gagal Memuat Data</h3>
      <p className="text-sm text-stone-600 mb-5">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors cursor-pointer"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}

export function ArticleCard({
  article,
  variant = 'standard',
}: {
  article: Article;
  variant?: 'standard' | 'featured';
}) {
  return (
    <article className="group bg-white border border-stone-200 flex flex-col h-full transition-colors hover:border-stone-300">
      <Link to={`/baca/${article.slug}`} className="block overflow-hidden">
        <EditorialImage
          src={article.imageUrl}
          alt={article.title}
          aspectClass={variant === 'featured' ? 'aspect-[16/10]' : 'aspect-[4/3]'}
        />
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2.5">
          <span className="font-medium text-[#14532D]">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDateId(article.publishedAt)}</span>
        </div>
        <h3
          className={`font-serif text-stone-900 font-medium leading-snug mb-3 group-hover:text-[#14532D] transition-colors ${
            variant === 'featured' ? 'text-2xl' : 'text-xl'
          }`}
        >
          <Link to={`/baca/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-5 flex-1">
          {article.summary}
        </p>
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
          <span className="text-stone-600 truncate">{article.authorName}</span>
          <Link
            to={`/baca/${article.slug}`}
            className="font-medium text-[#14532D] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            Baca Selengkapnya →
          </Link>
        </div>
      </div>
    </article>
  );
}
