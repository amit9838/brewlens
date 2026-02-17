'use client';

import { Formula } from '@/src/types/homebrew';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';

import {
  ExternalLink, Package, GitBranch, AlertTriangle,
  Hash, ChevronLeft, Share2, Info, CheckCircle2,
} from 'lucide-react';

interface FormulaDetailProps {
  formula: Formula;
}

export function FormulaDetail({ formula }: FormulaDetailProps) {
  return (
    <div className="min-h-screen bg-[#FDF8F3] dark:bg-zinc-950 pb-12 font-sans text-zinc-900 dark:text-zinc-100">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="block h-full">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-300/10 cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          </Link>
          <span className="text-xl font-medium">Formula Details</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full"><Info className="w-5 h-5" /></Button>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section - Expressive Card */}
        <section className="bg-[#EFB08C] dark:bg-orange-900/40 rounded-[32px] p-8 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm">
            {/* <Package className="w-12 h-12 text-[#8F4E2D] dark:text-orange-200" /> */}
            <img
              className="w-16 h-16 rounded-lg text-[#8F4E2D] dark:text-orange-200"
              src={`https://www.google.com/s2/favicons?domain=${formula.homepage}&sz=64`}
              alt="" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold tracking-wider uppercase opacity-80 mb-1">
              Homebrew Formula: {formula.name}@{formula.version}
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {formula.full_name}
            </h2>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center bg-white/90 dark:bg-zinc-900/90 rounded-full px-4 py-2 text-sm font-mono shadow-sm">
                <span className="opacity-60 mr-2">Install Command &gt;</span>
                brew install {formula.name}
              </div>
              {formula.homepage && (
                <Button variant="secondary" className="rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-50" asChild>
                  <a href={formula.homepage} target="_blank" rel="noopener noreferrer">
                    Visit Homepage <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Overview Card */}
            <Card className="border-none shadow-none bg-white dark:bg-zinc-900 rounded-[28px]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Overview</h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {formula.desc || "No description available for this formula."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {formula.license && (
                    <Badge variant="outline" className="bg-[#E8F5E9] text-[#2E7D32] border-none px-3 py-1">
                      License: {formula.license}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-[#E3F2FD] text-[#1565C0] border-none px-3 py-1">
                    Version: {formula.version}
                  </Badge>
                  {formula.versions.bottle && (
                    <Badge variant="outline" className="bg-[#F3E5F5] text-[#7B1FA2] border-none px-3 py-1 flex gap-1">
                      Bottle: Yes <CheckCircle2 className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dependencies Card */}
            <Card className="border-none shadow-none bg-white dark:bg-zinc-900 rounded-[28px]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Dependencies</h3>
                <div className="space-y-6">
                  {formula.dependencies.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wide">Runtime</p>
                      <div className="flex flex-wrap gap-2">
                        {formula.dependencies.map((dep) => (
                          <Badge key={dep} className="rounded-full px-4 py-1.5 bg-[#D1E5F4] text-zinc-800 hover:bg-[#D1E5F4] border-none">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {formula.build_dependencies.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wide">Build Only</p>
                      <div className="flex flex-wrap gap-2">
                        {formula.build_dependencies.map((dep) => (
                          <Badge key={dep} className="rounded-full px-4 py-1.5 bg-[#B2DFDB] text-zinc-800 hover:bg-[#B2DFDB] border-none">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supporting Panel (Sidebar) */}
          <div className="space-y-6">
            <Card className="border-none shadow-none bg-white dark:bg-zinc-900 rounded-[28px]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Technical Details</h3>
                <dl className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <dt className="text-zinc-500">License</dt>
                    <dd className="font-medium">{formula.license || 'Unknown'}</dd>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <dt className="text-zinc-500">Revision</dt>
                    <dd className="font-mono">{formula.revision}</dd>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <dt className="text-zinc-500">Keg Only</dt>
                    <dd className="font-medium">{formula.keg_only ? 'Yes' : 'No'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* SHA256 / Security */}
            {formula.sha256 && (
              <Card className="border-none shadow-none bg-white dark:bg-zinc-900 rounded-[28px]">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Security</h3>
                  <p className="text-xs font-medium text-zinc-500 mb-2 uppercase">SHA256 Checksum</p>
                  <code className="text-[10px] break-all bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl block leading-tight">
                    {formula.sha256}
                  </code>
                </CardContent>
              </Card>
            )}

            {/* Status Alerts */}
            {(formula.deprecated || formula.disabled) && (
              <div className="bg-[#F9DEDC] dark:bg-red-900/20 text-[#410002] dark:text-red-200 p-6 rounded-[28px] flex gap-4 items-start">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest mb-1">Status Alert</h4>
                  <p className="text-sm">
                    {formula.deprecated && `Deprecated ${formula.deprecation_date ? `since ${formula.deprecation_date}` : ''}`}
                    {formula.disabled && `Disabled ${formula.disable_date ? `since ${formula.disable_date}` : ''}`}
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