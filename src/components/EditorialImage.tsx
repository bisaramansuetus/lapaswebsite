import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface EditorialImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectClass?: string;
}

export function EditorialImage({
  src,
  alt,
  className = '',
  aspectClass = 'aspect-[4/3]',
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${aspectClass} w-full bg-[#EFEAE0] border border-stone-200 flex flex-col items-center justify-center p-6 text-center text-stone-500 ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-7 h-7 text-[#14532D]/60 mb-2" strokeWidth={1.5} />
        <span className="text-xs font-serif italic text-stone-600 max-w-[22ch] line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} w-full overflow-hidden bg-stone-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />
    </div>
  );
}
