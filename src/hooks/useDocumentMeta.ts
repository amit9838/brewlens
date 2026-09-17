import { useEffect } from "react";

interface DocumentMetaOptions {
  title: string;
  description?: string;
}

const DEFAULT_TITLE = "BrewLens — The Homebrew App Store";
const DEFAULT_DESCRIPTION = document.querySelector<HTMLMetaElement>(
  'meta[name="description"]',
)?.content;
const DEFAULT_URL = "https://amit9838.github.io/brewlens/";

const setMetaContent = (selector: string, content: string) => {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
};

const setCanonical = (url: string) => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
};

/**
 * Sets the document title, meta description, canonical URL and social
 * preview tags for the current route. Restores the defaults on unmount.
 */
export function useDocumentMeta({ title, description }: DocumentMetaOptions) {
  useEffect(() => {
    document.title = title;

    const url = window.location.origin + window.location.pathname;
    const desc = description ?? DEFAULT_DESCRIPTION ?? "";

    setMetaContent('meta[name="description"]', desc);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', desc);
    setMetaContent('meta[property="og:url"]', url);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', desc);
    setMetaContent('meta[name="twitter:url"]', url);
    setCanonical(url);

    return () => {
      document.title = DEFAULT_TITLE;
      setMetaContent('meta[name="description"]', DEFAULT_DESCRIPTION ?? "");
      setMetaContent('meta[property="og:title"]', DEFAULT_TITLE);
      setMetaContent('meta[property="og:description"]', DEFAULT_DESCRIPTION ?? "");
      setMetaContent('meta[property="og:url"]', DEFAULT_URL);
      setMetaContent('meta[name="twitter:title"]', DEFAULT_TITLE);
      setMetaContent('meta[name="twitter:description"]', DEFAULT_DESCRIPTION ?? "");
      setMetaContent('meta[name="twitter:url"]', DEFAULT_URL);
      setCanonical(DEFAULT_URL);
    };
  }, [title, description]);
}
