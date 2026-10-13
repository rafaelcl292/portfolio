import PDFDocument from "pdfkit";
import { profile, type Resume, resumes } from "../src/content";
import { escapeHtml } from "../src/site";

async function pdf(resume: Resume, language: string, output: string) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 42,
    bufferPages: true,
    info: {
      Title: `${profile.name} — ${resume.title}`,
      Author: profile.name,
      Subject: resume.title,
      Keywords: "C#, .NET, React, TypeScript, Rust, backend, full-stack",
    },
    lang: language,
  });
  doc.registerFont("ResumeRegular", "assets/fonts/LiberationSans-Regular.ttf");
  doc.registerFont("ResumeBold", "assets/fonts/LiberationSans-Bold.ttf");
  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
  const width = doc.page.width - 84;
  const text = (value: string, size = 9.1, bold = false, color = "#252c29") => {
    doc
      .font(bold ? "ResumeBold" : "ResumeRegular")
      .fontSize(size)
      .fillColor(color)
      .text(value, 42, doc.y, { width, lineGap: 2.1 });
  };
  const gap = (points: number) => {
    doc.y += points;
  };
  const heading = (label: string) => {
    gap(11);
    text(label.toUpperCase(), 9, true, "#304d3b");
    gap(3);
    doc
      .moveTo(42, doc.y)
      .lineTo(doc.page.width - 42, doc.y)
      .strokeColor("#c8cfcb")
      .lineWidth(0.5)
      .stroke();
    gap(7);
  };
  text(profile.name, 23, true);
  gap(4);
  text(resume.title, 10.5, false, "#304d3b");
  gap(6);
  text(`${resume.location}  |  ${profile.email}`, 8.4);
  gap(2);
  doc
    .fontSize(8.4)
    .text("rafaelcl.com", 42, doc.y, { link: profile.url, continued: true })
    .text("  |  ", { link: null, continued: true })
    .text("github.com/rafaelcl292", { link: profile.github });
  gap(10);
  text(resume.summary);
  heading(resume.headings.experience);
  for (const job of resume.jobs) {
    const y = doc.y;
    text(`${job.company} — ${job.title}`, 9.3, true);
    const after = doc.y;
    doc
      .font("ResumeRegular")
      .fontSize(8.1)
      .fillColor("#515a55")
      .text(job.dates, 42, y + 1, { width, align: "right" });
    doc.y = after + 3;
    for (const bullet of job.bullets) text(`•  ${bullet}`);
    gap(7);
  }
  heading(resume.headings.projects);
  for (const project of resume.projects) {
    doc
      .font("ResumeBold")
      .fontSize(9.3)
      .fillColor("#252c29")
      .text(project.name, 42, doc.y, { link: project.url, continued: true })
      .font("ResumeRegular")
      .fontSize(8.3)
      .text(`  |  ${project.stack}`, { link: null });
    gap(3);
    text(project.text);
    gap(7);
  }
  heading(resume.headings.skills);
  for (const skill of resume.skills) text(skill, 8.9);
  heading(resume.headings.education);
  text(resume.education, 9);
  heading(resume.headings.languages);
  text(resume.languages, 9);
  const pages = doc.bufferedPageRange().count;
  if (pages !== 1 || doc.y > doc.page.height - 42)
    throw new Error(
      `Resume overflow (${language}): ${pages} pages, y=${doc.y}`,
    );
  doc.end();
  await Bun.write(output, await done);
  console.log(`${output}: 1 page, bottom ${Math.round(doc.y)}pt`);
}

export async function buildResumes() {
  for (const [language, resume] of Object.entries(resumes)) {
    const stem =
      language === "en"
        ? "rafael-leventhal-resume"
        : "rafael-leventhal-curriculo";
    await pdf(
      resume,
      language === "en" ? "en" : "pt-BR",
      `dist/resume/${stem}.pdf`,
    );
    const txt = [
      profile.name,
      resume.title,
      `${resume.location} | ${profile.email}`,
      `${profile.url} | ${profile.github}`,
      "",
      resume.summary,
      "",
      resume.headings.experience.toUpperCase(),
      ...resume.jobs.flatMap((j) => [
        `${j.company} — ${j.title} | ${j.dates}`,
        ...j.bullets.map((b) => `• ${b}`),
        "",
      ]),
      resume.headings.projects.toUpperCase(),
      ...resume.projects.flatMap((p) => [
        `${p.name} | ${p.stack}`,
        p.text,
        p.url,
        "",
      ]),
      resume.headings.skills.toUpperCase(),
      ...resume.skills,
      "",
      resume.headings.education.toUpperCase(),
      resume.education,
      "",
      resume.headings.languages.toUpperCase(),
      resume.languages,
    ].join("\n");
    await Bun.write(`dist/resume/${stem}.txt`, `${txt}\n`);
    await Bun.write(
      `dist/resume/${stem}.html`,
      `<!doctype html><html lang="${language === "en" ? "en" : "pt-BR"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(profile.name)} — ${escapeHtml(resume.title)}</title><link rel="stylesheet" href="/assets/resume.css"><nav><a href="/">← Portfolio</a> · <a href="${stem}.pdf">PDF</a></nav><main><pre>${escapeHtml(txt)}</pre></main></html>`,
    );
  }
}
