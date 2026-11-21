import {
  chessh,
  earlierProjects,
  localCinema,
  profile,
  zander,
} from "./content";
import { monogramCursor, monogramPath } from "./monogram";
import { pawnStage } from "./pawn";

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ] ?? char,
  );

const monogram = (size: number) =>
  `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><rect class="mark-bg" width="64" height="64"/><path class="mark-fg" d="${monogramPath}"/><rect class="mark-cursor" x="${monogramCursor.x}" y="${monogramCursor.y}" width="${monogramCursor.width}" height="${monogramCursor.height}"/></svg>`;

const facts = (
  rows: readonly (readonly string[])[],
  stack: readonly string[],
) =>
  `<dl class="facts">${[...rows, ["Stack", stack.join(", ")]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;

export function renderSite(css: string, js: string, themeJs: string) {
  const resume = "/resume/rafael-leventhal-resume.pdf";
  const resumePt = "/resume/rafael-leventhal-curriculo.pdf";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rafael Coca Leventhal — Software developer</title>
  <meta name="description" content="Software developer at BTG Pactual in São Paulo. C#/.NET and React at work; chess software in Rust and Zig outside it.">
  <meta name="theme-color" content="#1b1f3a"><meta name="color-scheme" content="dark light">
  <link rel="canonical" href="https://rafaelcl.com/">
  <meta property="og:type" content="website"><meta property="og:title" content="Rafael Coca Leventhal — Software developer">
  <meta property="og:description" content="C#/.NET and React at BTG Pactual. Chess over SSH in Rust and a Stockfish port in Zig outside it.">
  <meta property="og:url" content="https://rafaelcl.com/"><meta property="og:image" content="https://rafaelcl.com/assets/social.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/monaspace-xenon-500.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/monaspace-argon-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/${css}">
  <script src="/assets/${themeJs}"></script>
  <script type="module" src="/assets/${js}"></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="shell">
    <header class="header">
      <a class="brand" href="#" aria-label="Rafael Coca Leventhal, top of page">${monogram(40)}</a>
      <nav aria-label="Main navigation">
        <a href="#work">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch to light theme" hidden><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect class="tg-frame" x="1.5" y="1.5" width="15" height="15"/><rect class="tg-fill" x="1.5" y="1.5" width="7.5" height="15"/></svg></button>
      </nav>
    </header>
    <main id="main">
      <section class="hero" id="hero" aria-labelledby="intro">
        <div class="hero-copy">
          <h1 id="intro"><span class="line line-first"><span class="typed">Rafael Coca</span><span class="caret" aria-hidden="true"></span></span> <span class="line line-last"><span class="typed">Leventhal</span><span class="caret" aria-hidden="true"></span></span></h1>
          <p class="hero-role">Software developer, <span class="nowrap">full-stack</span> and backend.</p>
          <p class="hero-text">I build C#/.NET services and React portals at <a href="#experience">BTG Pactual</a> in São Paulo. On my own time I write chess software in Rust and Zig.</p>
          <ul class="hero-actions">
            <li><a class="button" href="${resume}">Download résumé <span class="format">PDF</span></a></li>
            <li><a href="${profile.github}">GitHub</a></li>
            <li><a href="${profile.linkedin}">LinkedIn</a></li>
            <li><a href="mailto:${profile.email}">Email</a></li>
          </ul>
        </div>
        ${pawnStage}
        <span class="ground" aria-hidden="true"></span>
        <div class="hero-status">
          <span class="move" aria-hidden="true">1. e4</span>
          <button type="button" class="replay" id="replay" hidden>Drop the pawn again</button>
        </div>
      </section>

      <section id="work" class="section" aria-labelledby="work-title">
        <h2 id="work-title">Side projects</h2>

        <article class="project" aria-labelledby="chessh-title">
          <div class="project-copy">
            <h3 id="chessh-title">${chessh.name}</h3>
            <p class="project-kind">${chessh.category}</p>
            <p>${chessh.description}</p>
            <div class="ssh">
              <p id="ssh-hint">To play, run this in a terminal:</p>
              <div class="ssh-command"><span class="prompt" aria-hidden="true">$</span><code id="ssh-command">${chessh.command}</code><button type="button" id="copy-ssh" aria-describedby="ssh-hint">Copy</button></div>
              <span class="copy-status" id="copy-status" role="status"></span>
            </div>
            ${facts(chessh.facts, chessh.stack)}
            <a href="${chessh.url}">CheSSH source on GitHub</a>
          </div>
          <figure class="shot">
            <img src="/assets/chessh.png" width="1919" height="1079" alt="CheSSH in a terminal: a pixel-art chessboard after 1. e4, with the move list and game controls beside it." loading="lazy" decoding="async">
            <figcaption>CheSSH running at ${chessh.host}.</figcaption>
          </figure>
        </article>

        <article class="project project-flip" aria-labelledby="zander-title">
          <div class="project-copy">
            <h3 id="zander-title">${zander.name}</h3>
            <p class="project-kind">${zander.category}</p>
            <p>${zander.description}</p>
            ${facts(zander.facts, zander.stack)}
            <a href="${zander.url}">Zander source on GitHub</a>
          </div>
          <figure class="diff">
            <div class="diff-flow" aria-hidden="true">
              <span class="node">Same input</span>
              <span class="fork"></span>
              <div class="diff-pair">
                <span class="node">Zander<small>Zig port</small></span>
                <span class="node">Stockfish<small>Pinned reference</small></span>
              </div>
              <span class="fork fork-join"></span>
              <span class="node node-result">Results compared</span>
            </div>
            <figcaption>Differential testing: both engines get the same input, and the Zig port’s output is checked against the pinned Stockfish reference.</figcaption>
          </figure>
        </article>

        <div class="more">
          <article class="cinema" aria-labelledby="cinema-title">
            <h3 id="cinema-title">${localCinema.name}</h3>
            <p class="project-kind">${localCinema.category}</p>
            <p>${localCinema.description}</p>
            <dl class="facts"><div><dt>Stack</dt><dd>${localCinema.stack.join(", ")}</dd></div><div><dt>Source</dt><dd>Private</dd></div></dl>
          </article>
          <div class="earlier">
            <h3 id="earlier-title">Earlier projects</h3>
            <ul aria-labelledby="earlier-title">${earlierProjects.map((p) => `<li><a href="${profile.github}/${p.repo}">${p.name}</a><span class="earlier-text">${p.description}</span><span class="earlier-stack">${p.stack}</span></li>`).join("")}</ul>
          </div>
        </div>
      </section>

      <section id="experience" class="section" aria-labelledby="experience-title">
        <div class="section-head"><h2 id="experience-title">Experience</h2><a href="${resume}">Full résumé <span class="format">PDF</span></a></div>
        <ol class="timeline">
          <li><p class="when when-now">Mar 2025 – present</p><div class="what"><h3>BTG Pactual</h3><p class="role">Analyst <span>Jan 2026 – present</span></p><p class="role">IT Assistant <span>Mar – Dec 2025</span></p></div><p class="job-text">C#/.NET services and React portals for the Risco Sacado team, supporting receivables financing operations in Brazil.</p></li>
          <li><p class="when">Aug – Oct 2024</p><div class="what"><h3>Moveu</h3><p class="role">Software Development Intern</p></div><p class="job-text">The startup’s sole developer. Automated JSON specifications for customizable furniture, including dimensions and drilling patterns.</p></li>
          <li><p class="when">Jan &amp; Jul 2024</p><div class="what"><h3>BTG Pactual</h3><p class="role">Summer Intern</p></div><p class="job-text">Built a .NET logging library to standardize the team’s logs and integrated it into an Azure CI pipeline.</p></li>
          <li><p class="when">Jan 2021 – Dec 2025</p><div class="what"><h3>Insper</h3><p class="role">Bachelor’s degree in Computer Engineering</p></div><p class="job-text">Completed in December 2025.</p></li>
        </ol>
      </section>

      <section class="section about" aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <div class="about-body">
          <p class="about-lead">I enjoy working across the stack, with a particular interest in backend development.</p>
          <p>I use AI as part of my development workflow. My personal projects give me room to explore systems programming, build tools I want to use, and run them on my own infrastructure.</p>
          <p>Portuguese is my native language, and my English is advanced. I spent a school exchange in Canada in 2019.</p>
        </div>
      </section>

      <section id="contact" class="section contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Get in touch</h2>
        <div class="contact-body">
        <p class="contact-lead">I’m open to international opportunities.</p>
        <a class="contact-email" href="mailto:${profile.email}">${profile.email}</a>
        <ul class="contact-links"><li><a href="${profile.github}">GitHub</a></li><li><a href="${profile.linkedin}">LinkedIn</a></li><li><a href="${resume}">Résumé in English <span class="format">PDF</span></a></li><li><a href="${resumePt}" hreflang="pt-BR">Résumé in Portuguese <span class="format">PDF</span></a></li></ul>
        </div>
      </section>
    </main>
    <footer class="footer"><span>© ${new Date().getFullYear()} Rafael Coca Leventhal</span><span>Static HTML. No tracking.</span><a href="${profile.chess}">rltakes on Chess.com</a><a href="#">Back to top</a></footer>
  </div>
</body></html>`;
}
