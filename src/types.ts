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
    /** Full unmodified API response for fields not in the normalized shape */
    raw: any;
    /** Pre-computed lowercase search index for fast filtering */
    _searchString: string;
}