import { useState } from "react";
import { useBrewData } from "../../hooks/useBrewData";
import { type BrewItem, type BrewType } from "../../types";
import { useLocation } from "react-router-dom";
import { ExternalLink, Box, Zap, Trash2, Info, Check, Clipboard, InfoIcon, WrenchIcon, Code } from "lucide-react";
import { Share2, ChevronLeft } from 'lucide-react';
import { NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import SkeletonDetails from "./SkeletonDetails";
import { getSourceCodeStatus } from "../../lib/utils";

/**
 * Formats an artifact value for display.
 */
function formatArtifactValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((v) => formatArtifactValue(v)).join(", ");
  }
  if (typeof value === "object" && value !== null) {
    // Check for common brew artifact patterns to avoid [object Object]
    const entries = Object.entries(value);
    if (entries.length > 0) return String(entries[0][1]);
    return JSON.stringify(value);
  }
  return String(value ?? "");
}

export function CaskDetail() {
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const pathSegments = location.pathname.split('/');
  const token = pathSegments[pathSegments.length - 1];
  const type = pathSegments[pathSegments.length - 2] as BrewType;

  const url = `https://formulae.brew.sh/api/${type}/${token}.json`
  const { data = [], isLoading, error } = useBrewData(type, url);

  const item: BrewItem = data[0];

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

  const copyURL = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };


  if (!item) {
    return (
      <>
        {isLoading && <SkeletonDetails />}
        {error && <div className="flex flex-col items-center justify-center p-20 text-gray-500">
          <Info className="mb-4 h-12 w-12 opacity-20" />
          <p className="text-lg">No data found. Try refreshing?</p>
        </div>}
      </>
    );
  }


  const displayName = item.name;
  const description = item.desc || "No description available.";
  const homepage = item.homepage;
  const version = item.version;
  const installCommand = item.installCmd || `brew install --cask ${token}`;

  const raw = item.raw || {};
  const artifacts = raw.artifacts || [];
  const downloadUrl = raw.url || "Not available";
  const sha256 = raw.sha256 || "Not available";


  let monthly = item.raw.analytics.install["30d"][item.token];
  let threeMonthly = item.raw.analytics.install["90d"][item.token];
  let yearly = item.raw.analytics.install["365d"][item.token];

  const getDisplayInstallValue = (value: Number) => {
    if (Number(value) > 1000) {
      return (Number(value) / 1000).toFixed(1).toString() + "K";
    }
    return value.toString();
  }

  const installAnalyticsMap = new Map([
    ["1 month", { "original": monthly, "diaplay": getDisplayInstallValue(monthly) }],
    ["3 months", { "original": threeMonthly, "diaplay": getDisplayInstallValue(threeMonthly) }],
    ["1 year", { "original": yearly, "diaplay": getDisplayInstallValue(yearly) }],
  ]);


  return (
    <div className="min-h-screen p-2  text-gray-800 dark:text-gray-200 font-sans max-[1400px] mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between  mb-4">
        <NavLink
          to={`/`}
        >
          <Button variant="ghost" size="sm">
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Cask Details</span>
          </Button>
        </NavLink>

        {/* Header Action Buttons */}
        <div className="flex gap-2 text-zinc-400">
          <Button
            onClick={() => copyURL()}
            variant="ghost"
            size="sm"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </Button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="sm" >
              <Info size={20} />
            </Button>
          </a>
        </div>
      </div>

      {/* Main Header Card */}
      <header className="mb-6  overflow-hidden rounded-3xl bg-[#376154] dark:bg-[#09271e] p-10 border border-white/5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-zinc-200 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
            {/* Replace with actual icon logic if available */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${item.homepage}&sz=256`}
              alt={item.name[0]}
              className="w-24 h-24 rounded-md" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-bold tracking-widest text-emerald-500/80 uppercase mb-2">
              HOMEBREW CASK: {token}
              {packageStatus(item).isNotInstallable &&
                <span className="float-end rounded-full bg-orange-400/50 text-orange-700 dark:text-orange-100 px-4 py-1.5 text-xs font-bold opacity-70 border border-white/10" >{packageStatus(item).reason}</span>
              }
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
              {displayName}
            </h1>

            <div className=" flex flex-wrap items-center gap-2">
              <div className="group relative flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-5 py-2.5">
                <span className="text-sm pr-1  font-medium text-gray-300">
                  Install:
                </span>
                <code className="text-sm font-semibold text-emerald-400">
                  {installCommand}
                </code>
                <Button
                  onClick={copyCmd.bind(null, item)}
                  variant="glass"
                  size="icon"
                  className="absolute right-[0.15rem] top-[0.15rem] z-10 text-zinc-200 hover:text-zinc-100 px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all" >
                  {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                </Button>
              </div>

              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button isPill={true} variant="glass" className=" text-zinc-200 hover:text-zinc-100" >
                    View Website <ExternalLink size={14} />
                  </Button>
                </a>
              )}

              {getSourceCodeStatus(item).verified && <a
                href={getSourceCodeStatus(item).url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="glass"    >
                  <Code size={20} />Source
                </Button>
              </a>}

            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: About and Artifacts */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <section className="rounded-3xl bg-zinc-100/60 dark:bg-zinc-900 p-8 border border-black/3 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4 pr-2">
              <InfoIcon size={18} className="text-zinc-500 mb-1 opacity-70" />
              <h2 className="text-xl font-semibold">About</h2>
            </div>
            <p className="text-lg opacity-70 leading-relaxed mb-6">
              {description}
            </p>
            <div className="flex gap-4">
              <span className="rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                Version {version}
              </span>
              <span className="rounded-full bg-black/5 dark:bg-white/5 px-4 py-1.5 text-xs font-bold opacity-70 border border-white/10">
                Type: GUI Application
              </span>
              {getSourceCodeStatus(item).isOSS &&
                <span className="rounded-full bg-blue-500/10 text-blue-500 px-4 py-1.5 text-xs font-bold border border-white/10">
                  Open Source
                </span>
              }
            </div>

          </section>

          {/* Included Artifacts Section */}
          <section className="bg-zinc-100/60 dark:bg-zinc-900 p-6 rounded-3xl border border-black/3 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4 pr-2">
              <Box size={18} className="text-zinc-500 mb-1 opacity-70" />
              <h2 className="text-xl font-semibold ">Included Artifacts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {artifacts.map((artifact: any, index: number) => {
                const [type, value] = Object.entries(artifact)[0];
                const Icon =
                  type === "zap" ? Zap : type === "uninstall" ? Trash2 : Box;

                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-zinc-200/50 dark:bg-zinc-800 p-5  flex items-start gap-4"
                  >
                    <div className="mt-1 p-2 rounded-lg bg-white/5 text-gray-800 dark:text-gray-400">
                      <Icon size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                        {type}
                      </p>
                      <p className="text-sm font-medium  truncate whitespace-nowrap">
                        {formatArtifactValue(value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Requirements Section */}
          <section className="rounded-3xl bg-zinc-100/60 dark:bg-zinc-900 p-8 border border-black/3 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4 pr-2">
              <WrenchIcon size={18} className="text-zinc-500 mb-1 opacity-70" />
              <h2 className="text-xl font-semibold ">Requirements</h2>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              OS COMPATIBILITY
            </p>

            <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 border border-blue-500/20">
              macOS{" "}
              {typeof raw.depends_on?.macos === "object"
                ? `${Object.keys(raw.depends_on.macos)[0]} ${Object.values(raw.depends_on.macos)[0]}`
                : raw.depends_on?.macos || ">= 10.15"}
            </span>
          </section>
        </div>

        {/* Right Column: Package Info */}
        <aside className="space-y-6">
          <section className="rounded-3xl bg-zinc-100/60 dark:bg-zinc-900 p-8 border border-black/3 dark:border-white/5 h-full">
            <div className="flex items-center gap-2 mb-4 pr-2">
              <Box size={18} className="text-zinc-500 mb-1 opacity-70" />
              <h2 className="text-xl font-semibold ">Package Info</h2>
            </div>
            <div className="space-y-8 ">
              <div className="rounded-xl bg-zinc-200/50 dark:bg-zinc-800 p-3 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                  DOWNLOAD SOURCE
                </p>
                <a
                  href={downloadUrl}
                  className="text-sm  text-blue-700 dark:text-blue-400 break-all hover:underline leading-relaxed block"
                >
                  {downloadUrl}
                </a>
              </div>

              <div>
                <div className="rounded-xl bg-zinc-200/50 dark:bg-zinc-800 p-3 border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                    SHA256 HASH
                  </p>
                  <code className="text-[11px] text-gray-700 dark:text-gray-300 break-all font-mono leading-tight">
                    {sha256}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 mt-10 pr-2">
              <Box size={18} className="text-zinc-500 mb-1 opacity-70" />
              <h2 className="text-xl font-semibold ">Installs</h2>
            </div>
            <div className="flex gap-2">
              {Array.from(installAnalyticsMap).map(([label, value]) => (
                <div key={label} className="rounded-xl bg-zinc-200/50 dark:bg-zinc-800 p-4 border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                    {label}
                  </p>
                  <p
                    title={value.original}
                    className=" text-gray-700 dark:text-gray-300 break-all text-2xl leading-tight">
                    {value.diaplay}
                  </p>
                </div>
              ))}
            </div>

          </section>
        </aside>
      </div>
    </div >
  );
}
