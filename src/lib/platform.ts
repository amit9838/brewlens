/**
 * @file platform.ts
 * Platform detection for keyboard shortcuts (⌘ on Apple devices, Ctrl elsewhere).
 */

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** Label for the global search shortcut. */
export const shortcutLabel = isMac ? '⌘K' : 'Ctrl K';
