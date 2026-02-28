"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type FontId =
  | "sour-gummy"
  | "helvetica"
  | "lacquer"
  | "averia"
  | "space-mono";

interface FontOption {
  id: FontId;
  label: string;
  variable: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "sour-gummy",
    label: "Sour Gummy",
    variable: "var(--font-sour-gummy)",
  },
  {
    id: "helvetica",
    label: "Helvetica",
    variable: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  {
    id: "lacquer",
    label: "Lacquer",
    variable: "var(--font-lacquer)",
  },
  {
    id: "averia",
    label: "Averia Serif Libre",
    variable: "var(--font-averia)",
  },
  {
    id: "space-mono",
    label: "Space Mono",
    variable: "var(--font-space-mono)",
  },
];

interface FontContextValue {
  currentFont: FontOption;
  randomizeFont: () => void;
}

const FontContext = createContext<FontContextValue | null>(null);

export function FontProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const randomizeFont = useCallback(() => {
    setCurrentIndex((prev) => {
      let next: number;
      do {
        next = Math.floor(Math.random() * FONT_OPTIONS.length);
      } while (next === prev && FONT_OPTIONS.length > 1);
      return next;
    });
  }, []);

  const currentFont = FONT_OPTIONS[currentIndex];

  return (
    <FontContext.Provider value={{ currentFont, randomizeFont }}>
      <div
        style={{
          fontFamily: `${currentFont.variable}, ui-sans-serif, system-ui, sans-serif`,
        }}
      >
        {children}
      </div>
    </FontContext.Provider>
  );
}

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error("useFont must be used within FontProvider");
  return ctx;
}
