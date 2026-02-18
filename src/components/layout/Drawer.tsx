import { X, Github, BookOpen, Terminal } from 'lucide-react';
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { NavLink } from "react-router-dom";


interface NavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // Callback to tell the parent (Header) to open the Modal
    onShowInstallGuide: () => void;
}

// Internal component for clean link rendering
const DrawerLink = ({ href, icon: Icon, name, onClose }: { href: string; icon: any; name: string; onClose: () => void }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
        onClick={onClose}
    >
        <Icon className="w-5 h-5 text-green-600" />
        <span>{name}</span>
    </a>
);

export const NavDrawer = ({ isOpen, onClose, onShowInstallGuide }: NavDrawerProps) => {

    // Link Definitions
    const externalLinks = [
        { name: "Official Homebrew Docs", href: "https://docs.brew.sh/", icon: BookOpen },
        { name: "BrewLens GitHub", href: "https://github.com/amit9838/brewlens/", icon: Github },
    ];

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 transition-opacity duration-300",
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            )}
        >
            {/* Backdrop: Closes the drawer when clicking outside */}
            <div
                className="absolute inset-0 h-[100vh] bg-black/80"
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <div
                className={cn(
                    "fixed top-0 left-0 h-full w-80 max-w-full bg-white dark:bg-gray-900 shadow-2xl p-6 transition-transform duration-300 overflow-y-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                role="menu"
                aria-label="Application Menu"
            >
                <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                    {/* <h3 className="text-xl font-bold text-green-600">BrewLens Menu</h3> */}
                    <div className="logo">
                        {/* <span className="bg-green-600 text-white p-2 rounded-lg"><Terminal size={24} /></span> */}
                        <h1 className="text-2xl font-bold">Brew<span className="font-light opacity-70">Lens</span></h1>
                    </div>
                    <Button variant="ghost" onClick={onClose} aria-label="Close menu">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="space-y-4">

                    {/* Action Button: Installation Details */}
                    <NavLink
                        to={`/installation`}
                    >
                        <Button
                            className="flex w-full justify-start font-bold py-3 text-base"
                            variant="primary"
                            onClick={onShowInstallGuide} // Triggers the modal open logic in the parent
                        >
                            <Terminal className="w-5 h-5 mr-3" />
                            <span>
                                Show Installation Guide
                            </span>
                        </Button>
                    </NavLink>

                    <div className="pt-4 space-y-2 border-t border-gray-100 dark:border-gray-800 mt-4">
                        <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider pt-2">
                            Important Links
                        </p>
                        {/* External Links */}
                        {externalLinks.map(link => (
                            <DrawerLink key={link.name} {...link} onClose={onClose} />
                        ))}
                    </div>

                </nav>
            </div>
        </div>
    );
};