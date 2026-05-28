/**
 * @file categories.ts
 * Curated category definitions, dynamic featured app pool, and editors picks generator
 * for the Discover page and Browse catalogs. Emoji-free visual registry.
 */

export interface Category {
    id: string;
    label: string;
    /** Exact token matches — highest priority */
    tokens?: string[];
    /** If true, match any token/name/desc that CONTAINS one of the keywords */
    keywords?: string[];
    /** Applies only to casks, formulae, or both */
    types?: ('cask' | 'formula')[];
}

export const CASK_CATEGORIES: Category[] = [
    {
        id: 'all',
        label: 'All',
    },
    {
        id: 'productivity',
        label: 'Productivity',
        tokens: [
            'notion', 'obsidian', 'logseq', 'craft', 'bear', 'todoist', 'things',
            'omnifocus', 'fantastical', 'calendar', 'linear', 'clickup', 'asana',
            'monday', 'trello', 'airtable', 'cron', 'superhuman', 'mimestream',
            'spark', 'airmail', 'mailmate', 'evernote', 'roam-research', 'basecamp',
            'minder', 'focus', 'agenda'
        ],
        keywords: [
            'todo', 'note', 'calendar', 'mail', 'office', 'word', 'excel', 'sheet',
            'agenda', 'task', 'project', 'organize', 'productivity', 'email', 'reminder'
        ],
    },
    {
        id: 'dev-tools',
        label: 'Dev Tools',
        tokens: [
            'iterm2', 'warp', 'visual-studio-code', 'zed', 'cursor', 'nova',
            'sublime-text', 'textmate', 'jetbrains-toolbox', 'intellij-idea',
            'webstorm', 'pycharm', 'datagrip', 'rubymine', 'phpstorm', 'goland',
            'rider', 'clion', 'github', 'fork', 'tower', 'sourcetree', 'gitkraken',
            'tableplus', 'sequel-pro', 'sequel-ace', 'postico', 'beekeeper-studio',
            'dbngin', 'proxyman', 'charles', 'postman', 'insomnia', 'paw', 'rapidapi',
            'docker', 'orbstack', 'virtualbox', 'vmware-fusion', 'parallels',
            'vagrant', 'cyberduck', 'transmit', 'filezilla', 'ssh', 'termius',
            'dbeaver-community', 'local', 'navicat-premium', 'sourcetree', 'keka'
        ],
        keywords: [
            'editor', 'terminal', 'git', 'database', 'db', 'sql', 'code', 'ide',
            'debug', 'api', 'docker', 'container', 'deploy', 'server', 'ftp',
            'sftp', 'ssh', 'develop', 'programming', 'compiler', 'visual studio', 'debugger'
        ],
    },
    {
        id: 'browsers',
        label: 'Browsers',
        tokens: [
            'google-chrome', 'firefox', 'arc', 'safari', 'brave-browser', 'opera',
            'microsoft-edge', 'vivaldi', 'min', 'orion', 'tor-browser', 'waterfox',
            'librewolf', 'duckduckgo', 'epic-privacy-browser', 'yandex'
        ],
        keywords: ['browser', 'chrome', 'firefox', 'safari', 'web', 'internet', 'browsing'],
    },
    {
        id: 'design',
        label: 'Design',
        tokens: [
            'figma', 'sketch', 'affinity-designer', 'affinity-photo', 'affinity-publisher',
            'canva', 'pixelmator-pro', 'gimp', 'inkscape', 'blender', 'cinema-4d',
            'adobe-creative-cloud', 'zeplin', 'whimsical', 'lunacy', 'vectorize',
            'iconjar', 'sip', 'colorsnapper2', 'contrast', 'mark-text', 'origami-studio',
            'snagit', 'principle', 'proto-pie'
        ],
        keywords: [
            'design', 'photo', 'pixel', 'vector', 'color', 'icon', 'sketch', 'figma',
            'ui', 'ux', 'image', 'drawing', 'paint', '3d', 'graphic', 'photoshop', 'illustrator'
        ],
    },
    {
        id: 'media',
        label: 'Media',
        tokens: [
            'vlc', 'iina', 'plex', 'emby', 'jellyfin', 'infuse', 'spotify', 'vox',
            'capo', 'audirvana', 'swinsian', 'obs', 'screenflow', 'quicktime-player',
            'handbrake', 'ffmpeg', 'permute', 'mkvtoolnix', 'subler', 'movist',
            'downie', 'pulltube', 'frenzic-overtime', 'gyroflow-toolbox', 'deezer',
            'cog', 'shuttle', 'sound-clef'
        ],
        keywords: [
            'video', 'audio', 'music', 'media', 'player', 'stream', 'record',
            'screen', 'cast', 'podcast', 'radio', 'movie', 'song', 'mp3', 'mp4'
        ],
    },
    {
        id: 'utilities',
        label: 'Utilities',
        tokens: [
            'alfred', 'raycast', 'popclip', 'bartender', 'istatmenus', 'cleanmymac',
            'onyx', 'appcleaner', 'daisydisk', 'grandperspective', 'bettertouchtool',
            'magnet', 'rectangle', 'moom', 'contexts', 'mission-control-plus', 'paste',
            'pastebot', 'keyboard-maestro', 'karabiner-elements', 'yoink', 'spring',
            'hazel', 'typinator', 'textexpander', 'espanso', 'dash', 'devdocs-for-macos',
            'macfuse', 'launchbar', 'dozer', 'hiddenbar', 'stats', 'sensor'
        ],
        keywords: [
            'utility', 'launcher', 'menu', 'bar', 'clipboard', 'keyboard', 'window',
            'manage', 'clean', 'optimize', 'backup', 'sync', 'unzip', 'compress',
            'file', 'search', 'helper', 'stat', 'cpu'
        ],
    },
    {
        id: 'communication',
        label: 'Communication',
        tokens: [
            'slack', 'discord', 'zoom', 'microsoft-teams', 'telegram', 'signal',
            'whatsapp', 'skype', 'loom', 'gather', 'around', 'tuple', 'screen',
            'krisp', 'cleanshot', 'viber', 'wechat', 'element', 'keybase'
        ],
        keywords: [
            'chat', 'message', 'call', 'video', 'meet', 'conference', 'voice',
            'social', 'talk', 'team', 'collaboration', 'slack', 'messenger'
        ],
    },
    {
        id: 'security',
        label: 'Security',
        tokens: [
            '1password', 'bitwarden', 'dashlane', 'lastpass', 'nordvpn', 'expressvpn',
            'tunnelblick', 'openvpn-connect', 'little-snitch', 'lulu', 'malwarebytes',
            'blockblock', 'oversight', 'kextviewr', 'gpg-suite', 'keybase', 'mullvad-vpn',
            'protonvpn', 'keepassxc', 'yubico-yubikey-manager'
        ],
        keywords: [
            'password', 'vpn', 'firewall', 'security', 'encrypt', 'privacy', 'auth',
            '2fa', 'anti-virus', 'malware', 'protect', 'key', 'credentials'
        ],
    },
    {
        id: 'fonts',
        label: 'Fonts',
        keywords: ['font-'],
        tokens: [],
    },
];

export const FORMULA_CATEGORIES: Category[] = [
    {
        id: 'all',
        label: 'All',
    },
    {
        id: 'languages',
        label: 'Languages',
        tokens: [
            'python', 'python@3.12', 'python@3.11', 'node', 'ruby', 'rust', 'go',
            'deno', 'bun', 'openjdk', 'kotlin', 'swift', 'php', 'lua', 'r', 'erlang',
            'elixir', 'haskell-stack', 'ghc', 'ocaml', 'clojure', 'scala', 'groovy',
            'dotnet', 'mono', 'crystal', 'nim', 'zig', 'julia', 'perl', 'gcc', 'llvm'
        ],
        keywords: [
            'python', 'ruby', 'node', 'java', 'rust', 'golang', 'swift', 'perl',
            'scala', 'kotlin', 'compiler', 'runtime', 'interpreter', 'sdk', 'interpreter'
        ],
    },
    {
        id: 'databases',
        label: 'Databases',
        tokens: [
            'postgresql', 'mysql', 'redis', 'mongodb-community', 'sqlite', 'mariadb',
            'cassandra', 'couchdb', 'influxdb', 'neo4j', 'elasticsearch', 'opensearch',
            'etcd', 'memcached', 'rocksdb', 'leveldb'
        ],
        keywords: [
            'sql', 'postgres', 'mysql', 'redis', 'mongo', 'database', 'db',
            'cache', 'search', 'nosql', 'query', 'store', 'key-value'
        ],
    },
    {
        id: 'devops',
        label: 'DevOps',
        tokens: [
            'kubectl', 'helm', 'terraform', 'ansible', 'docker', 'podman', 'minikube',
            'kind', 'k9s', 'kustomize', 'flux', 'argocd', 'skaffold', 'pack', 'buildah',
            'podman-compose', 'pulumi', 'aws-cli', 'awscli', 'azure-cli', 'google-cloud-sdk',
            'vagrant', 'packer', 'consul', 'nomad'
        ],
        keywords: [
            'kubectl', 'helm', 'terraform', 'docker', 'kube', 'cloud', 'aws',
            'azure', 'gcp', 'ci', 'cd', 'deploy', 'kubernetes', 'automation', 'infrastructure'
        ],
    },
    {
        id: 'git',
        label: 'Git & VCS',
        tokens: [
            'git', 'gh', 'git-lfs', 'git-flow', 'hub', 'lab', 'glab', 'tig',
            'lazygit', 'delta', 'difftastic', 'pre-commit', 'commitizen', 'mercurial'
        ],
        keywords: ['git', 'svn', 'mercurial', 'version', 'vcs', 'commit', 'branch', 'github', 'repo'],
    },
    {
        id: 'cli-tools',
        label: 'CLI Tools',
        tokens: [
            'ripgrep', 'fd', 'fzf', 'bat', 'exa', 'eza', 'lsd', 'zoxide', 'tmux',
            'screen', 'htop', 'btop', 'glances', 'ncdu', 'dust', 'duf', 'hyperfine',
            'tokei', 'jq', 'yq', 'dasel', 'gron', 'fx', 'httpie', 'curlie', 'xh',
            'wget', 'curl', 'aria2', 'navi', 'cheat', 'tldr', 'tealdeer', 'atuin',
            'zellij', 'tree', 'wget', 'neofetch', 'ranger', 'mc', 'fish', 'zsh'
        ],
        keywords: [
            'grep', 'find', 'ls', 'cat', 'top', 'json', 'yaml', 'http', 'cli',
            'tool', 'search', 'shell', 'terminal', 'utility', 'modern replacement'
        ],
    },
    {
        id: 'networking',
        label: 'Networking',
        tokens: [
            'nmap', 'wireshark', 'mtr', 'traceroute', 'dig', 'bind', 'dnscrypt-proxy',
            'cloudflared', 'caddy', 'nginx', 'traefik', 'haproxy', 'socat', 'netcat',
            'openvpn', 'wireguard-tools', 'tcpdump', 'iperf3', 'dnsmasq', 'shadowsocks-libev'
        ],
        keywords: [
            'net', 'network', 'dns', 'http', 'proxy', 'vpn', 'firewall', 'port',
            'scan', 'traffic', 'server', 'routing', 'gateway'
        ],
    },
    {
        id: 'build-tools',
        label: 'Build Tools',
        tokens: [
            'cmake', 'ninja', 'make', 'bazel', 'buck', 'meson', 'gradle', 'maven',
            'ant', 'sbt', 'leiningen', 'mix', 'cargo', 'pip', 'poetry', 'pdm', 'uv',
            'yarn', 'pnpm', 'bun', 'autoconf', 'automake', 'libtool', 'pkg-config'
        ],
        keywords: [
            'build', 'make', 'compile', 'bundle', 'package', 'dep', 'npm', 'pip',
            'gem', 'cargo', 'dependency', 'installer', 'formatter', 'linter'
        ],
    },
];

/**
 * Given a package (token, name, desc) and a list of categories, return the best matching category id.
 * Falls back to 'all' (uncategorized).
 */
export function getCategoryForToken(item: { token: string; name: string; desc?: string }, categories: Category[]): string {
    const lowerToken = item.token.toLowerCase();
    const lowerName = item.name.toLowerCase();
    const lowerDesc = (item.desc || '').toLowerCase();

    // First pass: exact token matches
    for (const cat of categories) {
        if (cat.id === 'all') continue;
        if (cat.tokens?.some(t => t.toLowerCase() === lowerToken)) return cat.id;
    }

    // Second pass: keyword matching on token, name, or description
    for (const cat of categories) {
        if (cat.id === 'all') continue;
        if (cat.keywords?.some(kw => {
            const lowerKw = kw.toLowerCase();
            return lowerToken.includes(lowerKw) || lowerName.includes(lowerKw) || lowerDesc.includes(lowerKw);
        })) return cat.id;
    }

    return 'all';
}

// ─── Curated Pools for Curated Carousel Shuffling & Editor's Picks ────────────

/** Large pool of cask candidates for dynamic Featured Casks Carousel (token only) */
const FEATURED_POOL = [
    // Browsers & Web
    'arc', 'firefox', 'google-chrome', 'brave-browser', 'opera', 'vivaldi', 'tor-browser',
    // Dev Tools & Editors
    'visual-studio-code', 'zed', 'warp', 'iterm2', 'cursor', 'nova', 'jetbrains-toolbox',
    'github', 'gitbutler', 'fork', 'sourcetree', 'tableplus', 'sequel-pro', 'postico',
    'insomnia', 'postman', 'proxyman', 'paw',
    // Productivity & Notes
    'raycast', 'alfred', 'notion', 'obsidian', 'logseq', 'craft', 'bear', 'ulysses',
    'fantastical', 'todoist', 'linear-linear', 'cron',
    // Design & Creative
    'figma', 'sketch', 'canva', 'gimp', 'inkscape', 'blender', 'pixelmator-pro',
    'cleanshot', 'affinity-designer', 'affinity-photo',
    // Communication
    'slack', 'discord', 'telegram', 'signal', 'whatsapp', 'zoom', 'microsoft-teams',
    // Media & Entertainment
    'spotify', 'iina', 'vlc', 'obs', 'handbrake', 'plex', 'elmedia-player',
    // System & Utilities
    'docker', 'orbstack', '1password', 'bitwarden', 'rectangle', 'bettertouchtool',
    'appcleaner', 'cleanmymac', 'daisydisk', 'istat-menus', 'bartender', 'hazeover'
];

/** Big candidate pool of cask tokens to populate Editor's Picks */
const EDITORS_PICKS_POOL = [
    // Top-tier dev picks
    'visual-studio-code', 'zed', 'warp', 'iterm2', 'cursor', 'nova',
    'jetbrains-toolbox', 'github', 'gitbutler', 'fork', 'sourcetree',
    'tableplus', 'postico', 'sequel-pro', 'insomnia', 'postman', 'proxyman', 'paw',
    'docker', 'orbstack', 'dash',
    // Productivity powerhouses
    'raycast', 'alfred', 'notion', 'obsidian', 'logseq', 'craft', 'bear', 'ulysses',
    'fantastical', 'todoist', 'linear-linear', 'cron', 'bettertouchtool', 'rectangle',
    // Design & creative
    'figma', 'sketch', 'canva', 'gimp', 'inkscape', 'blender',
    'cleanshot', 'pixelmator-pro', 'affinity-designer', 'affinity-photo',
    // Communication & collab
    'slack', 'discord', 'telegram', 'signal', 'whatsapp', 'zoom', 'microsoft-teams', 'skype',
    // Media
    'spotify', 'iina', 'vlc', 'obs', 'handbrake', 'plex', 'elmedia-player',
    // Security & privacy
    '1password', 'bitwarden', 'nordvpn', 'mullvadvpn', 'tunnelblick', 'little-snitch',
    // System & cleanup
    'appcleaner', 'cleanmymac', 'daisydisk', 'istat-menus', 'bartender', 'hazeover',
    // Browsers
    'arc', 'firefox', 'brave-browser', 'opera', 'vivaldi'
];

/** Simple, robust array shuffle helper */
function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Dynamically generate featured slides (5 tokens) and editor's picks tokens (10 tokens) on load.
export const FEATURED_CASKS = shuffle(FEATURED_POOL).slice(0, 5);
export const EDITORS_PICKS_TOKENS = shuffle(EDITORS_PICKS_POOL).slice(0, 10);
