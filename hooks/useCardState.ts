"use client";

import { useState, useCallback, useEffect } from "react";

interface CardState {
  expandedCardId: string | null;
}

export function useCardState() {
  const [state, setState] = useState<CardState>({
    expandedCardId: null,
  });

  const expandCard = useCallback((cardId: string) => {
    setState({ expandedCardId: cardId });
  }, []);

  const collapseCard = useCallback(() => {
    setState({ expandedCardId: null });
  }, []);

  const toggleCard = useCallback((cardId: string) => {
    setState((prev) =>
      prev.expandedCardId === cardId
        ? { expandedCardId: null }
        : { expandedCardId: cardId },
    );
  }, []);

  // Handle escape key to collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.expandedCardId) {
        collapseCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.expandedCardId, collapseCard]);

  return {
    expandedCardId: state.expandedCardId,
    isExpanded: state.expandedCardId !== null,
    expandCard,
    collapseCard,
    toggleCard,
  };
}
