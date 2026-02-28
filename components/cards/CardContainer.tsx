"use client";

import { useState } from "react";
import { cardSections, headerInfo } from "@/lib/data";
import { useCardState } from "@/hooks/useCardState";
import { SiteHeader } from "./SiteHeader";
import { SectionDivider } from "./SectionDivider";
import { CardStack } from "./CardStack";
import { WritingsView } from "./WritingsView";
import { GoalsView } from "./GoalsView";

type ViewId = "home" | "writings" | "goals";

export function CardContainer() {
  const { expandedCardId, toggleCard } = useCardState();
  const [activeView, setActiveView] = useState<ViewId>("home");
  const visibleSections = cardSections.filter((section) => section.id !== "chat");

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center py-6 sm:py-8">
      {/* Blobs SVG background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-background"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/backgrounds/blobs.svg"
          alt=""
          className="h-full w-full object-cover opacity-60"
        />
      </div>

      <main className="relative z-10 w-full max-w-sm px-2 sm:max-w-md sm:px-3 lg:max-w-lg lg:px-4">
        <SiteHeader
          name={headerInfo.name}
          icon={headerInfo.icon}
          subtitle={headerInfo.subtitle}
          socials={headerInfo.socials}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Fixed-height content area — prevents header from jumping between views */}
        <div className="min-h-135">
          {activeView === "home" && (
            <div className="space-y-1 sm:space-y-1.5">
              {visibleSections.map((section) => (
                <section key={section.id} className="space-y-1 sm:space-y-1.5">
                  <SectionDivider label={section.label} />
                  <CardStack
                    cards={section.cards}
                    expandedCardId={expandedCardId}
                    onCardClick={toggleCard}
                  />
                </section>
              ))}
            </div>
          )}

          {activeView === "writings" && <WritingsView />}

          {activeView === "goals" && <GoalsView />}
        </div>
      </main>
    </div>
  );
}
