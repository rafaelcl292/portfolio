# Rafael Coca Leventhal

Portfolio and one-page English/Portuguese resumes at **https://rafaelcl.com**.

Static HTML/CSS, a small TypeScript enhancement (clipboard, theme, hero replay),
and locally generated PDFs. Built with Bun and served by Nginx on an Oracle Cloud ARM64 VM. No application
runtime, database, tracking, or third-party requests in production.

## Development

```sh
bun install --frozen-lockfile
bun run dev
```

Open `http://127.0.0.1:4173`. After editing, run `bun run build` and refresh.

```sh
bun check
bun run lint
bun run build
```

`bun run format` applies formatting. CI runs the same checks. Build verifies local
asset references and fails if either resume exceeds one page.

## Content

- `src/content.ts`: profile, projects, and both resume languages.
- `src/site.ts`: semantic HTML and portfolio narrative.
- `src/style.css`: the "refined terminal" design. Indigo ink and ivory (dark
  default, ivory paper option) with one apricot accent, laid out on a character
  grid: horizontal spacing in `ch`, vertical in rows, type at whole multiples.
- `src/pawn.ts`: the hero pawn, generated on a 32 x 29 grid of character cells.
  Each cell is one tone or two tones split at an eighth, like terminal block
  elements. Coloured by CSS custom properties.
- `src/monogram.ts`: the "RL" monogram outline (header, favicon, social card).
- `src/client.ts`: clipboard, theme toggle, and the hero replay button.
- `src/theme.ts`: tiny blocking script that applies the stored theme before paint.
- `scripts/resume.ts`: PDFs with embedded fonts, plus TXT/HTML exports.
- `public/chessh.png`: actual screenshot from the CheSSH repository.

The hero animation is CSS only: the pawn falls in whole rows, its square
lights up, the name is typed and the rest prints line by line. It runs once,
animates transform, opacity and clip-path, needs no script, and is
skipped under `prefers-reduced-motion`, which shows the finished composition.
The "Drop the pawn again" button restarts it on request, including for visitors
with reduced motion, since that is an explicit choice. The production CSP forbids inline scripts and
styles, so keep both in the built assets.

Employment facts come from the supplied resumes and the owner's corrections:
BTG IT Assistant from March 2025, Analyst from January 2026; summer internships
in January and July 2024; Insper completed in December 2025. No impact metrics
are inferred. Zander is credited as a Stockfish port, with no parity or strength
claims. Local Cinema source remains private, and its site is not linked
anywhere: it appears only as an unlinked project description.

## Deployment

Use Conventional Commits, then `bun run deploy` from a clean checkout with the
`cinema-oci` SSH alias configured. See [deployment](docs/deployment.md) for setup,
verification, and rollback. Credentials and private project source are not included.

## Assets

Monaspace Argon and Monaspace Xenon are supplied by Fontsource under the SIL
Open Font License. Their licenses are copied to the build. Liberation Sans is
embedded in PDFs; its license is in `assets/fonts/LICENSE`. The monogram is
outlined from Monaspace Xenon.
