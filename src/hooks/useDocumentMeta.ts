import { useEffect } from "react";

interface DocumentMetaOptions {
  title: string;
  description?: string;
}

const DEFAULT_TITLE = "BrewLens — The Homebrew App Store";
const DEFAULT_DESCRIPTION = document.querySelector<HTMLMetaElement>(
  'meta[name="description"]',
)?.content;

/**
 * Sets the document title and meta description for the current route.
 * Restores the defaults on unmount.
 */
export function useDocumentMeta({ title, description }: DocumentMetaOptions) {
  useEffect(() => {
    document.title = title;

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const prevDescription = meta?.content ?? DEFAULT_DESCRIPTION;

    if (meta && description) meta.content = description;

    return () => {
      document.title = DEFAULT_TITLE;
      if (meta) meta.content = prevDescription ?? DEFAULT_DESCRIPTION ?? "";
    };
  }, [title, description]);
}
