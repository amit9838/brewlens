/**
 * @file Installation.tsx
 * Step-by-step Homebrew install guide for macOS, Linux and Windows (WSL),
 * plus a copy-on-click cheat sheet of everyday brew commands.
 */
import { useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, Copy, Lightbulb } from 'lucide-react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useCopy } from '../../hooks/useCopy';
import { Card, CardTitle, Chip, Segmented, SectionHead } from '../ui/kit';
import { AppleLogo } from '../ui/AppleLogo';
import { LinuxLogo } from '../ui/LinuxLogo';
import { WindowsLogo } from '../ui/WindowsLogo';

type Platform = 'macos' | 'linux' | 'windows';

const SCRIPT = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"';
const VERIFY = 'brew --version\nbrew doctor';

interface Step { title: string; text: string; cmds?: string[] }
interface Guide { reqs: string[]; steps: Step[]; note?: { title: string; body: ReactNode } }

const GUIDES: Record<Platform, Guide> = {
    macos: {
        reqs: ['macOS Monterey 12 or later', 'Xcode Command Line Tools', '64-bit Intel or Apple Silicon', 'A Terminal and an admin account'],
        steps: [
            { title: 'Install the Command Line Tools', text: 'Homebrew needs Apple’s developer tools. The installer will offer to do this for you if missing.', cmds: ['xcode-select --install'] },
            { title: 'Run the install script', text: 'Paste the command into Terminal and press Return.', cmds: [SCRIPT] },
            { title: 'Apple Silicon PATH setup', text: 'Add brew to your shell so it’s available in every new window.', cmds: ['echo \'eval "$(/opt/homebrew/bin/brew shellenv)"\' >> ~/.zprofile', 'eval "$(/opt/homebrew/bin/brew shellenv)"'] },
            { title: 'Verify your installation', text: 'Confirm Homebrew is installed and healthy:', cmds: [VERIFY] },
        ],
    },
    linux: {
        reqs: ['Debian/Ubuntu-based distribution (or equivalent)', 'curl, git and a compiler toolchain', 'A user with sudo access'],
        steps: [
            { title: 'Install dependencies', text: 'For Debian or Ubuntu, run:', cmds: ['sudo apt update && sudo apt install build-essential procps curl file git'] },
            { title: 'Run the install script', text: 'Paste the command into your terminal and follow the prompts.', cmds: [SCRIPT] },
            { title: 'Add Homebrew to your PATH', text: 'The installer prints these next steps — run them so brew is available in every new shell:', cmds: ['echo \'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"\' >> ~/.profile', 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"'] },
            { title: 'Verify your installation', text: 'Confirm Homebrew is installed and healthy:', cmds: [VERIFY] },
        ],
        note: { title: 'Which shell do you use?', body: <>Homebrew adds itself to <code className="font-mono">~/.profile</code> by default. If you use zsh, use <code className="font-mono">~/.zshrc</code> instead.</> },
    },
    windows: {
        reqs: ['Windows 10 version 2004+ or Windows 11', 'WSL2 enabled', 'Ubuntu or another Linux distribution'],
        steps: [
            { title: 'Install WSL2', text: 'We recommend Ubuntu. Run this in PowerShell:', cmds: ['wsl --install'] },
            { title: 'Open your WSL terminal', text: 'Launch Ubuntu from the Start menu, or run wsl in PowerShell.' },
            { title: 'Run the Linux install steps', text: 'Switch to the Linux tab above and follow the instructions.' },
            { title: 'Verify inside WSL', text: 'Once the Linux install finishes, confirm Homebrew is working from your WSL terminal:', cmds: [VERIFY] },
        ],
        note: {
            title: 'WSL required',
            body: <>Homebrew does not run natively on Windows. See the <a href="https://learn.microsoft.com/windows/wsl/install" target="_blank" rel="noopener noreferrer" className="font-semibold underline">Microsoft WSL guide</a> for details.</>,
        },
    },
};

const COMMANDS = [
    { title: 'Install', items: [['brew install [pkg]', 'Install a package'], ['brew install --cask [app]', 'Install a macOS GUI app'], ['brew doctor', 'Check for problems']] },
    { title: 'Manage', items: [['brew update', 'Update Homebrew and formulae'], ['brew upgrade', 'Upgrade installed packages'], ['brew list', 'List installed packages'], ['brew search [query]', 'Search packages']] },
    { title: 'Remove', items: [['brew uninstall [pkg]', 'Uninstall a package'], ['brew cleanup', 'Remove old versions and cache']] },
];

const RESOURCES = [
    { href: 'https://docs.brew.sh', title: 'Documentation', desc: 'Read the full Homebrew manual and guides.' },
    { href: 'https://github.com/Homebrew/brew', title: 'GitHub', desc: 'View the source code and report issues.' },
];

const detectPlatform = (): Platform => {
    const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
    if (ua.includes('Win')) return 'windows';
    if (ua.includes('Linux') && !ua.includes('Android')) return 'linux';
    return 'macos';
};

export default function Installation() {
    useDocumentMeta({
        title: 'How to Install Homebrew on macOS, Linux & WSL | BrewLens',
        description: 'A step-by-step guide to installing Homebrew on macOS, Linux, and Windows Subsystem for Linux (WSL), plus essential brew commands.',
    });
    const [platform, setPlatform] = useState<Platform>(detectPlatform);
    const { copy, isCopied } = useCopy();
    const guide = GUIDES[platform];

    return (
        <>
            <section aria-labelledby="in-title" className="flex flex-col items-center gap-4 pb-2 pt-6 text-center">
                <div className="flex flex-wrap justify-center gap-2"><Chip>Free &amp; open source</Chip><Chip>No account required</Chip></div>
                <h1 id="in-title" className="m-0 text-[clamp(36px,5vw,56px)] font-extrabold leading-none tracking-[-0.04em]">Install Homebrew</h1>
                <p className="m-0 max-w-[560px] text-lg leading-normal text-ink-soft">The missing package manager for macOS and Linux. Pick your platform and follow the steps.</p>
                <Segmented
                    size="lg"
                    label="Choose your platform"
                    value={platform}
                    onChange={setPlatform}
                    className="mt-2 p-1.5"
                    options={[
                        { value: 'macos', label: <span className="flex items-center gap-2"><AppleLogo className="h-4 w-4" />macOS</span> },
                        { value: 'linux', label: <span className="flex items-center gap-2"><LinuxLogo className="h-4 w-4" />Linux</span> },
                        { value: 'windows', label: <span className="flex items-center gap-2"><WindowsLogo className="h-4 w-4" />Windows (WSL)</span> },
                    ]}
                />
            </section>

            <div className="flex flex-wrap items-start gap-6">
                <Card className="min-w-0 flex-[1_1_300px]">
                    <CardTitle>Requirements</CardTitle>
                    {guide.reqs.map((r) => (
                        <div key={r} className="flex gap-2.5 text-[15px] leading-[1.45]"><span className="font-extrabold text-accent-ink">✓</span><span>{r}</span></div>
                    ))}
                    {guide.note && (
                        <div className="rounded-[14px] bg-accent-soft p-3.5 text-sm leading-normal text-accent-tint-ink">
                            <strong className="flex items-center gap-1.5"><Lightbulb size={14} />{guide.note.title}</strong>
                            <div className="mt-1">{guide.note.body}</div>
                        </div>
                    )}
                </Card>

                <section aria-label="Installation steps" className="flex min-w-0 flex-[999_1_560px] flex-col gap-3">
                    <h2 className="m-0 mb-1 text-2xl font-bold tracking-[-0.02em]">Installation steps</h2>
                    {guide.steps.map((s, i) => (
                        <div key={platform + i} className="flex gap-[18px] rounded-[22px] p-5 shadow-[0_0_0_1px_var(--line)]">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-invert text-[15px] font-extrabold text-on-invert">{i + 1}</span>
                            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                                <div>
                                    <div className="text-[17px] font-bold">{s.title}</div>
                                    <div className="mt-0.5 text-[15px] text-muted">{s.text}</div>
                                </div>
                                {s.cmds?.map((cmd, j) => {
                                    const key = `${platform}-${i}-${j}`;
                                    return (
                                        <div key={key} className="flex items-start gap-2.5 rounded-[14px] bg-term py-1.5 pl-4 pr-1.5 text-white">
                                            <pre className="m-0 min-w-0 flex-1 overflow-x-auto py-2 font-mono text-[13.5px] leading-6">
                                                {cmd.split('\n').map((line, k) => <span key={k} className="flex gap-2.5"><span className="select-none text-[#6EE7B7]">$</span><span className="whitespace-pre">{line}</span></span>)}
                                            </pre>
                                            <button
                                                type="button"
                                                onClick={() => copy(cmd, key)}
                                                aria-label="Copy command"
                                                className="mt-0.5 flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border-0 bg-[#2A2A2F] px-3.5 text-[13px] font-semibold text-white transition hover:bg-[#3A3A40] active:scale-[0.97]"
                                            >
                                                {isCopied(key) ? <Check size={16} /> : <Copy size={16} />}{isCopied(key) ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </section>
            </div>

            <section aria-labelledby="cc-title" className="flex flex-col gap-4">
                <SectionHead eyebrow="Everyday brew usage once installation is done" title="Common commands" id="cc-title" />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
                    {COMMANDS.map((g) => (
                        <Card key={g.title} className="gap-2.5">
                            <h3 className="m-0 mb-1 text-lg font-bold">{g.title}</h3>
                            {g.items.map(([cmd, desc]) => (
                                <button
                                    key={cmd}
                                    type="button"
                                    onClick={() => copy(cmd, `g-${cmd}`)}
                                    aria-label={`Copy ${cmd}`}
                                    className="flex cursor-pointer items-center gap-3 rounded-[14px] border-0 bg-raised px-3.5 py-3 text-left text-ink transition-colors hover:bg-chip"
                                >
                                    <span className="min-w-0 flex-1">
                                        <code className="block font-mono text-[13.5px]">{cmd}</code>
                                        <span className="mt-0.5 block text-[13px] text-muted">{desc}</span>
                                    </span>
                                    <span className="text-xs font-bold text-accent-ink">{isCopied(`g-${cmd}`) ? 'Copied' : 'Copy'}</span>
                                </button>
                            ))}
                        </Card>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
                {RESOURCES.map((r) => (
                    <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-[22px] p-[22px] text-ink no-underline shadow-[0_0_0_1px_var(--line)] hover:bg-surface hover:text-ink">
                        <span className="flex-1"><span className="block text-[17px] font-bold">{r.title}</span><span className="mt-0.5 block text-sm text-muted">{r.desc}</span></span>
                        <ArrowUpRight size={16} />
                    </a>
                ))}
            </section>
        </>
    );
}
