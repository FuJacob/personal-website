"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardShellProps {
  bgColor: string;
  borderColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  header: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function CardShell({
  bgColor,
  borderColor,
  isExpanded,
  onToggle,
  header,
  children,
  className,
}: CardShellProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border-[1.5px] border-(--card-module-border)",
        "transition-[border-color,box-shadow] duration-200 ease-out",
        "[&:hover]:border-(--card-module-border-hover) [&:hover]:shadow-[0_0_10px_oklch(0.78_0.02_75/0.5)]",
        isExpanded &&
          "border-(--card-module-border-hover)! shadow-[0_0_10px_oklch(0.78_0.02_75/0.5)]",
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute right-3.5 top-2 bottom-2 w-px border-r border-dashed border-current opacity-30" />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={cn(
          "w-full p-2 pr-7 sm:p-2.5 sm:pr-8 text-left leading-tight",
          "transition-[filter] duration-150 motion-reduce:transition-none",
          "hover:brightness-[1.02]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25"
        )}
      >
        {header}
      </button>

      {children}
    </div>
  );
}
