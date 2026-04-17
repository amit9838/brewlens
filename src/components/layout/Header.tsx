import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { MenuIcon, Moon, Sun, Grid } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/brewlens_logo.png";
import { GlobalSearchBar } from "../ui/GlobalSearchBar";

interface HeaderProps {
  setIsOpen: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setIsOpen }) => {
  const { pathname } = useLocation();
  const showSearch = pathname !== '/all';

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const reset_pagination = () => {
    ["cp_cask", "cp_formula"].forEach(key => localStorage.setItem(key, "1"));
    window.location.href = "/brewlens/#/";
  };

  return (
    <header className="flex flex-col gap-3">
      {/* ── Row 1: logo | search (desktop only) | actions ── */}
      <div className="flex items-center gap-3">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" onClick={() => setIsOpen(true)}>
            <MenuIcon size={20} />
          </Button>
          <NavLink
            onClick={reset_pagination}
            to="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <img src={logo} alt="BrewLens logo" className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl my-auto font-bold">
              Brew<span className="font-light opacity-70">Lens</span>
            </h1>
          </NavLink>
        </div>

        {/* Centre: search bar — visible only on md+, hidden on /all */}
        {showSearch && (
          <div className="hidden md:flex flex-1 min-w-0 justify-center">
            <div className="w-full max-w-lg">
              <GlobalSearchBar />
            </div>
          </div>
        )}

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <NavLink to="/all">
            <Button variant="ghost" size="md">
              <Grid size={18} />
              <span className="hidden sm:inline ml-1 text-sm font-medium">All Apps</span>
            </Button>
          </NavLink>
          <Button
            variant="ghost"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="shrink-0"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
      </div>

      {/* ── Row 2: search bar — visible only below md, hidden on /all ── */}
      {showSearch && (
        <div className="md:hidden w-full">
          <GlobalSearchBar />
        </div>
      )}
    </header>
  );
};
