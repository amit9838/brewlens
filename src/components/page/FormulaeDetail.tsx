import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { ExternalLink, Info, Share2, ChevronLeft, Check, Clipboard, Box } from 'lucide-react';
import type { BrewItem } from '../../types';
import { NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";


export const Tag = ({ label }: { label: string | null }) => {
    return (
        <span
            className={cn(
                "bg-zinc-300 text-zinc-700 px-4 py-1.5 rounded-full text-sm",
                "dark:bg-zinc-800 dark:text-zinc-300",
                "border border-black/5 dark:border-white/5",
                "transition-colors cursor-default",
                !label && "opacity-50 italic"
            )}
        >
            {label ?? "None"}
        </span>
    );
};


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
        <div className="min-h-screen text-zinc-800 dark:text-zinc-100 p-2 font-sans">
            <div className="max-[1400px] mx-auto space-y-6">
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between mb-4">
                    <NavLink
                        to={`/brewlens`}
                    >
                        <Button variant="ghost" size="sm">
                            <ChevronLeft size={20} />
                            <span className="text-sm font-medium">Formula Details</span>
                        </Button>
                    </NavLink>
                    <div className="flex gap-4 text-zinc-900 dark:text-zinc-200 opacity-70">
                        <Share2 size={20} className="cursor-pointer hover:opacity-100" />
                        <Info size={20} className="cursor-pointer hover:opacity-100" />
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-[#8d655c] dark:bg-[#3d1a12] text-zinc-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-zinc-200  rounded-2xl flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
                        {/* Replace with actual icon logic if available */}
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${data.homepage}&sz=256`}
                            alt={name[0]}
                            className="w-24 h-24 rounded-md" />
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
                            <div className=" flex flex-wrap items-center gap-2">
                                <div className="group relative flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-5 py-2.5">
                                    <span className="text-sm font-medium text-gray-300">
                                        Install Command:
                                    </span>
                                    <code className="text-sm font-semibold text-emerald-400">
                                        {installCmd}
                                    </code>
                                    <Button
                                        onClick={copyCmd.bind(null, data)}
                                        variant="glass"
                                        size="icon"
                                        className="absolute right-[0.15rem] top-[0.15rem] z-10 text-zinc-200 hover:text-zinc-100 px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all" >
                                        {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                            <a
                                href={`https://formulae.brew.sh/api/formula/${data.token}.json`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="glass">
                                    JSON <ExternalLink size={14} />
                                </Button>
                            </a>
                            {"|"}
                            {homepage && (
                                <a
                                    href={homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="glass">
                                        Visit Homepage <ExternalLink size={14} />
                                    </Button>
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
                            <div className="flex items-center gap-2 mb-6 pr-2">
                                <Info size={18} className="text-orange-600 mb-1 opacity-50" />
                                <h2 className="text-xl font-semibold  text-zinc-700 dark:text-zinc-300">Dependencies</h2>
                            </div>
                            <p className="text-xl  mb-6 leading-relaxed opacity-70">
                                {description || 'No description available.'}
                            </p>
                            <div className="flex flex-wrap gap-3 cursor-default">
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
                            <div className="flex items-center gap-2 mb-4 pr-2">
                                <Box size={18} className="text-orange-600 mb-1 opacity-50" />
                                <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">Dependencies</h2>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <div className="text-[10px] font-bold tracking-widest opacity-90 uppercase mb-3">RUNTIME</div>
                                    <div className="flex flex-wrap gap-2">
                                        {runtimeDeps.length > 0 ? runtimeDeps.map((dep: string) => (
                                            <Tag key={dep} label={dep}></Tag>
                                        )) : <Tag label={null}></Tag>}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-bold tracking-widest opacity-90 uppercase mb-3">BUILD ONLY</div>
                                    <div className="flex flex-wrap gap-2">
                                        {buildDeps.length > 0 ? buildDeps.map((dep: string) => (
                                            <Tag key={dep} label={dep}></Tag>
                                        )) : <Tag label={null}></Tag>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Technical Details */}
                    <div className="bg-zinc-200 dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/5 h-fit">
                        <div className="flex items-center gap-2 mb-6 pr-2">
                            <Info size={18} className="text-orange-600 mb-1 opacity-50" />
                            <h2 className="text-xl font-semibold  text-zinc-700 dark:text-zinc-300">Technical Details</h2>
                        </div>
                        <div className="space-y-3 px-1">
                            <table className="w-full">
                                <tbody>
                                    {Object.entries({
                                        "Revision": revision,
                                        "Keg Only": kegOnly,
                                        "Tap": data.raw.tap,
                                        "Bottle": hasBottle
                                    }).map(([key, value], index) => (
                                        <tr key={index} className="h-7">
                                            <td className="opacity-70 text-sm w-1/2">{key}</td>
                                            <td className="text-sm font-semibold ">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default FormulaeDetail;