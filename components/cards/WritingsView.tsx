"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Writing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionDivider } from "./SectionDivider";
import { WritingCard } from "./WritingCard";

export function WritingsView() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/writings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWritings(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleWriting = useCallback((id: number) => {
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

  const expandedWriting = writings.find((w) => w.id === expandedId);

  if (loading) {
    return (
      <div className="space-y-1 sm:space-y-1.5">
        <SectionDivider label="Writings" />
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (writings.length === 0) {
    return (
      <div className="space-y-1 sm:space-y-1.5">
        <SectionDivider label="Writings" />
        <div className="py-8 text-center text-sm text-muted-foreground">
          No writings yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1 sm:space-y-1.5">
      <SectionDivider label="Writings" />

      <div className="space-y-1.5 sm:space-y-2">
        {writings.map((writing) => {
          const isExpanded = writing.id === expandedId;
          const isHidden = expandedId !== null && !isExpanded;

          return (
            <div
              key={writing.id}
              className={cn(
                "transition-all duration-300 ease-out",
                isHidden && "h-0 opacity-0 overflow-hidden pointer-events-none",
                isExpanded && "relative z-10"
              )}
            >
              <WritingCard
                writing={writing}
                isExpanded={isExpanded}
                onClick={() => toggleWriting(writing.id)}
              />

              {/* Expanded content: full markdown rendered below the card */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  {isExpanded && expandedWriting && (
                    <article className="mt-2 rounded-lg p-3 sm:p-4 prose-custom">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-xl font-bold text-foreground mb-3 mt-4 first:mt-0">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg font-semibold text-foreground mb-2 mt-3">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-base font-semibold text-foreground mb-2 mt-3">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-[15px] leading-relaxed text-muted-foreground mb-3">
                              {children}
                            </p>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
                            >
                              {children}
                            </a>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside text-[15px] text-muted-foreground mb-3 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside text-[15px] text-muted-foreground mb-3 space-y-1">
                              {children}
                            </ol>
                          ),
                          code: ({ className, children }) => {
                            const isBlock = className?.includes("language-");
                            if (isBlock) {
                              return (
                                <code className="block bg-secondary rounded-md px-3 py-2 text-sm font-mono text-foreground overflow-x-auto my-3">
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <code className="bg-secondary rounded px-1.5 py-0.5 text-sm font-mono text-foreground">
                                {children}
                              </code>
                            );
                          },
                          pre: ({ children }) => (
                            <pre className="bg-secondary rounded-md overflow-x-auto my-3">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-border pl-3 text-muted-foreground italic my-3">
                              {children}
                            </blockquote>
                          ),
                          hr: () => (
                            <hr className="border-border my-4" />
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-foreground">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                        }}
                      >
                        {expandedWriting.content}
                      </ReactMarkdown>
                    </article>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
