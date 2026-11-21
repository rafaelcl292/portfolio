const root = document.documentElement;

// Copy the SSH command.
const copyButton = document.querySelector<HTMLButtonElement>("#copy-ssh");
const copyStatus = document.querySelector<HTMLElement>("#copy-status");
const command = document.querySelector<HTMLElement>("#ssh-command");
let resetTimer: ReturnType<typeof setTimeout> | undefined;
copyButton?.addEventListener("click", async () => {
  if (!copyStatus || !command) return;
  clearTimeout(resetTimer);
  try {
    await navigator.clipboard.writeText(command.textContent ?? "");
    copyStatus.textContent = "Copied. Paste it into your terminal.";
    copyButton.textContent = "Copied";
  } catch {
    copyStatus.textContent = "Select the command and copy it to your terminal.";
    const range = document.createRange();
    range.selectNodeContents(command);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  }
  resetTimer = setTimeout(() => {
    copyStatus.textContent = "";
    copyButton.textContent = "Copy";
  }, 5000);
});

// Theme toggle.
const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const themeColor = document.querySelector<HTMLMetaElement>(
  'meta[name="theme-color"]',
);
const applyTheme = (theme: "dark" | "light") => {
  root.dataset.theme = theme;
  themeColor?.setAttribute(
    "content",
    theme === "light" ? "#f0eadb" : "#1b1f3a",
  );
  themeToggle?.setAttribute(
    "aria-label",
    `Switch to ${theme === "light" ? "dark" : "light"} theme`,
  );
};
if (themeToggle) {
  themeToggle.hidden = false;
  applyTheme(root.dataset.theme === "light" ? "light" : "dark");
  themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // The choice simply lasts for this visit.
    }
  });
}

// Replay the hero. The drop itself is CSS; this only restarts it. It is an
// explicit request, so it also plays when the system asks for reduced motion.
const hero = document.querySelector<HTMLElement>("#hero");
const replay = document.querySelector<HTMLButtonElement>("#replay");
if (hero && replay) {
  replay.hidden = false;
  replay.addEventListener("click", () => {
    hero.classList.add("resetting");
    void hero.offsetWidth;
    hero.classList.remove("resetting");
    hero.classList.add("replaying");
  });
}
