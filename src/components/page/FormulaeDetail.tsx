import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { getCategoryForToken, FORMULA_CATEGORIES } from '../../data/categories';
import { getSourceCodeStatus } from '../../lib/utils';
import { Card, CardTitle, Chip, Eyebrow, PillLink } from '../ui/kit';
import {
    DetailFallback, ExternalLinkPill, Hero, InstallsCard, MoreInCategory, TopBar, useDetailItem,
} from './DetailParts';

const DepChips = ({ deps }: { deps: string[] }) =>
    deps.length === 0 ? (
        <span className="text-sm text-muted">None</span>
    ) : (
        <div className="flex flex-wrap gap-2">
            {deps.map((d) => (
                <Link key={d} to={`/formula/${d}`} className="no-underline">
                    <Chip tone="raised" mono className="hover:bg-chip">{d}</Chip>
                </Link>
            ))}
        </div>
    );

export const FormulaeDetail = () => {
    const { token, apiUrl, item, isLoading, error } = useDetailItem('formula');

    useDocumentMeta({
        title: item ? `${item.name} — Homebrew Formula (${item.version}) | BrewLens` : `${token} — Homebrew Formula | BrewLens`,
        description: item
            ? `${item.desc ?? item.name} — install with "${item.installCmd}". View version, homepage, dependencies, and install command for the ${item.name} Homebrew formula on BrewLens.`
            : `View the ${token} Homebrew formula on BrewLens: description, version, install command, homepage, and dependencies.`,
    });

    if (!item) return <DetailFallback isLoading={isLoading} error={error} token={token} />;

    const raw = item.raw ?? {};
    const tap: string = raw.tap || 'homebrew/core';
    const version = raw.versions?.stable || raw.version || item.version;
    const runtimeDeps: string[] = raw.dependencies ?? [];
    const buildDeps: string[] = raw.build_dependencies ?? [];
    const sourceUrl: string | undefined = raw.urls?.stable?.url;
    const { verified, isFoss, fossUrl } = getSourceCodeStatus(raw, 'formula');
    const categoryId = getCategoryForToken(item, FORMULA_CATEGORIES);

    const tech: [string, string][] = [
        ['Revision', String(raw.revision ?? 0)],
        ['Keg only', raw.keg_only ? 'Yes' : 'No'],
        ['Tap', tap],
        ['Bottle', raw.bottle ? 'Yes' : 'No'],
    ];

    return (
        <div className="flex flex-col gap-10">
            <TopBar item={item} apiUrl={apiUrl} />
            <Hero
                item={item}
                kicker={`Homebrew formula · ${tap}`}
                categoryId={categoryId}
                links={<>
                    {item.homepage && <ExternalLinkPill href={item.homepage}>Homepage</ExternalLinkPill>}
                    {verified && fossUrl && <ExternalLinkPill href={fossUrl}>Source</ExternalLinkPill>}
                </>}
            />

            <div className="flex flex-wrap items-start gap-6">
                <div className="flex min-w-0 flex-[3.5_1_560px] flex-col gap-6">
                    <Card>
                        <CardTitle>Overview</CardTitle>
                        <p className="m-0 text-base leading-[1.6] text-ink-soft">{item.desc}</p>
                        <div className="flex flex-wrap gap-2">
                            {raw.license && <Chip tone="raised">License: {raw.license}</Chip>}
                            <Chip tone="raised">Version {version}</Chip>
                            <Chip tone="raised">Bottle: {raw.bottle ? 'Yes' : 'No'}</Chip>
                            <Chip tone="raised">macOS · Linux · WSL</Chip>
                            {isFoss && <Chip tone="oss">Open Source</Chip>}
                        </div>
                    </Card>

                    <Card>
                        <CardTitle>Dependencies</CardTitle>
                        <div><div className="mb-2"><Eyebrow>RUNTIME</Eyebrow></div><DepChips deps={runtimeDeps} /></div>
                        <div><div className="mb-2"><Eyebrow>BUILD ONLY</Eyebrow></div><DepChips deps={buildDeps} /></div>
                    </Card>
                </div>

                <aside className="flex min-w-0 flex-[1_1_380px] flex-col gap-6">
                    <InstallsCard item={item} />
                    <Card>
                        <CardTitle>Technical details</CardTitle>
                        <table className="w-full border-collapse">
                            <tbody>
                                {tech.map(([k, v]) => (
                                    <tr key={k}>
                                        <th scope="row" className="border-b border-line-strong py-3 text-left text-sm font-medium text-muted">{k}</th>
                                        <td className="border-b border-line-strong py-3 text-right text-sm font-semibold">{v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sourceUrl && (
                            <PillLink href={sourceUrl} variant="dark" className="justify-center"><Download size={16} strokeWidth={2.2} />Download source</PillLink>
                        )}
                    </Card>
                    <MoreInCategory item={item} categoryId={categoryId} />
                </aside>
            </div>
        </div>
    );
};

export default FormulaeDetail;
