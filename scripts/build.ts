import { cp, mkdir, rm } from "node:fs/promises";
import { basename } from "node:path";
import * as fontkit from "fontkit";
import sharp from "sharp";
import { monogramPath } from "../src/monogram";
import { renderSite } from "../src/site";
import { buildResumes } from "./resume";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await mkdir("dist/resume", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("public/chessh.png", "dist/assets/chessh.png");
await rm("dist/chessh.png");
const fonts = {
  fraunces: ["fraunces", "fraunces-latin-opsz-normal"],
  geist: ["geist", "geist-latin-wght-normal"],
  "geist-mono": ["geist-mono", "geist-mono-latin-wght-normal"],
} as const;
for (const [name, [pkg, file]] of Object.entries(fonts)) {
  const dir = `node_modules/@fontsource-variable/${pkg}`;
  await cp(`${dir}/files/${file}.woff2`, `dist/assets/${name}.woff2`);
  await cp(`${dir}/LICENSE`, `dist/assets/${name}-LICENSE.txt`);
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
  axes: Record<string, number>,
  value: string,
  size: number,
  x: number,
  y: number,
  tracking = 0,
) => {
  const base = fontkit.openSync(file);
  if (!("getVariation" in base)) throw new Error(`Not a single font: ${file}`);
  const font = base.getVariation(axes);
  const scale = size / font.unitsPerEm;
  let pen = x;
  let d = "";
  for (const glyph of font.layout(value).glyphs) {
    d += glyph.path.scale(scale, -scale).translate(pen, y).toSVG();
    pen += glyph.advanceWidth * scale + tracking * size;
  }
  return { d, width: pen - x };
};
const serif = "dist/assets/fraunces.woff2";
const mono = "dist/assets/geist-mono.woff2";
const display = { wght: 370, opsz: 144 };
const site = outline(mono, { wght: 400 }, "rafaelcl.com", 24, 0, 0);
await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#14110e"/><rect x="80" y="72" width="56" height="56" rx="12" fill="#e2b866"/><path transform="translate(80 72) scale(.875)" fill="#14110e" d="${monogramPath}"/><path fill="#aba190" d="${outline(mono, { wght: 400 }, "SOFTWARE DEVELOPER / SÃO PAULO, BRAZIL", 21, 160, 108, 0.08).d}"/><path fill="#f1eadb" d="${outline(serif, display, "Rafael Coca", 132, 74, 318, -0.04).d}"/><path fill="#e2b866" d="${outline(serif, display, "Leventhal", 132, 74, 446, -0.04).d}"/><path d="M80 506H1120" stroke="#322b23"/><path fill="#f1eadb" d="${outline(mono, { wght: 400 }, "C# / .NET · React · Rust · Zig", 24, 80, 562).d}"/><path fill="#aba190" d="${outline(mono, { wght: 400 }, "rafaelcl.com", 24, 1120 - site.width, 562).d}"/></svg>`,
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
