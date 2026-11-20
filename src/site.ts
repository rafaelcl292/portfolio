import {
  chessh,
  earlierProjects,
  localCinema,
  profile,
  zander,
} from "./content";
import { monogramPath } from "./monogram";
import { pawnStage } from "./pawn";

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ] ?? char,
  );

const icon = (path: string, size = 16) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const out = icon('<path d="M4.5 11.5l7-7M5.5 4.5h6v6"/>');
const down = icon('<path d="M8 3v9.5M3.75 8.5L8 12.75l4.25-4.25"/>');
const up = icon('<path d="M8 13V3.5M3.75 7.5L8 3.25l4.25 4.25"/>');

const monogram = (size: number) =>
  `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><rect class="mark-bg" width="64" height="64" rx="14"/><path class="mark-fg" d="${monogramPath}"/></svg>`;

const facts = (rows: readonly (readonly string[])[]) =>
  `<dl class="facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
const stack = (items: readonly string[]) =>
  `<ul class="stack" aria-label="Stack">${items.map((s) => `<li>${s}</li>`).join("")}</ul>`;

export function renderSite(css: string, js: string, themeJs: string) {
  const resume = "/resume/rafael-leventhal-resume.pdf";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rafael Coca Leventhal — Full-stack Developer</title>
  <meta name="description" content="Full-stack developer at BTG Pactual, based in São Paulo. C#/.NET, React, and independent projects in Rust and Zig.">
  <meta name="theme-color" content="#14110e"><meta name="color-scheme" content="dark light">
  <link rel="canonical" href="https://rafaelcl.com/">
  <meta property="og:type" content="website"><meta property="og:title" content="Rafael Coca Leventhal — Full-stack Developer">
  <meta property="og:description" content="C#/.NET and React at BTG Pactual. Rust, chess engines, and other things I build.">
  <meta property="og:url" content="https://rafaelcl.com/"><meta property="og:image" content="https://rafaelcl.com/assets/social.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fraunces.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/geist.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/${css}">
  <script src="/assets/${themeJs}"></script>
  <script type="module" src="/assets/${js}"></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="shell">
    <header class="header">
      <a class="brand" href="#" aria-label="Rafael C. Leventhal, home">${monogram(32)}<span class="brand-name">Rafael C. Leventhal</span></a>
      <nav aria-label="Main navigation">
        <a href="#work">Work</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch to light theme" hidden><span class="i-sun">${icon('<circle cx="8" cy="8" r="2.75"/><path d="M8 1.5v1.25M8 13.25v1.25M1.5 8h1.25M13.25 8h1.25M3.4 3.4l.9.9M11.7 11.7l.9.9M12.6 3.4l-.9.9M4.3 11.7l-.9.9"/>')}</span><span class="i-moon">${icon('<path d="M13.25 9.6A5.75 5.75 0 0 1 6.4 2.75a5.75 5.75 0 1 0 6.85 6.85z"/>')}</span></button>
      </nav>
    </header>
    <main id="main">
      <section class="hero" aria-labelledby="intro">
        <div class="hero-copy">
          <p class="label hero-label">Software developer <span aria-hidden="true">/</span> ${profile.location}</p>
          <h1 id="intro"><span class="line"><span>Rafael Coca</span></span> <span class="line h1-last"><span>Leventhal</span></span></h1>
          <p class="lede">I build software at <a href="#experience">BTG Pactual</a>. Outside work, I make things in Rust, Zig, and whatever the project calls for.</p>
          <div class="actions">
            <a class="button primary" href="${resume}">Download résumé ${down}</a>
            <a class="button" href="${profile.github}">GitHub ${out}</a>
            <a class="button" href="${profile.linkedin}">LinkedIn ${out}</a>
            <a class="button" href="mailto:${profile.email}">Email</a>
          </div>
          <dl class="hero-facts">
            <div><dt>Now</dt><dd>Analyst, BTG Pactual</dd></div>
            <div><dt>Education</dt><dd>Computer Engineering, Insper</dd></div>
            <div><dt>Languages</dt><dd>Portuguese &amp; English</dd></div>
          </dl>
        </div>
        ${pawnStage}
      </section>

      <section id="work" class="work" aria-labelledby="work-title">
        <header class="section-head reveal"><p class="label">Selected work</p><h2 id="work-title">Built outside the day job</h2></header>

        <article class="case reveal" aria-labelledby="chessh-title">
          <div class="case-copy">
            <p class="label">${chessh.category}</p>
            <h3 id="chessh-title">${chessh.name}</h3>
            <p class="case-text">${chessh.description}</p>
            ${facts(chessh.facts)}
            ${stack(chessh.stack)}
            <div class="ssh">
              <div class="ssh-command"><span class="prompt" aria-hidden="true">$</span><code id="ssh-command">${chessh.command}</code><button type="button" id="copy-ssh" aria-label="Copy SSH command">${icon('<rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/>')}</button></div>
              <span class="copy-status" id="copy-status" role="status"></span>
            </div>
            <a class="link" href="${chessh.url}">Source code ${out}</a>
          </div>
          <a class="terminal" href="${chessh.url}" aria-label="${chessh.host}: view CheSSH on GitHub">
            <span class="terminal-bar"><span class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${chessh.host}</span></span>
            <img src="/assets/chessh.png" width="1919" height="1079" alt="CheSSH terminal interface: a pixel-art chessboard, move history, and game controls." loading="lazy" decoding="async">
          </a>
        </article>

        <article class="case case-flip reveal" aria-labelledby="zander-title">
          <div class="case-copy">
            <p class="label">${zander.category}</p>
            <h3 id="zander-title">${zander.name}</h3>
            <p class="case-text">${zander.description}</p>
            ${facts(zander.facts)}
            ${stack(zander.stack)}
            <a class="link" href="${zander.url}">Source code ${out}</a>
          </div>
          <figure class="diff">
            <div class="diff-flow" aria-hidden="true">
              <span class="node">Same input</span>
              <span class="fork"></span>
              <div class="diff-pair">
                <span class="node node-main">Zander<small>Zig implementation</small></span>
                <span class="node">Stockfish<small>Pinned reference</small></span>
              </div>
              <span class="fork join"></span>
              <span class="node node-accent">Compare results</span>
            </div>
            <figcaption>Differential testing: the Zig implementation is compared with a pinned Stockfish reference.</figcaption>
          </figure>
        </article>

        <div class="more reveal">
          <article class="side-project" aria-labelledby="cinema-title">
            <p class="label">${localCinema.category}</p>
            <h3 id="cinema-title">${localCinema.name}</h3>
            <p>${localCinema.description}</p>
            ${stack(localCinema.stack)}
            <p class="private">${icon('<rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>', 14)} ${localCinema.note}</p>
          </article>
          <div class="earlier">
            <h3 class="label">Earlier work</h3>
            <ul>${earlierProjects.map((p) => `<li><a class="earlier-row" href="${profile.github}/${p.repo}"><span class="earlier-name">${p.name}</span><span class="earlier-description">${p.description}</span><span class="earlier-stack">${p.stack}</span>${out}</a></li>`).join("")}</ul>
          </div>
        </div>
      </section>

      <section id="experience" class="split" aria-labelledby="experience-title">
        <header class="split-head reveal"><p class="label">The day job</p><h2 id="experience-title">Experience</h2><a class="link" href="${resume}">Full résumé ${down}</a></header>
        <ol class="timeline">
          <li class="reveal"><p class="when">2025 — Present</p><div><h3>BTG Pactual</h3><p class="role">Analyst <span>Jan 2026 — Present</span></p><p class="role">IT Assistant <span>Mar — Dec 2025</span></p><p class="job-text">C#/.NET services and React portals for the Risco Sacado team, supporting receivables financing operations in Brazil.</p></div></li>
          <li class="reveal"><p class="when">Aug — Oct 2024</p><div><h3>Moveu</h3><p class="role">Software Development Intern</p><p class="job-text">The startup’s sole developer. Automated JSON specifications for customizable furniture, including dimensions and drilling patterns.</p></div></li>
          <li class="reveal"><p class="when">Jan &amp; Jul 2024</p><div><h3>BTG Pactual</h3><p class="role">Summer Intern</p><p class="job-text">A .NET logging library to standardize the team’s logs, integrated into an Azure CI pipeline.</p></div></li>
        </ol>
      </section>

      <section class="split" aria-labelledby="about-title">
        <header class="split-head reveal"><p class="label">A little context</p><h2 id="about-title">About me</h2></header>
        <div class="about reveal">
          <p class="about-lead">I enjoy working across the stack, with a particular interest in backend development.</p>
          <p class="about-text">I use AI as part of my development workflow. My personal projects give me room to explore systems programming, build tools I want to use, and run them on my own infrastructure.</p>
          <dl class="about-facts"><div><dt>Education</dt><dd>Computer Engineering<span>Insper · 2021–2025</span></dd></div><div><dt>Languages</dt><dd>Portuguese · Native<span>English · Advanced</span></dd></div></dl>
        </div>
      </section>

      <section id="contact" class="contact reveal" aria-labelledby="contact-title">
        <p class="label status"><span class="status-dot" aria-hidden="true"></span>Open to international opportunities</p>
        <h2 id="contact-title">Let’s talk.</h2>
        <a class="contact-email" href="mailto:${profile.email}">${profile.email}</a>
        <ul class="contact-links"><li><a class="link" href="${profile.github}">GitHub ${out}</a></li><li><a class="link" href="${profile.linkedin}">LinkedIn ${out}</a></li><li><a class="link" href="${resume}">Résumé (EN) ${down}</a></li><li><a class="link" href="/resume/rafael-leventhal-curriculo.pdf" lang="pt-BR">Currículo (PT) ${down}</a></li></ul>
      </section>
    </main>
    <footer class="footer"><span>© ${new Date().getFullYear()} Rafael Coca Leventhal</span><span class="footer-note">Static HTML. No tracking.</span><a class="footer-chess" href="${profile.chess}">rltakes on Chess.com</a><a class="link" href="#">Back to top ${up}</a></footer>
  </div>
</body></html>`;
}
