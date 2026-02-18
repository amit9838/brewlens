export type BrewType = 'cask' | 'formula';

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
    raw: any;
    _searchString: string; // Optimized for filtering
}