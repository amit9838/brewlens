/**
 * @file Drawer.tsx
 * Standardized Navigation Sidebar/Drawer.
 * Implements modern UI patterns with backdrop blurs and premium styling.
 */
import { X, Github, BookOpen, Terminal, Info, Home, LayoutGrid, BarChart2 } from 'lucide-react';
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/brewlens_logo.png";

interface NavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Standardized link component for both internal and external navigation.
 */
const NavItem = ({ 
    to, 
    href, 
    icon: Icon, 
    label, 
    onClose,
    isExternal = false 
}: { 
    to?: string; 
    href?: string; 
    icon: any; 
    label: string; 
    onClose: () => void;
    isExternal?: boolean;
}) => {
    const className = cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
        "text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400",
        "hover:bg-green-50 dark:hover:bg-green-500/10 active:scale-[0.98]"
    );

    const content = (
        <>
            <div className="p-2 rounded-lg bg-gray-100/80 dark:bg-zinc-800/50 group-hover:bg-green-100 dark:group-hover:bg-green-500/20 transition-colors">
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="font-bold text-sm tracking-tight">{label}</span>
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
    const internalLinks = [
        { label: "Dashboard", to: "/", icon: Home },
        { label: "Explorer", to: "/all", icon: LayoutGrid },
        { label: "Analytics", to: "/analytics", icon: BarChart2 },
        { label: "About", to: "/about", icon: Info },
    ];

    const externalLinks = [
        { label: "Homebrew Docs", href: "https://docs.brew.sh/", icon: BookOpen },
        { label: "Homebrew GitHub", href: "https://github.com/Homebrew", icon: Github },
        { label: "BrewLens GitHub", href: "https://github.com/amit9838/brewlens/", icon: Github },
    ];

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] transition-all duration-300",
                isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            )}
        >
            {/* Dark Overlay (No Blur) */}
            <div
                className="absolute inset-0 bg-black/60 cursor-pointer"
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <div
                className={cn(
                    "fixed top-0 left-0 h-full w-[320px] max-w-[85vw] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                    "bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800",
                    "shadow-[20px_0_50px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.3)]",
                    "flex flex-col p-6",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header / Logo */}
                <div className="flex justify-between items-center mb-8 pl-1">
                    <Link to="/" onClick={onClose} className="flex items-center gap-2">
                        <img src={logo} alt="BrewLens logo" className="w-9 h-9" />
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Brew<span className="font-light opacity-70 ml-0.5">Lens</span>
                        </h2>
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose} 
                        className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </Button>
                </div>

                {/* Primary Navigation */}
                <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="mb-8">
                        <NavItem to="/installation" label="Installation Guide" icon={Terminal} onClose={onClose} />
                    </div>

                    <div className="space-y-1.5">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-zinc-500 mb-3">
                            Navigation
                        </p>
                        {internalLinks.map(link => (
                            <NavItem key={link.label} {...link} onClose={onClose} />
                        ))}
                    </div>

                    <div className="pt-6 space-y-1.5">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-zinc-500 mb-3">
                            Community & Help
                        </p>
                        {externalLinks.map(link => (
                            <NavItem key={link.label} {...link} isExternal onClose={onClose} />
                        ))}
                    </div>
                </nav>

                {/* Footer / Version Info */}
                <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                    <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/50">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                            BrewLens helps you explore and manage your Homebrew ecosystem with ease.
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-gray-400">
                            <span>v0.4.0</span>
                            <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                Stable
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};