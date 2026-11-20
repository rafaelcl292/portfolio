// The hero pawn: a turned Staunton pawn drawn as stacked, mirrored profiles.
// Colours come from CSS custom properties (see `.pw-*` in style.css), so the
// piece is boxwood on the dark theme and ebony on the light one.

type Point = readonly [number, number];
type Segment = readonly [Point, Point, Point];

const CENTRE = 200;
const at = ([x, y]: Point) => `${x} ${y}`;
const mirrored = ([x, y]: Point) => `${CENTRE * 2 - x} ${y}`;

/**
 * Builds a closed, symmetric shape from its right-hand profile (top to bottom).
 * `bow` curves the bottom edge downwards, as seen from slightly above.
 */
function turned(start: Point, segments: readonly Segment[], bow: number) {
  let d = `M${at(start)}`;
  let end = start;
  for (const [a, b, c] of segments) {
    d += `C${at(a)} ${at(b)} ${at(c)}`;
    end = c;
  }
  d += `Q${CENTRE} ${end[1] + bow * 2} ${mirrored(end)}`;
  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i];
    if (!segment) continue;
    const previous = segments[i - 1]?.[2] ?? start;
    d += `C${mirrored(segment[1])} ${mirrored(segment[0])} ${mirrored(previous)}`;
  }
  return `${d}Z`;
}

const foot = turned(
  [318, 498],
  [
    [
      [344, 500],
      [353, 513],
      [353, 529],
    ],
    [
      [353, 549],
      [347, 566],
      [339, 573],
    ],
  ],
  9,
);
const bead = turned(
  [316, 473],
  [
    [
      [331, 473],
      [335, 481],
      [335, 487],
    ],
    [
      [335, 494],
      [331, 500],
      [321, 501],
    ],
  ],
  8,
);
const body = turned(
  [245, 230],
  [
    [
      [249, 330],
      [266, 420],
      [322, 476],
    ],
  ],
  7,
);
const fillet = turned(
  [261, 219],
  [
    [
      [268, 222],
      [268, 232],
      [257, 236],
    ],
  ],
  3,
);
const collar = turned(
  [236, 188],
  [
    [
      [272, 188],
      [297, 196],
      [297, 207],
    ],
    [
      [297, 217],
      [289, 224],
      [265, 224],
    ],
  ],
  4,
);

const stops = (values: readonly (readonly [number, string])[]) =>
  values
    .map(([offset, name]) => `<stop offset="${offset}" class="${name}"/>`)
    .join("");
// "lit" and "dark" take the theme's highlight and deepest wood tones, so form
// shading stays warm instead of greying the piece; anything else is literal.
const tint = (values: readonly (readonly [number, string, number])[]) =>
  values
    .map(
      ([offset, colour, opacity]) =>
        `<stop offset="${offset}" ${colour === "lit" ? 'class="pw-high"' : colour === "dark" ? 'class="pw-deep"' : `stop-color="${colour}"`} stop-opacity="${opacity}"/>`,
    )
    .join("");
const shaded = (d: string, overlay: string) =>
  `<path d="${d}" fill="url(#pw-turned)"/><path d="${d}" fill="url(#${overlay})"/>`;

export const pawnSvg = `<svg class="pawn-svg" viewBox="0 20 400 572" width="400" height="572" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="pw-turned" x1="0" x2="1" y1="0" y2="0">${stops([
      [0, "pw-edge"],
      [0.1, "pw-light"],
      [0.27, "pw-high"],
      [0.5, "pw-mid"],
      [0.78, "pw-shade"],
      [0.93, "pw-deep"],
      [1, "pw-rim"],
    ])}</linearGradient>
    <radialGradient id="pw-ball" cx="0.5" cy="0.5" r="0.5" fx="0.33" fy="0.27">${stops(
      [
        [0, "pw-high"],
        [0.22, "pw-light"],
        [0.55, "pw-mid"],
        [0.84, "pw-shade"],
        [1, "pw-deep"],
      ],
    )}</radialGradient>
    <radialGradient id="pw-ball-rim" cx="0.38" cy="0.34" r="0.74"><stop offset="0.86" class="pw-rim" stop-opacity="0"/><stop offset="1" class="pw-rim" stop-opacity="0.75"/></radialGradient>
    <radialGradient id="pw-gloss">${tint([
      [0, "#fff", 0.9],
      [0.35, "#fff", 0.35],
      [1, "#fff", 0],
    ])}</radialGradient>
    <radialGradient id="pw-sheen">${tint([
      [0, "lit", 0.9],
      [1, "lit", 0],
    ])}</radialGradient>
    <radialGradient id="pw-contact">${tint([
      [0, "dark", 0.85],
      [0.6, "dark", 0.45],
      [1, "dark", 0],
    ])}</radialGradient>
    <linearGradient id="pw-ring" x1="0" x2="0" y1="0" y2="1">${tint([
      [0, "lit", 0.45],
      [0.32, "lit", 0],
      [0.55, "dark", 0],
      [0.8, "dark", 0.3],
      [1, "dark", 0.7],
    ])}</linearGradient>
    <linearGradient id="pw-stem" x1="0" x2="0" y1="0" y2="1">${tint([
      [0, "dark", 0.8],
      [0.07, "dark", 0.52],
      [0.15, "dark", 0.24],
      [0.25, "dark", 0.07],
      [0.36, "dark", 0],
      [0.8, "dark", 0],
      [0.92, "dark", 0.12],
      [1, "dark", 0.4],
    ])}</linearGradient>
    <linearGradient id="pw-foot" x1="0" x2="0" y1="0" y2="1">${tint([
      [0, "dark", 0.55],
      [0.16, "lit", 0.4],
      [0.45, "lit", 0],
      [0.6, "dark", 0],
      [0.85, "dark", 0.35],
      [1, "dark", 0.75],
    ])}</linearGradient>
    <clipPath id="pw-collar-clip"><path d="${collar}"/></clipPath>
  </defs>
  ${shaded(foot, "pw-foot")}
  <ellipse cx="116" cy="513" rx="40" ry="5" fill="url(#pw-sheen)" opacity="0.7"/>
  ${shaded(bead, "pw-ring")}
  ${shaded(body, "pw-stem")}
  ${shaded(fillet, "pw-ring")}
  ${shaded(collar, "pw-ring")}
  <ellipse cx="206" cy="197" rx="78" ry="13" fill="url(#pw-contact)" clip-path="url(#pw-collar-clip)"/>
  <ellipse cx="146" cy="199" rx="26" ry="4" fill="url(#pw-sheen)" opacity="0.8"/>
  <circle cx="200" cy="116" r="84" fill="url(#pw-ball)"/>
  <circle cx="200" cy="116" r="84" fill="url(#pw-ball-rim)"/>
  <ellipse cx="166" cy="82" rx="30" ry="19" transform="rotate(-30 166 82)" fill="url(#pw-gloss)" class="pw-spec"/>
</svg>`;

export const pawnStage = `<div class="pawn-stage" aria-hidden="true">
          <span class="pawn-pool"></span>
          <span class="pawn-shadow"></span>
          <span class="pawn-ring"></span><span class="pawn-ring pawn-ring-2"></span>
          ${[1, 2, 3, 4, 5, 6].map((n) => `<span class="dust dust-${n}"></span>`).join("")}
          <div class="pawn">${pawnSvg}</div>
        </div>`;
