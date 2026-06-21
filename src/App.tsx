import { useRef } from "react";
import { Link } from "react-router-dom";
import { education } from "./data/education";
import { work } from "./data/work";
import { projects } from "./data/projects";
import { contacts } from "./data/contacts";
import { companyLogo, projectLogo } from "./lib/logos";
import { useFitToViewport } from "./lib/useFitToViewport";

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  useFitToViewport(contentRef);

  return (
    <main className="relative w-full bg-[#dfe5e6]">
      {/* Background — fixed to the viewport so content scrolls over it */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Background video — scaled up so the blur doesn't reveal edges */}
        <video
          src="/bg.webm"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-xs"
        />

        {/* Overall white wash */}
        <div className="absolute inset-0 bg-white/30" />

        {/* Animated dark-grain vignette */}
        <div
          className="noise-vignette pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
      </div>

      {/* Content — exactly the visible viewport tall; inner block scales to fit */}
      <div
        className="relative z-10 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-6"
        style={{ height: "var(--app-h)" }}
      >
        <div
          ref={contentRef}
          style={{ transformOrigin: "center", willChange: "transform" }}
          className="flex w-full max-w-lg flex-col gap-6 text-base sm:gap-7 sm:text-lg"
        >
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
                hey, i'm Jacob Fu
              </h1>
              <p className="mt-3 max-w-md text-base text-ink/70 sm:text-lg">
                currently in the bay, trying new ideas and places.              </p>
              <nav className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm text-ink/45">
                {contacts.map((c) => {
                  const cls =
                    "underline decoration-transparent decoration-from-font underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60";
                  return c.href.startsWith("/") ? (
                    <Link key={c.label} to={c.href} className={cls}>
                      {c.label}
                    </Link>
                  ) : (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className={cls}
                    >
                      {c.label}
                    </a>
                  );
                })}
              </nav>
            </div>
            <img
              src="/portrait.jpg"
              alt="Jacob Fu"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="size-24 shrink-0 rounded-2xl object-cover shadow-sm sm:size-28"
            />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-ink/40 sm:text-sm">
              studying at
            </p>
            <ul className="flex flex-col gap-3">
              {education.map((e) => (
                <li key={e.school}>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-ink/80">
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 transition-opacity hover:opacity-70"
                    >
                      <img
                        src={companyLogo(e.logo)}
                        alt={e.school}
                        className="size-5 rounded-sm object-cover"
                      />
                    </a>
                    <span className="font-semibold">{e.school}</span>
                    <span className="ml-auto whitespace-nowrap text-xs text-ink/40 sm:text-sm">
                      {e.location}
                    </span>
                  </div>
                  <p className="mt-0.5 pl-7 text-sm text-ink/45 sm:text-base">
                    <span className="arrow" aria-hidden="true">
                      {"→"}
                    </span>{" "}
                    {e.program}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-ink/40 sm:text-sm">
              working / worked at
            </p>
            <ul className="flex flex-col gap-3">
              {work.map((w, i) => (
                <li key={`${w.company}-${i}`}>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-ink/80">
                    <a
                      href={w.href}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 transition-opacity hover:opacity-70"
                    >
                      <img
                        src={companyLogo(w.logo)}
                        alt={w.company}
                        className="size-5 rounded-sm object-cover"
                      />
                    </a>
                    <span className="font-semibold">{w.company}</span>
                    <span className="ml-auto whitespace-nowrap text-xs text-ink/40 sm:text-sm">
                      {w.location}
                    </span>
                  </div>
                  {w.stints.map((s) => (
                    <p
                      key={s.year}
                      className="mt-0.5 flex items-baseline gap-x-2 pl-7 text-sm text-ink/45 sm:text-base"
                    >
                      <span>
                        <span className="arrow" aria-hidden="true">
                          {"→"}
                        </span>{" "}
                        {s.team}
                      </span>
                      <span className="ml-auto whitespace-nowrap text-xs text-ink/40 sm:text-sm">
                        {s.year}
                      </span>
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-ink/40 sm:text-sm">
              building / built
            </p>
            <ul className="flex flex-col gap-3">
              {projects.map((p) => {
                const logo = projectLogo(p.logo);
                return (
                  <li key={p.name}>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-ink/80">
                      {logo ? (
                        <img
                          src={logo}
                          alt={p.name}
                          className="size-5 shrink-0 rounded-sm object-cover"
                        />
                      ) : (
                        <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-ink/85 text-[0.65rem] font-semibold text-white">
                          {p.name.charAt(0)}
                        </span>
                      )}
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold underline decoration-transparent decoration-from-font underline-offset-4 transition-colors hover:decoration-ink"
                      >
                        {p.name}
                      </a>
                      <span className="text-xs text-ink/45 sm:text-sm">
                        {p.description}
                      </span>
                    </div>
                    <p className="mt-0.5 pl-7 text-sm text-ink/45 sm:text-base">
                      <span className="arrow" aria-hidden="true">
                        {"→"}
                      </span>{" "}
                      {p.detail}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
