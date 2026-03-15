import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { MenuIcon, Moon, Sun, TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/brewlens_logo.png"

interface HeaderProps {
  setIsOpen: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setIsOpen }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  // Effects
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const reset_pagination = () => {
    ["cp_cask", "cp_formula"].forEach(key => localStorage.setItem(key, "1"));
    window.location.href = "/";
  }

  return (
    <header className="flex  gap-4 justify-between items-center">
      <div className="flex items-center gap-3">
        <Button variant="ghost"
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon size={20} />
        </Button>
        <NavLink
          onClick={() => reset_pagination()}
          to="/"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-200">
          <img src={logo} alt="" className="w-8 h-8 " />
          <h1 className="text-3xl my-auto font-bold">
            Brew<span className="font-light opacity-70">Lens</span>
          </h1>
        </NavLink>
      </div>
      <div className="flex gap-3">
        <NavLink to="/analytics">
          <Button variant="ghost" className="shrink-0">
            <TrendingUp size={20} />
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
    </header>
  );
};
