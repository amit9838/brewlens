/**
 * @file curated.ts
 * The curated pool behind the featured carousel and Editor's Picks on the Discover page,
 * and the hand-picked list of open-source casks (`OPEN_SOURCE_CASKS`).
 *
 * The pool is grouped by category and each visit draws across categories
 * (`drawBalanced` in lib/random.ts), so no single category dominates.
 *
 * Every token was checked against the Homebrew API (Nov 2026): it exists, is not
 * deprecated or disabled, and is popular enough by 365-day installs. Within a
 * category, tokens are listed most-installed first. Deprecated or disabled casks
 * are also filtered out at runtime (Discover), so a pool can go stale safely.
 */
import { drawBalanced } from '../lib/random';

// ─── Curated pool ────────────────────────────────────────────────────────────

/**
 * Apps for the featured carousel and Editor's Picks, grouped by category.
 * 1,500+ installs a year, including some command-line casks.
 */
const CURATED_POOL: Record<string, readonly string[]> = {
    'Browsers': [
        'google-chrome', 'firefox', 'brave-browser', 'microsoft-edge', 'librewolf', 'zen',
        'ungoogled-chromium', 'tor-browser', 'vivaldi', 'helium-browser', 'duckduckgo',
        'firefox@developer-edition', 'opera', 'orion', 'thebrowsercompany-dia', 'google-chrome@canary',
        'finicky', 'comet', 'mullvad-browser', 'firefox@nightly', 'waterfox', 'floorp', 'yandex',
        'thorium', 'responsively',
    ],
    'Dev Tools': [
        'docker-desktop', 'android-platform-tools', 'visual-studio-code', 'ghostty', 'ngrok', 'iterm2',
        'flutter', 'orbstack', 'postman', 'warp', 'android-studio', 'dbeaver-community', 'cursor',
        'zed', 'bruno', 'utm', 'miniconda', 'sublime-text', 'kitty', 'github', 'wireshark-app',
        'db-browser-for-sqlite', 'pgadmin4', 'godot', 'wezterm', 'vscodium', 'podman-desktop',
        'intellij-idea', 'cyberduck', 'mongodb-compass', 'tableplus', 'rancher', 'jetbrains-toolbox',
        'unity-hub', 'meld', 'anaconda', 'sequel-ace', 'virtualbox', 'xcodes-app', 'coteditor',
        'pycharm', 'sourcetree', 'redis-insight', 'insomnia', 'termius', 'proxyman', 'rstudio', 'kiro',
        'fork', 'tabby', 'datagrip', 'lens', 'visual-studio-code@insiders', 'beekeeper-studio',
        'sf-symbols', 'bbedit', 'charles', 'webstorm', 'gitkraken', 'linear', 'parallels',
        'beyond-compare', 'neovide-app', 'rider', 'macvim-app', 'devtoys', 'goland', 'textmate', 'trae',
        'expo-orbit', 'sublime-merge', 'yaak', 'postico', 'transmit', 'royal-tsx', 'phpstorm',
        'zed@preview', 'clion', 'gitbutler', 'devin-desktop', 'hoppscotch', 'requestly',
        'swiftformat-for-xcode', 'positron', 'rapidapi', 'rustrover', 'httpie-desktop', 'dash', 'tower',
        'studio-3t', 'pulsar', 'gitup-app', 'p4v', 'jupyterlab-app', 'dbgate',
    ],
    'Productivity': [
        'libreoffice', 'obsidian', 'raycast', 'chatgpt', 'notion', 'adobe-acrobat-reader',
        'google-drive', 'calibre', 'alfred', 'microsoft-excel', 'thunderbird', 'microsoft-word',
        'onedrive', 'microsoft-office', 'zotero', 'dropbox', 'anki', 'microsoft-outlook',
        'microsoft-powerpoint', 'skim', 'typora', 'espanso', 'nextcloud', 'onlyoffice', 'zettlr',
        'netnewswire', 'joplin', 'logseq', 'notion-calendar', 'todoist-app', 'linear', 'deepl',
        'grammarly-desktop', 'loom', 'microsoft-onenote', 'pdf-expert', 'miro', 'ticktick', 'xmind',
        'readdle-spark', 'anytype', 'popclip', 'fantastical', 'megasync', 'keyboard-maestro',
        'raindropio', 'clickup', 'mimestream', 'affine', 'asana', 'appflowy',
    ],
    'Design & Creative': [
        'blender', 'drawio', 'inkscape', 'gimp', 'figma', 'freecad', 'shottr', 'kicad', 'affinity',
        'bambu-studio', 'cleanshot', 'krita', 'adobe-creative-cloud', 'imageoptim', 'orcaslicer',
        'autodesk-fusion', 'prusaslicer', 'xnviewmp', 'canva', 'rawtherapee', 'sweet-home3d',
        'ultimaker-cura', 'sketch',
    ],
    'Media & Entertainment': [
        'vlc', 'blackhole-2ch', 'spotify', 'iina', 'obs', 'calibre', 'audacity', 'transmission',
        'handbrake-app', 'background-music', 'jellyfin', 'stremio', 'downie', 'kap', 'losslesscut',
        'plex', 'eqmac', 'musescore', 'mkvtoolnix-app', 'jellyfin-media-player', 'plex-media-server',
        'soundsource', 'musicbrainz-picard', 'kdenlive', 'shotcut', 'reaper', 'cap', 'foobar2000',
        'tidal', 'sonos', 'kodi', 'mediainfo', 'audio-hijack', 'yt-music', 'screen-studio', 'loopback',
        'webtorrent', 'permute', 'plexamp', 'elmedia-player',
    ],
    'Communication': [
        'discord', 'slack', 'zoom', 'whatsapp', 'telegram', 'microsoft-teams', 'signal', 'wechat',
        'telegram-desktop', 'element', 'webex', 'vesktop', 'loom', 'mattermost', 'beeper', 'viber',
        'ferdium', 'keybase',
    ],
    'Security & Privacy': [
        '1password-cli', 'tailscale-app', 'macfuse', '1password', 'bitwarden', 'keepassxc', 'protonvpn',
        'cloudflare-warp', 'lulu', 'openvpn-connect', 'tunnelblick', 'nordvpn', 'cryptomator',
        'mullvad-vpn', 'yubico-authenticator', 'proton-mail', 'proton-pass', 'knockknock',
        'little-snitch', 'gpg-suite', 'proton-drive', 'adguard', 'veracrypt', 'malwarebytes',
        'proton-mail-bridge', 'surfshark', 'windscribe', 'blockblock', 'ente-auth', 'oversight',
        'viscosity',
    ],
    'AI & LLM Tools': [
        'codex', 'claude-code', 'claude', 'warp', 'raycast', 'cursor', 'zed', 'chatgpt', 'ollama-app',
        'lm-studio', 'hammerspoon', 'gemini', 'kiro', 'wispr-flow', 'macwhisper', 'superwhisper',
        'voiceink', 'cherry-studio', 'anythingllm', 'granola', 'draw-things', 'comfy', 'trae',
        'chatbox', 'jan', 'devin-desktop', 'buzz', 'copilot-for-xcode', 'diffusionbee', 'perplexity',
        'alma', 'ollamac',
    ],
    'Games & Emulation': [
        'steam', 'moonlight', 'crossover', 'android-file-transfer', 'prismlauncher', 'epic-games',
        'parsec', 'minecraft', 'nvidia-geforce-now', 'playcover-community', 'porting-kit', 'battle-net',
        'heroic', 'dolphin', 'retroarch', 'pcsx2', 'openra', 'curseforge', 'mgba-app', 'gog-galaxy',
        'league-of-legends', 'vcmi', 'openttd', 'retroarch-metal',
    ],
    'Utilities & System': [
        'iterm2', 'stats', 'rectangle', 'raycast', 'maccy', 'betterdisplay', 'localsend', 'alt-tab',
        'karabiner-elements', 'jordanbaird-ice', 'hammerspoon', 'appcleaner', 'linearmouse', 'keka',
        'pearcleaner', 'logi-options+', 'mos', 'qlmarkdown', 'balenaetcher', 'monitorcontrol',
        'swiftbar', 'caffeine', 'thaw', 'hiddenbar', 'shottr', 'the-unarchiver', 'scroll-reverser',
        'aldente', 'keepingyouawake', 'syncthing-app', 'grandperspective', 'keycastr', 'onyx',
        'mac-mouse-fix', 'macs-fan-control', 'bettertouchtool', 'clipy', 'itsycal', 'lunar',
        'middleclick', 'amethyst', 'orion', 'istat-menus', 'unnaturalscrollwheels', 'bartender',
        'daisydisk', 'displaylink', 'coconutbattery', 'syntax-highlight', 'cleanshot', 'loop', 'marta',
        'omnidisksweeper', 'latest', 'meetingbar', 'kap', 'input-source-pro', 'hot', 'openinterminal',
        'quicklook-video', 'forklift', 'cleanmymac', 'rectangle-pro', 'xbar', 'flycut',
        'suspicious-package', 'bettermouse', 'betterzip', 'hyperkey', 'homerow', 'shortcat',
        'carbon-copy-cloner', 'numi', 'hazel', 'jumpcut', 'moom', 'sloth', 'apparency', 'tg-pro',
    ],
};

/**
 * Pool apps kept out of the featured carousel, which they'd look thin on: command-line
 * casks, drivers and plugins, apps under 2,000 installs a year, and everyday apps
 * most people already have (Office, Zoom). They still appear in Editor's Picks.
 */
const NOT_FEATURED: ReadonlySet<string> = new Set([
    // Browsers
    'thorium', 'responsively',
    // Dev Tools
    'android-platform-tools', 'ngrok', 'flutter', 'miniconda', 'anaconda', 'virtualbox',
    'sf-symbols', 'dash', 'tower', 'studio-3t', 'pulsar', 'gitup-app', 'p4v', 'jupyterlab-app',
    'dbgate',
    // Productivity
    'adobe-acrobat-reader', 'google-drive', 'microsoft-excel', 'microsoft-word', 'onedrive',
    'microsoft-office', 'microsoft-outlook', 'microsoft-powerpoint', 'nextcloud',
    'microsoft-onenote', 'mimestream', 'affine', 'asana', 'appflowy',
    // Design & Creative
    'kicad', 'adobe-creative-cloud', 'autodesk-fusion', 'ultimaker-cura', 'sketch',
    // Media & Entertainment
    'blackhole-2ch', 'background-music', 'audio-hijack', 'yt-music', 'screen-studio',
    'loopback', 'webtorrent', 'permute', 'plexamp', 'elmedia-player',
    // Communication
    'zoom', 'microsoft-teams', 'ferdium', 'keybase',
    // Security & Privacy
    '1password-cli', 'tailscale-app', 'macfuse', 'cloudflare-warp', 'openvpn-connect',
    'nordvpn', 'mullvad-vpn', 'gpg-suite', 'adguard', 'veracrypt', 'malwarebytes', 'windscribe',
    'blockblock', 'oversight', 'viscosity',
    // AI & LLM Tools
    'codex', 'claude-code', 'perplexity', 'alma', 'ollamac',
    // Games & Emulation
    'parsec', 'battle-net', 'gog-galaxy', 'league-of-legends', 'vcmi', 'openttd',
    'retroarch-metal',
    // Utilities & System
    'karabiner-elements', 'logi-options+', 'displaylink', 'moom', 'sloth', 'apparency',
    'tg-pro',
]);

// ─── Today's draw ────────────────────────────────────────────────────────────

/** Apps shown on recent visits (newest first), so the next visits show different apps first. */
const RECENT_DRAWS_KEY = 'brewlens_curated_last';
/** About three visits' worth of draws (8 featured + 10 picks each). */
const RECENT_DRAWS_LIMIT = 54;

function readRecentDraws(): string[] {
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(RECENT_DRAWS_KEY) ?? '[]');
        return Array.isArray(saved) ? saved.filter((t): t is string => typeof t === 'string') : [];
    } catch {
        return [];
    }
}

const recentDraws = readRecentDraws();
const avoid = new Set(recentDraws);

// Drawn once per page load. Both draw more than Discover shows (5 featured, 4 picks),
// so deprecated or disabled casks can be dropped, and Editor's Picks never repeats a
// featured app.
export const FEATURED_CASKS = drawBalanced(CURATED_POOL, 8, { avoid, exclude: NOT_FEATURED });
export const EDITORS_PICKS_TOKENS = drawBalanced(CURATED_POOL, 10, {
    avoid,
    exclude: new Set(FEATURED_CASKS),
});

try {
    const draw = [...FEATURED_CASKS, ...EDITORS_PICKS_TOKENS];
    const kept = recentDraws.filter((t) => !draw.includes(t));
    localStorage.setItem(RECENT_DRAWS_KEY, JSON.stringify([...draw, ...kept].slice(0, RECENT_DRAWS_LIMIT)));
} catch {
    // Storage unavailable (e.g. some private modes): repeats are just more likely.
}

// ─── Open-source casks ───────────────────────────────────────────────────────

/**
 * Casks we know are open source but that `getSourceCodeStatus` can't detect on
 * its own: the Homebrew API has no license for casks, so it only trusts a
 * homepage that is a repository page (github.com/owner/repo, …).
 *
 * Add an app here when its homepage is its own website. Only use tokens that
 * exist in the API. Casks whose homepage is already a repository don't need
 * listing.
 */
export const OPEN_SOURCE_CASKS: ReadonlySet<string> = new Set([
    // ── Browsers & internet ──
    'brave-browser', 'chromium', 'firefox', 'librewolf', 'thunderbird', 'tor-browser',
    'element', 'signal', 'telegram-desktop', 'localsend', 'transmission', 'qbittorrent', 'syncthing-app',
    // ── Developer tools & terminals ──
    'ghostty', 'iterm2', 'wezterm', 'zed', 'utm', 'podman-desktop', 'rancher', 'godot',
    // ── Productivity & utilities ──
    'alt-tab', 'hammerspoon', 'karabiner-elements', 'maccy', 'rectangle', 'lulu',
    'bitwarden', 'keepassxc', 'joplin', 'standard-notes', 'netnewswire', 'anki', 'calibre', 'libreoffice',
    // ── Media & design ──
    'vlc', 'iina', 'obs', 'audacity', 'shotcut', 'kdenlive', 'musescore',
    'blender', 'gimp', 'inkscape', 'krita', 'darktable', 'freecad', 'kicad',
    // ── AI ──
    'jan',
]);
