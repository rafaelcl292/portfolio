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
    copyButton.setAttribute("aria-label", "SSH command copied");
  } catch {
    copyStatus.textContent = "Select the command and copy it to your terminal.";
    const range = document.createRange();
    range.selectNodeContents(command);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  }
  resetTimer = setTimeout(() => {
    copyStatus.textContent = "";
    copyButton.setAttribute("aria-label", "Copy SSH command");
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
    theme === "light" ? "#f5efe2" : "#14110e",
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
