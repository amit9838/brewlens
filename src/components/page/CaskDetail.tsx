import { Box, Download, Trash2, Terminal, Zap } from 'lucide-react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { getCategoryForToken, CASK_CATEGORIES } from '../../data/categories';
import { getSourceCodeStatus } from '../../lib/utils';
import { Card, CardTitle, Chip, Eyebrow, PillLink } from '../ui/kit';
import {
    DetailFallback, ExternalLinkPill, Hero, InstallsCard, MoreInCategory, TopBar, useDetailItem,
} from './DetailParts';

/** Flattens Homebrew's nested artifact values into readable strings. */
function flatten(value: unknown): string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.flatMap(flatten);
    if (typeof value === 'object') return Object.values(value as object).flatMap(flatten);
    return [String(value)];
}

const ARTIFACT_LABEL: Record<string, string> = {
    app: 'App', binary: 'Binary', zap: 'Zap / uninstall', uninstall: 'Uninstall', pkg: 'Installer package',
    font: 'Font', suite: 'Suite', manpage: 'Man page', artifact: 'Artifact', preflight: 'Preflight', postflight: 'Postflight',
};
const ARTIFACT_ICON: Record<string, typeof Box> = { zap: Zap, uninstall: Trash2, binary: Terminal };

function macosRequirement(dep: unknown): string {
    if (!dep) return '≥ 10.15';
    if (typeof dep === 'string') return dep;
    const [op, ver] = Object.entries(dep as Record<string, unknown>)[0] ?? [];
    return op ? `${op} ${flatten(ver).join(', ')}` : '≥ 10.15';
}

export function CaskDetail() {
    const { token, apiUrl, item, isLoading, error } = useDetailItem('cask');

    useDocumentMeta({
        title: item ? `${item.name} — Homebrew Cask (${item.version}) | BrewLens` : `${token} — Homebrew Cask | BrewLens`,
        description: item
            ? `${item.desc ?? item.name} — install with "${item.installCmd}". View version, homepage, download URL, and SHA-256 checksum for the ${item.name} Homebrew cask on BrewLens.`
            : `View the ${token} Homebrew cask on BrewLens: version, install command, homepage, download URL, and checksum.`,
    });

    if (!item) return <DetailFallback isLoading={isLoading} error={error} token={token} />;

    const raw = item.raw ?? {};
    const artifacts = (raw.artifacts ?? []).filter((a): a is Record<string, unknown> => !!a && typeof a === 'object');
    const { verified, isFoss, fossUrl } = getSourceCodeStatus(raw, 'cask');
    const categoryId = getCategoryForToken(item, CASK_CATEGORIES);
    const rows = artifacts.flatMap((a) => Object.entries(a)).map(([type, value]) => ({ type, text: flatten(value).join(', ') })).filter((r) => r.text);

    return (
        <div className="flex flex-col gap-10">
            <TopBar item={item} apiUrl={apiUrl} />
            <Hero
                item={item}
                kicker={`Homebrew cask · ${item.token}`}
                categoryId={categoryId}
                links={<>
                    {item.homepage && <ExternalLinkPill href={item.homepage}>Website</ExternalLinkPill>}
                    {verified && fossUrl && <ExternalLinkPill href={fossUrl}>Source</ExternalLinkPill>}
                </>}
            />

            <div className="flex flex-wrap items-start gap-6">
                <div className="flex min-w-0 flex-[3.5_1_560px] flex-col gap-6">
                    <Card>
                        <CardTitle>About</CardTitle>
                        <p className="m-0 text-base leading-[1.6] text-ink-soft">{item.desc}</p>
                        <div className="flex flex-wrap gap-2">
                            <Chip tone="raised">Version {item.version}</Chip>
                            <Chip tone="raised">macOS · Cask</Chip>
                            {isFoss && <Chip tone="oss">Open Source</Chip>}
                        </div>
                    </Card>

                    {rows.length > 0 && (
                        <Card>
                            <CardTitle>Included artifacts</CardTitle>
                            <div className="flex flex-col gap-2">
                                {rows.map((r, i) => {
                                    const Icon = ARTIFACT_ICON[r.type] ?? Box;
                                    return (
                                        <div key={i} className="flex items-center gap-3.5 rounded-2xl bg-raised p-3.5">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-chip"><Icon size={18} /></span>
                                            <div className="min-w-0">
                                                <Eyebrow>{(ARTIFACT_LABEL[r.type] ?? r.type).toUpperCase()}</Eyebrow>
                                                <code className="block truncate font-mono text-sm" title={r.text}>{r.text}</code>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    <Card>
                        <CardTitle>Requirements</CardTitle>
                        <div className="flex items-center gap-2.5 text-[15px]">
                            <Eyebrow>OS COMPATIBILITY</Eyebrow>
                            <Chip tone="raised">macOS {macosRequirement(raw.depends_on?.macos)}</Chip>
                        </div>
                    </Card>
                </div>

                <aside className="flex min-w-0 flex-[1_1_380px] flex-col gap-6">
                    <InstallsCard item={item} />
                    <Card>
                        <CardTitle>Package info</CardTitle>
                        <div>
                            <Eyebrow>SHA-256</Eyebrow>
                            <code className="mt-1.5 block break-all rounded-xl bg-raised p-3 font-mono text-[12.5px] text-muted">{raw.sha256 || 'Not available'}</code>
                        </div>
                        {raw.url && (
                            <PillLink href={raw.url} variant="dark" className="justify-center"><Download size={16} strokeWidth={2.2} />Download installer</PillLink>
                        )}
                    </Card>
                    <MoreInCategory item={item} categoryId={categoryId} />
                </aside>
            </div>
        </div>
    );
}

