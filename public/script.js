const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("motion-ready");

const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" }
  );
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
}

const typed = document.querySelector(".typed");
if (typed) {
  const phrase = typed.dataset.text || "";
  if (reducedMotion) {
    typed.textContent = phrase;
  } else {
    typed.textContent = "";
    let index = 0;
    const typeNext = () => {
      typed.textContent = phrase.slice(0, index);
      index += 1;
      if (index <= phrase.length) window.setTimeout(typeNext, 54);
    };
    window.setTimeout(typeNext, 360);
  }
}

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll("details[open]").forEach((other) => {
      if (other !== detail) other.removeAttribute("open");
    });
  });
});
