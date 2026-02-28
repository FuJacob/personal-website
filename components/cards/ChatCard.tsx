"use client";

import { ChatCard as ChatCardType } from "@/lib/types";
import { MessageCircle } from "lucide-react";
import { CardShell } from "./CardShell";
import { CardExpansion } from "./CardExpansion";

interface ChatCardProps {
  card: ChatCardType;
  isExpanded: boolean;
  onClick: () => void;
}

export function ChatCard({ card, isExpanded, onClick }: ChatCardProps) {
  const bgColor = "var(--card-module-bg)";
  const textColor = "text-foreground";
  const mutedColor = "text-muted-foreground";
  const borderColor = "var(--card-module-border)";
  const summary =
    card.summary ||
    "Ask about internships, projects, and technical strengths. You can get a concise walkthrough of my recent work and preferred stacks.";

  return (
    <CardShell
      bgColor={bgColor}
      borderColor={borderColor}
      isExpanded={isExpanded}
      onToggle={onClick}
      header={
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-7 w-7 rounded bg-white/90 dark:bg-gray-800/90 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <div className={`truncate text-[15px] font-semibold ${textColor}`}>
              {card.title}
            </div>
          </div>
          <span
            className={`shrink-0 text-[10px] font-medium uppercase tracking-wide ${mutedColor}`}
          >
            Ask me
          </span>
        </div>
      }
    >
      <CardExpansion isExpanded={isExpanded} summary={summary} />
    </CardShell>
  );
}
