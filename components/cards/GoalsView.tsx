"use client";

import { useState, useEffect, useCallback } from "react";
import { Goal } from "@/lib/types";
import { SectionDivider } from "./SectionDivider";
import { GoalCard } from "./GoalCard";

export function GoalsView() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGoals(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleGoal = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // Escape to collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedId !== null) {
        setExpandedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedId]);

  if (loading) {
    return (
      <div className="space-y-1 sm:space-y-1.5">
        <SectionDivider label="2026 Resolutions" />
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="space-y-1 sm:space-y-1.5">
        <SectionDivider label="2026 Resolutions" />
        <div className="py-8 text-center text-sm text-muted-foreground">
          No goals yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1 sm:space-y-1.5">
      <SectionDivider label="2026 Resolutions" />
      <div className="space-y-1.5 sm:space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="transition-transform duration-200 ease-out motion-reduce:transition-none"
          >
            <GoalCard
              goal={goal}
              isExpanded={goal.id === expandedId}
              onClick={() => toggleGoal(goal.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
