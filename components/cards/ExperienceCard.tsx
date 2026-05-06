"use client";

import { ExperienceCard as ExperienceCardType } from "@/lib/types";
import Image from "next/image";
import { CardShell } from "./CardShell";
import { CardExpansion } from "./CardExpansion";

interface ExperienceCardProps {
  card: ExperienceCardType;
  isExpanded: boolean;
  onClick: () => void;
}

export function ExperienceCard({
  card,
  isExpanded,
  onClick,
}: ExperienceCardProps) {
  const bgColor = "var(--card-module-bg)";
  const textColor = "text-foreground";
  const mutedColor = "text-muted-foreground";
  const borderColor = "var(--card-module-border)";
  const summary =
    card.summary || card.description.split("\n\n")[0] || card.role;
  const imageSrc = card.media?.type === "image" ? card.media.src : card.logo;
  const imageAlt = card.media?.caption || card.company;
  const roleLabel = card.role;
  const metaLabel = card.location
    ? `${card.location} — ${card.period}`
    : card.period;

  return (
    <CardShell
      bgColor={bgColor}
      borderColor={borderColor}
      isExpanded={isExpanded}
      onToggle={onClick}
      header={
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-7 w-7 shrink-0 rounded overflow-hidden">
              <Image
                src={card.logo}
                alt={card.company}
                width={28}
                height={28}
                sizes="28px"
                className="h-full w-full object-cover"
              />
            </div>
            <div className={`truncate text-base font-semibold ${textColor}`}>
              {card.company}
              <span className={`ml-1 text-[11px] font-medium ${mutedColor}`}>
                {roleLabel}
              </span>
            </div>
          </div>
          <span
            className={`shrink-0 text-[11px] font-medium uppercase tracking-wide ${mutedColor}`}
          >
            {metaLabel}
          </span>
        </div>
      }
    >
      <CardExpansion
        isExpanded={isExpanded}
        summary={summary}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
      />
    </CardShell>
  );
}
