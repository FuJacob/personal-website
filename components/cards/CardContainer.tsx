"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cardSections, headerInfo } from "@/lib/data";
import { useCardState } from "@/hooks/useCardState";
import { SiteHeader } from "./SiteHeader";
import { SectionDivider } from "./SectionDivider";
import { CardStack } from "./CardStack";

const WritingsView = dynamic(
  () => import("./WritingsView").then((m) => ({ default: m.WritingsView })),
);
const GoalsView = dynamic(
  () => import("./GoalsView").then((m) => ({ default: m.GoalsView })),
);

type ViewId = "home" | "writings" | "goals";

export function CardContainer() {
  const { expandedCardId, toggleCard } = useCardState();
  const [activeView, setActiveView] = useState<ViewId>("home");
  const visibleSections = cardSections.filter(
    (section) => section.id !== "chat",
  );

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center py-6 sm:py-8">
      {/* Blobs SVG background (inlined to eliminate LCP network request) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-background"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 2560 1440"
          className="h-full w-full object-cover opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="2560" height="1440" fill="#1d1a17" />
          <g>
            <g transform="translate(337 797)">
              <path
                d="M171.6 -207.6C222.2 -162 262.9 -107.8 280.7 -44C298.5 19.8 293.4 93.1 260.8 151.5C228.2 210 168.2 253.5 100.8 278.8C33.5 304 -41.2 311.1 -108.8 290.2C-176.4 269.4 -237 220.6 -262.6 159.7C-288.1 98.7 -278.7 25.6 -264.6 -45.4C-250.6 -116.4 -231.9 -185.2 -187 -231.9C-142.2 -278.5 -71.1 -303 -5.3 -296.6C60.5 -290.3 121 -253.3 171.6 -207.6Z"
                fill="none"
                stroke="#8c857c"
                strokeWidth="20"
              />
            </g>
            <g transform="translate(1592 1289)">
              <path
                d="M202 -239.4C255.9 -195.5 289.7 -126.3 300.8 -54.4C311.8 17.5 300.2 92.1 264 150.2C227.8 208.3 167 250 99.9 274.5C32.8 298.9 -40.6 306.1 -97.8 280.2C-155 254.4 -195.9 195.6 -230.5 133.9C-265.1 72.3 -293.2 7.8 -286.8 -54.4C-280.4 -116.6 -239.4 -176.5 -185.8 -220.4C-132.2 -264.4 -66.1 -292.4 4 -297.2C74.1 -301.9 148.1 -283.3 202 -239.4Z"
                fill="none"
                stroke="#8c857c"
                strokeWidth="20"
              />
            </g>
            <g transform="translate(2238 915)">
              <path
                d="M86.7 -107.8C111.6 -82.4 130.6 -54.4 141.7 -20.7C152.8 13.1 156 52.5 140.2 82C124.4 111.4 89.6 130.9 52.5 144.4C15.5 158 -23.7 165.5 -59.1 155.5C-94.4 145.6 -125.9 118.2 -139.6 85.1C-153.2 52.1 -149.1 13.2 -139.3 -21.6C-129.6 -56.4 -114.3 -87.2 -90.2 -112.7C-66 -138.2 -33 -158.4 -1.1 -157.2C30.9 -155.9 61.8 -133.2 86.7 -107.8Z"
                stroke="#8c857c"
                fill="none"
                strokeWidth="20"
              />
            </g>
          </g>
        </svg>
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
