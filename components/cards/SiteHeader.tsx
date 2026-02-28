"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail, Dices } from "lucide-react";
import { useFont } from "@/components/FontProvider";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type ViewId = "home" | "writings" | "goals";

interface SiteHeaderProps {
  name: string;
  icon?: string;
  subtitle: string;
  socials: {
    linkedin: string;
    github: string;
    twitter: string;
    email: string;
  };
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
  className?: string;
}

const views: { id: ViewId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "writings", label: "Writings" },
  { id: "goals", label: "Goals" },
];

export function SiteHeader({
  name,
  icon,
  subtitle,
  socials,
  activeView,
  onViewChange,
  className,
}: SiteHeaderProps) {
  const { randomizeFont } = useFont();

  return (
    <header className={cn("py-1.5 sm:py-2", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {icon && (
            <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden sm:h-12 sm:w-12">
              <Image
                src={icon}
                alt={name}
                width={96}
                height={96}
                className="h-full w-full object-cover scale-150"
              />
            </div>
          )}
          <div>
            <h1 className="text-headline text-foreground">{name}</h1>
            <p className="text-body text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="flex w-36 shrink-0 items-end self-stretch flex-col justify-between pt-2 sm:w-40">
          <div className="flex items-end gap-3 sm:gap-4">
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="X (formerly Twitter)"
            >
              <XIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${socials.email}`}
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={randomizeFont}
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Randomize font"
              title="Randomize font"
            >
              <Dices className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex items-center gap-1.5 text-caption">
            {views.map((view, i) => (
              <span key={view.id} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-muted-foreground/40 select-none">
                    |
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onViewChange(view.id)}
                  className={cn(
                    "py-1 px-1.5 transition-colors",
                    activeView === view.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {view.label}
                </button>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
