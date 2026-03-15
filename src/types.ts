export type BrewType = 'cask' | 'formula';

export interface BrewPackage {
    verified: boolean;
    isFoss: boolean;
    fossUrl: string | null;
}

export interface BrewItem {
    id: string;
    type: BrewType
    name: string;
    token: string;
    desc: string;
    version: string;
    homepage?: string;
    deprecated?: boolean;
    disabled?: boolean;
    installCmd: string;
    package: BrewPackage;
    raw: any;
    _searchString: string; // Optimized for filtering
}