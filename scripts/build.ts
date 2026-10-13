import { cp, mkdir, rm } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";
import { renderSite } from "../src/site";
import { buildResumes } from "./resume";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await mkdir("dist/resume", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("public/chessh.png", "dist/assets/chessh.png");
await rm("dist/chessh.png");
await cp(
  "node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  "dist/assets/manrope.woff2",
);
await cp(
  "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
  "dist/assets/instrument-serif.woff2",
);
await cp(
  "node_modules/@fontsource-variable/manrope/LICENSE",
  "dist/assets/manrope-LICENSE.txt",
);
await cp(
  "node_modules/@fontsource/instrument-serif/LICENSE",
  "dist/assets/instrument-serif-LICENSE.txt",
);
await cp("src/resume.css", "dist/assets/resume.css");
await cp("assets/fonts/LICENSE", "dist/assets/liberation-LICENSE.txt");
const css = await Bun.file("src/style.css").text();
const cssName = `style-${new Bun.CryptoHasher("sha256").update(css).digest("hex").slice(0, 12)}.css`;
await Bun.write(`dist/assets/${cssName}`, css);
const result = await Bun.build({
  entrypoints: ["src/client.ts"],
  outdir: "dist/assets",
  naming: "[name]-[hash].[ext]",
  target: "browser",
  minify: true,
});
if (!result.success || !result.outputs[0])
  throw new AggregateError(result.logs, "Client build failed");
await Bun.write(
  "dist/index.html",
  renderSite(cssName, basename(result.outputs[0].path)),
);
await buildResumes();
await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#141715"/><circle cx="78" cy="94" r="6" fill="#c2dc99"/><g font-family="sans-serif"><text x="98" y="102" font-size="23" fill="#a5aaa3">FULL-STACK DEVELOPER · BACKEND FOCUSED</text><text x="70" y="270" font-size="92" fill="#efeee7">Rafael Coca</text><text x="70" y="377" font-size="100" fill="#c2dc99" font-family="serif">Leventhal.</text><path d="M70 470H1130" stroke="#363d35"/><text x="70" y="540" fill="#efeee7" font-size="26">C# / .NET · React · Rust · Zig</text><text x="925" y="540" fill="#a5aaa3" font-size="26">rafaelcl.com</text></g></svg>`,
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
