const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("motion-ready");

const header = document.querySelector(".site-header");
if (header) {
  let lastScrollY = Math.max(window.scrollY, 0);
  let scrollFrame;
  const directionThreshold = 4;

  const updateHeader = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const scrollDelta = currentScrollY - lastScrollY;

    if (currentScrollY <= directionThreshold) {
      header.classList.remove("is-hidden");
      lastScrollY = currentScrollY;
    } else if (scrollDelta >= directionThreshold) {
      header.classList.add("is-hidden");
      lastScrollY = currentScrollY;
    } else if (scrollDelta <= -directionThreshold) {
      header.classList.remove("is-hidden");
      lastScrollY = currentScrollY;
    }

    scrollFrame = undefined;
  };

  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateHeader);
  }, { passive: true });
}

const menuToggle = document.querySelector(".menu-toggle");
const menuShell = document.querySelector(".mobile-menu-shell");
const menuClose = document.querySelector(".menu-close");
const menuBackdrop = document.querySelector(".menu-backdrop");

if (menuToggle && menuShell && menuClose && menuBackdrop) {
  const mobileQuery = window.matchMedia("(max-width: 900px)");

  const closeMenu = (restoreFocus = true) => {
    menuShell.classList.remove("is-open");
    menuShell.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    if (restoreFocus) menuToggle.focus();
  };

  const openMenu = () => {
    menuShell.classList.add("is-open");
    menuShell.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    menuClose.focus();
  };

  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", () => closeMenu());
  menuBackdrop.addEventListener("click", () => closeMenu());
  menuShell.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuShell.classList.contains("is-open")) closeMenu();
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) closeMenu(false);
  });
}

const heroRevealItems = document.querySelectorAll(".hero-reveal");
if (reducedMotion) {
  heroRevealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const activeHeroRevealItems = [...heroRevealItems].filter(
    (item) => window.getComputedStyle(item).display !== "none"
  );

  heroRevealItems.forEach((item) => {
    if (activeHeroRevealItems.includes(item)) return;
    item.classList.add("is-visible");
  });

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      activeHeroRevealItems.forEach((item, index) => {
        item.style.transitionDelay = `${120 + index * 180}ms`;
        item.classList.add("is-visible");
      });
    });
  });
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
