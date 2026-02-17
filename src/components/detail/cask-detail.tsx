'use client';

import { Cask } from "@/src/types/homebrew";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import Link from 'next/link';

import {
  ExternalLink, Package, Download, Hash,
  AlertTriangle, ChevronLeft, Share2, Info,
  Monitor, Layers
} from "lucide-react";

interface CaskDetailProps {
  cask: Cask;
}

export function CaskDetail({ cask }: CaskDetailProps) {
  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-zinc-950 pb-12 font-sans text-zinc-900 dark:text-zinc-100">
      {/* Top App Bar */}
      {/* {console.log(cask)} */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="block h-full">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-300/10 cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <span className="text-xl font-medium">Cask Details</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full"><Info className="w-5 h-5" /></Button>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section - Expressive Card for Casks */}
        <section className="bg-[#B2DFDB] dark:bg-teal-900/40 rounded-[32px] p-8 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm">
            {/* <Monitor className="w-12 h-12 text-[#00695C] dark:text-teal-200" /> */}
            <img
              className="w-16 h-16 rounded-lg text-[#8F4E2D] dark:text-orange-200"
              src={`https://www.google.com/s2/favicons?domain=${cask.homepage}&sz=64`}
              alt="" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold tracking-wider uppercase opacity-70 mb-1">
              Homebrew Cask: {cask.token}
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {cask.name[0] || cask.token}
            </h2>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center bg-white/90 dark:bg-zinc-900/90 rounded-full px-5 py-2.5 text-sm font-mono shadow-sm border border-teal-200/50">
                <span className="opacity-60 mr-2">Install &gt;</span>
                brew install --cask {cask.token}
              </div>
              {cask.homepage && (
                <Button variant="secondary" className="rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-50 shadow-sm" asChild>
                  <a href={cask.homepage} target="_blank" rel="noopener noreferrer">
                    View Website <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Overview & Description */}
            <Card className="border-none shadow-none bg-white dark:bg-zinc-900 rounded-[28px]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {cask.desc || "A macOS application distributed via Homebrew Casks."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-[#E0F2F1] text-[#00796B] border-none px-4 py-1.5 rounded-full">
                    Version {cask.version}
                  </Badge>
                  <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-none px-4 py-1.5 rounded-full">
                    Type: GUI Application
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Artifacts - Expressive List */}
            {cask.artifacts && (
              <Card className="border-none shadow-none bg-white dark:bg-zinc-900 rounded-[28px]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4 text-[#00695C]">
                    <Layers className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">Included Artifacts</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cask.artifacts.map((artifact, index) => {
                      const isString = typeof artifact === "string";
                      const type = isString ? "File" : Object.keys(artifact)[0];
                      const val = isString ? artifact : artifact[type];

                      return (
                        <div key={index} className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                          <Package className="w-5 h-5 opacity-40" />
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50">{type}</p>
                            <p className="text-sm font-medium truncate max-w-[180px]">{String(val)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dependencies (Cask Specific) */}
            {cask.depends_on && (
              <Card className="border-none shadow-none bg-white dark:bg-zinc-900 rounded-[28px]">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                  <div className="space-y-6">
                    {cask.depends_on.macos && (
                      <div>
                        <p className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wide">OS Compatibility</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(cask.depends_on.macos).map(([k, v]) => (
                            <Badge key={k} className="rounded-full px-4 py-1.5 bg-blue-50 text-blue-700 border-none">
                              macOS {k}: {String(v)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {(cask.depends_on.formula || cask.depends_on.cask) && (
                      <div>
                        <p className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wide">Required Software</p>
                        <div className="flex flex-wrap gap-2">
                          {cask.depends_on.formula?.map(f => (
                            <Badge key={f} className="rounded-full px-4 py-1.5 bg-zinc-100 text-zinc-800 border-none">
                              {f} (Formula)
                            </Badge>
                          ))}
                          {cask.depends_on.cask?.map(c => (
                            <Badge key={c} className="rounded-full px-4 py-1.5 bg-zinc-100 text-zinc-800 border-none">
                              {c} (Cask)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar / Technical Column */}
          <div className="space-y-6">
            <Card className="border-none shadow-none bg-white dark:bg-zinc-900 rounded-[28px]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Package Info</h3>
                <div className="space-y-4">
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                    <p className="text-xs font-bold opacity-50 uppercase mb-2">Download Source</p>
                    <a href={cask.url} className="text-sm text-teal-600 dark:text-teal-400 break-all hover:underline flex items-start gap-1">
                      {cask.url} <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                    </a>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                    <p className="text-xs font-bold opacity-50 uppercase mb-2">SHA256 Hash</p>
                    <code className="text-[10px] break-all block leading-tight opacity-80">{cask.sha256}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deprecation Warning */}
            {(cask.deprecated || cask.disabled) && (
              <div className="bg-[#FFDAD6] dark:bg-red-900/30 text-[#410002] dark:text-red-100 p-6 rounded-[28px] flex gap-4 items-start border border-red-200 dark:border-red-900/50">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Status Alert</h4>
                  <p className="text-sm">
                    This cask is {cask.deprecated ? 'deprecated' : 'disabled'}.
                    {cask.deprecation_date && <span className="block opacity-70 mt-1">Effective: {cask.deprecation_date}</span>}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}