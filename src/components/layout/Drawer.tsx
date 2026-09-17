import { X, Terminal, Info, Home, LayoutGrid, BarChart2, ChevronRight, ExternalLink, BookOpen, Github } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { NavLink } from "react-router-dom";
import { useDrawerBehavior } from "../../hooks/useDrawerBehavior";
import logo from "../../assets/brewlens_logo.png";

interface NavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItemProps {
    to?: string;
    href?: string;
    icon: LucideIcon;
    label: string;
    description?: string;
    onClose: () => void;
    isExternal?: boolean;
}

const INTERNAL_LINKS: { label: string; to: string; icon: LucideIcon }[] = [
    { label: "Dashboard", to: "/", icon: Home },
    { label: "Explorer", to: "/all", icon: LayoutGrid },
    { label: "Analytics", to: "/analytics", icon: BarChart2 },
    { label: "About", to: "/about", icon: Info },
];

const EXTERNAL_LINKS: { label: string; href: string; icon: LucideIcon }[] = [
    { label: "Homebrew Docs", href: "https://docs.brew.sh", icon: BookOpen },
    { label: "GitHub Repository", href: "https://github.com/amit9838/brewlens", icon: Github },
];

const NavItem = ({ to, href, icon: Icon, label, description, onClose, isExternal = false }: NavItemProps) => {
    const className = cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
        "text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400",
        "hover:bg-green-50 dark:hover:bg-green-500/10 active:scale-[0.98]"
    );

    const content = (
        <>
            <div className="p-2 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/50 transition-colors group-hover:bg-green-100 dark:group-hover:bg-green-500/20">
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div className="min-w-0 flex-1">
                <span className="font-bold text-sm tracking-tight">{label}</span>
                {description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
                )}
            </div>
            {isExternal && (
                <ExternalLink size={14} className="shrink-0 text-zinc-400 transition-colors group-hover:text-green-500" />
            )}
        </>
    );

    if (isExternal && href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClose}>
                {content}
            </a>
        );
    }

    return (
        <NavLink
            to={to || "/"}
            onClick={onClose}
            className={({ isActive }) => cn(
                className,
                isActive && "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
            )}
        >
            {content}
        </NavLink>
    );
};

export const NavDrawer = ({ isOpen, onClose }: NavDrawerProps) => {
    const panelRef = useDrawerBehavior(isOpen, onClose);

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] transition-[opacity,visibility] duration-[250ms]",
                isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            )}
        >
            <div
                aria-hidden
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            <div
                id="app-drawer"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                tabIndex={-1}
                className={cn(
                    "fixed top-0 left-0 h-full w-[320px] max-w-[85vw] outline-none",
                    "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    "bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800",
                    "shadow-[20px_0_50px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.3)]",
                    "flex flex-col p-6",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex justify-between items-center mb-8 pl-1">
                    <NavLink to="/" onClick={onClose} className="flex items-center gap-2">
                        <img src={logo} alt="BrewLens logo" className="w-9 h-9" />
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Brew<span className="font-light opacity-70 ml-0.5">Lens</span>
                        </h2>
                    </NavLink>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </Button>
                </div>

                <nav className="flex-1 space-y-6 overflow-y-auto pr-2">
                    <NavLink
                        to="/installation"
                        onClick={onClose}
                        className="group flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-3 transition-all duration-200 hover:border-green-500/50 hover:bg-green-500/15 active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-center rounded-xl bg-green-100 p-2.5 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                            <Terminal size={18} strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold tracking-tight text-green-700 dark:text-green-400">
                                Installation Guide
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                Set up Homebrew in minutes
                            </div>
                        </div>
                        <ChevronRight
                            size={16}
                            className="shrink-0 text-green-600/60 transition-transform group-hover:translate-x-0.5 dark:text-green-400/60"
                        />
                    </NavLink>

                    <div className="space-y-1.5">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500 mb-3">
                            Navigation
                        </p>
                        {INTERNAL_LINKS.map(link => (
                            <NavItem key={link.label} {...link} onClose={onClose} />
                        ))}
                    </div>

                    <div className="space-y-1.5">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500 mb-3">
                            Resources
                        </p>
                        {EXTERNAL_LINKS.map(link => (
                            <NavItem key={link.label} {...link} onClose={onClose} isExternal />
                        ))}
                    </div>
                </nav>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
                        v0.4.0 · Open source
                    </span>
                    <a
                        href="https://github.com/amit9838/brewlens"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="BrewLens on GitHub"
                        className="text-zinc-400 transition-colors hover:text-green-600 dark:hover:text-green-400"
                    >
                        <Github size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
};
