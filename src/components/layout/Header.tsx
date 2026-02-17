import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { MenuIcon, Terminal, Search, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";


interface HeaderProps {
  type: string;
  search: string;
  setSearch: (value: string) => void;
  setIsOpen: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ type, search, setSearch, setIsOpen }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  // Effects
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="flex items-center gap-3">
        <Button variant="ghost"
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon size={20} />
        </Button>
        <NavLink to="/brewlens" className="flex items-center gap-2 text-gray-600 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-200">
            <Terminal size={20} className="bg-green-600 text-white p-1.5 w-8 h-8 rounded-md" />
          <h1 className="text-3xl my-auto font-bold">
            Brew<span className="font-light opacity-70">Lens</span>
          </h1>
        </NavLink>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder={`Search ${type}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
