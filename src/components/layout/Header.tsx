import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "../ui/Button";
import { MenuIcon, Moon, Sun, Search, X, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/brewlens_logo.png";
import { useSearch } from "../contexts/SearchContext";
import { cn } from "../../lib/utils";

interface HeaderProps {
  setIsOpen: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setIsOpen }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery, brewType, setBrewType, openQuickSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const isOnAllPage = location.pathname === '/all';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (!isOnAllPage && newValue) {
      navigate(`/all?type=${encodeURIComponent(brewType)}&q=${encodeURIComponent(newValue)}`);
    } else if (!newValue && !isOnAllPage) {
      navigate('/all');
    }
  };
  const handleSearchFocus = () => {
    if (!isOnAllPage) {
      navigate('/all', { state: { focusSearch: true } });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (!isOnAllPage) {
      navigate('/all');
    }
    inputRef.current?.focus();
  };

  
  useEffect(() => {
    const state = location.state as { focusSearch?: boolean };
    if (state?.focusSearch) {
      inputRef.current?.focus();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const resetPagination = () => {
    ["cp_cask", "cp_formula"].forEach(key => localStorage.setItem(key, "1"));
    window.location.href = "/brewlens/#/";
  };

  const showExtra = isOnAllPage;

  return (
    <header className="flex gap-4 flex-wrap justify-between items-center">
      <div className="flex items-center gap-3 w-[16rem]">
        <Button variant="ghost" onClick={() => setIsOpen(true)}>
          <MenuIcon size={20} />
        </Button>
        <NavLink
          onClick={() => resetPagination()}
          to="/"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <img src={logo} alt="" className="w-8 h-8" />
          <h1 className="text-3xl my-auto font-bold">
            Brew<span className="font-light opacity-70">Lens</span>
          </h1>
        </NavLink>
      </div>

      <div className="relative flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder={`Search ${brewType}`}
            className="w-full pl-10 pr-8 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className={cn(
          "flex items-center gap-2 transition-all duration-200 overflow-hidden",
          showExtra ? "opacity-100 max-w-xs" : "opacity-0 max-w-0 pointer-events-none"
        )}>
          <Button variant="secondary" size="md" onClick={openQuickSearch} title="Quick search">
            <Sparkles size={15} />
          </Button>
          <div className="bg-gray-200 dark:bg-zinc-800 p-1 rounded-lg flex">
            {(['cask', 'formula'] as const).map(t => (
              <button
                key={t}
                onClick={() => setBrewType(t)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                  brewType === t ? "bg-white dark:bg-zinc-600 shadow text-green-600 dark:text-green-400" : "text-gray-500"
                )}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 w-[16rem]  flex flex-row-reverse">
        <Button
          variant="ghost"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          className="shrink-0"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
      </div>
    </header>
  );
};