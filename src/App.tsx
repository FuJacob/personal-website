import { Link } from "react-router-dom";
import { education } from "./data/education";
import { work } from "./data/work";
import { projects } from "./data/projects";
import { contacts } from "./data/contacts";
import { companyLogo, projectLogo } from "./lib/logos";

function App() {
  return (
    <main className="relative w-full bg-[#dfe5e6]">
      {/* Background — fixed to the viewport so content scrolls over it */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Background photo — scaled up so the blur doesn't reveal edges */}
        <img
          src="/background.avif"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-xs"
        />

        {/* Overall white wash */}
        <div className="absolute inset-0 bg-white/30" />

        {/* White vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center,transparent 35%,rgba(255,255,255,0.97) 90%,rgba(255,255,255,1) 100%)",
          }}
        />
      </div>

      {/* Content — at least one screen tall & centered, but grows + scrolls if taller */}
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-lg flex-col gap-6 text-base sm:gap-7 sm:text-lg">
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
              Jacob Fu
            </h1>
            <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/45">
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

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-ink/40 sm:text-sm">
              Education
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
                    <span className="whitespace-nowrap text-xs text-ink/40 sm:ml-auto sm:text-sm">
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
              Work
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
                    <span className="text-xs text-ink/45 sm:text-sm">
                      {w.role}
                    </span>
                    <span className="whitespace-nowrap text-xs text-ink/40 sm:ml-auto sm:text-sm">
                      {w.location} · {w.year}
                    </span>
                  </div>
                  <p className="mt-0.5 pl-7 text-sm text-ink/45 sm:text-base">
                    <span className="arrow" aria-hidden="true">
                      {"→"}
                    </span>{" "}
                    {w.team}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-ink/40 sm:text-sm">
              Projects
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
