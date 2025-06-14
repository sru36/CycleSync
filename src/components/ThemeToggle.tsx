import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="w-4 h-4" />;
    } else if (theme === "light") {
      return <Sun className="w-4 h-4" />;
    } else {
      // System theme - show sun/moon based on current preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      );
    }
  };

  const getTooltip = () => {
    if (theme === "light") return "Switch to dark mode";
    if (theme === "dark") return "Switch to system mode";
    return "Switch to light mode";
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      title={getTooltip()}
      className="w-9 h-9 p-0"
    >
      {getIcon()}
    </Button>
  );
}
