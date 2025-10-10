import { query } from "./dom";

const root = document.documentElement; // Returns root element
const current = localStorage.getItem("theme");

if (current) root.setAttribute("data-theme", current);

query("themeToggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});
