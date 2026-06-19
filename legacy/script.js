// Portfolio interactions — kept minimal and reduced-motion aware.

// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle?.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }),
);

// Scroll-reveal (skipped entirely if the user prefers reduced motion)
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal");
if (reduce || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  revealEls.forEach((el) => io.observe(el));
}

// Active section in nav
const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = navAnchors
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = "#" + e.target.id;
          navAnchors.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === id),
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((s) => spy.observe(s));
}

// LinkedIn placeholder — replace the URL below with your profile, or set it here.
const LINKEDIN_URL = ""; // e.g. "https://www.linkedin.com/in/your-handle"
const li = document.querySelector("[data-linkedin]");
if (li) {
  if (LINKEDIN_URL) {
    li.setAttribute("href", LINKEDIN_URL);
    li.setAttribute("target", "_blank");
    li.setAttribute("rel", "noopener");
  } else {
    li.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Add your LinkedIn URL in script.js (LINKEDIN_URL) to enable this link.");
    });
  }
}
