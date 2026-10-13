import { earlierProjects, profile, projects } from "./content";

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ] ?? char,
  );
const arrow = '<span aria-hidden="true">↗</span>';

export function renderSite(css: string, js: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rafael Coca Leventhal — Full-stack Developer</title>
  <meta name="description" content="Full-stack developer at BTG Pactual, based in São Paulo. C#/.NET, React, and independent projects in Rust and Zig.">
  <meta name="theme-color" content="#141715"><meta name="color-scheme" content="dark">
  <link rel="canonical" href="https://rafaelcl.com/">
  <meta property="og:type" content="website"><meta property="og:title" content="Rafael Coca Leventhal — Full-stack Developer">
  <meta property="og:description" content="C#/.NET and React at BTG Pactual. Rust, chess engines, and other things I build.">
  <meta property="og:url" content="https://rafaelcl.com/"><meta property="og:image" content="https://rafaelcl.com/assets/social.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/manrope.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/${css}">
  <script type="module" src="/assets/${js}"></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="shell">
    <header class="header">
      <a class="monogram" href="#" aria-label="Rafael Coca Leventhal, home">rcl<span>.</span></a>
      <nav aria-label="Main navigation"><a href="#work">Projects</a><a href="#experience">Experience</a><a class="nav-contact" href="#contact">Contact ${arrow}</a></nav>
    </header>
    <main id="main">
      <section class="hero" aria-labelledby="intro">
        <h1 id="intro">Rafael Coca<br><span class="serif">Leventhal</span><span class="name-dot">.</span></h1>
        <div class="hero-bottom">
          <p>I build software at <a href="#experience">BTG Pactual</a>.<br>Outside work, I make things in Rust, Zig,<br class="desktop-break"> and whatever the project calls for.</p>
          <div class="hero-aside"><span>São Paulo, Brazil</span><span>Portuguese & English</span><a href="/resume/rafael-leventhal-resume.pdf" class="text-link">Download résumé <span aria-hidden="true">↓</span></a></div>
        </div>
      </section>
      <section id="work" class="work" aria-labelledby="work-title">
        <div class="section-heading"><h2 id="work-title">Selected projects</h2><span class="section-note">Built outside the day job</span></div>
        <article class="featured">
          <div class="project-copy"><span class="index">01 / ${projects[0]?.category}</span><h3>CheSSH</h3><p>${projects[0]?.description}</p><div class="stack">${projects[0]?.stack}</div><a class="text-link" href="${projects[0]?.url}">Source code ${arrow}</a>
          <div class="ssh-command"><code id="ssh-command">ssh -p 2222 chess.rafaelcl.com</code><button type="button" id="copy-ssh" aria-label="Copy SSH command"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4"/></svg></button></div><span class="copy-status" id="copy-status" role="status"></span></div>
          <a class="terminal" href="${projects[0]?.url}" aria-label="View CheSSH on GitHub"><div class="terminal-bar"><span class="terminal-dots" aria-hidden="true">● ● ●</span><span>chess.rafaelcl.com</span><span aria-hidden="true">↗</span></div><img src="/assets/chessh.png" width="1919" height="1079" alt="CheSSH terminal interface: a pixel-art chessboard, move history, and game controls." fetchpriority="high"></a>
        </article>
        <div class="project-pair">${projects
          .slice(1)
          .map(
            (p, i) =>
              `<article class="project-small"><span class="index">0${i + 2} / ${p.category}</span><h3>${p.name}</h3><p>${p.description}</p><div class="stack">${p.stack}</div><a class="text-link" href="${p.url}">${p.link} ${arrow}</a></article>`,
          )
          .join("")}</div>
        <div class="earlier"><h3>Earlier work</h3><div>${earlierProjects.map((p) => `<a class="earlier-row" href="${profile.github}/${p.repo}"><span class="earlier-name">${p.name}</span><span class="earlier-description">${p.description}</span><span class="earlier-stack">${p.stack}</span>${arrow}</a>`).join("")}</div></div>
      </section>
      <section id="experience" class="experience section-grid" aria-labelledby="experience-title">
        <div><span class="index">The day job</span><h2 id="experience-title">Experience</h2><a class="text-link" href="/resume/rafael-leventhal-resume.pdf">Full résumé <span aria-hidden="true">↓</span></a></div>
        <div class="timeline">
          <article><div class="job-top"><h3>BTG Pactual</h3><span>2025 — Present</span></div><p class="job-role">Analyst <span>· Jan 2026 — Present</span><br>IT Assistant <span>· Mar — Dec 2025</span></p><p>C#/.NET services and React portals for the Risco Sacado team, supporting receivables financing operations in Brazil.</p></article>
          <article><div class="job-top"><h3>Moveu</h3><span>Aug — Oct 2024</span></div><p class="job-role">Software Development Intern</p><p>The startup’s sole developer. Automated JSON specifications for customizable furniture, including dimensions and drilling patterns.</p></article>
          <article><div class="job-top"><h3>BTG Pactual</h3><span>Jan & Jul 2024</span></div><p class="job-role">Summer Intern</p><p>A .NET logging library to standardize the team’s logs, integrated into an Azure CI pipeline.</p></article>
        </div>
      </section>
      <section class="about section-grid" aria-labelledby="about-title">
        <div><span class="index">A little context</span><h2 id="about-title">About me</h2></div>
        <div><p class="about-lead">I enjoy working across the stack, with a particular interest in backend development.</p><p>I use AI as part of my development workflow. My personal projects give me room to explore systems programming, build tools I want to use, and run them on my own infrastructure.</p><div class="about-facts"><div><span class="index">Education</span><p>Computer Engineering<br><span>Insper · 2021–2025</span></p></div><div><span class="index">Languages</span><p>Portuguese · Native<br><span>English · Advanced</span></p></div></div></div>
      </section>
      <section id="contact" class="contact" aria-labelledby="contact-title"><div class="eyebrow"><span class="small-dot" aria-hidden="true"></span> Open to international opportunities</div><h2 id="contact-title">Let’s <span class="serif">talk.</span></h2><a class="contact-email" href="mailto:${profile.email}">${profile.email} ${arrow}</a><div class="contact-links"><a href="${profile.github}">GitHub ${arrow}</a><a href="/resume/rafael-leventhal-resume.pdf">Résumé (EN) ↓</a><a href="/resume/rafael-leventhal-curriculo.pdf" lang="pt-BR">Currículo (PT) ↓</a></div></section>
    </main>
    <footer><span>© ${new Date().getFullYear()} Rafael Coca Leventhal</span><a href="#">Back to top ↑</a></footer>
  </div>
</body></html>`;
}
