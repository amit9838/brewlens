import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, Copy, Download, Github } from 'lucide-react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { Chip, PillLink, SectionHead } from '../ui/kit';
import logo from '../../assets/brewlens_logo.png';

const FACTS = [
    ['Developer', 'Amit Chaudhary'],
    ['Version', 'v0.4.0'],
    ['License', 'MIT'],
    ['Data', 'Homebrew API'],
];

const FEATURES = [
    { icon: Download, title: 'Live Homebrew data', text: 'Packages, versions and install analytics come straight from the official Homebrew API at formulae.brew.sh.' },
    { icon: Copy, title: 'Copy, paste, install', text: 'Every cask and formula page gives you the exact brew command, plus homepage, source and checksum.' },
    { icon: Bookmark, title: 'Yours, in the browser', text: 'Bookmarks and recently viewed apps are saved in your browser. No account needed.' },
];

const RESOURCES = [
    { href: 'https://docs.brew.sh/', title: 'Homebrew Docs', desc: 'Official documentation for the Homebrew package manager.' },
    { href: 'https://github.com/Homebrew', title: 'Homebrew GitHub', desc: 'View the source code and contribute to Homebrew.' },
    { to: '/installation', title: 'Install Homebrew', desc: 'Step-by-step guide for macOS, Linux and WSL.' },
];

export default function About() {
    useDocumentMeta({
        title: 'About BrewLens — Open-Source Homebrew Explorer',
        description: 'BrewLens is a free, MIT-licensed, open-source Homebrew explorer by Amit Chaudhary. Learn how it works, its data sources, and how to contribute.',
    });

    return (
        <>
            <section aria-labelledby="ab-title" className="flex flex-wrap items-center gap-8 rounded-[32px] bg-[#111114] p-10 text-white">
                <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="BrewLens logo" className="h-14 w-14 rounded-2xl" />
                        <Chip tone="dark">Open source · MIT licensed</Chip>
                    </div>
                    <h1 id="ab-title" className="m-0 text-[clamp(36px,5vw,56px)] font-extrabold leading-none tracking-[-0.04em]">About BrewLens</h1>
                    <p className="m-0 max-w-[560px] text-lg leading-[1.55] text-zinc-300">
                        A free, open-source web GUI for Homebrew. Browse and search every cask and formula, with versions, install commands and checksums in one place.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2.5">
                        <PillLink href="https://github.com/amit9838/brewlens" variant="accent"><Github size={18} />View on GitHub</PillLink>
                        <PillLink to="/all" className="border-0 bg-[#2A2A2F] text-white hover:bg-[#3a3a40]">Start exploring</PillLink>
                    </div>
                </div>
                <dl className="m-0 grid min-w-[280px] flex-[1_1_280px] grid-cols-2 gap-2.5">
                    {FACTS.map(([k, v]) => (
                        <div key={k} className="rounded-[18px] bg-[#1E1E22] p-[18px]">
                            <dt className="text-[13px] text-zinc-400">{k}</dt>
                            <dd className="m-0 mt-1 text-[17px] font-bold">{v}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="flex flex-col gap-4">
                <SectionHead eyebrow="What BrewLens does" title="How it works" />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="flex flex-col gap-4 rounded-3xl bg-surface p-6">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-accent-tint-ink"><f.icon size={20} /></span>
                            <div>
                                <h3 className="m-0 text-lg font-bold">{f.title}</h3>
                                <p className="mb-0 mt-1.5 text-[15px] leading-[1.55] text-ink-soft">{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-wrap items-center gap-6 rounded-[28px] bg-accent-soft p-8">
                <div className="min-w-0 flex-[1_1_420px]">
                    <div className="text-[15px] font-semibold text-accent-tint-ink">Built for the community</div>
                    <h2 className="mb-0 mt-1 text-[30px] font-extrabold tracking-[-0.025em]">Join us</h2>
                    <p className="mb-0 mt-2 text-base leading-[1.55] text-ink-soft">Contributors are welcome. Pull requests, bug reports and ideas all help BrewLens get better.</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <PillLink href="https://github.com/amit9838/brewlens/pulls" variant="dark">Open a pull request</PillLink>
                    <PillLink href="https://github.com/amit9838/brewlens/issues" variant="outline">Report an issue</PillLink>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <SectionHead eyebrow="Official Homebrew resources" title="Resources & help" />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
                    {RESOURCES.map((r) => {
                        const inner = (
                            <>
                                <span className="flex-1"><span className="block text-[17px] font-bold">{r.title}</span><span className="mt-0.5 block text-sm text-muted">{r.desc}</span></span>
                                <ArrowUpRight size={16} />
                            </>
                        );
                        const cls = 'flex items-center gap-4 rounded-[22px] p-[22px] text-ink no-underline shadow-[0_0_0_1px_var(--line)] hover:bg-surface hover:text-ink';
                        return r.href
                            ? <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                            : <Link key={r.title} to={r.to!} className={cls}>{inner}</Link>;
                    })}
                </div>
            </section>
        </>
    );
}
