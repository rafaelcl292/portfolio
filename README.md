# Rafael Coca Leventhal

Portfolio and one-page English/Portuguese resumes at **https://rafaelcl.com**.

Static HTML/CSS, a small TypeScript clipboard enhancement, and locally generated
PDFs. Built with Bun and served by Nginx on an Oracle Cloud ARM64 VM. No application
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
- `src/style.css`: ebony-and-boxwood colour tokens (dark default, light option),
  responsive layouts, the hero animation, reduced-motion support.
- `src/pawn.ts`: the hero pawn, an inline SVG coloured by CSS custom properties.
- `src/monogram.ts`: the "RL" monogram outline (header, favicon, social card).
- `src/client.ts`: clipboard and theme toggle.
- `src/theme.ts`: tiny blocking script that applies the stored theme before paint.
- `scripts/resume.ts`: PDFs with embedded fonts, plus TXT/HTML exports.
- `public/chessh.png`: actual screenshot from the CheSSH repository.

The hero animation (a pawn lands and the text is revealed on impact) is CSS only:
it runs once, animates transform and opacity, needs no script, and is skipped
under `prefers-reduced-motion`. The production CSP forbids inline scripts and
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

Fraunces, Geist, and Geist Mono are supplied by Fontsource under the SIL Open Font
License. Their licenses are copied to the build. Liberation Sans is embedded in
PDFs; its license is in `assets/fonts/LICENSE`. The monogram is outlined from
Fraunces.
