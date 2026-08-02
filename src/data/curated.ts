/**
 * @file curated.ts
 * Curated pools for Featured Carousel & Editor's Picks on the Discover page.
 * Extracted from categories.ts to keep category definitions lean and focused
 * solely on taxonomy.
 *
 * Both pools are organized by category to ensure broad, diverse coverage
 * across the entire Homebrew cask ecosystem with popular/high-traffic tools.
 */

// ─── Simple, robust array shuffle ────────────────────────────────────────────

function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ─── Featured Casks Carousel Pool ────────────────────────────────────────────

/**
 * Master pool for the hero carousel on the Discover page.
 * 5 tokens are randomly drawn from this on each page load.
 * Organized by category for balanced representation.
 */
const FEATURED_POOL = [
    // ── Browsers ──
    'arc', 'firefox', 'google-chrome', 'brave-browser', 'zen-browser', 'opera', 'vivaldi', 'orion',
    'microsoft-edge', 'tor-browser', 'librewolf', 'duckduckgo', 'min', 'chromium',
    // ── Dev Tools ──
    'visual-studio-code', 'zed', 'warp', 'ghostty', 'iterm2', 'cursor', 'windsurf',
    'jetbrains-toolbox', 'github', 'gitbutler', 'fork', 'tableplus', 'postico',
    'insomnia', 'postman', 'bruno', 'proxyman', 'orbstack', 'docker', 'android-studio',
    'kitty', 'wezterm', 'hyper', 'lens',
    // ── Productivity ──
    'raycast', 'alfred', 'notion', 'obsidian', 'craft', 'logseq', 'bear',
    'fantastical', 'todoist', 'linear-linear', 'cron', 'ulysses',
    'libreoffice', 'calibre', 'evernote', 'thunderbird', 'busycal',
    'dropbox', 'google-drive', 'microsoft-office', 'spark', 'anytype', 'notion-calendar',
    // ── Design & Creative ──
    'figma', 'sketch', 'canva', 'pixelmator-pro', 'gimp', 'inkscape',
    'blender', 'cleanshot', 'affinity-designer', 'affinity-photo', 'penpot',
    'adobe-creative-cloud',
    // ── Media & Entertainment ──
    'spotify', 'iina', 'vlc', 'obs', 'handbrake', 'plex', 'elmedia-player', 'losslesscut',
    'audacity', 'transmission', 'makemkv', 'infuse', 'davinci-resolve', 'jellyfin',
    'screen-studio', 'downie',
    // ── Communication ──
    'slack', 'discord', 'telegram', 'signal', 'whatsapp', 'zoom', 'microsoft-teams', 'element',
    'mattermost', 'loom', 'messenger', 'capcut', 'skype',
    // ── Security & Privacy ──
    '1password', 'bitwarden', 'nordvpn', 'mullvadvpn', 'little-snitch', 'protonvpn',
    'keepassxc', 'tailscale', 'wireguard', 'lulu', 'yubico-yubikey-manager',
    'gpg-suite', 'malwarebytes',
    // ── AI & LLM Tools ──
    'ollama', 'lm-studio', 'chatgpt', 'claude', 'msty', 'diffusionbee',
    'comfyui', 'gpt4all', 'jan', 'draw-things', 'claude-code', 'aider',
    // ── Games & Emulation ──
    'steam', 'openemu', 'ryujinx', 'heroic-games-launcher', 'retroarch', 'dolphin',
    'epic-games', 'gog-galaxy', 'prism-launcher', 'ppsspp', 'minecraft', 'itch',
    // ── Utilities & System ──
    'rectangle', 'bettertouchtool', 'appcleaner', 'daisydisk', 'istat-menus',
    'bartender', 'localsend', 'keka', 'maccy', 'hiddenbar', 'stats',
    'balenaetcher', 'syncthing', 'qbittorrent', 'the-unarchiver', 'shottr',
    'kap', 'monitorcontrol', 'betterdisplay', 'onyx', 'grandperspective',
    'cleanmymac', 'swish', 'betterzip', 'textsniper', 'dropover', 'hot',
];

// ─── Editor's Picks Pool ─────────────────────────────────────────────────────

/**
 * Master pool for the Editor's Picks lane on the Discover page.
 * 10 tokens are randomly drawn from this on each page load.
 */
const EDITORS_PICKS_POOL = [
    // ── Browsers ──
    'arc', 'firefox', 'google-chrome', 'brave-browser', 'zen-browser', 'opera', 'vivaldi',
    'orion', 'tor-browser', 'librewolf', 'microsoft-edge', 'duckduckgo', 'min', 'chromium',
    // ── Dev Tools ──
    'visual-studio-code', 'zed', 'warp', 'ghostty', 'iterm2', 'cursor', 'windsurf',
    'jetbrains-toolbox', 'github', 'gitbutler', 'fork', 'tableplus', 'postico',
    'insomnia', 'postman', 'bruno', 'proxyman', 'orbstack', 'docker', 'dash',
    'sublime-text', 'nova', 'android-studio', 'paw', 'dbeaver-community',
    'kitty', 'wezterm', 'hyper', 'lens', 'devtoys', 'code-server',
    // ── Productivity ──
    'raycast', 'alfred', 'notion', 'obsidian', 'craft', 'logseq', 'bear',
    'fantastical', 'todoist', 'linear-linear', 'cron', 'ulysses',
    'things', 'ia-writer', 'evernote', 'libreoffice', 'calibre', 'thunderbird',
    'busycal', 'airmail', 'airtable', 'dropbox', 'google-drive',
    'microsoft-office', 'spark', 'anytype', 'notion-calendar',
    // ── Design & Creative ──
    'figma', 'sketch', 'canva', 'pixelmator-pro', 'gimp', 'inkscape',
    'blender', 'cleanshot', 'affinity-designer', 'affinity-photo',
    'penpot', 'lunacy', 'zeplin', 'cinema-4d', 'adobe-creative-cloud',
    // ── Media & Entertainment ──
    'spotify', 'iina', 'vlc', 'obs', 'handbrake', 'plex', 'elmedia-player',
    'losslesscut', 'jellyfin', 'infuse', 'audacity', 'transmission',
    'makemkv', 'davinci-resolve', 'deezer', 'subler', 'screen-studio',
    'downie', 'pulltube',
    // ── Communication ──
    'slack', 'discord', 'telegram', 'signal', 'whatsapp', 'zoom',
    'microsoft-teams', 'element', 'mattermost', 'loom', 'messenger',
    'around', 'krisp', 'capcut', 'riverside', 'skype',
    // ── Security & Privacy ──
    '1password', 'bitwarden', 'nordvpn', 'mullvadvpn', 'little-snitch',
    'protonvpn', 'keepassxc', 'tailscale', 'lulu', 'wireguard',
    'yubico-yubikey-manager', 'expressvpn', 'dashlane', 'gpg-suite', 'malwarebytes',
    // ── AI & LLM Tools ──
    'ollama', 'lm-studio', 'chatgpt', 'claude', 'msty', 'diffusionbee',
    'comfyui', 'gpt4all', 'pinokio', 'stable-diffusion-webui',
    'jan', 'draw-things', 'open-interpreter', 'claude-code', 'aider',
    'tabby', 'codium',
    // ── Games & Emulation ──
    'steam', 'openemu', 'ryujinx', 'heroic-games-launcher', 'retroarch',
    'dolphin', 'ppsspp', 'whisky', 'epic-games', 'gog-galaxy',
    'prism-launcher', 'porting-kit', 'minecraft', 'itch',
    // ── Utilities & System ──
    'rectangle', 'bettertouchtool', 'appcleaner', 'daisydisk', 'istat-menus',
    'bartender', 'localsend', 'keka', 'maccy', 'hiddenbar', 'stats',
    'shottr', 'kap', 'balenaetcher', 'syncthing', 'qbittorrent',
    'the-unarchiver', 'monitorcontrol', 'betterdisplay', 'onyx',
    'grandperspective', 'alt-tab', 'itsycal', 'latest',
    'cleanmymac', 'swish', 'betterzip', 'textsniper', 'dropover', 'hot',
    'carbon-copy-cloner',
    // ── Fonts ──
    'font-hack-nerd-font', 'font-fira-code-nerd-font', 'font-jetbrains-mono-nerd-font',
    'font-meslo-lg-nerd-font', 'font-cascadia-code',
];

// Dynamically generate on load — shuffled at import time so each page visit
// shows a fresh, randomized set drawn from every category.
export const FEATURED_CASKS = shuffle(FEATURED_POOL).slice(0, 5);
export const EDITORS_PICKS_TOKENS = shuffle(EDITORS_PICKS_POOL).slice(0, 10);