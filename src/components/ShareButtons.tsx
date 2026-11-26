import { useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-stone-200">
      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-500 mr-2">
        <Share2 className="w-3.5 h-3.5" />
        Bagikan
      </span>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3.5 py-1.5 text-xs font-medium border border-stone-300 text-stone-700 hover:border-[#14532D] hover:text-[#14532D] transition-colors whitespace-nowrap"
      >
        WhatsApp
      </a>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3.5 py-1.5 text-xs font-medium border border-stone-300 text-stone-700 hover:border-[#14532D] hover:text-[#14532D] transition-colors whitespace-nowrap"
      >
        X / Twitter
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium border border-stone-300 text-stone-700 hover:border-[#14532D] hover:text-[#14532D] transition-colors cursor-pointer whitespace-nowrap"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-[#14532D]" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? 'Tautan Disalin' : 'Salin Tautan'}
      </button>
    </div>
  );
}
