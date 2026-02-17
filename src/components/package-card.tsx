import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { PackageData, PackageType, Formula, Cask } from '@/src/types/homebrew';

// -----------------------------------------------------------------------------
// Types & Constants
// -----------------------------------------------------------------------------

interface BaseProps {
  data: PackageData;
  type: PackageType;
}

// Material 3 color tokens – extended for dark mode
const M3 = {
  light: {
    surface: '#F7F2FA',
    surfaceHover: '#e1e1e1',
    onSurface: '#1D1B20',
    onSurfaceVariant: '#49454F',
    primary: '#6750A4',
    primaryHover: '#775AF1',
    error: '#B3261E',
    errorContainer: '#F9DEDC',
    avatarBg: '#EADDFF',
    avatarColor: '#21005D',
    formulaChipBg: '#E8DEF8',
    formulaChipText: '#1D192B',
    caskChipBg: '#D0E4FF',
    caskChipText: '#001D35',
    chipBorder: '#79747E',
    cardBorder: '#CAC4D0',
  },
  dark: {
    surface: '#1e1e1e',
    surfaceHover: '#2d2d2d',
    onSurface: '#e1e1e1',
    onSurfaceVariant: '#c7c7c7',
    primary: '#d0bcff',
    primaryHover: '#e1d4ff',
    error: '#f2b8b5',
    errorContainer: '#562e2a',
    avatarBg: '#4a3a5e',
    avatarColor: '#eaddff',
    formulaChipBg: '#4a3a5e',
    formulaChipText: '#eaddff',
    caskChipBg: '#003355',
    caskChipText: '#cfe5ff',
    chipBorder: '#938f99',
    cardBorder: '#49454F',
  },
} as const;


// -----------------------------------------------------------------------------
// Helper components
// -----------------------------------------------------------------------------

const Avatar: React.FC<{ homepage: string }> = ({ homepage }) => (
  <img
    className="w-12 h-12 rounded-lg text-[#8F4E2D] dark:text-orange-200"
    src={`https://www.google.com/s2/favicons?domain=${homepage}&sz=64`}
    alt="" />
);


const PackageName: React.FC<{ data: PackageData; type: PackageType }> = ({ data, type }) => {
  const name = type === 'formula'
    ? (data as Formula).full_name
    : (data as Cask).name[0];

  const packageVersion = type === 'formula'
    ? (data as Formula).versions.stable
    : (data as Cask).version;

  return (
    <div className="flex flex-col overflow-hidden">
      <h3 className="text-[1rem] font-medium leading-tight text-[#1D1B20] dark:text-[#e1e1e1] truncate">
        {name}
      </h3>
      <span className="text-[0.75rem] font-medium text-zinc-500 dark:text-zinc-400">
        v{packageVersion}
      </span>
    </div>
  );
};


const StatusBadge: React.FC<{ data: PackageData }> = ({ data }) => {
  if (!data.deprecated && !data.disabled) return null;

  const message = data.disabled ? 'Disabled' : 'Deprecated';
  return (
    <span className="flex items-center gap-1 text-[0.75rem] text-[#B3261E] dark:text-[#f2b8b5] font-semibold bg-[#F9DEDC] dark:bg-[#562e2a] px-2 py-0.5 rounded-md">
      {message}
    </span>
  );
};

const LicenseBadge: React.FC<{ data: Formula }> = ({ data }) => {
  if (!data.license) return null;
  return (
    <span className="text-[0.7rem] text-[#49454F] dark:text-[#c7c7c7] bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full border border-[#CAC4D0] dark:border-[#49454F]">
      {data.license}
    </span>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

const PackageCard: React.FC<BaseProps> = ({ data, type }) => {

  // Type guards
  const isFormula = (pkg: PackageData): pkg is Formula => type === 'formula';
  const isCask = (pkg: PackageData): pkg is Cask => type === 'cask';
  const token = type === 'formula' ? (data as Formula).name : (data as Cask).token;

  // Construct detail page URL
  const packageName = type === 'formula'
    ? (data as Formula).full_name
    : (data as Cask).name[0];
  const detailHref = `/${type}/${token}`;

  // Stop propagation to prevent the card overlay from capturing clicks on interactive elements
  const handleInteractiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <article
      className={clsx(
        'relative flex flex-col min-w-[320px] max-w-100 p-4 pb-3 min-h-[12rem]  max-h-[16rem] rounded-2xl border transition-all duration-200 bg-[#F7F2FA] dark:bg-[#1a1a1a] border-transparent dark:border-transparent shadow-md hover:shadow-lg hover:bg-[#efefef] dark:hover:bg-[#232323]'

      )}
    >
      {/* Overlay Link – makes the whole card clickable */}
      {/* {console.log(data)} */}
      {/* {console.log(isFormula)} */}
      <Link
        href={detailHref}
        aria-label={`View details for ${packageName}`}
      >
        {/* Card Content – all interactive elements must have higher z-index and stop propagation */}
        <div className=" z-20">
          {/* Header */}
          <header className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-4">
              <Avatar homepage={data.homepage} />
              <PackageName data={data} type={type} />
            </div>
            {/* <TypeChip type={type} /> */}
          </header>

          {/* Description */}
          <section className="grow mb-4">
            <p className="text-[0.875rem] leading-5 text-[#49454F] dark:text-zinc-400 line-clamp-2">
              {data.desc || 'No description provided for this package.'}
            </p>
          </section>

          {/* Metadata */}
          <footer className="flex flex-wrap items-center gap-1 mb-10 ">
            <StatusBadge data={data} />
            {isFormula(data) && <LicenseBadge data={data} />}
          </footer>

          {/* Actions */}
          <div className="absolute bottom-0 left-0 p-2  flex items-center justify-between pt-2 borders-t border-[#CAC4D0]/50 dark:border-[#49454F]/50">
            {/* <a
              href={data.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="  text-[0.875rem] font-normal text-[#325ecd] dark:text-[#d0bcff] hover:underline  px-3 py-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2b52b4] dark:focus-visible:ring-[#d0bcff]"
              onClick={handleInteractiveClick}
              aria-label={`Homepage for ${data.name}`}
            >
              View Homepage
            </a> */}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default React.memo(PackageCard);