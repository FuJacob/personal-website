import { Link } from "react-router-dom";
import background from "./assets/background.jpg";
import { education } from "./data/education";
import { work } from "./data/work";
import { projects } from "./data/projects";
import { contacts } from "./data/contacts";
import { companyLogo, projectLogo } from "./lib/logos";

function App() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* Background photo — scaled up so the blur doesn't reveal edges */}
      <img
        src={background}
        alt=""
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

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <div className="flex w-full max-w-md flex-col gap-7 text-lg">
          <div>
            <h1 className="font-serif text-5xl font-bold tracking-tight">
              Jacob Fu
            </h1>
            <p className="mt-2 font-serif text-xl italic text-ink/70">
              Trying different things
            </p>
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
            <p className="mb-2 text-sm uppercase tracking-widest text-ink/40">
              Education
            </p>
            <ul className="flex flex-col gap-3">
              {education.map((e) => (
                <li key={e.school}>
                  <div className="flex items-center gap-2 text-ink/80">
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
                    <span className="ml-auto whitespace-nowrap text-sm text-ink/40">
                      {e.location}
                    </span>
                  </div>
                  <p className="mt-0.5 pl-7 text-base text-ink/45">
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
            <p className="mb-2 text-sm uppercase tracking-widest text-ink/40">
              Work
            </p>
            <ul className="flex flex-col gap-3">
              {work.map((w, i) => (
                <li key={`${w.company}-${i}`}>
                  <div className="flex items-center gap-2 text-ink/80">
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
                    <span className="text-sm text-ink/45">{w.role}</span>
                    <span className="ml-auto whitespace-nowrap text-sm text-ink/40">
                      {w.location} · {w.year}
                    </span>
                  </div>
                  <p className="mt-0.5 pl-7 text-base text-ink/45">
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
            <p className="mb-2 text-sm uppercase tracking-widest text-ink/40">
              Projects
            </p>
            <ul className="flex flex-col gap-3">
              {projects.map((p) => {
                const logo = projectLogo(p.logo);
                return (
                  <li key={p.name}>
                    <div className="flex items-center gap-2 text-ink/80">
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
                      <span className="text-sm text-ink/45">
                        {p.description}
                      </span>
                    </div>
                    <p className="mt-0.5 pl-7 text-base text-ink/45">
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
