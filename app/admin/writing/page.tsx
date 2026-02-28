"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Writing {
  id: number;
  title: string;
  subtitle: string;
  created_at: string;
  content: string;
}

export default function AdminWritingPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Preview toggle
  const [showPreview, setShowPreview] = useState(false);

  // Existing writings
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loadingWritings, setLoadingWritings] = useState(false);

  const fetchWritings = useCallback(async () => {
    setLoadingWritings(true);
    try {
      const res = await fetch("/api/admin/writings");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setWritings(data);
      } else if (res.status === 401) {
        setIsAuthed(false);
      }
    } catch (err) {
      console.error("Failed to fetch writings:", err);
    } finally {
      setLoadingWritings(false);
    }
  }, []);

  // Check auth on mount — try fetching writings
  useEffect(() => {
    fetch("/api/admin/writings")
      .then((res) => {
        if (res.ok) {
          setIsAuthed(true);
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && Array.isArray(data)) setWritings(data);
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthed(true);
        setPassword("");
        fetchWritings();
      } else {
        setAuthError("Invalid password");
      }
    } catch {
      setAuthError("Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setPublishing(true);
    try {
      const res = await fetch("/api/admin/writings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, content }),
      });

      if (res.ok) {
        setTitle("");
        setSubtitle("");
        setContent("");
        setShowPreview(false);
        fetchWritings();
      } else if (res.status === 401) {
        setIsAuthed(false);
      }
    } catch (err) {
      console.error("Failed to publish:", err);
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this writing?")) return;

    try {
      const res = await fetch(`/api/admin/writings?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWritings((prev) => prev.filter((w) => w.id !== id));
      } else if (res.status === 401) {
        setIsAuthed(false);
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // ── Login Gate ──
  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <h1 className="text-headline text-foreground">Admin</h1>
          <p className="text-body text-muted-foreground">
            Enter password to continue.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {authError && <p className="text-sm text-destructive">{authError}</p>}

          <button
            type="submit"
            disabled={authLoading || !password}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  // ── Authed Admin View ──
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-headline text-foreground">Writings</h1>
          <p className="text-body text-muted-foreground">
            Create and manage writings.
          </p>
        </div>

        {/* Compose Form */}
        <form onSubmit={handlePublish} className="space-y-4">
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle / Tag (optional)"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            {!showPreview ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write in Markdown..."
                rows={12}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            ) : (
              <div className="min-h-50 rounded-lg border border-border bg-secondary px-4 py-3">
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
                          <code className="block bg-background rounded-md px-3 py-2 text-sm font-mono text-foreground overflow-x-auto my-3">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className="bg-background rounded px-1.5 py-0.5 text-sm font-mono text-foreground">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-background rounded-md overflow-x-auto my-3">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-border pl-3 text-muted-foreground italic my-3">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="border-border my-4" />,
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
                  {content || "*Nothing to preview*"}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={publishing || !title.trim() || !content.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>

            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPreview ? "Edit" : "Preview"}
            </button>
          </div>
        </form>

        {/* Existing Writings */}
        <div className="space-y-3">
          <h2 className="text-caption text-muted-foreground">
            Existing Writings
          </h2>

          {loadingWritings ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : writings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No writings yet.</p>
          ) : (
            <div className="space-y-2">
              {writings.map((writing) => (
                <div
                  key={writing.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">
                      {writing.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(writing.created_at)}
                      {writing.subtitle && ` · ${writing.subtitle}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(writing.id)}
                    className="shrink-0 rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
