// Complete TypeScript interfaces for Homebrew formula/cask JSON
export interface Formula {
  name: string;
  full_name: string;
  desc: string | null;
  homepage: string;
  version: string;
  versions: {
    stable: string;
    head?: string;
    bottle: boolean;
  };
  revision: number;
  license: string | null;
  dependencies: string[];
  build_dependencies: string[];
  installed: any[];
  keg_only: boolean;
  bottle: Record<string, any>;
  sha256?: string;
  url?: string;
  deprecated: boolean;
  deprecation_date?: string;
  disabled: boolean;
  disable_date?: string;
}

export interface Cask {
  token: string;
  full_token: string;
  name: string[];
  desc: string | null;
  homepage: string;
  version: string;
  sha256: string;
  url: string;
  appcast: string | null;
  artifacts: Array<Record<string, any> | string>;
  depends_on?: {
    macos?: Record<string, any>;
    arch?: Array<{ type: string; bits?: number }>;
    formula?: string[];
    cask?: string[];
  };
  deprecated: boolean;
  deprecation_date?: string;
  disabled: boolean;
  disable_date?: string;
}

export type PackageType = 'formula' | 'cask';
export type PackageData = Formula | Cask;