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

interface Goal {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

type Tab = "writings" | "goals" | "resume";

const inputCls =
  "w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const btnPrimary =
  "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50";

const btnSecondary =
  "rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Markdown renderer shared between compose preview and existing writing page ───
const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-foreground mb-3 mt-4 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-foreground mb-2 mt-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-foreground mb-2 mt-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-[15px] leading-relaxed text-muted-foreground mb-3">{children}</p>
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
    <pre className="bg-background rounded-md overflow-x-auto my-3">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-border pl-3 text-muted-foreground italic my-3">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-4" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
};

// ─── Writings Tab ───────────────────────────────────────────────────────────
function WritingsTab() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [writings, setWritings] = useState<Writing[]>([]);
  const [loadingWritings, setLoadingWritings] = useState(false);

  const fetchWritings = useCallback(async () => {
    setLoadingWritings(true);
    try {
      const res = await fetch("/api/admin/writings");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setWritings(data);
      }
    } catch (err) {
      console.error("Failed to fetch writings:", err);
    } finally {
      setLoadingWritings(false);
    }
  }, []);

  useEffect(() => {
    fetchWritings();
  }, [fetchWritings]);

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
      const res = await fetch(`/api/admin/writings?id=${id}`, { method: "DELETE" });
      if (res.ok) setWritings((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Compose */}
      <form onSubmit={handlePublish} className="space-y-4">
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={inputCls}
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle / Tag (optional)"
            className={inputCls}
          />
          {!showPreview ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write in Markdown..."
              rows={12}
              className={`${inputCls} font-mono resize-y`}
            />
          ) : (
            <div className="min-h-50 rounded-lg border border-border bg-secondary px-4 py-3">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {content || "*Nothing to preview*"}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={publishing || !title.trim() || !content.trim()}
            className={btnPrimary}
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview((p) => !p)}
            className={btnSecondary}
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        <h2 className="text-caption text-muted-foreground">Existing Writings</h2>
        {loadingWritings ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : writings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No writings yet.</p>
        ) : (
          <div className="space-y-2">
            {writings.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{w.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(w.created_at)}
                    {w.subtitle && ` · ${w.subtitle}`}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(w.id)}
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
  );
}

// ─── Goals Tab ───────────────────────────────────────────────────────────────
function GoalsTab() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/goals");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setGoals(data);
      }
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        const goal = await res.json();
        setGoals((prev) => [...prev, goal]);
        setNewTitle("");
      }
    } catch (err) {
      console.error("Failed to add goal:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (goal: Goal) => {
    const optimistic = goals.map((g) =>
      g.id === goal.id ? { ...g, completed: !g.completed } : g,
    );
    setGoals(optimistic);
    try {
      const res = await fetch(`/api/admin/goals?id=${goal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !goal.completed }),
      });
      if (!res.ok) {
        // Roll back on failure
        setGoals(goals);
      }
    } catch {
      setGoals(goals);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this goal?")) return;
    try {
      const res = await fetch(`/api/admin/goals?id=${id}`, { method: "DELETE" });
      if (res.ok) setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New goal title"
          className={`${inputCls} flex-1`}
        />
        <button
          type="submit"
          disabled={adding || !newTitle.trim()}
          className={btnPrimary}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        <h2 className="text-caption text-muted-foreground">Goals</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : goals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No goals yet.</p>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => handleToggle(goal)}
                  className="h-4 w-4 shrink-0 cursor-pointer accent-primary"
                />
                <span
                  className={`flex-1 text-sm ${
                    goal.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {goal.title}
                </span>
                <button
                  onClick={() => handleDelete(goal.id)}
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
  );
}

// ─── Resume Tab ───────────────────────────────────────────────────────────────
function ResumeTab() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/resume", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("success");
        setFile(null);
        // Reset file input
        const input = document.getElementById("resume-file") as HTMLInputElement | null;
        if (input) input.value = "";
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Upload failed");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error");
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Upload a PDF to replace{" "}
        <span className="font-mono text-foreground">jacob-fu-resume.pdf</span> in R2.
      </p>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          id="resume-file"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setStatus("idle");
          }}
          className="block w-full text-sm text-muted-foreground
            file:mr-3 file:rounded-lg file:border file:border-border
            file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:text-foreground
            file:cursor-pointer file:transition-colors file:hover:bg-secondary/80"
        />

        <button
          type="submit"
          disabled={uploading || !file}
          className={btnPrimary}
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>

      {status === "success" && (
        <p className="text-sm text-green-500">Resume uploaded successfully.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("writings");

  // Detect existing session on mount
  useEffect(() => {
    fetch("/api/admin/writings")
      .then((res) => {
        if (res.ok) setIsAuthed(true);
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
      } else {
        setAuthError("Invalid password");
      }
    } catch {
      setAuthError("Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Login Gate ──
  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <h1 className="text-headline text-foreground">Admin</h1>
          <p className="text-body text-muted-foreground">Enter password to continue.</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className={inputCls}
          />

          {authError && <p className="text-sm text-destructive">{authError}</p>}

          <button
            type="submit"
            disabled={authLoading || !password}
            className={`${btnPrimary} w-full`}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "writings", label: "Writings" },
    { id: "goals", label: "Goals" },
    { id: "resume", label: "Resume" },
  ];

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-headline text-foreground">Admin</h1>
          <p className="text-body text-muted-foreground">Manage content.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-secondary p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "writings" && <WritingsTab />}
        {activeTab === "goals" && <GoalsTab />}
        {activeTab === "resume" && <ResumeTab />}
      </div>
    </div>
  );
}
