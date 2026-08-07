/**
 * @file categories.ts
 * Industry-standard category definitions for Homebrew casks & formulae.
 *
 * Each category is self-contained with icon, color, and metadata so consumer
 * components (BrewList, FeaturedBanner, Explore) can derive all UI styling
 * from a single source of truth — no more duplicated style maps.
 *
 * Also exports `buildCategoryIndex()` for O(1) token→category lookups.
 */

// ─── Category Schema ──────────────────────────────────────────────────────────

export interface Category {
    id: string;
    label: string;
    /** Description blurb for Explore / Discover cards */
    description?: string;
    /** Exact token matches — highest priority */
    tokens?: string[];
    /** If true, match any token/name/desc that CONTAINS one of the keywords */
    keywords?: string[];
    /** Applies only to casks, formulae, or both */
    types?: ('cask' | 'formula')[];
    /** Lucide icon name (string key) — consumers map to actual imports */
    icon: string;
    /** Tailwind color family used by `getCategoryStyle()` */
    color: string;
}

// ─── Cask Categories ─────────────────────────────────────────────────────────

export const CASK_CATEGORIES: Category[] = [
    {
        id: 'all',
        label: 'All',
        icon: 'Home',
        color: 'zinc',
        description: 'Browse the complete Homebrew cask catalog',
    },
    {
        id: 'productivity',
        label: 'Productivity',
        description: 'Notes, task organizers, calendars & email',
        icon: 'Zap',
        color: 'emerald',
        tokens: [
            'notion', 'obsidian', 'logseq', 'craft', 'bear', 'todoist', 'things',
            'omnifocus', 'fantastical', 'calendar366', 'linear-linear', 'clickup', 'asana',
            'monday', 'trello', 'airtable', 'cron', 'superhuman', 'mimestream',
            'spark', 'airmail', 'evernote', 'basecamp', 'minder', 'focus', 'agenda',
            'ulysses', 'ia-writer', 'scrivener', 'goodnotes', 'notability',
            'devonthink', 'apple-notes', 'reminders', 'busycal', 'busycontacts',
        ],
        keywords: [
            'todo', 'note', 'calendar', 'mail', 'office', 'word', 'excel', 'sheet',
            'agenda', 'task', 'project', 'organize', 'productivity', 'email', 'reminder',
            'writing', 'journal', 'planner',
        ],
    },
    {
        id: 'dev-tools',
        label: 'Dev Tools',
        description: 'Terminals, IDEs, editors & database clients',
        icon: 'Terminal',
        color: 'indigo',
        tokens: [
            'iterm2', 'warp', 'ghostty', 'visual-studio-code', 'zed', 'cursor',
            'windsurf', 'nova', 'sublime-text', 'jetbrains-toolbox', 'intellij-idea',
            'webstorm', 'pycharm', 'datagrip', 'rubymine', 'phpstorm', 'goland',
            'rider', 'clion', 'fleet', 'android-studio', 'xcode',
            'github', 'gitbutler', 'fork', 'tower', 'sourcetree', 'gitkraken',
            'tableplus', 'sequel-ace', 'postico', 'beekeeper-studio',
            'dbngin', 'proxyman', 'charles', 'postman', 'insomnia', 'bruno', 'hoppscotch',
            'docker', 'orbstack', 'colima', 'vagrant',
            'cyberduck', 'transmit', 'filezilla', 'termius',
            'dbeaver-community', 'local', 'navicat-premium', 'dash',
        ],
        keywords: [
            'editor', 'terminal', 'git', 'database', 'db', 'sql', 'code', 'ide',
            'debug', 'api', 'docker', 'container', 'deploy', 'server', 'ftp',
            'sftp', 'ssh', 'develop', 'programming', 'compiler', 'debugger',
        ],
    },
    {
        id: 'browsers',
        label: 'Browsers',
        description: 'Fast, secure & modern browser options',
        icon: 'Globe',
        color: 'blue',
        tokens: [
            'google-chrome', 'firefox', 'arc', 'zen-browser', 'brave-browser', 'opera',
            'microsoft-edge', 'vivaldi', 'min', 'orion', 'tor-browser', 'waterfox',
            'librewolf', 'duckduckgo', 'epic-privacy-browser',
        ],
        keywords: ['browser', 'chrome', 'firefox', 'safari', 'web', 'internet', 'browsing'],
    },
    {
        id: 'design',
        label: 'Design & Creative',
        description: 'Photo editors, vector tools, 3D & prototyping',
        icon: 'Palette',
        color: 'pink',
        tokens: [
            'figma', 'sketch', 'affinity-designer', 'affinity-photo', 'affinity-publisher',
            'canva', 'pixelmator-pro', 'gimp', 'inkscape', 'blender', 'cinema-4d',
            'zeplin', 'whimsical', 'lunacy', 'vectorize',
            'iconjar', 'sip', 'colorsnapper2', 'contrast', 'origami-studio',
            'snagit', 'principle', 'proto-pie', 'penpot', 'arctype',
        ],
        keywords: [
            'design', 'photo', 'pixel', 'vector', 'color', 'icon', 'sketch', 'figma',
            'ui', 'ux', 'image', 'drawing', 'paint', '3d', 'graphic',
        ],
    },
    {
        id: 'media',
        label: 'Media & Entertainment',
        description: 'Video players, music streaming & recording tools',
        icon: 'Film',
        color: 'rose',
        tokens: [
            'vlc', 'iina', 'plex', 'emby', 'jellyfin', 'infuse', 'spotify', 'vox',
            'audirvana', 'swinsian', 'obs', 'screenflow', 'quicktime-player',
            'handbrake', 'ffmpeg', 'permute', 'mkvtoolnix', 'subler', 'movist',
            'downie', 'pulltube', 'gyroflow-toolbox', 'deezer',
            'cog', 'shuttle', 'elmedia-player', 'eqmac', 'losslesscut',
        ],
        keywords: [
            'video', 'audio', 'music', 'media', 'player', 'stream', 'record',
            'screen', 'cast', 'podcast', 'radio', 'movie', 'song', 'mp3', 'mp4',
            'entertainment', 'playback',
        ],
    },
    {
        id: 'utilities',
        label: 'Utilities & System',
        description: 'Launchers, window managers, clipboard & system tools',
        icon: 'Sliders',
        color: 'purple',
        tokens: [
            'alfred', 'raycast', 'popclip', 'bartender', 'hiddenbar', 'dozer',
            'istat-menus', 'stats', 'sensor', 'appcleaner', 'daisydisk', 'grandperspective',
            'onyx', 'cleanmymac', 'bettertouchtool',
            'magnet', 'rectangle', 'moom', 'contexts', 'mission-control-plus',
            'paste', 'pastebot', 'keyboard-maestro', 'karabiner-elements',
            'yoink', 'spring', 'hazel', 'typinator', 'textexpander', 'espanso',
            'macfuse', 'launchbar', 'localsend', 'balenaetcher',
            'keka', 'the-unarchiver', 'maccy', 'kap', 'lofi', 'shottr',
        ],
        keywords: [
            'utility', 'launcher', 'menu', 'bar', 'clipboard', 'keyboard', 'window',
            'manage', 'clean', 'optimize', 'backup', 'sync', 'unzip', 'compress',
            'file', 'search', 'helper', 'stat', 'cpu', 'system',
        ],
    },
    {
        id: 'communication',
        label: 'Communication',
        description: 'Chat, video calls & team collaboration',
        icon: 'MessageSquare',
        color: 'teal',
        tokens: [
            'slack', 'discord', 'zoom', 'microsoft-teams', 'telegram', 'signal',
            'whatsapp', 'loom', 'gather', 'around', 'tuple', 'screen',
            'krisp', 'cleanshot', 'viber', 'element', 'keybase', 'mattermost',
            'revolt', 'capcut', 'riverside',
        ],
        keywords: [
            'chat', 'message', 'call', 'video', 'meet', 'conference', 'voice',
            'social', 'talk', 'team', 'collaboration', 'messenger',
        ],
    },
    {
        id: 'security',
        label: 'Security & Privacy',
        description: 'Password managers, VPNs & malware protection',
        icon: 'Shield',
        color: 'amber',
        tokens: [
            '1password', 'bitwarden', 'dashlane', 'keeper-password-manager',
            'nordvpn', 'expressvpn', 'tunnelblick', 'openvpn-connect',
            'little-snitch', 'lulu', 'malwarebytes',
            'blockblock', 'oversight', 'gpg-suite', 'keybase',
            'mullvadvpn', 'protonvpn', 'keepassxc', 'yubico-yubikey-manager',
            'tailscale', 'wireguard',
        ],
        keywords: [
            'password', 'vpn', 'firewall', 'security', 'encrypt', 'privacy', 'auth',
            '2fa', 'anti-virus', 'malware', 'protect', 'key', 'credentials',
        ],
    },
    {
        id: 'ai-tools',
        label: 'AI & LLM Tools',
        description: 'LLM runners, AI assistants & image generation',
        icon: 'Bot',
        color: 'violet',
        tokens: [
            'ollama', 'lm-studio', 'gpt4all', 'msty', 'chatgpt', 'claude',
            'jan', 'open-interpreter', 'pinokio', 'stable-diffusion-webui',
            'diffusionbee', 'comfyui', 'draw-things',
        ],
        keywords: [
            'ai', 'llm', 'gpt', 'claude', 'diffusion', 'image generation',
            'chatbot', 'assistant', 'model', 'inference', 'machine learning',
        ],
    },
    {
        id: 'games',
        label: 'Games & Emulation',
        description: 'Game stores, emulators & gaming utilities',
        icon: 'Gamepad2',
        color: 'orange',
        tokens: [
            'steam', 'openemu', 'ryujinx', 'dolphin', 'heroic-games-launcher',
            'gog-galaxy', 'whisky', 'porting-kit', 'prism-launcher',
            'retroarch', 'ppsspp', 'pcsx2',
        ],
        keywords: [
            'game', 'emulator', 'gaming', 'steam', 'play', 'retro',
            'launcher', 'cheats', 'controller',
        ],
    },
    {
        id: 'fonts',
        label: 'Fonts',
        description: 'Nerd Fonts & developer typefaces',
        icon: 'Type',
        color: 'cyan',
        tokens: [
            'font-hack-nerd-font', 'font-fira-code-nerd-font', 'font-jetbrains-mono-nerd-font',
            'font-meslo-lg-nerd-font', 'font-cascadia-code', 'font-source-code-pro',
            'font-iosevka-nerd-font', 'font-ubuntu-mono-nerd-font', 'font-roboto',
            'font-inter', 'font-fira-sans', 'font-open-sans', 'font-lato',
        ],
        keywords: ['font-', 'typeface', 'nerd font'],
    },
];

// ─── Formula Categories ───────────────────────────────────────────────────────

export const FORMULA_CATEGORIES: Category[] = [
    {
        id: 'all',
        label: 'All',
        icon: 'Home',
        color: 'zinc',
        description: 'Browse the complete Homebrew formula catalog',
    },
    {
        id: 'languages',
        label: 'Languages & Runtimes',
        description: 'Compilers, interpreters, package managers & SDKs',
        icon: 'Code',
        color: 'cyan',
        tokens: [
            'python', 'python@3.12', 'python@3.11', 'node', 'ruby', 'rust', 'go',
            'deno', 'bun', 'openjdk', 'kotlin', 'swift', 'php', 'lua', 'r', 'erlang',
            'elixir', 'haskell-stack', 'ghc', 'ocaml', 'clojure', 'scala', 'groovy',
            'dotnet', 'mono', 'crystal', 'nim', 'zig', 'julia', 'perl', 'gcc', 'llvm',
            'mojo', 'gleam', 'roc',
        ],
        keywords: [
            'python', 'ruby', 'node', 'java', 'rust', 'golang', 'swift', 'perl',
            'scala', 'kotlin', 'compiler', 'runtime', 'interpreter', 'sdk',
            'language', 'lang',
        ],
    },
    {
        id: 'databases',
        label: 'Databases & Storage',
        description: 'SQL, NoSQL, caching & message queues',
        icon: 'Database',
        color: 'amber',
        tokens: [
            'postgresql', 'mysql', 'redis', 'mongodb-community', 'sqlite', 'mariadb',
            'cassandra', 'couchdb', 'influxdb', 'neo4j', 'elasticsearch', 'opensearch',
            'etcd', 'memcached', 'rocksdb', 'leveldb', 'clickhouse', 'timescaledb',
            'cockroachdb', 'surreal', 'planetscale',
        ],
        keywords: [
            'sql', 'postgres', 'mysql', 'redis', 'mongo', 'database', 'db',
            'cache', 'search', 'nosql', 'query', 'store', 'key-value', 'storage',
        ],
    },
    {
        id: 'devops',
        label: 'DevOps & Cloud',
        description: 'Containers, Kubernetes, IaC & cloud CLIs',
        icon: 'Rocket',
        color: 'rose',
        tokens: [
            'kubectl', 'helm', 'terraform', 'ansible', 'docker', 'podman', 'minikube',
            'kind', 'k9s', 'kustomize', 'flux', 'argocd', 'skaffold',
            'podman-compose', 'pulumi', 'aws-cli', 'awscli', 'azure-cli', 'google-cloud-sdk',
            'vagrant', 'packer', 'consul', 'nomad', 'opentofu', 'vault',
        ],
        keywords: [
            'kubectl', 'helm', 'terraform', 'docker', 'kube', 'cloud', 'aws',
            'azure', 'gcp', 'ci', 'cd', 'deploy', 'kubernetes', 'automation',
            'infrastructure', 'container', 'orchestration',
        ],
    },
    {
        id: 'git',
        label: 'Git & Version Control',
        description: 'Git CLIs, diff tools & collaboration helpers',
        icon: 'GitBranch',
        color: 'emerald',
        tokens: [
            'git', 'gh', 'git-lfs', 'git-flow', 'hub', 'lab', 'glab', 'tig',
            'lazygit', 'delta', 'difftastic', 'pre-commit', 'commitizen', 'mercurial',
            'git-delta', 'gitui', 'ghostty',
        ],
        keywords: ['git', 'svn', 'mercurial', 'version', 'vcs', 'commit', 'branch', 'github', 'repo'],
    },
    {
        id: 'cli-tools',
        label: 'CLI Tools & Utilities',
        description: 'Terminal shell enhancers, search & data processing',
        icon: 'Cpu',
        color: 'violet',
        tokens: [
            'ripgrep', 'fd', 'fzf', 'bat', 'eza', 'lsd', 'zoxide', 'tmux',
            'screen', 'htop', 'btop', 'glances', 'ncdu', 'dust', 'duf', 'hyperfine',
            'tokei', 'jq', 'yq', 'dasel', 'gron', 'fx', 'httpie', 'curlie', 'xh',
            'wget', 'curl', 'aria2', 'navi', 'cheat', 'tldr', 'tealdeer', 'atuin',
            'zellij', 'tree', 'neofetch', 'ranger', 'mc', 'fish', 'zsh', 'starship',
            'broot', 'procs', 'bottom', 'zellij', 'mise',
        ],
        keywords: [
            'grep', 'find', 'ls', 'cat', 'top', 'json', 'yaml', 'http', 'cli',
            'tool', 'search', 'shell', 'terminal', 'utility', 'modern replacement',
            'fuzzy', 'prompt',
        ],
    },
    {
        id: 'networking',
        label: 'Networking',
        description: 'Network diagnostics, DNS tools & proxies',
        icon: 'Network',
        color: 'sky',
        tokens: [
            'nmap', 'wireshark', 'mtr', 'traceroute', 'dig', 'bind', 'dnscrypt-proxy',
            'cloudflared', 'caddy', 'nginx', 'traefik', 'haproxy', 'socat', 'netcat',
            'openvpn', 'wireguard-tools', 'tcpdump', 'iperf3', 'dnsmasq', 'shadowsocks-libev',
            'dive', 'mitmproxy',
        ],
        keywords: [
            'net', 'network', 'dns', 'http', 'proxy', 'vpn', 'firewall', 'port',
            'scan', 'traffic', 'server', 'routing', 'gateway',
        ],
    },
    {
        id: 'monitoring',
        label: 'Monitoring & Observability',
        description: 'Metrics, logs, tracing & alerting stacks',
        icon: 'Gauge',
        color: 'lime',
        tokens: [
            'prometheus', 'grafana', 'jaeger', 'loki', 'vector',
            'telegraf', 'graphite', 'node_exporter', 'otel',
        ],
        keywords: [
            'monitor', 'metrics', 'logs', 'tracing', 'alert',
            'observability', 'dashboard', 'prometheus', 'grafana',
        ],
    },
    {
        id: 'build-tools',
        label: 'Build Tools & Package Managers',
        description: 'Compilers, bundlers, dependency & build systems',
        icon: 'Hammer',
        color: 'slate',
        tokens: [
            'cmake', 'ninja', 'make', 'bazel', 'meson', 'gradle', 'maven',
            'ant', 'sbt', 'leiningen', 'mix', 'cargo', 'pip', 'poetry', 'pdm', 'uv',
            'yarn', 'pnpm', 'bun', 'autoconf', 'automake', 'libtool', 'pkg-config',
            'npm', 'conan', 'vcpkg',
        ],
        keywords: [
            'build', 'make', 'compile', 'bundle', 'package', 'dep', 'npm', 'pip',
            'gem', 'cargo', 'dependency', 'installer', 'formatter', 'linter',
            'toolchain',
        ],
    },
];

// ─── Lookup Index Builder (O(1) category resolution) ──────────────────────────

/**
 * Build a Map from token → category id for O(1) lookups.
 * Consumer calls this once when data loads, then uses `index.get(token)`.
 *
 * Also handles keyword-based fallback for tokens not in the exact-match set.
 */
export function buildCategoryIndex(
    items: { token: string; name: string; desc?: string }[],
    categories: Category[],
): Map<string, string> {
    const index = new Map<string, string>();

    for (const item of items) {
        const lowerToken = item.token.toLowerCase();

        // Check if already computed (e.g. from a previous shared call)
        if (index.has(lowerToken)) continue;

        // First pass: exact token match
        for (const cat of categories) {
            if (cat.id === 'all') continue;
            if (cat.tokens?.some(t => t.toLowerCase() === lowerToken)) {
                index.set(lowerToken, cat.id);
                break;
            }
        }
        if (index.has(lowerToken)) continue;

        // Second pass: keyword substring match
        const lowerName = item.name.toLowerCase();
        const lowerDesc = (item.desc || '').toLowerCase();
        for (const cat of categories) {
            if (cat.id === 'all') continue;
            if (cat.keywords?.some(kw => {
                const lowerKw = kw.toLowerCase();
                return lowerToken.includes(lowerKw) || lowerName.includes(lowerKw) || lowerDesc.includes(lowerKw);
            })) {
                index.set(lowerToken, cat.id);
                break;
            }
        }

        // Fallback
        if (!index.has(lowerToken)) {
            index.set(lowerToken, 'all');
        }
    }

    return index;
}

/**
 * Legacy convenience wrapper — kept for components that resolve one item at a time.
 * Prefer `buildCategoryIndex()` + `index.get(token)` for bulk lookups.
 */
export function getCategoryForToken(
    item: { token: string; name: string; desc?: string },
    categories: Category[],
): string {
    const lowerToken = item.token.toLowerCase();
    const lowerName = item.name.toLowerCase();
    const lowerDesc = (item.desc || '').toLowerCase();

    for (const cat of categories) {
        if (cat.id === 'all') continue;
        if (cat.tokens?.some(t => t.toLowerCase() === lowerToken)) return cat.id;
    }

    for (const cat of categories) {
        if (cat.id === 'all') continue;
        if (cat.keywords?.some(kw => {
            const lowerKw = kw.toLowerCase();
            return lowerToken.includes(lowerKw) || lowerName.includes(lowerKw) || lowerDesc.includes(lowerKw);
        })) return cat.id;
    }

    return 'all';
}

// ─── Style Utility ────────────────────────────────────────────────────────────

/**
 * Color family → Tailwind CSS class map for light + dark UI.
 * Instead of duplicating per-category style objects across 3 files,
 * consumers call this once and destructure what they need.
 */
export interface CategoryStyleClasses {
    surface: string;
    hoverSurface: string;
    border: string;
    hoverBorder: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeColor: string;
    /** Hover state for clickable category badges */
    hoverBg: string;
    /** For FeaturedBanner border-with-background chip */
    bannerBg: string;
    bannerBorder: string;
    text: string;
}

const COLOR_TO_STYLE: Record<string, CategoryStyleClasses> = {
    zinc: {
        surface: 'bg-zinc-100 dark:bg-zinc-500/12',
        hoverSurface: 'group-hover:bg-zinc-200 dark:group-hover:bg-zinc-500/20',
        border: 'border-zinc-200/60 dark:border-zinc-500/20',
        hoverBorder: 'hover:border-zinc-300/70 dark:hover:border-zinc-400/40',
        iconBg: 'bg-zinc-100 dark:bg-zinc-500/20',
        iconColor: 'text-zinc-600 dark:text-zinc-400',
        badgeBg: 'bg-zinc-100 dark:bg-zinc-400/15',
        badgeColor: 'text-zinc-700 dark:text-zinc-300',
        hoverBg: 'hover:bg-zinc-200 dark:hover:bg-zinc-400/25',
        bannerBg: 'bg-zinc-500/10',
        bannerBorder: 'border-zinc-500/20',
        text: 'text-zinc-600 dark:text-zinc-400',
    },
    emerald: {
        surface: 'bg-emerald-100 dark:bg-emerald-500/12',
        hoverSurface: 'group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20',
        border: 'border-emerald-200/60 dark:border-emerald-500/20',
        hoverBorder: 'hover:border-emerald-300/70 dark:hover:border-emerald-400/40',
        iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-400/15',
        badgeColor: 'text-emerald-700 dark:text-emerald-300',
        hoverBg: 'hover:bg-emerald-200 dark:hover:bg-emerald-400/25',
        bannerBg: 'bg-emerald-500/10',
        bannerBorder: 'border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
    },
    indigo: {
        surface: 'bg-indigo-100 dark:bg-indigo-500/12',
        hoverSurface: 'group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/20',
        border: 'border-indigo-200/60 dark:border-indigo-500/20',
        hoverBorder: 'hover:border-indigo-300/70 dark:hover:border-indigo-400/40',
        iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        badgeBg: 'bg-indigo-100 dark:bg-indigo-400/15',
        badgeColor: 'text-indigo-700 dark:text-indigo-300',
        hoverBg: 'hover:bg-indigo-200 dark:hover:bg-indigo-400/25',
        bannerBg: 'bg-indigo-500/10',
        bannerBorder: 'border-indigo-500/20',
        text: 'text-indigo-600 dark:text-indigo-400',
    },
    blue: {
        surface: 'bg-blue-100 dark:bg-blue-500/12',
        hoverSurface: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20',
        border: 'border-blue-200/60 dark:border-blue-500/20',
        hoverBorder: 'hover:border-blue-300/70 dark:hover:border-blue-400/40',
        iconBg: 'bg-blue-100 dark:bg-blue-500/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-100 dark:bg-blue-400/15',
        badgeColor: 'text-blue-700 dark:text-blue-300',
        hoverBg: 'hover:bg-blue-200 dark:hover:bg-blue-400/25',
        bannerBg: 'bg-blue-500/10',
        bannerBorder: 'border-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
    },
    pink: {
        surface: 'bg-pink-100 dark:bg-pink-500/12',
        hoverSurface: 'group-hover:bg-pink-200 dark:group-hover:bg-pink-500/20',
        border: 'border-pink-200/60 dark:border-pink-500/20',
        hoverBorder: 'hover:border-pink-300/70 dark:hover:border-pink-400/40',
        iconBg: 'bg-pink-100 dark:bg-pink-500/20',
        iconColor: 'text-pink-600 dark:text-pink-400',
        badgeBg: 'bg-pink-100 dark:bg-pink-400/15',
        badgeColor: 'text-pink-700 dark:text-pink-300',
        hoverBg: 'hover:bg-pink-200 dark:hover:bg-pink-400/25',
        bannerBg: 'bg-pink-500/10',
        bannerBorder: 'border-pink-500/20',
        text: 'text-pink-600 dark:text-pink-400',
    },
    rose: {
        surface: 'bg-rose-100 dark:bg-rose-500/12',
        hoverSurface: 'group-hover:bg-rose-200 dark:group-hover:bg-rose-500/20',
        border: 'border-rose-200/60 dark:border-rose-500/20',
        hoverBorder: 'hover:border-rose-300/70 dark:hover:border-rose-400/40',
        iconBg: 'bg-rose-100 dark:bg-rose-500/20',
        iconColor: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-100 dark:bg-rose-400/15',
        badgeColor: 'text-rose-700 dark:text-rose-300',
        hoverBg: 'hover:bg-rose-200 dark:hover:bg-rose-400/25',
        bannerBg: 'bg-rose-500/10',
        bannerBorder: 'border-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
    },
    purple: {
        surface: 'bg-purple-100 dark:bg-purple-500/12',
        hoverSurface: 'group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20',
        border: 'border-purple-200/60 dark:border-purple-500/20',
        hoverBorder: 'hover:border-purple-300/70 dark:hover:border-purple-400/40',
        iconBg: 'bg-purple-100 dark:bg-purple-500/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
        badgeBg: 'bg-purple-100 dark:bg-purple-400/15',
        badgeColor: 'text-purple-700 dark:text-purple-300',
        hoverBg: 'hover:bg-purple-200 dark:hover:bg-purple-400/25',
        bannerBg: 'bg-purple-500/10',
        bannerBorder: 'border-purple-500/20',
        text: 'text-purple-600 dark:text-purple-400',
    },
    teal: {
        surface: 'bg-teal-100 dark:bg-teal-500/12',
        hoverSurface: 'group-hover:bg-teal-200 dark:group-hover:bg-teal-500/20',
        border: 'border-teal-200/60 dark:border-teal-500/20',
        hoverBorder: 'hover:border-teal-300/70 dark:hover:border-teal-400/40',
        iconBg: 'bg-teal-100 dark:bg-teal-500/20',
        iconColor: 'text-teal-600 dark:text-teal-400',
        badgeBg: 'bg-teal-100 dark:bg-teal-400/15',
        badgeColor: 'text-teal-700 dark:text-teal-300',
        hoverBg: 'hover:bg-teal-200 dark:hover:bg-teal-400/25',
        bannerBg: 'bg-teal-500/10',
        bannerBorder: 'border-teal-500/20',
        text: 'text-teal-600 dark:text-teal-400',
    },
    amber: {
        surface: 'bg-amber-100 dark:bg-amber-500/12',
        hoverSurface: 'group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20',
        border: 'border-amber-200/60 dark:border-amber-500/20',
        hoverBorder: 'hover:border-amber-300/70 dark:hover:border-amber-400/40',
        iconBg: 'bg-amber-100 dark:bg-amber-500/20',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-100 dark:bg-amber-400/15',
        badgeColor: 'text-amber-700 dark:text-amber-300',
        hoverBg: 'hover:bg-amber-200 dark:hover:bg-amber-400/25',
        bannerBg: 'bg-amber-500/10',
        bannerBorder: 'border-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
    },
    violet: {
        surface: 'bg-violet-100 dark:bg-violet-500/12',
        hoverSurface: 'group-hover:bg-violet-200 dark:group-hover:bg-violet-500/20',
        border: 'border-violet-200/60 dark:border-violet-500/20',
        hoverBorder: 'hover:border-violet-300/70 dark:hover:border-violet-400/40',
        iconBg: 'bg-violet-100 dark:bg-violet-500/20',
        iconColor: 'text-violet-600 dark:text-violet-400',
        badgeBg: 'bg-violet-100 dark:bg-violet-400/15',
        badgeColor: 'text-violet-700 dark:text-violet-300',
        hoverBg: 'hover:bg-violet-200 dark:hover:bg-violet-400/25',
        bannerBg: 'bg-violet-500/10',
        bannerBorder: 'border-violet-500/20',
        text: 'text-violet-600 dark:text-violet-400',
    },
    cyan: {
        surface: 'bg-cyan-100 dark:bg-cyan-500/12',
        hoverSurface: 'group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/20',
        border: 'border-cyan-200/60 dark:border-cyan-500/20',
        hoverBorder: 'hover:border-cyan-300/70 dark:hover:border-cyan-400/40',
        iconBg: 'bg-cyan-100 dark:bg-cyan-500/20',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        badgeBg: 'bg-cyan-100 dark:bg-cyan-400/15',
        badgeColor: 'text-cyan-700 dark:text-cyan-300',
        hoverBg: 'hover:bg-cyan-200 dark:hover:bg-cyan-400/25',
        bannerBg: 'bg-cyan-500/10',
        bannerBorder: 'border-cyan-500/20',
        text: 'text-cyan-600 dark:text-cyan-400',
    },
    orange: {
        surface: 'bg-orange-100 dark:bg-orange-500/12',
        hoverSurface: 'group-hover:bg-orange-200 dark:group-hover:bg-orange-500/20',
        border: 'border-orange-200/60 dark:border-orange-500/20',
        hoverBorder: 'hover:border-orange-300/70 dark:hover:border-orange-400/40',
        iconBg: 'bg-orange-100 dark:bg-orange-500/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
        badgeBg: 'bg-orange-100 dark:bg-orange-400/15',
        badgeColor: 'text-orange-700 dark:text-orange-300',
        hoverBg: 'hover:bg-orange-200 dark:hover:bg-orange-400/25',
        bannerBg: 'bg-orange-500/10',
        bannerBorder: 'border-orange-500/20',
        text: 'text-orange-600 dark:text-orange-400',
    },
    sky: {
        surface: 'bg-sky-100 dark:bg-sky-500/12',
        hoverSurface: 'group-hover:bg-sky-200 dark:group-hover:bg-sky-500/20',
        border: 'border-sky-200/60 dark:border-sky-500/20',
        hoverBorder: 'hover:border-sky-300/70 dark:hover:border-sky-400/40',
        iconBg: 'bg-sky-100 dark:bg-sky-500/20',
        iconColor: 'text-sky-600 dark:text-sky-400',
        badgeBg: 'bg-sky-100 dark:bg-sky-400/15',
        badgeColor: 'text-sky-700 dark:text-sky-300',
        hoverBg: 'hover:bg-sky-200 dark:hover:bg-sky-400/25',
        bannerBg: 'bg-sky-500/10',
        bannerBorder: 'border-sky-500/20',
        text: 'text-sky-600 dark:text-sky-400',
    },
    lime: {
        surface: 'bg-lime-100 dark:bg-lime-500/12',
        hoverSurface: 'group-hover:bg-lime-200 dark:group-hover:bg-lime-500/20',
        border: 'border-lime-200/60 dark:border-lime-500/20',
        hoverBorder: 'hover:border-lime-300/70 dark:hover:border-lime-400/40',
        iconBg: 'bg-lime-100 dark:bg-lime-500/20',
        iconColor: 'text-lime-600 dark:text-lime-400',
        badgeBg: 'bg-lime-100 dark:bg-lime-400/15',
        badgeColor: 'text-lime-700 dark:text-lime-300',
        hoverBg: 'hover:bg-lime-200 dark:hover:bg-lime-400/25',
        bannerBg: 'bg-lime-500/10',
        bannerBorder: 'border-lime-500/20',
        text: 'text-lime-600 dark:text-lime-400',
    },
    slate: {
        surface: 'bg-slate-100 dark:bg-slate-500/12',
        hoverSurface: 'group-hover:bg-slate-200 dark:group-hover:bg-slate-500/20',
        border: 'border-slate-200/60 dark:border-slate-500/20',
        hoverBorder: 'hover:border-slate-300/70 dark:hover:border-slate-400/40',
        iconBg: 'bg-slate-100 dark:bg-slate-500/20',
        iconColor: 'text-slate-600 dark:text-slate-400',
        badgeBg: 'bg-slate-100 dark:bg-slate-400/15',
        badgeColor: 'text-slate-700 dark:text-slate-300',
        hoverBg: 'hover:bg-slate-200 dark:hover:bg-slate-400/25',
        bannerBg: 'bg-slate-500/10',
        bannerBorder: 'border-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
    },
};

/**
 * Get the complete set of Tailwind style classes for a category color.
 * Defaults to zinc if the color isn't found.
 */
export function getCategoryStyle(color: string): CategoryStyleClasses {
    return COLOR_TO_STYLE[color] || COLOR_TO_STYLE.zinc;
}

/**
 * Map of icon name strings → lucide-react component import names.
 * Consumers can use this to dynamically resolve icons without
 * maintaining their own per-category switch/record.
 */
export const CATEGORY_ICON_MAP: Record<string, string> = {
    Home: 'Home',
    Zap: 'Zap',
    Terminal: 'Terminal',
    Globe: 'Globe',
    Palette: 'Palette',
    Film: 'Film',
    Sliders: 'Sliders',
    MessageSquare: 'MessageSquare',
    Shield: 'Shield',
    Type: 'Type',
    Bot: 'Bot',
    Gamepad2: 'Gamepad2',
    Code: 'Code',
    Database: 'Database',
    Rocket: 'Rocket',
    GitBranch: 'GitBranch',
    Cpu: 'Cpu',
    Network: 'Network',
    Hammer: 'Hammer',
    Gauge: 'Gauge',
};