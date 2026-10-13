import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

// Build locally; upload static assets only. No application runtime on the server.
const host = Bun.env.PORTFOLIO_SSH_HOST ?? "cinema-oci";
if (!/^[a-zA-Z0-9][a-zA-Z0-9@._-]*$/.test(host))
  throw new Error("Invalid SSH host");
if ((await $`git status --porcelain`.text()).trim())
  throw new Error("Commit all changes before deploying.");
const revision = (await $`git rev-parse HEAD`.text()).trim();
if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error("Invalid revision");
await $`bun check`;
await $`bun run lint`;
await $`bun run build`;
const release = `${revision.slice(0, 12)}-${Date.now()}`;
await Bun.write(
  "dist/release.json",
  `${JSON.stringify({ revision, builtAt: new Date().toISOString() })}\n`,
);
const files = [
  ...new Bun.Glob("**/*").scanSync({ cwd: "dist", onlyFiles: true }),
].sort();
const sums = await Promise.all(
  files.map(
    async (file) =>
      `${new Bun.CryptoHasher("sha256").update(await Bun.file(`dist/${file}`).arrayBuffer()).digest("hex")}  ${file}`,
  ),
);
await Bun.write("dist/SHA256SUMS", `${sums.join("\n")}\n`);
const temp = await mkdtemp(join(tmpdir(), "portfolio-"));
const remoteArchive = `/tmp/portfolio-${release}.tar.gz`;
try {
  const archive = join(temp, "release.tar.gz");
  await $`tar -czf ${archive} -C dist .`;
  await $`scp ${archive} ${`${host}:${remoteArchive}`}`;
  const remoteScript = `set -euo pipefail
exec 9>/var/lock/portfolio-deploy.lock
flock -n 9
base=/var/www/portfolio
release=${release}
archive=${remoteArchive}
trap 'rm -f "$archive"' EXIT
before=$(systemctl show local-cinema chessh rqbit -p MainPID -p ActiveState)
mkdir -p "$base/releases/$release"
tar -xzf "$archive" -C "$base/releases/$release" --no-same-owner
cd "$base/releases/$release"
sha256sum --check --quiet SHA256SUMS
chown -R root:root .
find . -type d -exec chmod 755 {} +
find . -type f -exec chmod 644 {} +
previous=$(readlink "$base/current" || true)
switched=0
rollback() {
  if [ "$switched" = 1 ]; then
    if [ -n "$previous" ]; then ln -s "$previous" "$base/rollback-$release"; mv -Tf "$base/rollback-$release" "$base/current"; else rm -f "$base/current"; fi
  fi
}
trap 'rollback; rm -f "$archive"' EXIT
ln -s "$base/releases/$release" "$base/next-$release"
mv -Tf "$base/next-$release" "$base/current"
switched=1
curl --fail --silent --show-error --resolve rafaelcl.com:443:127.0.0.1 https://rafaelcl.com/ | cmp - index.html
curl --fail --silent --show-error --resolve rafaelcl.com:443:127.0.0.1 https://rafaelcl.com/resume/rafael-leventhal-resume.pdf | cmp - resume/rafael-leventhal-resume.pdf
curl --fail --silent --show-error http://127.0.0.1:8090/api/health
systemctl is-active --quiet nginx local-cinema chessh rqbit
after=$(systemctl show local-cinema chessh rqbit -p MainPID -p ActiveState)
[ "$before" = "$after" ]
switched=0
printf '\\nDeployed ${revision}; previous release: %s\\n' "$previous"
`;
  await $`ssh ${host} sudo bash -s < ${Buffer.from(remoteScript)}`;
  for (const path of [
    "/",
    "/resume/rafael-leventhal-resume.pdf",
    "/resume/rafael-leventhal-curriculo.pdf",
  ]) {
    const url = `https://rafaelcl.com${path}`;
    let remote: Buffer;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok)
        throw new Error(
          `Public verification failed: ${path} ${response.status}`,
        );
      remote = Buffer.from(await response.arrayBuffer());
    } catch (error) {
      // Newly created records may remain negative-cached by a local resolver.
      // Resolve publicly over HTTPS; never bypass TLS or hard-code an origin IP.
      if (
        !(error instanceof Error) ||
        !("code" in error) ||
        !["ENOTFOUND", "EAI_AGAIN"].includes(String(error.code))
      )
        throw error;
      console.log(
        `Local DNS has no answer; verifying ${path} through Cloudflare DNS over HTTPS.`,
      );
      remote = (
        await $`curl --doh-url https://cloudflare-dns.com/dns-query --fail --silent --show-error --max-time 30 ${url}`.quiet()
      ).stdout;
    }
    const local = await Bun.file(
      `dist${path === "/" ? "/index.html" : path}`,
    ).arrayBuffer();
    if (!Buffer.from(local).equals(remote))
      throw new Error(`Public content mismatch: ${path}`);
  }
  console.log("Public HTTPS page and both PDFs match the local release.");
} finally {
  await rm(temp, { recursive: true, force: true });
}
