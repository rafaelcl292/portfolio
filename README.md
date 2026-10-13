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
- `src/style.css`: dark theme, responsive layouts, reduced-motion support.
- `scripts/resume.ts`: PDFs with embedded fonts, plus TXT/HTML exports.
- `public/chessh.png`: actual screenshot from the CheSSH repository.

Employment facts come from the supplied resumes and the owner's corrections:
BTG IT Assistant from March 2025, Analyst from January 2026; summer internships
in January and July 2024; Insper completed in December 2025. No impact metrics
are inferred. Zander is credited as a Stockfish port, with no parity or strength
claims. Local Cinema source remains private.

## Deployment

Use Conventional Commits, then `bun run deploy` from a clean checkout with the
`cinema-oci` SSH alias configured. See [deployment](docs/deployment.md) for setup,
verification, and rollback. Credentials and private project source are not included.

## Assets

Manrope and Instrument Serif are supplied by Fontsource under the SIL Open Font
License. Their licenses are copied to the build. Liberation Sans is embedded in
PDFs; its license is in `assets/fonts/LICENSE`.
