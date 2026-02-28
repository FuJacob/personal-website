"use client";

import { AboutCard as AboutCardType } from "@/lib/types";
import Image from "next/image";
import { CardShell } from "./CardShell";
import { CardExpansion } from "./CardExpansion";

interface AboutCardProps {
  card: AboutCardType;
  isExpanded: boolean;
  onClick: () => void;
}

export function AboutCard({ card, isExpanded, onClick }: AboutCardProps) {
  const bgColor = "var(--card-module-bg)";
  const textColor = "text-foreground";
  const mutedColor = "text-muted-foreground";
  const borderColor = "var(--card-module-border)";
  const summary =
    card.summary ||
    "Waterloo CS student focused on infrastructure, distributed systems, and product-minded engineering. Previously interned at HubSpot and Bridgewell.";
  const imageSrc = card.media?.type === "image" ? card.media.src : card.avatar;
  const imageAlt = card.media?.caption || card.name;

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
                src={card.education?.logo ?? card.avatar}
                alt={card.education?.school ?? card.name}
                width={28}
                height={28}
                sizes="28px"
                className="h-full w-full object-cover"
              />
            </div>
            <div className={`truncate text-base font-semibold ${textColor}`}>
              {card.name}
            </div>
          </div>
          {card.status && (
            <span
              className={`shrink-0 text-[11px] font-medium uppercase tracking-wide ${mutedColor}`}
            >
              {card.status}
            </span>
          )}
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
