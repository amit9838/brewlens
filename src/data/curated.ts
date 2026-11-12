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
 * 1,500+ installs a year. Each app is listed once, in its main category. Left out:
 * beta / nightly builds of an app already listed, SDKs, drivers, and the separate
 * Office apps (`microsoft-office` covers them). Command-line casks are kept only
 * when they're major apps in their own right (`codex`, `claude-code`).
 */
const CURATED_POOL: Record<string, readonly string[]> = {
    'Browsers': [
        'google-chrome', 'firefox', 'brave-browser', 'microsoft-edge', 'librewolf', 'zen',
        'ungoogled-chromium', 'tor-browser', 'vivaldi', 'helium-browser', 'duckduckgo', 'opera',
        'orion', 'thebrowsercompany-dia', 'finicky', 'comet', 'mullvad-browser', 'waterfox', 'floorp',
        'thorium', 'responsively',
    ],
    'Dev Tools': [
        'docker-desktop', 'visual-studio-code', 'ghostty', 'iterm2', 'orbstack', 'postman', 'warp',
        'android-studio', 'dbeaver-community', 'zed', 'bruno', 'utm', 'sublime-text', 'kitty', 'github',
        'wireshark-app', 'db-browser-for-sqlite', 'pgadmin4', 'godot', 'wezterm', 'vscodium',
        'podman-desktop', 'intellij-idea', 'cyberduck', 'mongodb-compass', 'tableplus', 'rancher',
        'jetbrains-toolbox', 'unity-hub', 'emacs-app', 'multipass', 'meld', 'sequel-ace', 'virtualbox',
        'xcodes-app', 'mysqlworkbench', 'headlamp', 'coteditor', 'pycharm', 'sourcetree', 'freelens',
        'redis-insight', 'insomnia', 'termius', 'proxyman', 'another-redis-desktop-manager', 'rstudio',
        'fork', 'tabby', 'wave', 'datagrip', 'lens', 'arduino-ide', 'beekeeper-studio', 'sf-symbols',
        'bbedit', 'charles', 'webstorm', 'gitkraken', 'parallels', 'beyond-compare', 'neovide-app',
        'postgres-app', 'mockoon', 'rider', 'macvim-app', 'devtoys', 'goland', 'textmate', 'expo-orbit',
        'sublime-merge', 'yaak', 'hex-fiend', 'postico', 'transmit', 'royal-tsx', 'phpstorm', 'clion',
        'gitbutler', 'hoppscotch', 'requestly', 'swiftformat-for-xcode', 'positron', 'rapidapi',
        'rustrover', 'httpie-desktop', 'dash', 'tower', 'studio-3t', 'pulsar', 'gitup-app',
        'jupyterlab-app', 'dbgate',
    ],
    'Productivity': [
        'libreoffice', 'obsidian', 'notion', 'adobe-acrobat-reader', 'google-drive', 'calibre',
        'alfred', 'thunderbird', 'onedrive', 'markedit', 'microsoft-office', 'zotero', 'dropbox',
        'anki', 'skim', 'typora', 'espanso', 'easydict', 'nextcloud', 'onlyoffice', 'zettlr',
        'netnewswire', 'joplin', 'logseq', 'notion-calendar', 'todoist-app', 'linear', 'deepl',
        'grammarly-desktop', 'pdf-expert', 'miro', 'ticktick', 'xmind', 'readdle-spark', 'anytype',
        'popclip', 'fantastical', 'megasync', 'keyboard-maestro', 'raindropio', 'clickup', 'mimestream',
        'affine', 'asana', 'appflowy',
    ],
    'Design & Creative': [
        'blender', 'drawio', 'inkscape', 'gimp', 'figma', 'freecad', 'shottr', 'kicad', 'affinity',
        'bambu-studio', 'cleanshot', 'krita', 'adobe-creative-cloud', 'imageoptim', 'orcaslicer',
        'autodesk-fusion', 'prusaslicer', 'xnviewmp', 'pika', 'canva', 'clop', 'rawtherapee',
        'sweet-home3d', 'ultimaker-cura', 'sketch',
    ],
    'Media & Entertainment': [
        'vlc', 'spotify', 'iina', 'obs', 'audacity', 'transmission', 'handbrake-app',
        'background-music', 'jellyfin', 'stremio', 'capcut', 'downie', 'kap', 'losslesscut', 'plex',
        'eqmac', 'musescore', 'mkvtoolnix-app', 'soundsource', 'musicbrainz-picard', 'kdenlive',
        'shotcut', 'reaper', 'cap', 'foobar2000', 'tidal', 'sonos', 'kodi', 'mediainfo', 'audio-hijack',
        'yt-music', 'screen-studio', 'loopback', 'webtorrent', 'permute', 'plexamp', 'elmedia-player',
    ],
    'Communication': [
        'discord', 'slack', 'zoom', 'whatsapp', 'telegram', 'microsoft-teams', 'signal', 'wechat',
        'element', 'webex', 'vesktop', 'loom', 'mattermost', 'beeper', 'viber', 'ferdium', 'keybase',
    ],
    'Security & Privacy': [
        'tailscale-app', '1password', 'bitwarden', 'keepassxc', 'protonvpn', 'cloudflare-warp', 'lulu',
        'openvpn-connect', 'tunnelblick', 'nordvpn', 'burp-suite', 'cryptomator', 'mullvad-vpn',
        'yubico-authenticator', 'secretive', 'proton-mail', 'proton-pass', 'knockknock',
        'little-snitch', 'gpg-suite', 'proton-drive', 'adguard', 'veracrypt', 'malwarebytes',
        'proton-mail-bridge', 'surfshark', 'windscribe', 'blockblock', 'ente-auth', 'oversight',
        'viscosity',
    ],
    'AI & LLM Tools': [
        'codex', 'claude-code', 'claude', 'cursor', 'opencode-desktop', 'chatgpt', 'ollama-app',
        'antigravity', 'cmux', 'lm-studio', 'codexbar', 'google-gemini', 'handy',
        'github-copilot-for-xcode', 'upscayl', 'fluidvoice', 'kiro', 'wispr-flow', 'block-goose',
        'macwhisper', 'superwhisper', 'voiceink', 'cherry-studio', 'anythingllm', 'granola',
        'draw-things', 'comfy', 'trae', 'chatbox', 'jan', 'devin-desktop', 'buzz', 'diffusionbee',
        'perplexity',
    ],
    'Games & Emulation': [
        'steam', 'moonlight', 'crossover', 'prismlauncher', 'epic-games', 'parsec', 'minecraft',
        'roblox', 'nvidia-geforce-now', 'playcover-community', 'porting-kit', 'battle-net', 'heroic',
        'dolphin', 'retroarch', 'pcsx2', 'openra', 'curseforge', 'mgba-app', 'gog-galaxy',
        'league-of-legends', 'vcmi', 'openttd',
    ],
    'Utilities & System': [
        'stats', 'rectangle', 'raycast', 'maccy', 'betterdisplay', 'localsend', 'alt-tab',
        'karabiner-elements', 'jordanbaird-ice', 'hammerspoon', 'appcleaner', 'linearmouse', 'keka',
        'pearcleaner', 'mos', 'qlmarkdown', 'balenaetcher', 'monitorcontrol', 'rustdesk', 'dockdoor',
        'swiftbar', 'caffeine', 'windows-app', 'thaw', 'openmtp', 'hiddenbar', 'mounty', 'gemini',
        'raspberry-pi-imager', 'the-unarchiver', 'scroll-reverser', 'anydesk', 'aldente', 'notunes',
        'applite', 'keepingyouawake', 'syncthing-app', 'grandperspective', 'keycastr', 'onyx',
        'mac-mouse-fix', 'macs-fan-control', 'homebrew-app', 'bettertouchtool', 'android-file-transfer',
        'clipy', 'itsycal', 'lunar', 'middleclick', 'amethyst', 'istat-menus', 'unnaturalscrollwheels',
        'bartender', 'daisydisk', 'keyclu', 'coconutbattery', 'battery', 'syntax-highlight',
        'macpacker', 'loop', 'marta', 'omnidisksweeper', 'latest', 'meetingbar', 'input-source-pro',
        'hot', 'openinterminal', 'quicklook-video', 'forklift', 'cleanmymac', 'elgato-stream-deck',
        'rectangle-pro', 'cork', 'xbar', 'flycut', 'suspicious-package', 'bettermouse', 'betterzip',
        'hyperkey', 'homerow', 'shortcat', 'carbon-copy-cloner', 'numi', 'hazel', 'jumpcut', 'moom',
        'sloth', 'apparency', 'tg-pro',
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
    'virtualbox', 'sf-symbols', 'dash', 'tower', 'studio-3t', 'pulsar', 'gitup-app',
    'jupyterlab-app', 'dbgate',
    // Productivity
    'adobe-acrobat-reader', 'google-drive', 'onedrive', 'microsoft-office', 'nextcloud',
    'mimestream', 'affine', 'asana', 'appflowy',
    // Design & Creative
    'kicad', 'adobe-creative-cloud', 'autodesk-fusion', 'ultimaker-cura', 'sketch',
    // Media & Entertainment
    'background-music', 'audio-hijack', 'yt-music', 'screen-studio', 'loopback', 'webtorrent',
    'permute', 'plexamp', 'elmedia-player',
    // Communication
    'zoom', 'microsoft-teams', 'ferdium', 'keybase',
    // Security & Privacy
    'tailscale-app', 'cloudflare-warp', 'openvpn-connect', 'nordvpn', 'mullvad-vpn', 'gpg-suite',
    'adguard', 'veracrypt', 'malwarebytes', 'windscribe', 'blockblock', 'oversight', 'viscosity',
    // AI & LLM Tools
    'codex', 'claude-code', 'github-copilot-for-xcode', 'perplexity',
    // Games & Emulation
    'parsec', 'battle-net', 'gog-galaxy', 'league-of-legends', 'vcmi', 'openttd',
    // Utilities & System
    'karabiner-elements', 'windows-app', 'anydesk', 'android-file-transfer', 'moom', 'sloth',
    'apparency', 'tg-pro',
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
