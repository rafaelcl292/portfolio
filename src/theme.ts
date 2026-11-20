// Loaded as a blocking classic script so the stored theme applies before first paint.
// Dark is the default; light is an explicit, remembered choice.
let theme = "dark";
try {
  if (localStorage.getItem("theme") === "light") theme = "light";
} catch {
  // Storage can be unavailable; the default theme still applies.
}
document.documentElement.dataset.theme = theme;
document.documentElement.classList.add("js");
