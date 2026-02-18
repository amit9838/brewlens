import React from "react";
import { 
  Terminal, 
  Apple, 
  Monitor, 
  Command, 
  CheckCircle2, 
  BookOpen, 
  ExternalLink, 
  Cpu,
  Server
} from "lucide-react";
import { cn } from "../../lib/utils";

// --- Types ---
interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface CodeBlockProps {
  command: string;
  label?: string;
}

// --- Helper Components ---

const CodeBlock: React.FC<CodeBlockProps> = ({ command, label }) => {
  return (
    <div className="my-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-900 text-slate-100 shadow-sm dark:border-slate-700">
      {label && (
        <div className="flex items-center border-b border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400">
          <Terminal className="mr-2 h-3 w-3" />
          {label}
        </div>
      )}
      <div className="group relative">
        <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed">
          <code>{command}</code>
        </pre>
      </div>
    </div>
  );
};

const BentoCard: React.FC<CardProps> = ({ title, icon, children, className, headerClassName }) => {
  return (
    <div className={cn(
      "flex flex-col overflow-hidden rounded-3xl border transition-all duration-200",
      "bg-white dark:bg-slate-900 dark:border-slate-800",
      "shadow-sm hover:shadow-md",
      className
    )}>
      <div className={cn("flex items-center gap-3 px-6 pt-6 pb-2", headerClassName)}>
        {icon && <div className="text-slate-700 dark:text-slate-200">{icon}</div>}
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
      <div className="flex-1 px-6 pb-6 text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
};

const Pill = ({ children, color = "slate" }: { children: React.ReactNode, color?: string }) => (
  <span className={cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    color === "blue" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    color === "green" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    color === "orange" && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    color === "slate" && "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  )}>
    {children}
  </span>
);

// --- Main Component ---

export default function HomebrewGuide() {
  return (
    <div className="min-h-screen  p-4 font-sans  md:p-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        
        {/* --- Header Section (Full Width) --- */}
        <div className="col-span-1 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 shadow-lg md:col-span-2 xl:col-span-3">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-6xl shadow-inner backdrop-blur-sm">
              🍺
            </div>
            <div className="max-w-3xl">
              <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                Homebrew Installation Guide
              </h1>
              <p className="text-lg font-medium text-indigo-100 opacity-90">
                The "missing package manager" for macOS (or Linux). 
                A free and open-source tool that simplifies installing software.
              </p>
            </div>
          </div>
        </div>

        {/* --- MacOS Installation --- */}
        <BentoCard 
          title="Installation on macOS" 
          icon={<Apple className="h-6 w-6" />}
          className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900"
          headerClassName="text-blue-900 dark:text-blue-100"
        >
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white">Prerequisites:</h4>
              <div className="flex flex-wrap gap-2">
                <Pill color="blue">macOS Monterey 12+</Pill>
                <Pill color="blue">Xcode CL Tools</Pill>
                <Pill color="blue">64-bit Intel / Apple Silicon</Pill>
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">1. Run the Install Script:</p>
              <CodeBlock 
                label="Terminal" 
                command='/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' 
              />
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Cpu className="h-4 w-4 text-orange-500" />
                <span>Apple Silicon Post-Install</span>
              </div>
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Add to PATH (~/.zprofile):</p>
              <CodeBlock command={`echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile\neval "$(/opt/homebrew/bin/brew shellenv)"`} />
            </div>
          </div>
        </BentoCard>

        {/* --- Linux Installation --- */}
        <BentoCard 
          title="Installation on Linux" 
          icon={<Server className="h-6 w-6" />}
          className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900"
          headerClassName="text-emerald-900 dark:text-emerald-100"
        >
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white">1. Install Dependencies (Debian/Ubuntu):</h4>
              <CodeBlock 
                command="sudo apt update && sudo apt install build-essential procps curl file git" 
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">2. Run Script:</h4>
              <CodeBlock 
                command='/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' 
              />
            </div>

            <div className="rounded-xl bg-emerald-100/50 p-3 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
              <strong>Tip:</strong> Don't forget to add Homebrew to your <code className="rounded bg-emerald-200 px-1 py-0.5 text-xs dark:bg-emerald-800">~/.bashrc</code> or <code className="rounded bg-emerald-200 px-1 py-0.5 text-xs dark:bg-emerald-800">~/.zshrc</code> as prompted by the script!
            </div>
          </div>
        </BentoCard>

        {/* --- Windows Section (Smaller) --- */}
        <BentoCard 
          title="Windows (WSL)" 
          icon={<Monitor className="h-6 w-6" />}
          className="bg-orange-50/50 border-orange-100 dark:bg-orange-950/10 dark:border-orange-900 md:col-span-1"
          headerClassName="text-orange-900 dark:text-orange-100"
        >
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-3 text-sm">
              <p>Homebrew does <strong>not</strong> run natively on Windows.</p>
              <p>You must use <strong>Windows Subsystem for Linux (WSL)</strong>.</p>
              <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400">
                <li>Install WSL2 (Ubuntu recommended).</li>
                <li>Open your WSL terminal.</li>
                <li>Follow the <strong>Linux</strong> installation instructions.</li>
              </ul>
            </div>
          </div>
        </BentoCard>

        {/* --- Common Commands (Wide) --- */}
        <BentoCard 
          title="Common Commands" 
          icon={<Command className="h-6 w-6" />}
          className="bg-purple-50/50 border-purple-100 dark:bg-purple-950/10 dark:border-purple-900 md:col-span-2 xl:col-span-2"
          headerClassName="text-purple-900 dark:text-purple-100"
        >
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Command</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-2 font-mono text-purple-600 dark:text-purple-400">brew install [pkg]</td>
                  <td className="px-4 py-2">Install a package (e.g., wget)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-2 font-mono text-purple-600 dark:text-purple-400">brew install --cask [app]</td>
                  <td className="px-4 py-2">Install GUI app (macOS only)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-2 font-mono text-purple-600 dark:text-purple-400">brew update</td>
                  <td className="px-4 py-2">Update Homebrew & formula list</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-2 font-mono text-purple-600 dark:text-purple-400">brew upgrade</td>
                  <td className="px-4 py-2">Upgrade all installed packages</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-2 font-mono text-purple-600 dark:text-purple-400">brew list</td>
                  <td className="px-4 py-2">List installed packages</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-2 font-mono text-purple-600 dark:text-purple-400">brew doctor</td>
                  <td className="px-4 py-2">Check system for problems</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-col gap-2 rounded-lg bg-white p-3 text-sm shadow-sm dark:bg-slate-800 sm:flex-row sm:items-center">
            <span className="font-semibold">Example:</span>
            <code className="rounded bg-slate-100 px-2 py-1 font-mono text-slate-800 dark:bg-slate-700 dark:text-slate-200">
              brew install --cask firefox
            </code>
          </div>
        </BentoCard>

        {/* --- Verification --- */}
        <BentoCard 
          title="Verification" 
          icon={<CheckCircle2 className="h-6 w-6" />}
          className="bg-teal-50/50 border-teal-100 dark:bg-teal-950/10 dark:border-teal-900"
          headerClassName="text-teal-900 dark:text-teal-100"
        >
          <div className="flex h-full flex-col">
            <p className="mb-4 text-sm">
              Run the doctor command to ensure everything is set up correctly. It will warn you about issues and suggest fixes.
            </p>
            <div className="mt-auto">
              <CodeBlock command="brew doctor" />
            </div>
          </div>
        </BentoCard>

        {/* --- Resources --- */}
        <div className="col-span-1 flex flex-col gap-6 md:col-span-2 xl:col-span-3">
          <BentoCard 
            title="Additional Resources" 
            icon={<BookOpen className="h-6 w-6" />}
            className="bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900"
            headerClassName="text-indigo-900 dark:text-indigo-100"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a 
                href="https://docs.brew.sh" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Documentation</div>
                    <div className="text-xs text-slate-500">docs.brew.sh</div>
                  </div>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-indigo-500" />
              </a>

              <a 
                href="https://github.com/Homebrew/brew" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                    <Server size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">GitHub Repo</div>
                    <div className="text-xs text-slate-500">github.com/Homebrew</div>
                  </div>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-indigo-500" />
              </a>
            </div>
          </BentoCard>
        </div>

      </div>
    </div>
  );
}