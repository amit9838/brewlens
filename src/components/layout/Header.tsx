/**
 * @file Header.tsx
 * Top bar: menu button (opens the sidebar), logo, floating pill navigation,
 * bookmarks and GitHub. The theme toggle lives in the sidebar.
 */
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Bookmark, Compass, Home, Menu, Search, Star, Github } from 'lucide-react';
import logo from '../../assets/brewlens_logo.png';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useModal } from '../contexts/ModalContexts';
import BookmarksModal from '../ui/BookmarksModal';
import { shortcutLabel, useSearchPalette } from '../ui/SearchPalette';
import { useGitHubStars } from '../../hooks/useAnalytics';
import { formatCount } from '../../lib/format';
import { cn } from '../../lib/utils';

/** Primary pages shown in the pill; Install, About and extras live in the sidebar. */
const NAV = [
    { to: '/', label: 'Discover', icon: Home, end: true },
    { to: '/all', label: 'Explore', icon: Compass },
    { to: '/analytics', label: 'Charts', icon: BarChart3 },
];

interface HeaderProps {
    setIsOpen: (v: boolean) => void;
    isOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ setIsOpen, isOpen }) => {
    const navigate = useNavigate();
    const { bookmarks } = useBookmarks();
    const { openModal } = useModal();
    const palette = useSearchPalette();
    const { data: stars } = useGitHubStars();

    const goHome = () => {
        ['cp_cask', 'cp_formula'].forEach((k) => localStorage.setItem(k, '1'));
        navigate('/');
    };

    const iconBtn = 'relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-ink hover:bg-chip';

    return (
        <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 basis-0 items-center gap-2">
                <button type="button" onClick={() => setIsOpen(true)} aria-label="Open navigation menu" aria-expanded={isOpen} aria-controls="app-drawer" className={iconBtn}>
                    <Menu size={22} />
                </button>
                <Link to="/" onClick={goHome} className="flex items-center gap-2.5 text-ink no-underline hover:text-ink">
                    <img src={logo} alt="" className="h-9 w-9 rounded-[10px]" />
                    <span className="text-[28px] font-bold leading-none tracking-[-0.02em]">Brew<span className="font-light opacity-70">Lens</span></span>
                </Link>
            </div>

            <nav aria-label="Main" className="hidden flex-wrap items-center gap-0.5 rounded-full bg-raised p-1.5 shadow-pill md:flex">
                {NAV.map((n) => (
                    <NavLink
                        key={n.to}
                        to={n.to}
                        end={n.end}
                        className={({ isActive }) => cn(
                            'flex h-11 items-center gap-2 rounded-full px-[18px] text-base font-semibold no-underline transition-colors',
                            isActive ? 'bg-accent-tint text-accent-tint-ink' : 'text-ink hover:bg-chip hover:text-ink',
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <n.icon size={18} strokeWidth={2.2} aria-hidden="true" />}
                                {n.label}
                            </>
                        )}
                    </NavLink>
                ))}
                <button
                    type="button"
                    onClick={palette.open}
                    aria-label="Search packages"
                    aria-keyshortcuts="Meta+K Control+K"
                    className="ml-1 flex h-11 min-w-[160px] cursor-pointer items-center gap-2.5 rounded-full border-0 bg-chip pl-4 pr-2 text-[15px] font-medium text-muted transition-colors hover:bg-line-strong"
                >
                    <Search size={18} strokeWidth={2.2} />
                    <span className="flex-1 text-left">Search</span>
                    <kbd className="rounded-full bg-raised px-2.5 py-1 font-mono text-xs font-medium text-ink-soft">{shortcutLabel}</kbd>
                </button>
            </nav>

            <div className="flex flex-1 basis-0 items-center justify-end gap-2">
                <button type="button" onClick={palette.open} aria-label="Search packages" className={cn(iconBtn, 'md:hidden')}>
                    <Search size={20} />
                </button>
                <button
                    type="button"
                    aria-label={`Bookmarks, ${bookmarks.length} saved`}
                    aria-haspopup="dialog"
                    onClick={() => openModal(() => <BookmarksModal />, { size: 'lg' })}
                    className={iconBtn}
                >
                    <Bookmark size={20} />
                    {bookmarks.length > 0 && (
                        <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-extrabold text-[#111114]">
                            {bookmarks.length}
                        </span>
                    )}
                </button>
                <a
                    href="https://github.com/amit9838/brewlens"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`BrewLens on GitHub${stars ? `, ${stars} stars` : ''}`}
                    className="hidden h-11 items-center gap-2.5 rounded-full bg-invert pl-3.5 pr-1.5 text-sm font-semibold text-on-invert no-underline hover:text-on-invert sm:flex"
                >
                    <Github size={18} />GitHub
                    {stars !== undefined && (
                        <span className="flex h-8 items-center gap-1.5 rounded-full bg-black/30 px-2.5 text-[13px] font-bold dark:bg-black/10">
                            <Star size={14} fill="#10B981" stroke="#10B981" />{formatCount(stars)}
                        </span>
                    )}
                </a>
            </div>
        </header>
    );
};
