import { SunIcon, MoonIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn btn-circle btn-ghost"
    >
      {isDark 
        ? <SunIcon className="size-5 text-yellow-400" /> 
        : <MoonIcon className="size-5 text-slate-600" />
      }
    </button>
  );
};

export default ThemeToggle;