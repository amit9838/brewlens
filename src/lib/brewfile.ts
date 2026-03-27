import type { BrewItem } from '../types';

/**
 * Generates Brewfile content from a list of BrewItems.
 * Casks emit `cask "token"`, formulae emit `brew "token"`.
 */
export function buildBrewfile(items: BrewItem[]): string {
    return items
        .map(item => item.type === 'cask' ? `cask "${item.token}"` : `brew "${item.token}"`)
        .join('\n');
}
