import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'book';
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function SeoHead({ title, description, type = 'website' }: SeoHeadProps) {
  useEffect(() => {
    const fullTitle = title.includes('LapAs') ? title : `${title} — LapAs`;
    document.title = fullTitle;
    const url = window.location.origin + window.location.pathname;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type === 'article' ? 'article' : 'website');
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, type]);

  return null;
}
