"use client";

import { CardItem } from "@/lib/types";
import { AboutCard } from "./AboutCard";
import { ExperienceCard } from "./ExperienceCard";
import { ProjectCard } from "./ProjectCard";
import { ChatCard } from "./ChatCard";

interface CardStackProps {
  cards: CardItem[];
  expandedCardId: string | null;
  onCardClick: (cardId: string) => void;
}

export function CardStack({
  cards,
  expandedCardId,
  onCardClick,
}: CardStackProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      {cards.map((card) => {
        const isExpanded = card.id === expandedCardId;

        return (
          <div
            key={card.id}
            className="transition-transform duration-200 ease-out motion-reduce:transition-none"
          >
            {renderCard(card, isExpanded, () => onCardClick(card.id))}
          </div>
        );
      })}
    </div>
  );
}

function renderCard(card: CardItem, isExpanded: boolean, onClick: () => void) {
  switch (card.type) {
    case "about":
      return (
        <AboutCard card={card} isExpanded={isExpanded} onClick={onClick} />
      );
    case "experience":
      return (
        <ExperienceCard card={card} isExpanded={isExpanded} onClick={onClick} />
      );
    case "project":
      return (
        <ProjectCard card={card} isExpanded={isExpanded} onClick={onClick} />
      );
    case "chat":
      return <ChatCard card={card} isExpanded={isExpanded} onClick={onClick} />;
  }
}
