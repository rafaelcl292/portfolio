import { resolve, sep } from "node:path";

const root = resolve("dist");
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: Number(Bun.env.PORT ?? 4173),
  async fetch(request) {
    let path: string;
    try {
      path = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("Bad request", { status: 400 });
    }
    const filePath = resolve(root, `.${path === "/" ? "/index.html" : path}`);
    if (!filePath.startsWith(`${root}${sep}`))
      return new Response("Not found", { status: 404 });
    const file = Bun.file(filePath);
    if (!(await file.exists()))
      return new Response(Bun.file(`${root}/404.html`), { status: 404 });
    return new Response(file, { headers: { "Cache-Control": "no-store" } });
  },
});
console.log(`Portfolio preview: ${server.url}`);
