/**
 * @file categories.ts
 * Curated category definitions for the Discover page.
 * Each category has a list of known tokens and keyword patterns
 * for automatic classification of Homebrew packages.
 */

export interface Category {
    id: string;
    label: string;
    emoji: string;
    /** Exact token matches — highest priority */
    tokens?: string[];
    /** If true, match any token that CONTAINS one of the keywords */
    keywords?: string[];
    /** Applies only to casks, formulae, or both */
    types?: ('cask' | 'formula')[];
}

export const CASK_CATEGORIES: Category[] = [
    {
        id: 'all',
        label: 'All',
        emoji: '🏠',
    },
    {
        id: 'productivity',
        label: 'Productivity',
        emoji: '⚡',
        tokens: ['notion', 'obsidian', 'logseq', 'craft', 'bear', 'todoist', 'things', 'omnifocus', 'fantastical', 'calendar', 'linear', 'clickup', 'asana', 'monday', 'trello', 'airtable', 'cron', 'superhuman', 'mimestream', 'spark', 'airmail', 'mailmate'],
        keywords: ['todo', 'note', 'calendar', 'mail', 'office', 'word', 'excel', 'sheet', 'agenda', 'task'],
    },
    {
        id: 'dev-tools',
        label: 'Dev Tools',
        emoji: '🛠',
        tokens: ['iterm2', 'warp', 'visual-studio-code', 'zed', 'cursor', 'nova', 'sublime-text', 'textmate', 'jetbrains-toolbox', 'intellij-idea', 'webstorm', 'pycharm', 'datagrip', 'rubymine', 'phpstorm', 'goland', 'rider', 'clion', 'github', 'fork', 'tower', 'sourcetree', 'gitkraken', 'tableplus', 'sequel-pro', 'postico', 'beekeeper-studio', 'dbngin', 'proxyman', 'charles', 'postman', 'insomnia', 'paw', 'rapidapi', 'docker', 'orbstack', 'virtualbox', 'vmware-fusion', 'parallels', 'vagrant', 'cyberduck', 'transmit', 'filezilla', 'ssh', 'termius'],
        keywords: ['editor', 'terminal', 'git', 'database', 'db', 'sql', 'code', 'ide', 'debug', 'api', 'docker', 'container', 'deploy', 'server', 'ftp', 'sftp', 'ssh'],
    },
    {
        id: 'browsers',
        label: 'Browsers',
        emoji: '🌐',
        tokens: ['google-chrome', 'firefox', 'arc', 'safari', 'brave-browser', 'opera', 'microsoft-edge', 'vivaldi', 'min', 'orion', 'tor-browser', 'waterfox', 'librewolf'],
        keywords: ['browser', 'chrome', 'firefox'],
    },
    {
        id: 'design',
        label: 'Design',
        emoji: '🎨',
        tokens: ['figma', 'sketch', 'affinity-designer', 'affinity-photo', 'affinity-publisher', 'canva', 'pixelmator-pro', 'gimp', 'inkscape', 'blender', 'cinema-4d', 'adobe-creative-cloud', 'zeplin', 'whimsical', 'lunacy', 'vectorize', 'iconjar', 'sip', 'colorsnapper2', 'contrast', 'mark-text', 'origami-studio'],
        keywords: ['design', 'photo', 'pixel', 'vector', 'color', 'icon', 'sketch', 'figma', 'ui', 'ux'],
    },
    {
        id: 'media',
        label: 'Media',
        emoji: '🎬',
        tokens: ['vlc', 'iina', 'plex', 'emby', 'jellyfin', 'infuse', 'spotify', 'vox', 'capo', 'audirvana', 'swinsian', 'obs', 'screenflow', 'quicktime-player', 'handbrake', 'ffmpeg', 'permute', 'mkvtoolnix', 'subler', 'movist', 'downie', 'pulltube', 'frenzic-overtime', 'gyroflow-toolbox'],
        keywords: ['video', 'audio', 'music', 'media', 'player', 'stream', 'record', 'screen', 'cast', 'podcast', 'radio'],
    },
    {
        id: 'utilities',
        label: 'Utilities',
        emoji: '🔧',
        tokens: ['alfred', 'raycast', 'popclip', 'bartender', 'istatmenus', 'cleanmymac', 'onyx', 'appcleaner', 'daisydisk', 'grandperspective', 'bettertouchtool', 'magnet', 'rectangle', 'moom', 'contexts', 'mission-control-plus', 'paste', 'pastebot', 'keyboard-maestro', 'karabiner-elements', 'yoink', 'spring', 'hazel', 'typinator', 'textexpander', 'espanso', 'dash', 'devdocs-for-macos', 'macfuse', 'launchbar'],
        keywords: ['utility', 'launcher', 'menu', 'bar', 'clipboard', 'keyboard', 'window', 'manage', 'clean', 'optimize', 'backup', 'sync'],
    },
    {
        id: 'communication',
        label: 'Communication',
        emoji: '💬',
        tokens: ['slack', 'discord', 'zoom', 'microsoft-teams', 'telegram', 'signal', 'whatsapp', 'skype', 'loom', 'gather', 'around', 'tuple', 'screen', 'krisp', 'cleanshot'],
        keywords: ['chat', 'message', 'call', 'video', 'meet', 'conference', 'voice', 'social'],
    },
    {
        id: 'security',
        label: 'Security',
        emoji: '🔒',
        tokens: ['1password', 'bitwarden', 'dashlane', 'lastpass', 'nordvpn', 'expressvpn', 'tunnelblick', 'openvpn-connect', 'little-snitch', 'lulu', 'malwarebytes', 'blockblock', 'oversight', 'kextviewr', 'gpg-suite', 'keybase'],
        keywords: ['password', 'vpn', 'firewall', 'security', 'encrypt', 'privacy', 'auth', '2fa'],
    },
    {
        id: 'fonts',
        label: 'Fonts',
        emoji: '🔤',
        keywords: ['font-'],
        tokens: [],
    },
];

export const FORMULA_CATEGORIES: Category[] = [
    {
        id: 'all',
        label: 'All',
        emoji: '🏠',
    },
    {
        id: 'languages',
        label: 'Languages',
        emoji: '💻',
        tokens: ['python', 'python@3.12', 'python@3.11', 'node', 'ruby', 'rust', 'go', 'deno', 'bun', 'openjdk', 'kotlin', 'swift', 'php', 'lua', 'r', 'erlang', 'elixir', 'haskell-stack', 'ghc', 'ocaml', 'clojure', 'scala', 'groovy', 'dotnet', 'mono', 'crystal', 'nim', 'zig', 'julia'],
        keywords: ['python', 'ruby', 'node', 'java', 'rust', 'golang', 'swift', 'perl', 'scala', 'kotlin'],
    },
    {
        id: 'databases',
        label: 'Databases',
        emoji: '🗄',
        tokens: ['postgresql', 'mysql', 'redis', 'mongodb-community', 'sqlite', 'mariadb', 'cassandra', 'couchdb', 'influxdb', 'neo4j', 'elasticsearch', 'opensearch', 'etcd'],
        keywords: ['sql', 'postgres', 'mysql', 'redis', 'mongo', 'database', 'db', 'cache', 'search'],
    },
    {
        id: 'devops',
        label: 'DevOps',
        emoji: '🚀',
        tokens: ['kubectl', 'helm', 'terraform', 'ansible', 'docker', 'podman', 'minikube', 'kind', 'k9s', 'kustomize', 'flux', 'argocd', 'skaffold', 'pack', 'buildah', 'podman-compose', 'pulumi', 'aws-cli', 'awscli', 'azure-cli', 'google-cloud-sdk'],
        keywords: ['kubectl', 'helm', 'terraform', 'docker', 'kube', 'cloud', 'aws', 'azure', 'gcp', 'ci', 'cd', 'deploy'],
    },
    {
        id: 'git',
        label: 'Git & VCS',
        emoji: '🌿',
        tokens: ['git', 'gh', 'git-lfs', 'git-flow', 'hub', 'lab', 'glab', 'tig', 'lazygit', 'delta', 'difftastic', 'pre-commit', 'commitizen'],
        keywords: ['git', 'svn', 'mercurial', 'version', 'vcs'],
    },
    {
        id: 'cli-tools',
        label: 'CLI Tools',
        emoji: '⚙️',
        tokens: ['ripgrep', 'fd', 'fzf', 'bat', 'exa', 'eza', 'lsd', 'zoxide', 'tmux', 'screen', 'htop', 'btop', 'glances', 'ncdu', 'dust', 'duf', 'hyperfine', 'tokei', 'jq', 'yq', 'dasel', 'gron', 'fx', 'httpie', 'curlie', 'xh', 'wget', 'curl', 'aria2', 'navi', 'cheat', 'tldr', 'tealdeer', 'atuin', 'zellij'],
        keywords: ['grep', 'find', 'ls', 'cat', 'top', 'json', 'yaml', 'http', 'cli', 'tool', 'search', 'shell'],
    },
    {
        id: 'networking',
        label: 'Networking',
        emoji: '🌐',
        tokens: ['nmap', 'wireshark', 'mtr', 'traceroute', 'dig', 'bind', 'dnscrypt-proxy', 'cloudflared', 'caddy', 'nginx', 'traefik', 'haproxy', 'socat', 'netcat', 'openvpn', 'wireguard-tools'],
        keywords: ['net', 'network', 'dns', 'http', 'proxy', 'vpn', 'firewall', 'port', 'scan'],
    },
    {
        id: 'build-tools',
        label: 'Build Tools',
        emoji: '🔨',
        tokens: ['cmake', 'ninja', 'make', 'bazel', 'buck', 'meson', 'gradle', 'maven', 'ant', 'sbt', 'leiningen', 'mix', 'cargo', 'pip', 'poetry', 'pdm', 'uv', 'yarn', 'pnpm', 'bun'],
        keywords: ['build', 'make', 'compile', 'bundle', 'package', 'dep', 'npm', 'pip', 'gem', 'cargo'],
    },
];

/**
 * Given a token and a list of categories, return the best matching category id.
 * Falls back to 'all' (uncategorized).
 */
export function getCategoryForToken(token: string, categories: Category[]): string {
    const lowerToken = token.toLowerCase();
    for (const cat of categories) {
        if (cat.id === 'all') continue;
        if (cat.tokens?.includes(lowerToken)) return cat.id;
    }
    // Second pass: keyword prefix / contains matching
    for (const cat of categories) {
        if (cat.id === 'all') continue;
        if (cat.keywords?.some(kw => lowerToken.includes(kw.toLowerCase()))) return cat.id;
    }
    return 'all';
}

/** Hard-coded curated list of featured cask tokens for the hero banner */
export const FEATURED_CASKS = [
    { token: 'arc',            tagline: 'The browser that thinks like you', tag: 'Browser' },
    { token: 'visual-studio-code', tagline: 'The most popular code editor on earth', tag: 'Dev Tools' },
    { token: 'figma',          tagline: 'Design, prototype and collaborate in real time', tag: 'Design' },
    { token: 'obsidian',       tagline: 'Your second brain, locally stored forever', tag: 'Productivity' },
    { token: 'iterm2',         tagline: 'The terminal emulator macOS deserves', tag: 'Dev Tools' },
];

/** Hard-coded curated Editor's Picks (cask tokens) */
export const EDITORS_PICKS_TOKENS = [
    'raycast', 'warp', 'tableplus', 'zed', 'proxyman',
    'cleanshot', 'bettertouchtool', 'rectangle', 'dash', 'orbstack',
];
