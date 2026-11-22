import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./App.css";
import { PaintProvider, Paintable, usePaint } from "./paint";
import { StyleToolbar } from "./StyleToolbar";

/** A link's hover highlight: the brand's color, and a text color that stays readable on it. */
type Brand = { color: string; ink: string };

// The site's own yellow paint highlight, for links that have no brand of their own.
const defaultBrand: Brand = { color: "#ffe94d", ink: "#000" };

// The "leave a mark on any word" toolbar is hidden for now. Flip to true to bring it back.
const SHOW_STYLE_TOOLBAR = false;

type ExternalLinkProps = {
  href: string;
  brand?: Brand;
  /** Paintable block name for the link text. */
  paintId: string;
  children: string;
};

/** Renders a page link with the same pixel arrow and underline everywhere. */
function ExternalLink({
  href,
  brand = defaultBrand,
  paintId,
  children,
}: ExternalLinkProps) {
  const opensWebsite = !href.startsWith("mailto:");

  return (
    <a
      className="brand-link inline-flex items-center gap-1 border-b border-black pb-0.5 leading-tight"
      style={
        { "--brand": brand.color, "--brand-ink": brand.ink } as CSSProperties
      }
      href={href}
      target={opensWebsite ? "_blank" : undefined}
      rel={opensWebsite ? "noreferrer" : undefined}
    >
      <span>
        <Paintable id={paintId}>{children}</Paintable>
      </span>
      <svg
        className="size-[9px] max-sm:size-[7px]"
        viewBox="0 0 7 7"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {/* A small pixel arrow that points up and to the right. */}
        <path d="M2 0h5v5H6V2H5v1H4v1H3v1H2v1H1v1H0V6h1V5h1V4h1V3h1V2h1V1H2z" />
      </svg>
    </a>
  );
}

const brands = {
  black: { color: "#000", ink: "#fff" },
  ramp: { color: "#e4f222", ink: "#000" },
  hyperwrite: { color: "#7c5cff", ink: "#fff" },
  hubspot: { color: "#ff7a59", ink: "#000" },
} satisfies Record<string, Brand>;

const socialLinks = [
  { name: "x", href: "https://x.com/fujacobb/", brand: brands.black },
  { name: "github", href: "https://github.com/fujacob/", brand: brands.black },
  {
    name: "linkedin",
    href: "https://www.linkedin.com/in/fujacob/",
    brand: { color: "#0a66c2", ink: "#fff" },
  },
  {
    name: "youtube",
    href: "https://www.youtube.com/@jjacobfu",
    brand: { color: "#ff0000", ink: "#fff" },
  },
  { name: "mail", href: "mailto:jjacobfu@gmail.com", brand: defaultBrand },
];

const roles = [
  {
    dates: "08/2026 - present",
    company: "ramp",
    brand: brands.ramp,
    href: "https://ramp.com/",
    role: "intern, accounting engineering",
  },
  {
    dates: "08/2026 - 08/2026",
    company: "hyperwrite",
    brand: brands.hyperwrite,
    href: "https://www.hyperwriteai.com/",
    role: "engineer, ai writing",
  },
  {
    dates: "05/2026 - 08/2026",
    company: "uber",
    brand: brands.black,
    href: "https://uber.com/",
    role: "intern, safety media platform",
  },
  {
    dates: "01/2026 - 04/2026",
    company: "hubspot",
    brand: brands.hubspot,
    href: "https://hubspot.com/",
    role: "intern, ai content editor",
  },
  {
    dates: "05/2025 - 08/2025",
    company: "hubspot",
    brand: brands.hubspot,
    href: "https://hubspot.com/",
    role: "intern, sales workspace",
  },
];

const projects = [
  {
    name: "cotabby.app",
    href: "https://cotabby.app/",
    brand: { color: "#4169e1", ink: "#fff" },
    detail: "ai autocomplete for macos, 17k+ installs and 1,100+ stars",
  },
  {
    name: "metro apocalypse",
    href: "https://www.patreon.com/amuletio",
    brand: { color: "#39d353", ink: "#000" },
    detail:
      "a multiplayer zombie tag .io game, 248k+ players, 4.2m+ plays, and $2.5k+ in patreon revenue",
  },
];

/** Turns any label into a word-ID-safe slug, such as `hubspot-05-2025`. */
function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Keyed by company and start date so reordering the lists doesn't move anyone's marks.
const roleKey = (role: (typeof roles)[number]) =>
  `role-${slug(role.company)}-${slug(role.dates.split(" ")[0])}`;
const projectKey = (project: (typeof projects)[number]) =>
  `project-${slug(project.name)}`;

type GrassLayerSettings = {
  name: "far" | "back" | "front";
  count: number;
  minHeight: number;
  maxHeight: number;
  seed: number;
};

/** Small seeded generator so the grass looks random but stays the same on every load. */
function createRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

/** Builds one pixel tuft from a few blades that curve away from the center. */
function createTuftPath(height: number, random: () => number) {
  const bladeCount = 2 + Math.floor(random() * 3);
  const segments: string[] = [];

  for (let blade = 0; blade < bladeCount; blade += 1) {
    const baseX = 3 + Math.floor(random() * 7);
    const lean = random() * 2 - 1;
    const bladeHeight = Math.round(height * (0.55 + random() * 0.45));

    // Stack 2px-wide pixels upward, bending more near the tip like real grass.
    for (let y = 0; y < bladeHeight; y += 2) {
      const bend = Math.round(lean * (y / bladeHeight) ** 2 * 4);
      segments.push(`M${baseX + bend} ${height - y - 2}h2v2h-2z`);
    }
  }

  return segments.join("");
}

const grassLayerSettings: GrassLayerSettings[] = [
  { name: "far", count: 230, minHeight: 26, maxHeight: 48, seed: 7 },
  { name: "back", count: 280, minHeight: 18, maxHeight: 38, seed: 11 },
  { name: "front", count: 170, minHeight: 16, maxHeight: 32, seed: 29 },
];

const grassLayers = grassLayerSettings.map((layer) => {
  const random = createRandom(layer.seed);

  return {
    name: layer.name,
    tufts: Array.from({ length: layer.count }, (_, index) => {
      // Space tufts unevenly across the screen so the grass does not form a repeating pattern.
      const left = ((index + random() * 0.85) / layer.count) * 100;
      const height = Math.round(
        layer.minHeight + random() * (layer.maxHeight - layer.minHeight),
      );

      return {
        left,
        height,
        path: createTuftPath(height, random),
        duration: 3.6 + random() * 1.6,
        // Tufts farther right start later, so the breeze rolls across the field.
        delay: -(left / 100) * 5 - random() * 0.6,
      };
    }),
  };
});

// The sun is drawn on a pixel grid, one SVG unit per pixel, just like the grass blades.
const SUN_SIZE = 49;
const SUN_CENTER = 24;
const SUN_RAY_COUNT = 8;
const SUN_FRAME_COUNT = 4;

/** Turns every grid cell that passes the test into one path, merging runs along each row. */
function sunCellsToPath(isFilled: (dx: number, dy: number) => boolean) {
  const segments: string[] = [];

  for (let y = 0; y < SUN_SIZE; y += 1) {
    let x = 0;
    while (x < SUN_SIZE) {
      if (!isFilled(x - SUN_CENTER, y - SUN_CENTER)) {
        x += 1;
        continue;
      }
      let end = x;
      while (end < SUN_SIZE && isFilled(end - SUN_CENTER, y - SUN_CENTER))
        end += 1;
      segments.push(`M${x} ${y}h${end - x}v1h-${end - x}z`);
      x = end;
    }
  }

  return segments.join("");
}

const sunDiscPath = sunCellsToPath((dx, dy) => {
  const distance = Math.hypot(dx, dy);
  return distance > 9.5 && distance <= 11.5;
});

// Each frame turns the rays a little further. Every frame is redrawn on the grid,
// so the sun looks like it turns without blurring the pixels the way a CSS rotation would.
const sunRayFrames = Array.from({ length: SUN_FRAME_COUNT }, (_, frame) => {
  const rayGap = (2 * Math.PI) / SUN_RAY_COUNT;
  const offset = (frame / SUN_FRAME_COUNT) * rayGap;

  return sunCellsToPath((dx, dy) => {
    for (let ray = 0; ray < SUN_RAY_COUNT; ray += 1) {
      const angle = offset + ray * rayGap;
      const along = dx * Math.cos(angle) + dy * Math.sin(angle);
      const across = -dx * Math.sin(angle) + dy * Math.cos(angle);
      if (along >= 14 && along <= 21 && Math.abs(across) <= 1) return true;
    }
    return false;
  });
});

// Seagull flap frames on a 15 x 7 pixel grid. The body stays on the same row in every frame.
const SEAGULL_WIDTH = 15;
const SEAGULL_HEIGHT = 7;
const seagullFrames = {
  up: [
    "x.............x",
    ".x...........x.",
    "..xx.......xx..",
    "....xx...xx....",
    "......xxx......",
    "...............",
    "...............",
  ],
  glide: [
    "...............",
    "...............",
    "..xxx.....xxx..",
    ".x...xx.xx...x.",
    "x......x......x",
    "...............",
    "...............",
  ],
  down: [
    "...............",
    "...............",
    "...............",
    "...............",
    "...xxxxxxxxx...",
    "..x.........x..",
    ".x...........x.",
  ],
};

// Two flaps, then a glide, the way gulls ride the wind.
const seagullSequence: (keyof typeof seagullFrames)[] = [
  "up",
  "glide",
  "down",
  "glide",
  "up",
  "glide",
  "down",
  "glide",
  "glide",
  "glide",
  "glide",
  "glide",
  "glide",
  "glide",
];

// Every frame sits side by side in one strip. CSS slides the strip one frame at a time.
const seagullStripPath = seagullSequence
  .flatMap((frameName, frame) =>
    seagullFrames[frameName].flatMap((row, y) =>
      [...row].flatMap((cell, x) =>
        cell === "x" ? [`M${frame * SEAGULL_WIDTH + x} ${y}h1v1h-1z`] : [],
      ),
    ),
  )
  .join("");

const seagulls = (() => {
  const random = createRandom(41);

  return Array.from({ length: 5 }, (_, index) => {
    // The last two are far away, so they are smaller, fainter and slower, like the far grass.
    const isFar = index >= 3;
    const duration = isFar ? 40 + random() * 12 : 22 + random() * 8;

    return {
      isFar,
      top: 6 + random() * 26,
      duration,
      // Negative delays put some gulls mid-flight on load instead of all entering together.
      delay: -(index / 5) * duration - random() * 4,
      flapFrameTime: 0.09 + random() * 0.04,
      bobDuration: 2.5 + random() * 2,
      flipped: random() < 0.4,
    };
  });
})();

type BoyPose = "left" | "right" | "up-left" | "up-center" | "up-right";

const boyImages: Record<BoyPose, string> = {
  left: "/boy-left.png",
  right: "/boy-right.png",
  "up-left": "/boy-up-left.png",
  "up-center": "/boy-up-center.png",
  "up-right": "/boy-up-right.png",
};

function App() {
  return (
    <PaintProvider>
      <Page />
    </PaintProvider>
  );
}

function Page() {
  const { tool } = usePaint();
  const [boyPose, setBoyPose] = useState<BoyPose>("right");
  const boyRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const updateBoyDirection = (event: PointerEvent) => {
      const boyBounds = boyRef.current?.getBoundingClientRect();
      const isAbove = event.clientY < window.innerHeight / 2;
      // Face forward whenever the cursor is lined up with the boy, at any height.
      const isDirectlyAbove =
        boyBounds !== undefined &&
        event.clientX >= boyBounds.left &&
        event.clientX <= boyBounds.right;
      // The boy is centered, so the middle of the window decides left or right.
      const horizontal =
        event.clientX < window.innerWidth / 2 ? "left" : "right";
      const nextPose: BoyPose = isDirectlyAbove
        ? "up-center"
        : isAbove
          ? `up-${horizontal}`
          : horizontal;
      setBoyPose(nextPose);
    };

    window.addEventListener("pointermove", updateBoyDirection);
    return () => window.removeEventListener("pointermove", updateBoyDirection);
  }, []);

  return (
    <main className={tool === null ? "page" : `page painting painting-${tool}`}>
      <svg
        className="sun"
        viewBox={`0 0 ${SUN_SIZE} ${SUN_SIZE}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path d={sunDiscPath} />
        {sunRayFrames.map((path, frame) => (
          <path key={frame} className={`sun-rays sun-rays-${frame}`} d={path} />
        ))}
      </svg>

      <div className="sky" aria-hidden="true">
        {seagulls.map((gull, index) => (
          <div
            key={index}
            className={
              gull.isFar ? "seagull-flight seagull-far" : "seagull-flight"
            }
            style={{
              top: `${gull.top}%`,
              animationDuration: `${gull.duration}s`,
              animationDelay: `${gull.delay}s`,
              animationDirection: gull.flipped ? "reverse" : "normal",
            }}
          >
            <div
              className="seagull-bob"
              style={{ animationDuration: `${gull.bobDuration}s` }}
            >
              <div className="seagull">
                <svg
                  className="seagull-strip"
                  viewBox={`0 0 ${SEAGULL_WIDTH * seagullSequence.length} ${SEAGULL_HEIGHT}`}
                  shapeRendering="crispEdges"
                  style={{
                    animationDuration: `${gull.flapFrameTime * seagullSequence.length}s`,
                  }}
                >
                  <path d={seagullStripPath} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <article className="mx-auto w-full max-w-2xl px-6 pt-12 max-sm:px-4 max-sm:pt-8 pb-[calc(var(--ground-offset)+var(--ground-height)+min(26svh,14rem)+3rem)] font-pixel text-lg leading-7 text-black max-sm:text-xs max-sm:leading-5">
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1>
            <Paintable id="name">jacob fu</Paintable>
          </h1>
          <nav aria-label="Social links" className="flex flex-wrap gap-x-3">
            {socialLinks.map((link) => (
              <ExternalLink
                key={link.name}
                href={link.href}
                brand={link.brand}
                paintId={`social-${link.name}`}
              >
                {link.name}
              </ExternalLink>
            ))}
          </nav>
        </header>

        <p className="mt-6">
          <Paintable id="bio-1">
            {`hi there! i'm a computer science student at the university of waterloo. i grew up in
          kingston, ontario, canada, and love playing badminton and eating good food.`}
          </Paintable>
        </p>
        <p className="mt-4">
          <Paintable id="bio-2">
            {`right now i'm at ramp in new york. if you ever want to`}
          </Paintable>{" "}
          <ExternalLink href="mailto:jjacobfu@gmail.com" paintId="bio-2-chat">
            chat
          </ExternalLink>
          <Paintable id="bio-2-end">
            {`, i'm always down to make a new connection :)`}
          </Paintable>
        </p>

        <h2 className="mt-6">
          <Paintable id="work-heading">some places i've worked at:</Paintable>
        </h2>
        <ul>
          {roles.map((role) => {
            const paintId = roleKey(role);
            return (
              <li key={paintId} className="hanging-indent">
                <Paintable
                  id={`${paintId}-dates`}
                >{`(${role.dates})`}</Paintable>{" "}
                <ExternalLink
                  href={role.href}
                  brand={role.brand}
                  paintId={`${paintId}-company`}
                >
                  {role.company}
                </ExternalLink>{" "}
                <Paintable id={`${paintId}-role`}>{`- ${role.role}`}</Paintable>
              </li>
            );
          })}
        </ul>

        <h2 className="mt-6">
          <Paintable id="projects-heading">some things i've built:</Paintable>
        </h2>
        <ul>
          {projects.map((project) => (
            <li key={project.name} className="hanging-indent">
              <ExternalLink
                href={project.href}
                brand={project.brand}
                paintId={`${projectKey(project)}-name`}
              >
                {project.name}
              </ExternalLink>{" "}
              <Paintable
                id={`${projectKey(project)}-detail`}
              >{`- ${project.detail}`}</Paintable>
            </li>
          ))}
        </ul>

        {SHOW_STYLE_TOOLBAR && <StyleToolbar />}
      </article>

      <img
        ref={boyRef}
        className="pixel-boy"
        src={boyImages[boyPose]}
        width="492"
        height="577"
        alt="A black-and-white pixel-art boy sitting and leaning back, seen from behind"
      />

      {grassLayers.map((layer) => (
        <div
          key={layer.name}
          className={`grass grass-${layer.name}`}
          aria-hidden="true"
        >
          {layer.tufts.map((tuft, index) => (
            <svg
              key={index}
              className="grass-tuft"
              viewBox={`0 0 14 ${tuft.height}`}
              width="14"
              height={tuft.height}
              shapeRendering="crispEdges"
              style={{
                left: `${tuft.left}%`,
                animationDuration: `${tuft.duration}s`,
                animationDelay: `${tuft.delay}s`,
              }}
            >
              <path d={tuft.path} />
            </svg>
          ))}
        </div>
      ))}
      <div className="grass-ground" aria-hidden="true" />

      {/* Covers the page during the intro, then blinks open like waking eyes. */}
      <div className="eyelids" aria-hidden="true" />
      <p className="intro-text" aria-hidden="true">
        wakey wakey
      </p>
    </main>
  );
}

export default App;
