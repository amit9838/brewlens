import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { ExternalLink, Info, Share2, ChevronLeft } from 'lucide-react';
import type { BrewItem } from '../../types';
import { NavLink } from "react-router-dom";
import { Check, Copy } from "lucide-react";


export const FormulaeDetail = () => {
    const [copied, setCopied] = useState(false);
    const location = useLocation();
    const data = location.state?.caskData as BrewItem | undefined;

    if (!data) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-400">
                No formula data found. Try refreshing?
            </div>
        );
    }

    const raw = data.raw;
    const tap = (raw.tap || 'homebrew/core').toUpperCase();
    const name = data.name;
    const installCmd = data.installCmd || `brew install ${data.token}`;
    const homepage = data.homepage || raw.homepage;
    const description = data.desc || raw.desc;
    const license = raw.license || 'N/A';
    const version = raw.versions?.stable || raw.version || data.version;
    const hasBottle = raw.bottle ? 'Yes' : 'No';
    const revision = raw.revision ?? '0';
    const kegOnly = raw.keg_only ? 'Yes' : 'No';

    const runtimeDeps = raw.dependencies || [];
    const buildDeps = raw.build_dependencies || [];

    const packageStatus = (item: BrewItem) => {
        const isNotInstallable = (item.deprecated || item.disabled);
        const reason = item.deprecated ? "Deprecated" : item.disabled ? "Disabled" : "unknown";
        return { isNotInstallable, reason };
    }

    const copyCmd = (item: BrewItem) => {
        navigator.clipboard.writeText(item.installCmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };


    return (
        <div className="min-h-screen text-zinc-800 dark:text-zinc-100 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between mb-4">
                    <NavLink
                        to={`/brewlens`}
                    >
                        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                            <ChevronLeft size={20} />
                            <span className="text-sm font-medium">Formula Details</span>
                        </button>
                    </NavLink>
                    <div className="flex gap-4 text-zinc-900 dark:text-zinc-200 opacity-70">
                        <Share2 size={20} className="cursor-pointer hover:opacity-100" />
                        <Info size={20} className="cursor-pointer hover:opacity-100" />
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-[#8d655c] dark:bg-[#3d1a12] text-zinc-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-zinc-200 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                        {/* Replace with actual icon logic if available */}
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${data.homepage}&sz=64`}
                            alt={name[0]}
                            className="opacity-80 invert rounded-md" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="text-[10px] tracking-widest font-bold text-zinc-300 mb-2 uppercase">
                            HOMEBREW FORMULA: {tap}
                            {packageStatus(data).isNotInstallable &&
                                <span className="float-end rounded-full bg-orange-500/70 text-white px-4 py-1.5 text-xs font-bold opacity-70 border border-white/10" >{packageStatus(data).reason}</span>
                            }
                        </div>
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">{name}</h1>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="flex items-center bg-black/40 rounded-full pl-4 pr-1 py-1.5 border border-black/5 dark:border-white/5">
                                <span className="text-xs text-zinc-400 mr-2">Install Command {'>'}</span>
                                <code className="text-xs font-mono bg-transparent text-white px-2 py-1">
                                    {installCmd}
                                </code>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-xs font-medium border border-white/10">
                                <button onClick={copyCmd.bind(null, data)} className="px-3">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <a
                                href={`https://formulae.brew.sh/api/formula/${data.token}.json`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-xs font-medium border border-white/10"
                            >
                                JSON <ExternalLink size={14} />
                            </a>
                            {"|"}
                            {homepage && (
                                <a
                                    href={homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-xs font-medium border border-white/10"
                                >
                                    Visit Homepage <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Overview & Dependencies */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview Card */}
                        <div className="bg-zinc-200 dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/5">
                            <h2 className="text-xl font-semibold mb-4 text-zinc-700 dark:text-zinc-300">Overview</h2>
                            <p className="text-xl  mb-6 leading-relaxed opacity-70">
                                {description || 'No description available.'}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <div className="bg-[#abcbbc]  dark:bg-[#122512] text-[#0d520d] dark:text-[#a7f3d0] px-3 py-1 rounded-full text-xs font-medium border border-[#3e5a3e]/10">
                                    License: {license}
                                </div>
                                <div className="bg-[#86a3d2a7] dark:bg-[#0f1a2c] text-[#164fad] dark:text-[#93c5fd] px-3 py-1 rounded-full text-xs font-medium border border-[#334155]/10">
                                    Version: {version}
                                </div>
                                <div className=" bg-[#d2b4d9bd] dark:bg-[#3b2341] text-[#ad40c8] dark:text-[#f5d0fe] px-3 py-1 rounded-full text-xs font-medium border border-[#583361]/10">
                                    Bottle: {hasBottle}
                                </div>
                            </div>
                        </div>

                        {/* Dependencies Card */}
                        <div className="bg-zinc-200 dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/5">
                            <h2 className="text-xl font-semibold mb-6 opacity-70">Dependencies</h2>
                            <div className="space-y-8">
                                <div>
                                    <div className="text-[10px] font-bold tracking-widest opacity-90 uppercase mb-3">RUNTIME</div>
                                    <div className="flex flex-wrap gap-2">
                                        {runtimeDeps.length > 0 ? runtimeDeps.map((dep: string) => (
                                            <span key={dep} className="bg-[#262626] hover:bg-[#323232] text-zinc-300 px-4 py-1.5 rounded-full text-sm border border-black/5 dark:border-white/5 transition-colors cursor-default">
                                                {dep}
                                            </span>
                                        )) : <span className="opacity-50 text-sm italic">None</span>}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-bold tracking-widest opacity-90 uppercase mb-3">BUILD ONLY</div>
                                    <div className="flex flex-wrap gap-2">
                                        {buildDeps.length > 0 ? buildDeps.map((dep: string) => (
                                            <span key={dep} className="bg-[#262626] hover:bg-[#323232] text-zinc-300 px-4 py-1.5 rounded-full text-sm border border-black/5 dark:border-white/5 transition-colors cursor-default">
                                                {dep}
                                            </span>
                                        )) : <span className="opacity-50 text-sm italic">None</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Technical Details */}
                    <div className="bg-zinc-200 dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/5 h-fit">
                        <h2 className="text-xl font-semibold mb-6 opacity-70">Technical Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-black/5 dark:border-white/5">
                                <span className="opacity-90 text-sm">License</span>
                                <span className="text-sm font-medium">{license}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-black/5 dark:border-white/5">
                                <span className="opacity-90 text-sm">Revision</span>
                                <span className="text-sm font-medium">{revision}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="opacity-90 text-sm">Keg Only</span>
                                <span className="text-sm font-medium">{kegOnly}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default FormulaeDetail;