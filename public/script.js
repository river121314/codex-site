const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("motion-ready");

const header = document.querySelector(".site-header");
if (header) {
  let lastScrollY = Math.max(window.scrollY, 0);
  let scrollFrame;

  const updateHeader = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const isPastHeader = currentScrollY > header.offsetHeight;
    const isScrollingDown = currentScrollY > lastScrollY;
    const isScrollingUp = currentScrollY < lastScrollY;

    if (!isPastHeader) {
      header.classList.remove("is-fixed", "is-shown");
    } else if (isScrollingDown) {
      if (!header.classList.contains("is-fixed")) {
        header.classList.add("is-fixed");
        window.requestAnimationFrame(() => header.classList.add("is-shown"));
      } else {
        header.classList.add("is-shown");
      }
    } else if (isScrollingUp) {
      header.classList.remove("is-shown");
    }

    lastScrollY = currentScrollY;
    scrollFrame = undefined;
  };

  if (lastScrollY > header.offsetHeight) {
    header.classList.add("is-fixed", "is-shown");
  }

  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateHeader);
  }, { passive: true });
}

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
