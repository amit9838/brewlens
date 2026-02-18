import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, Check, Copy, Terminal, Moon, Sun } from "lucide-react";
/**
 * Icons (Inline SVGs to avoid external dependencies)
 */
const Icons = {

    Terminal: () => (
        <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1m-2-2l-2-2m2 2l-2 2m2-2H4"
            />
        </svg>
    ),
    Moon: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    ),
    Sun: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
    ),
};

/**
 * CodeBlock Component - Handles syntax highlighting aesthetics and copy functionality
 */
const CodeBlock: React.FC<{ code: string; label?: string }> = ({
    code,
    label,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group overflow-hidden rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-highest)] my-2">
            {label && (
                <div className="px-4 py-1 text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] border-b border-[var(--md-sys-color-outline-variant)]/50 bg-[var(--md-sys-color-surface-container-high)]">
                    {label}
                </div>
            )}
            <div className="flex items-start justify-between p-4">
                <code className="font-mono text-sm break-all text-[var(--md-sys-color-on-surface-variant)]">
                    {code}
                </code>
                <button
                    onClick={handleCopy}
                    className="ml-4 p-2 rounded-full hover:bg-[var(--md-sys-color-on-surface)]/10 transition-colors text-[var(--md-sys-color-primary)] shrink-0"
                    aria-label="Copy code"
                >
                    {copied ? <Check /> : <Copy />}
                </button>
            </div>
        </div>
    );
};

const Installation: React.FC = () => {
    // Theme toggle state
    const [isDark, setIsDark] = useState(false);

    // Initial Theme Check
    useEffect(() => {
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => setIsDark(!isDark);

    const platforms = [
        {
            name: "macOS",
            icon: "🍏",
            prerequisites: [
                "macOS Monterey (12) or later",
                "Xcode Command Line Tools",
                "64-bit Intel or Apple Silicon",
                "curl and git",
            ],
            steps: [
                {
                    type: "text",
                    content: "Open Terminal (/Applications/Utilities/Terminal)",
                },
                {
                    type: "code",
                    content:
                        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
                    label: "Install Script",
                },
                { type: "text", content: "Follow the prompts and enter password." },
            ],
            postInstall: [
                "echo 'eval \"$(/opt/homebrew/bin/brew shellenv)\"' >> ~/.zprofile",
                'eval "$(/opt/homebrew/bin/brew shellenv)"',
            ],
        },
        {
            name: "Linux",
            icon: "🐧",
            prerequisites: [
                "GCC / Clang",
                "curl, git, procps",
                "Ruby",
                "64-bit system",
            ],
            steps: [
                { type: "text", content: "Install build tools (Debian/Ubuntu):" },
                {
                    type: "code",
                    content:
                        "sudo apt update && sudo apt install build-essential procps curl file git",
                    label: "Dependencies",
                },
                { type: "text", content: "Run the install script:" },
                {
                    type: "code",
                    content:
                        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
                    label: "Install Script",
                },
            ],
            postInstall: [
                "echo 'eval \"$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)\"' >> ~/.bashrc",
                'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"',
            ],
        },
        {
            name: "Windows (WSL)",
            icon: "🪟",
            prerequisites: ["Windows 10/11 with WSL2", "Ubuntu (or similar) on WSL"],
            steps: [
                { type: "text", content: "Open your WSL terminal." },
                {
                    type: "text",
                    content: "Follow the Linux installation steps exactly.",
                },
                {
                    type: "text",
                    content: "Brew will be available inside the Linux subsystem.",
                },
            ],
            postInstall: [],
        },
    ];

    const commands = [
        { command: "brew --version", description: "Show Homebrew version." },
        { command: "brew update", description: "Update Homebrew & formulae." },
        { command: "brew upgrade", description: "Upgrade installed packages." },
        { command: "brew install <pkg>", description: "Install a package." },
        { command: "brew list", description: "List installed packages." },
        { command: "brew search <text>", description: "Search packages." },
        { command: "brew info <pkg>", description: "View package details." },
        { command: "brew doctor", description: "Check system health." },
    ];

    return (
        <div
            className={`transition-colors duration-500 ease-in-out ${isDark ? "dark" : ""}`}
            style={
                {
                    // CSS Variables mapping for M3 Tokens
                    "--md-sys-color-primary": isDark ? "#D0BCFF" : "#6750A4",
                    "--md-sys-color-on-primary": isDark ? "#381E72" : "#FFFFFF",
                    "--md-sys-color-primary-container": isDark ? "#4F378B" : "#EADDFF",
                    "--md-sys-color-on-primary-container": isDark ? "#EADDFF" : "#21005D",

                    "--md-sys-color-surface": isDark ? "#141218" : "#FDF8F6",
                    "--md-sys-color-on-surface": isDark ? "#E6E1E5" : "#1C1B1F",
                    "--md-sys-color-on-surface-variant": isDark ? "#CAC4D0" : "#49454F",
                    "--md-sys-color-outline": isDark ? "#938F99" : "#79747E",
                    "--md-sys-color-outline-variant": isDark ? "#49454F" : "#CAC4D0",

                    "--md-sys-color-surface-container-low": isDark
                        ? "#1D1B20"
                        : "#F7F2FA",
                    "--md-sys-color-surface-container": isDark ? "#211F26" : "#F3EDF7",
                    "--md-sys-color-surface-container-high": isDark
                        ? "#2B2930"
                        : "#ECE6F0",
                    "--md-sys-color-surface-container-highest": isDark
                        ? "#36343B"
                        : "#E6E0E9",
                } as React.CSSProperties
            }
        >
            <div className="min-h-screen font-sans  duration-300 p-4 md:p-4">
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between mb-4"></div>
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Header */}
                    <header className="relative overflow-hidden rounded-full  p-8 md:p-2 text-center shadow-sm">
                        <nav className="flex justify-between items-center p-1 w-full">
                            <h1 className="text-2xl md:text-2xl font-normal tracking-tight text-[var(--md-sys-color-on-surface)]">
                                Homebew Guide
                            </h1>
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="  p-3 rounded-full bg-[var(--md-sys-color-surface-container-highest)] hover:bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-surface)] hover:text-[var(--md-sys-color-on-primary-container)] transition-all"
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun /> : <Moon />}
                            </button>
                        </nav>
                    </header>

                    {/* Platform Grid */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-normal mb-8 pl-2 border-l-4 border-[var(--md-sys-color-primary)]">
                            Installation
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {platforms.map((platform) => (
                                <article
                                    key={platform.name}
                                    className="flex flex-col bg-[var(--md-sys-color-surface-container-low)] rounded-[2rem] p-6 md:p-8 hover:bg-[var(--md-sys-color-surface-container)] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-[var(--md-sys-color-primary-container)] flex items-center justify-center text-3xl">
                                            {platform.icon}
                                        </div>
                                        <h3 className="text-2xl font-normal text-[var(--md-sys-color-on-surface)]">
                                            {platform.name}
                                        </h3>
                                    </div>

                                    <div className="space-y-8 flex-grow">
                                        {/* Prerequisites */}
                                        <div>
                                            <h4 className="text-sm font-bold tracking-wider uppercase text-[var(--md-sys-color-primary)] mb-3">
                                                Prerequisites
                                            </h4>
                                            <ul className="space-y-2">
                                                {platform.prerequisites.map((req, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-3 text-sm text-[var(--md-sys-color-on-surface-variant)]"
                                                    >
                                                        <span className="mt-1 text-[var(--md-sys-color-primary)] opacity-70">
                                                            •
                                                        </span>
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Steps */}
                                        <div>
                                            <h4 className="text-sm font-bold tracking-wider uppercase text-[var(--md-sys-color-primary)] mb-3">
                                                Steps
                                            </h4>
                                            <div className="space-y-4">
                                                {platform.steps.map((step, i) => (
                                                    <div key={i}>
                                                        {step.type === "text" ? (
                                                            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mb-1">
                                                                {step.content}
                                                            </p>
                                                        ) : (
                                                            <CodeBlock
                                                                code={step.content}
                                                                label={step.label}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Post Install */}
                                        {platform.postInstall.length > 0 && (
                                            <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant)]">
                                                <h4 className="text-sm font-bold tracking-wider uppercase text-[var(--md-sys-color-primary)] mb-2">
                                                    Add to PATH
                                                </h4>
                                                {platform.postInstall.map((cmd, i) => (
                                                    <CodeBlock key={i} code={cmd} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Common Commands & Verify Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Commands Table/List */}
                        <div className="lg:col-span-2 bg-[var(--md-sys-color-surface-container)] rounded-[2rem] p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="p-2 rounded-xl bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]">
                                    <Terminal />
                                </span>
                                <h2 className="text-2xl font-normal">Common Commands</h2>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-[var(--md-sys-color-outline-variant)]">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[var(--md-sys-color-surface-container-high)]">
                                        <tr>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
                                                Command
                                            </th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)] hidden md:table-cell">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]">
                                        {commands.map((cmd, i) => (
                                            <tr
                                                key={i}
                                                className="group hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors"
                                            >
                                                <td className="p-4">
                                                    <code className="text-sm font-mono text-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)]/30 px-2 py-1 rounded-md">
                                                        {cmd.command}
                                                    </code>
                                                    <p className="md:hidden mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                                                        {cmd.description}
                                                    </p>
                                                </td>
                                                <td className="p-4 text-sm text-[var(--md-sys-color-on-surface)] hidden md:table-cell">
                                                    {cmd.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Verify & Links (Sidebar) */}
                        <div className="space-y-6">
                            {/* Verification Card */}
                            <div className="bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] rounded-[2rem] p-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Check /> Verify
                                </h3>
                                <p className="mb-4 opacity-80 text-sm">
                                    Run these to ensure your system is healthy:
                                </p>
                                <CodeBlock code="brew --version" />
                                <div className="h-2"></div>
                                <CodeBlock code="brew doctor" />
                            </div>

                            {/* Resources Card */}
                            <div className="bg-[var(--md-sys-color-surface-container-high)] rounded-[2rem] p-8 border border-[var(--md-sys-color-outline-variant)]">
                                <h3 className="text-xl font-normal mb-4">Resources</h3>
                                <ul className="space-y-3">
                                    {[
                                        { name: "Documentation", url: "https://docs.brew.sh" },
                                        {
                                            name: "GitHub Repo",
                                            url: "https://github.com/Homebrew/brew",
                                        },
                                        { name: "Formulae List", url: "https://formulae.brew.sh" },
                                    ].map((link) => (
                                        <li key={link.name}>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between p-3 rounded-xl bg-[var(--md-sys-color-surface)] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] transition-all group"
                                            >
                                                <span className="font-medium text-sm">{link.name}</span>
                                                <span className="group-hover:translate-x-1 transition-transform">
                                                    →
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center pt-8 border-t border-[var(--md-sys-color-outline-variant)]">
                        <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                            Designed with Material 3 Expressive
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Installation;
