/**
 * @file types.ts
 * Shared TypeScript type definitions for the BrewLens application.
 * All API data flows through these types after normalization.
 */

/** Discriminates between Homebrew GUI apps (casks) and CLI tools (formulae). */
export type BrewType = 'cask' | 'formula';

/**
 * Open-source status of a Homebrew package.
 * Computed by `getSourceCodeStatus()` during data normalization.
 */
export interface BrewPackage {
    /** Whether a source code URL was found and verified */
    verified: boolean;
    /** Whether the source is hosted on a known OSS platform */
    isFoss: boolean;
    /** Direct URL to the source repository, or empty string if not found */
    fossUrl: string | null;
}

/**
 * Raw cask or formula object from the Homebrew API (formulae.brew.sh).
 * Only the fields BrewLens reads are typed; everything else is `unknown`.
 */
export interface RawBrewData {
    [key: string]: unknown;
    /** Cask token, e.g. `firefox` (casks only) */
    full_token?: string;
    /** Formula full name, e.g. `git` or `user/tap/name` (formulae only) */
    full_name?: string;
    /** Display names (casks) or the formula name */
    name?: string | string[];
    desc?: string | null;
    homepage?: string;
    deprecated?: boolean;
    disabled?: boolean;
    /** Cask version */
    version?: string;
    /** Formula versions */
    versions?: { stable?: string | null };
    /** Cask download URL and checksum */
    url?: string;
    sha256?: string;
    url_specs?: Record<string, string>;
    artifacts?: unknown[];
    depends_on?: { macos?: unknown };
    /** Formula source URLs */
    urls?: { stable?: { url?: string }; head?: { url?: string } };
    tap?: string;
    dependencies?: string[];
    build_dependencies?: string[];
    revision?: number;
    keg_only?: boolean;
    bottle?: unknown;
    license?: string | null;
    /** Install counts per period ("30d", "90d", "365d") keyed by token */
    analytics?: { install?: Record<string, Record<string, number>> };
}

/**
 * Normalized representation of a Homebrew cask or formula.
 * Consumed by all page components, cards, and filter logic.
 */
export interface BrewItem {
    /** Unique identifier: full_token for casks, name for formulae */
    id: string;
    /** Whether this is a cask (GUI app) or formula (CLI tool) */
    type: BrewType;
    /** Human-readable display name */
    name: string;
    /** Homebrew token used in install commands */
    token: string;
    /** Package description */
    desc: string;
    /** Current stable version string */
    version: string;
    /** Package homepage URL */
    homepage?: string;
    /** Whether the package is deprecated */
    deprecated?: boolean;
    /** Whether the package is disabled */
    disabled?: boolean;
    /** Ready-to-run install command, e.g. `brew install --cask firefox` */
    installCmd: string;
    /** Open-source status computed at normalization time */
    package: BrewPackage;
    /**
     * Full unmodified API response for fields not in the normalized shape.
     * Only set on single-package (detail page) fetches; list items leave it out to save memory.
     */
    raw?: RawBrewData;
    /** Pre-computed lowercase search index for fast filtering */
    _searchString: string;
}