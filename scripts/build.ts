import { cp, mkdir, rm } from "node:fs/promises";
import { basename } from "node:path";
import * as fontkit from "fontkit";
import sharp from "sharp";
import { monogramCursor, monogramPath } from "../src/monogram";
import { pawnSvg } from "../src/pawn";
import { renderSite } from "../src/site";
import { buildResumes } from "./resume";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await mkdir("dist/resume", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("public/chessh.png", "dist/assets/chessh.png");
await rm("dist/chessh.png");
const fonts = [
  ["monaspace-argon", 400],
  ["monaspace-argon", 600],
  ["monaspace-xenon", 500],
] as const;
for (const [family, weight] of fonts) {
  const dir = `node_modules/@fontsource/${family}`;
  await cp(
    `${dir}/files/${family}-latin-${weight}-normal.woff2`,
    `dist/assets/${family}-${weight}.woff2`,
  );
  await cp(`${dir}/LICENSE`, `dist/assets/${family}-LICENSE.txt`);
}
await cp("src/resume.css", "dist/assets/resume.css");
await cp("assets/fonts/LICENSE", "dist/assets/liberation-LICENSE.txt");
const css = await Bun.file("src/style.css").text();
const cssName = `style-${new Bun.CryptoHasher("sha256").update(css).digest("hex").slice(0, 12)}.css`;
await Bun.write(`dist/assets/${cssName}`, css);
async function bundle(entry: string, format: "esm" | "iife") {
  const result = await Bun.build({
    entrypoints: [entry],
    outdir: "dist/assets",
    naming: "[name]-[hash].[ext]",
    target: "browser",
    format,
    minify: true,
  });
  if (!result.success || !result.outputs[0])
    throw new AggregateError(result.logs, `Build failed: ${entry}`);
  return basename(result.outputs[0].path);
}
await Bun.write(
  "dist/index.html",
  renderSite(
    cssName,
    await bundle("src/client.ts", "esm"),
    await bundle("src/theme.ts", "iife"),
  ),
);
await buildResumes();

// Social card. Text is converted to outlines so it renders in the site's
// typefaces on any machine.
const outline = (
  file: string,
  value: string,
  size: number,
  x: number,
  y: number,
) => {
  const font = fontkit.openSync(file);
  if (!("layout" in font)) throw new Error(`Not a single font: ${file}`);
  const scale = size / font.unitsPerEm;
  let pen = x;
  let d = "";
  for (const glyph of font.layout(value).glyphs) {
    d += glyph.path.scale(scale, -scale).translate(pen, y).toSVG();
    pen += glyph.advanceWidth * scale;
  }
  return { d, width: pen - x };
};
const display = "dist/assets/monaspace-xenon-500.woff2";
const text = "dist/assets/monaspace-argon-400.woff2";
const site = outline(text, "rafaelcl.com", 24, 0, 0);
const cardPawn = pawnSvg
  .replace("<svg ", '<svg x="840" y="92" ')
  .replace(/width="\d+" height="\d+"/, 'width="240" height="435"');
await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><style>.pw-base{fill:#ece6d6}.pw-shade{fill:#b3aecb}.pw-deep{fill:#7d7aa8}</style><rect width="1200" height="630" fill="#1b1f3a"/><rect x="80" y="72" width="56" height="56" fill="#ece6d6"/><g transform="translate(80 72) scale(.875)"><path fill="#1b1f3a" d="${monogramPath}"/><rect x="${monogramCursor.x}" y="${monogramCursor.y}" width="${monogramCursor.width}" height="${monogramCursor.height}" fill="#1b1f3a" opacity=".45"/></g>${cardPawn}<rect x="817.5" y="527" width="285" height="8" fill="#eaa66c"/><path d="M80 527.5H1120" stroke="#3d4372"/><path fill="#ece6d6" d="${outline(display, "Rafael Coca", 80, 76, 290).d}"/><path fill="#ece6d6" d="${outline(display, "Leventhal", 80, 76, 386).d}"/><path fill="#adb1cd" d="${outline(text, "Software developer, full-stack and backend", 24, 80, 452).d}"/><path fill="#ece6d6" d="${outline(text, "C#/.NET, React, Rust, Zig", 24, 80, 584).d}"/><path fill="#adb1cd" d="${outline(text, "rafaelcl.com", 24, 1120 - site.width, 584).d}"/></svg>`,
  ),
)
  .png()
  .toFile("dist/assets/social.png");
const html = await Bun.file("dist/index.html").text();
const links = [...html.matchAll(/(?:src|href)="(\/(?!\/)[^"]+)"/g)].map(
  (match) => match[1],
);
for (const link of links) {
  if (link && link !== "/" && !(await Bun.file(`dist${link}`).exists()))
    throw new Error(`Missing local asset: ${link}`);
}
console.log(
  `Built static portfolio: ${links.length} local asset references verified.`,
);
