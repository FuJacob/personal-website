"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardExpansionProps {
  isExpanded: boolean;
  summary: string;
  imageSrc?: string;
  imageAlt?: string;
  links?: {
    href: string;
    label: string;
    icon: ReactNode;
  }[];
}

export function CardExpansion({
  isExpanded,
  summary,
  imageSrc,
  imageAlt,
  links = [],
}: CardExpansionProps) {
  return (
    <div
      className={cn(
        "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="min-h-0">
        <div className="border-t border-black/10 dark:border-white/10 px-2 pr-7 pb-2 pt-1 sm:px-2.5 sm:pr-8 sm:pb-2.5 sm:pt-1.5">
          <div className="flex items-start gap-2">
            <p
              className="min-w-0 flex-1 text-[15px] leading-relaxed text-muted-foreground"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "4.2em",
              }}
            >
              {summary}
            </p>

            {imageSrc && (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/10 sm:h-16 sm:w-16">
                <Image
                  src={imageSrc}
                  alt={imageAlt || "Card preview"}
                  fill
                  sizes="(max-width: 640px) 56px, 64px"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {links.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {links.map((link) => (
                <a
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-sm border border-black/10 px-1.5 py-0.5 hover:text-foreground dark:border-white/10"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
