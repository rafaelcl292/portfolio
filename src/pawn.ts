// The hero pawn, drawn the way a terminal would draw it: on a grid of
// character cells, each one a block element. A cell is either one tone or two
// tones split at an eighth (the lower, upper, left and right eighth blocks
// that Unicode gives a TUI), so the lathe-turned outline stays crisp without
// leaving the grid. Colours come from CSS custom properties (`.pw-*`).

export const COLS = 32;
export const ROWS = 29;
const CW = 10;
const CH = 20;
const W = COLS * CW;
const H = ROWS * CH;
const CX = W / 2;

// The Staunton profile as a radius for every height, top to bottom.
const HEAD = { y: 88, r: 88 };
const arc = (t: number, power = 2) =>
  Math.max(0, 1 - Math.abs(t) ** power) ** (1 / power);
function radius(y: number) {
  let r = 0;
  // Collar: a full, rounded disc under the head.
  if (y > 172 && y < 218) r = Math.max(r, 108 * arc((y - 195) / 23, 3));
  // Body: a concave taper that flares towards the base.
  if (y >= 205 && y <= 462) r = Math.max(r, 50 + 64 * ((y - 205) / 257) ** 2.2);
  // Bead above the foot.
  if (y > 450 && y < 486) r = Math.max(r, 116 + 14 * arc((y - 468) / 18));
  // Foot: a bulging turned base that stands flat on the square.
  if (y >= 482 && y <= H)
    r = Math.max(r, 126 + 30 * arc((y - 540) / 60) ** 0.7);
  return r;
}

// 0 empty, 1 lit, 2 shade, 3 deep. One light from the upper left.
function tone(x: number, y: number) {
  const dx = x - CX;
  const dy = y - HEAD.y;
  let nx: number;
  let ny = 0;
  if (dx * dx + dy * dy <= HEAD.r * HEAD.r && y < 174) {
    nx = dx / HEAD.r;
    ny = dy / HEAD.r;
  } else {
    const r = radius(y);
    if (Math.abs(dx) > r) return 0;
    nx = dx / r;
    // Undercuts: below the collar and below the bead.
    if ((y > 217 && y < 236) || (y > 484 && y < 494)) return nx > -0.55 ? 3 : 2;
  }
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const light = -0.62 * nx - 0.5 * ny + 0.6 * nz;
  return light > 0.28 ? 1 : light > -0.3 ? 2 : 3;
}

const SX = 8;
const SY = 16;
type Rect = readonly [x: number, y: number, w: number, h: number];
const rects: Rect[][] = [[], [], [], []];

const majority = (counts: number[]) => counts.indexOf(Math.max(...counts));

for (let row = 0; row < ROWS; row++) {
  let run: { tone: number; from: number } | undefined;
  const flush = (col: number) => {
    if (run && run.tone > 0)
      rects[run.tone]?.push([
        run.from * CW,
        row * CH,
        (col - run.from) * CW,
        CH,
      ]);
    run = undefined;
  };
  for (let col = 0; col < COLS; col++) {
    const samples: number[][] = [];
    const total = [0, 0, 0, 0];
    for (let j = 0; j < SY; j++) {
      const line: number[] = [];
      for (let i = 0; i < SX; i++) {
        const t = tone(
          col * CW + ((i + 0.5) * CW) / SX,
          row * CH + ((j + 0.5) * CH) / SY,
        );
        line.push(t);
        total[t] = (total[t] ?? 0) + 1;
      }
      samples.push(line);
    }
    const whole = majority(total);
    let best = {
      error: SX * SY - (total[whole] ?? 0),
      split: undefined as
        | undefined
        | { vertical: boolean; k: number; a: number; b: number },
    };
    for (const vertical of [false, true]) {
      for (let k = 2; k < 7; k++) {
        const a = [0, 0, 0, 0];
        const b = [0, 0, 0, 0];
        for (let j = 0; j < SY; j++)
          for (let i = 0; i < SX; i++) {
            const first = vertical ? i < k : j < k * 2;
            const t = samples[j]?.[i] ?? 0;
            const side = first ? a : b;
            side[t] = (side[t] ?? 0) + 1;
          }
        const ta = majority(a);
        const tb = majority(b);
        const error = SX * SY - (a[ta] ?? 0) - (b[tb] ?? 0);
        // A split has to earn its place over a plain cell.
        if (ta !== tb && error + 6 < best.error)
          best = { error, split: { vertical, k, a: ta, b: tb } };
      }
    }
    if (!best.split) {
      if (run?.tone !== whole) {
        flush(col);
        run = { tone: whole, from: col };
      }
      continue;
    }
    flush(col);
    const { vertical, k, a, b } = best.split;
    const x = col * CW;
    const y = row * CH;
    const cut = vertical ? (k * CW) / 8 : (k * CH) / 8;
    if (a > 0) rects[a]?.push(vertical ? [x, y, cut, CH] : [x, y, CW, cut]);
    if (b > 0)
      rects[b]?.push(
        vertical ? [x + cut, y, CW - cut, CH] : [x, y + cut, CW, CH - cut],
      );
  }
  flush(COLS);
}

const path = (list: Rect[] = []) =>
  list.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}z`).join("");

const grid = [
  ...Array.from({ length: ROWS - 1 }, (_, i) => `M0 ${(i + 1) * CH}H${W}`),
  ...Array.from({ length: COLS - 1 }, (_, i) => `M${(i + 1) * CW} 0V${H}`),
].join("");

export const pawnSvg = `<svg class="pawn-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><path class="pw-base" d="${path(rects[1])}"/><path class="pw-shade" d="${path(rects[2])}"/><path class="pw-deep" d="${path(rects[3])}"/><path class="pw-grid" d="${grid}" fill="none" vector-effect="non-scaling-stroke"/></svg>`;

export const pawnStage = `<div class="pawn-stage" aria-hidden="true">
          <div class="pawn">${pawnSvg}</div>
        </div>`;
