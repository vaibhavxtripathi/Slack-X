"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Hint } from "./hint";

const PALETTES = [
  { key: "theme-aubergine", label: "Aubergine" },
  { key: "theme-uru", label: "Uru" },
  { key: "theme-ocean", label: "Ocean" },
  { key: "theme-graphite", label: "Graphite" },
  { key: "theme-sunset", label: "Coral" },
  { key: "theme-midnight", label: "Midnight" },
];

const STORAGE_KEY = "slack-x-palette";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [palette, setPalette] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "theme-aubergine";
    }
    return "theme-aubergine";
  });

  // Apply theme immediately on mount to prevent flash
  useEffect(() => {
    const root = document.documentElement;
    const savedPalette = localStorage.getItem(STORAGE_KEY) || "theme-aubergine";

    // Remove prior palette classes
    PALETTES.forEach((p) => root.classList.remove(p.key, `${p.key}-dark`));

    // Apply saved palette immediately
    root.classList.add(savedPalette);

    // Apply dark variant if dark mode is active
    if (isDark) {
      root.classList.add(`${savedPalette}-dark`);
    }

    // Update state
    setPalette(savedPalette);
  }, [isDark]); // Add isDark to dependency array

  // Handle theme changes
  useEffect(() => {
    const root = document.documentElement;
    // Remove prior palette classes
    PALETTES.forEach((p) => root.classList.remove(p.key, `${p.key}-dark`));
    // Apply current palette, and palette-dark if dark theme is active
    root.classList.add(palette);
    if (isDark) root.classList.add(`${palette}-dark`);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, palette);
    }
  }, [palette, isDark]);

  const handlePaletteChange = (newPalette: string) => {
    setPalette(newPalette);
  };

  return (
    <div className="flex items-center gap-1">
      {isDark ? (
        <Hint label="Switch to Light" side="bottom" align="center">
          <Button
            variant="transparent"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <Sun className="size-5" />
          </Button>
        </Hint>
      ) : (
        <Hint label="Switch to Dark" side="bottom" align="center">
          <Button
            variant="transparent"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <Moon className="size-5" />
          </Button>
        </Hint>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            size="icon"
            aria-label="Switch palette"
            className="group relative"
          >
            <Palette className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuRadioGroup
            value={palette}
            onValueChange={handlePaletteChange}
          >
            {PALETTES.map((p) => (
              <DropdownMenuRadioItem
                key={p.key}
                value={p.key}
                className="text-destructive data-[state=checked]:text-destructive"
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <span>{p.label}</span>
                  <div
                    className={`w-4 h-4 rounded-full ${
                      p.key === "theme-aubergine"
                        ? "bg-gradient-to-br from-purple-600 to-purple-800"
                        : p.key === "theme-uru"
                          ? "bg-gradient-to-br from-[#B695BE] to-[#9E0B2E]"
                          : p.key === "theme-ocean"
                            ? "bg-gradient-to-br from-teal-500 to-teal-700"
                            : p.key === "theme-graphite"
                              ? "bg-gradient-to-br from-gray-400 to-gray-600"
                              : p.key === "theme-sunset"
                                ? "bg-gradient-to-tl from-[#673A3A] to-[#432929]"
                                : p.key === "theme-midnight"
                                  ? "bg-gradient-to-br from-indigo-600 to-indigo-800"
                                  : "bg-gradient-to-br from-gray-400 to-gray-600"
                    }`}
                  />
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
