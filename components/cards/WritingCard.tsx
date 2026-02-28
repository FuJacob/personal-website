"use client";

import { Writing } from "@/lib/types";
import { CardShell } from "./CardShell";

interface WritingCardProps {
  writing: Writing;
  isExpanded: boolean;
  onClick: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function WritingCard({ writing, isExpanded, onClick }: WritingCardProps) {
  const bgColor = "var(--card-module-bg)";
  const borderColor = "var(--card-module-border)";

  return (
    <CardShell
      bgColor={bgColor}
      borderColor={borderColor}
      isExpanded={isExpanded}
      onToggle={onClick}
      header={
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate text-base font-semibold text-foreground">
              {writing.title}
            </div>
            {writing.subtitle && (
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {writing.subtitle}
              </span>
            )}
          </div>
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground whitespace-nowrap">
            {formatDate(writing.created_at)}
          </span>
        </div>
      }
    />
  );
}
