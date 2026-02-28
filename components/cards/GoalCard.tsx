"use client";

import { Goal } from "@/lib/types";
import { CardShell } from "./CardShell";
import { CardExpansion } from "./CardExpansion";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  isExpanded: boolean;
  onClick: () => void;
}

export function GoalCard({ goal, isExpanded, onClick }: GoalCardProps) {
  const bgColor = "var(--card-module-bg)";
  const borderColor = "var(--card-module-border)";

  return (
    <CardShell
      bgColor={bgColor}
      borderColor={borderColor}
      isExpanded={isExpanded}
      onToggle={onClick}
      className={cn(goal.completed && "opacity-60")}
      header={
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "h-4 w-4 shrink-0 rounded-sm border border-current flex items-center justify-center text-[10px]",
                goal.completed
                  ? "text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {goal.completed && "✓"}
            </span>
            <div
              className={cn(
                "truncate text-base font-semibold text-foreground",
                goal.completed && "line-through"
              )}
            >
              {goal.title}
            </div>
          </div>
        </div>
      }
    >
      {goal.description && (
        <CardExpansion
          isExpanded={isExpanded}
          summary={goal.description}
        />
      )}
    </CardShell>
  );
}
