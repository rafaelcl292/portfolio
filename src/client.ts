const button = document.querySelector<HTMLButtonElement>("#copy-ssh");
const status = document.querySelector<HTMLElement>("#copy-status");
let resetTimer: ReturnType<typeof setTimeout> | undefined;
button?.addEventListener("click", async () => {
  if (!status) return;
  clearTimeout(resetTimer);
  try {
    await navigator.clipboard.writeText("ssh -p 2222 chess.rafaelcl.com");
    status.textContent = "Copied. Paste it into your terminal.";
    button.setAttribute("aria-label", "SSH command copied");
  } catch {
    status.textContent = "Select the command and copy it to your terminal.";
    const command = document.querySelector("#ssh-command");
    if (command) {
      const range = document.createRange();
      range.selectNodeContents(command);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  }
  resetTimer = setTimeout(() => {
    status.textContent = "";
    button.setAttribute("aria-label", "Copy SSH command");
  }, 5000);
});
