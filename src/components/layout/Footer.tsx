// src/components/layout/Footer.tsx

import { Github } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const githubLink = "https://github.com/amit9838/brewlens/";

    return (
        // Styled to be at the bottom, providing padding and a separator border
        <footer className="mt-auto pt-8 pb-4 text-center text-gray-500 text-sm border-t border-gray-200 dark:border-gray-800/50">

            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                <p className="font-semibold text-gray-600 dark:text-gray-300">
                    © {currentYear} BrewLens
                </p>

                {/* Separator */}
                <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>

                {/* GitHub Link */}
                <a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
                    aria-label="Visit BrewLens GitHub Page"
                >
                    <Github className="w-4 h-4" />
                    Project Page
                </a>
            </div>

            <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                Data provided by Homebrew API
            </p>
        </footer>
    );
};