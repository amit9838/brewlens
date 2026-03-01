import { Github, ExternalLink, Heart } from 'lucide-react';
import logo from "../../assets/brewlens_logo.png"



const BrewLensAbout = () => {
    const currentYear = new Date().getFullYear();
    const githubLink = "https://github.com/amit9838/brewlens/";

    return (
        <div className="text-slate-200 font-sans selection:bg-amber-500/30">
            {/* Hero Section */}
            <section className="relative pt-5 pb-16 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 blur-[120px] rounded-full" />

                <div className="relative z-10 flex flex-col items-center bg-transparent">
                    <div className="inline-flex items-center justify-center   bg-grsadient-to-br from-amber-400 to-orange-600 rounded-full shadow-2xl shadow-amber-900/20 mb-6">
                        <a href="https://github.com/amit9838" target="_blank" rel="noopener noreferrer">
                            <img src="https://avatars.githubusercontent.com/u/61614402?v=4&size=128" alt="" className="w-20 h-20 rounded-2xl" />
                        </a>
                        <div className="h-15 divider  border-r-[1px] border-slate-500 mx-2 bg-transparent "></div>
                        <a href="https://github.com/amit9838/brewlens" target="_blank" rel="noopener noreferrer">
                            <img src={logo} alt="BrewLens Logo" className="w-20 h-20" />
                        </a>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight dark:text-white text-zinc-700 mb-4">
                        Brew
                        <span className='font-thin'>
                            Lens
                        </span>
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-slate-400 leading-relaxed">
                        The missing visual interface for Homebrew. Manage your packages,
                        explore new formulae, and monitor your system health with a
                        refined, intuitive GUI.
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <span className="text-stone-600 dark:text-zinc-300">Developer :</span>
                        <span className="font-semibold text-stone-800 dark:text-zinc-100">Amit Chaudhary</span>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <main className="max-w-5xl mx-auto px-6 pb-24 space-y-20">

                {/* Contribution Section */}
                <section className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-8 rounded-r-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-zinc-700 dark:text-white flex items-center gap-2">
                                Open Source <Heart className="fill-amber-500 text-amber-500" size={20} />
                            </h2>
                            <p className="text-slate-400">
                                BrewLens is free and open-source. Created by <strong>amit9838</strong> and the community.
                            </p>
                        </div>
                        <a
                            href="https://github.com/amit9838/brewlens"
                            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium whitespace-nowrap"
                        >
                            Become a contributor <ExternalLink size={16} />
                        </a>
                    </div>
                </section>
            </main>

            {/* Footer */}
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
        </div>
    );
};

export default BrewLensAbout;