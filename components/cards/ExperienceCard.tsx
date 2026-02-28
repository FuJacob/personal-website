"use client";

import { ExperienceCard as ExperienceCardType } from "@/lib/types";
import Image from "next/image";
import { Snowflake, Sun, Leaf, Flower2 } from "lucide-react";
import { CardShell } from "./CardShell";
import { CardExpansion } from "./CardExpansion";

const SEASON_ICON_CLASS = "h-3 w-3 shrink-0 opacity-70";

function SeasonIcon({ period }: { period: string }) {
  const season = period.split(" ")[0]?.toLowerCase();
  switch (season) {
    case "winter":
      return <Snowflake className={SEASON_ICON_CLASS} aria-hidden="true" />;
    case "summer":
      return <Sun className={SEASON_ICON_CLASS} aria-hidden="true" />;
    case "fall":
      return <Leaf className={SEASON_ICON_CLASS} aria-hidden="true" />;
    case "spring":
      return <Flower2 className={SEASON_ICON_CLASS} aria-hidden="true" />;
    default:
      return null;
  }
}

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
  const summary = card.summary || card.description.split("\n\n")[0] || card.role;
  const imageSrc = card.media?.type === "image" ? card.media.src : card.logo;
  const imageAlt = card.media?.caption || card.company;
  const roleLabel = "Software Engineering Intern";

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
                — {roleLabel}
              </span>
            </div>
          </div>
          <span
            className={`flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-wide ${mutedColor}`}
          >
            <SeasonIcon period={card.period} />
            {card.period}
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
