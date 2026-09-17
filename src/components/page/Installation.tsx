import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { Button } from "../ui/Button";
import { SectionHeader } from "../ui/SectionHeader";
import {
  Terminal,
  SquareTerminal,
  BookOpen,
  ExternalLink,
  Check,
  Copy,
  Lightbulb,
  Info,
  Sparkles,
  ArrowRight,
  TriangleAlert,
  ListChecks,
} from "lucide-react";
import { AppleLogo } from "../ui/AppleLogo";
import { LinuxLogo } from "../ui/LinuxLogo";
import { WindowsLogo } from "../ui/WindowsLogo";

type PlatformKey = "macos" | "linux" | "windows";

interface CodeBlockProps {
  command: string;
  label?: string;
}

interface PlatformGuide {
  name: string;
  command: string | null;
  commandNote?: string;
  prerequisites: string[];
  steps: {
    title: string;
    description?: string;
    code?: string;
    codeLabel?: string;
  }[];
  note?: {
    type: "note" | "tip";
    title: string;
    content: React.ReactNode;
  };
}

const detectPlatform = (): PlatformKey => {
  if (typeof navigator === "undefined") return "macos";
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "windows";
  if (ua.includes("Linux") && !ua.includes("Android")) return "linux";
  return "macos";
};

const CodeBlock: React.FC<CodeBlockProps> = ({ command, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-sm dark:border-zinc-800">
      <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        </span>
        <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {label ?? "terminal"}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy command"
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6 text-zinc-100">
        {command.split("\n").map((line, i) => (
          <span key={i} className="flex gap-2.5">
            <span className="select-none text-green-500/90">$</span>
            <span className="whitespace-pre">{line}</span>
          </span>
        ))}
      </pre>
    </div>
  );
};

const Admonition = ({
  type,
  title,
  children,
}: {
  type: "note" | "tip";
  title: string;
  children: React.ReactNode;
}) => {
  const isNote = type === "note";
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border p-4",
        isNote
          ? "border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10"
          : "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          isNote
            ? "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
            : "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-500",
        )}
      >
        {isNote ? (
          <Info className="h-4 w-4" />
        ) : (
          <Lightbulb className="h-4 w-4" />
        )}
      </div>
      <div className="min-w-0">
        <div
          className={cn(
            "mb-1 text-sm font-semibold",
            isNote
              ? "text-blue-900 dark:text-blue-200"
              : "text-amber-900 dark:text-amber-200",
          )}
        >
          {title}
        </div>
        <div className="text-sm text-zinc-700 dark:text-zinc-300">
          {children}
        </div>
      </div>
    </div>
  );
};

const PLATFORM_GUIDES: Record<PlatformKey, PlatformGuide> = {
  macos: {
    name: "macOS",
    command:
      '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
    prerequisites: [
      "macOS Monterey 12 or later",
      "Xcode Command Line Tools",
      "64-bit Intel or Apple Silicon",
    ],
    steps: [
      {
        title: "Run the install script",
        description: "Paste the command into Terminal and press Return.",
        code: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
        codeLabel: "terminal",
      },
      {
        title: "Verify your installation",
        description: "Confirm Homebrew is installed and healthy:",
        code: "brew --version\nbrew doctor",
        codeLabel: "terminal",
      },
    ],
    note: {
      type: "note",
      title: "Apple Silicon PATH setup",
      content: (
        <>
          <p className="mb-1">
            On Apple Silicon Macs, add Homebrew to your PATH in{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
              ~/.zprofile
            </code>
            :
          </p>
          <CodeBlock
            label="terminal"
            command={`echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile\neval "$(/opt/homebrew/bin/brew shellenv)"`}
          />
        </>
      ),
    },
  },
  linux: {
    name: "Linux",
    command:
      '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
    prerequisites: [
      "Debian/Ubuntu-based distribution (or equivalent)",
      "curl, git, and build tools",
    ],
    steps: [
      {
        title: "Install dependencies",
        description: "For Debian or Ubuntu, run:",
        code: "sudo apt update && sudo apt install build-essential procps curl file git",
        codeLabel: "terminal",
      },
      {
        title: "Run the install script",
        description: "Paste the command into your terminal and follow the prompts.",
        code: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
        codeLabel: "terminal",
      },
      {
        title: "Add Homebrew to your PATH",
        description:
          "The installer prints these next steps — run them so brew is available in every new shell:",
        code: `echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.profile\neval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"`,
        codeLabel: "terminal",
      },
      {
        title: "Verify your installation",
        description: "Confirm Homebrew is installed and healthy:",
        code: "brew --version\nbrew doctor",
        codeLabel: "terminal",
      },
    ],
    note: {
      type: "tip",
      title: "Which shell do you use?",
      content: (
        <p>
          Homebrew adds itself to{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            ~/.profile
          </code>{" "}
          by default. If you use zsh, you can use{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            ~/.zshrc
          </code>{" "}
          instead.
        </p>
      ),
    },
  },
  windows: {
    name: "Windows (WSL)",
    command: null,
    commandNote:
      "Homebrew does not run natively on Windows. Install WSL2, open your Linux terminal, then use the Linux install command.",
    prerequisites: [
      "Windows 10 version 2004+ or Windows 11",
      "WSL2 enabled",
      "Ubuntu or another Linux distribution",
    ],
    steps: [
      {
        title: "Install WSL2",
        description: "We recommend Ubuntu. Run this in PowerShell:",
        code: "wsl --install",
        codeLabel: "powershell",
      },
      {
        title: "Open your WSL terminal",
        description: "Launch Ubuntu from the Start menu, or run wsl in PowerShell.",
      },
      {
        title: "Run the Linux install steps",
        description: "Switch to the Linux tab above and follow the instructions.",
      },
      {
        title: "Verify inside WSL",
        description:
          "Once the Linux install finishes, confirm Homebrew is working from your WSL terminal:",
        code: "brew --version\nbrew doctor",
        codeLabel: "terminal",
      },
    ],
    note: {
      type: "note",
      title: "WSL required",
      content: (
        <p>
          See the{" "}
          <a
            href="https://learn.microsoft.com/windows/wsl/install"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
          >
            Microsoft WSL installation guide
          </a>{" "}
          for details.
        </p>
      ),
    },
  },
};

const COMMON_COMMANDS = [
  {
    title: "Install",
    commands: [
      { cmd: "brew install [pkg]", desc: "Install a package" },
      { cmd: "brew install --cask [app]", desc: "Install a macOS GUI app" },
      { cmd: "brew doctor", desc: "Check for problems" },
    ],
  },
  {
    title: "Manage",
    commands: [
      { cmd: "brew update", desc: "Update Homebrew and formulae" },
      { cmd: "brew upgrade", desc: "Upgrade installed packages" },
      { cmd: "brew list", desc: "List installed packages" },
      { cmd: "brew search [query]", desc: "Search packages" },
    ],
  },
  {
    title: "Remove",
    commands: [
      { cmd: "brew uninstall [pkg]", desc: "Uninstall a package" },
      { cmd: "brew cleanup", desc: "Remove old versions and cache" },
    ],
  },
];

const RESOURCES = [
  {
    href: "https://docs.brew.sh",
    title: "Documentation",
    desc: "Read the full Homebrew manual and guides.",
  },
  {
    href: "https://github.com/Homebrew/brew",
    title: "GitHub",
    desc: "View the source code and report issues.",
  },
];

const PLATFORMS: {
  key: PlatformKey;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "macos", label: "macOS", icon: <AppleLogo className="h-5 w-5" /> },
  { key: "linux", label: "Linux", icon: <LinuxLogo className="h-5 w-5" /> },
  {
    key: "windows",
    label: "Windows (WSL)",
    icon: <WindowsLogo className="h-5 w-5" />,
  },
];

export default function HomebrewGuide() {
  const [platform, setPlatform] = useState<PlatformKey>(detectPlatform);
  const guide = PLATFORM_GUIDES[platform];

  useDocumentMeta({
    title: "How to Install Homebrew on macOS, Linux & WSL | BrewLens",
    description:
      "A step-by-step guide to installing Homebrew on macOS, Linux, and Windows Subsystem for Linux (WSL), plus essential brew commands.",
  });

  return (
    <div className="relative font-sans">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/[0.05] blur-[120px] dark:bg-amber-600/10" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-green-500/[0.03] blur-[120px] dark:bg-green-600/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-12">
        <header className="space-y-4 pt-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
            <Terminal size={12} />
            Installation Guide
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Install{" "}
            <span className="font-thin opacity-80">Homebrew</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            The missing package manager for macOS, Linux, and Windows (WSL) —
            in a few copy-paste commands.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {["Free & open source", "5-minute setup", "No account required"].map(
              (chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-zinc-600 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-300"
                >
                  {chip}
                </span>
              ),
            )}
          </div>
        </header>

        <section>
          <div
            className="grid grid-cols-3 gap-2 sm:gap-3"
            role="tablist"
            aria-label="Choose your platform"
          >
            {PLATFORMS.map(({ key, label, icon }) => {
              const active = platform === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPlatform(key)}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-200 sm:p-4",
                    active
                      ? "border-green-600/40 bg-green-500/5 shadow-sm dark:border-green-500/40 dark:bg-green-500/10"
                      : "border-zinc-200 bg-white hover:border-zinc-300 hover:translate-y-[-2px] dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:hover:border-zinc-700",
                  )}
                >
                  {detectPlatform() === key && (
                    <span className="absolute -top-2 right-2 rounded-full bg-green-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      Detected
                    </span>
                  )}
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-xl p-2.5 transition-colors",
                      active
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-zinc-100 text-zinc-500 group-hover:text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                    )}
                  >
                    {icon}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold sm:text-sm",
                      active
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-600 dark:text-zinc-400",
                    )}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          {guide.command ? (
            <>
              <CodeBlock label="terminal" command={guide.command} />
              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                Paste the command into your terminal and follow the on-screen
                instructions.
              </p>
            </>
          ) : (
            <div className="flex flex-col gap-3 rounded-2xl border border-amber-300/60 bg-amber-500/10 p-4 dark:border-amber-500/20 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-500">
                  <TriangleAlert className="h-4.5 w-4.5" />
                </div>
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  {guide.commandNote}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPlatform("linux")}
                className="shrink-0 sm:ml-auto"
              >
                Continue with Linux
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-center rounded-xl bg-green-50 p-2.5 text-green-600 dark:bg-green-500/15 dark:text-green-400">
              <Terminal size={18} strokeWidth={1.8} />
            </div>
            <SectionHeader
              title="Installation steps"
              subtitle={`Step-by-step guide for ${guide.name}`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <ListChecks size={14} />
              Prerequisites
            </div>
            <div className="flex flex-wrap gap-2">
              {guide.prerequisites.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-zinc-300"
                >
                  <Check
                    size={12}
                    className="text-green-600 dark:text-green-400"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ol>
            {guide.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {index < guide.steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute bottom-1 left-[13px] top-9 w-px bg-zinc-200 dark:bg-zinc-800"
                  />
                )}
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white shadow-sm dark:bg-green-700">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {step.description}
                    </p>
                  )}
                  {step.code && (
                    <CodeBlock
                      label={step.codeLabel}
                      command={step.code}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>

          {guide.note && (
            <Admonition type={guide.note.type} title={guide.note.title}>
              {guide.note.content}
            </Admonition>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-center rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <SquareTerminal size={18} strokeWidth={1.8} />
            </div>
            <SectionHeader
              title="Common commands"
              subtitle="Everyday brew usage once installation is done"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {COMMON_COMMANDS.map((category) => (
              <div
                key={category.title}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:shadow-none"
              >
                <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:border-zinc-800/60 dark:bg-zinc-800/30 dark:text-zinc-400">
                  {category.title}
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {category.commands.map((command) => (
                    <div key={command.cmd} className="px-4 py-2.5">
                      <code className="block break-words font-mono text-xs text-green-700 dark:text-green-400">
                        {command.cmd}
                      </code>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {command.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-center rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-500/15 dark:text-amber-500">
              <BookOpen size={18} strokeWidth={1.8} />
            </div>
            <SectionHeader
              title="Learn more"
              subtitle="Terminology and further reading"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:shadow-none">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center justify-center rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-500/15 dark:text-amber-500">
                  <Lightbulb size={16} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Terminology
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    Formulae
                  </strong>{" "}
                  — command-line tools and libraries built from source.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    Casks
                  </strong>{" "}
                  — pre-built macOS GUI apps and binaries.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    Taps
                  </strong>{" "}
                  — third-party repositories of additional packages.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:shadow-none">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center justify-center rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-500/15 dark:text-amber-500">
                  <BookOpen size={16} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Resources
                </h3>
              </div>
              <ul className="space-y-3">
                {RESOURCES.map((resource) => (
                  <li key={resource.href}>
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3 transition-colors hover:border-amber-500/30 hover:bg-amber-500/5 dark:border-zinc-800/60 dark:bg-zinc-800/30 dark:hover:border-amber-500/30"
                    >
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {resource.title}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {resource.desc}
                        </div>
                      </div>
                      <ExternalLink
                        size={14}
                        className="shrink-0 text-zinc-400 transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-500"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:shadow-none sm:p-8">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl dark:bg-green-500/15" />
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
              <Sparkles size={12} />
              What&apos;s next
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Ready to brew?
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Browse thousands of formulae and casks with BrewLens — trending
              apps, categories, and analytics, no terminal required.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row">
              <Button asChild variant="primary" size="md">
                <Link to="/">
                  Explore packages
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="md">
                <a
                  href="https://docs.brew.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="h-4 w-4" />
                  Homebrew docs
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
