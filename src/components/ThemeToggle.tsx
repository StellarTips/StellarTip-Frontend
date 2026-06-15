"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ variant = "ghost" as const, size = "sm" as const }) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
