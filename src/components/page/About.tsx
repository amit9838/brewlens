import { Github, ExternalLink, Heart, BookOpen, Star, Users, GitPullRequest } from 'lucide-react';
import logo from "../../assets/brewlens_logo.png"

const BrewLensAbout = () => {
    const currentYear = new Date().getFullYear();
    const githubLink = "https://github.com/amit9838/brewlens/";

    return (
        <div className="text-zinc-700 dark:text-zinc-200 font-sans selection:bg-amber-500/30 min-h-screen transition-colors duration-300">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.05] dark:bg-amber-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/[0.03] dark:bg-blue-600/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-16 space-y-16">

                {/* Top Section: About & Contribution Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* About Content */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center justify-center rounded-2xl shadow-2xl shadow-amber-500/60 dark:shadow-amber-900/60 mb-2">
                            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-2">
                                <a href="https://github.com/amit9838" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                    <img src="https://avatars.githubusercontent.com/u/61614402?v=4&size=128" alt="Amit" className="w-14 h-14 rounded-2xl border border-zinc-100 dark:border-zinc-800" />
                                </a>
                                <div className="h-10 w-[1px] bg-zinc-100 dark:bg-zinc-800 mx-1"></div>
                                <a href="https://github.com/amit9838/brewlens" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                    <img src={logo} alt="BrewLens" className="w-14 h-14" />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                Brew
                                <span className='font-thin opacity-80'>
                                    Lens
                                </span>
                            </h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                The missing visual interface for Homebrew. Manage your packages,
                                explore new formulae, and monitor your system health with a
                                refined, intuitive GUI.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-xs">
                            <div className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-300">
                                <span className="opacity-60 mr-2">Developer:</span>
                                <span className="font-semibold text-zinc-900 dark:text-white">Amit Chaudhary</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-300">
                                <span className="opacity-60 mr-2">Version:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">v0.4.0</span>
                            </div>
                        </div>
                    </div>

                    {/* Contribution Section */}
                    <div className="relative group w-full max-w-xl mx-auto lg:max-w-none">
                        <div className="absolute -inset-1 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                        <div className="relative bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/50 p-6 md:p-8 rounded-3xl backdrop-blur-xl">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                                        <Heart size={12} className="fill-current" />
                                        Open Source
                                    </div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                                        Built by the community, <br />
                                        <span className="text-amber-600 dark:text-amber-500">for the community.</span>
                                    </h2>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        BrewLens is free and open-source. We welcome contributions—from bug reports to new features.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center gap-0.5">
                                        <Users className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                                        <span className="text-zinc-900 dark:text-white text-sm font-bold">Join Us</span>
                                        <span className="text-[9px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest">Contributors</span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center gap-0.5">
                                        <GitPullRequest className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                                        <span className="text-zinc-900 dark:text-white text-sm font-bold">Welcome</span>
                                        <span className="text-[9px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest">Pull Requests</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                    <a
                                        href="https://github.com/amit9838/brewlens"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-white dark:text-zinc-900 font-bold rounded-xl transition-all hover:translate-y-[-2px] shadow-lg shadow-amber-500/20 text-sm"
                                    >
                                        <Github size={18} />
                                        Contribute
                                    </a>
                                    <a
                                        href="https://github.com/amit9838/brewlens/stargazers"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all hover:translate-y-[-2px] text-sm"
                                    >
                                        <Star size={18} className="text-amber-600 dark:text-amber-500" />
                                        Star
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Community Links */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white whitespace-nowrap">Resources & Help</h2>
                        <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                label: "Homebrew Docs",
                                href: "https://docs.brew.sh/",
                                icon: BookOpen,
                                desc: "Official documentation for the Homebrew package manager."
                            },
                            {
                                label: "Homebrew GitHub",
                                href: "https://github.com/Homebrew",
                                icon: Github,
                                desc: "View the source code and contribute to Homebrew."
                            }
                        ].map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/30 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 shadow-sm dark:shadow-none"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-amber-500/10 transition-colors">
                                        <link.icon className="w-8 h-8 text-zinc-500 dark:text-zinc-400 group-hover:text-amber-600 dark:group-hover:text-amber-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                            {link.label}
                                            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 dark:text-amber-500" />
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                            {link.desc}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 py-12 text-center border-t border-zinc-100 dark:border-zinc-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                        <span>© {currentYear} BrewLens</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></span>
                        <a href={githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">GitHub</a>
                        <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800"></span>
                        <span>Open Source</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 font-bold">
                        Data provided by Homebrew API
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default BrewLensAbout;