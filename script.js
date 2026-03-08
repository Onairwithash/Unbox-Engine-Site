const revealElements = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const ambientNodes = document.querySelectorAll(".ambient");
const scrollFloatNodes = document.querySelectorAll(".scroll-float-inner");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
}

if (!reduceMotion) {
  const applyScrollFloat = () => {
    const viewportCenter = window.innerHeight / 2;
    scrollFloatNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const offset = (elementCenter - viewportCenter) / viewportCenter;
      const clamped = Math.max(-1, Math.min(1, offset));
      node.style.transform = `translate3d(0, ${clamped * 18}px, 0) scale(1.05)`;
    });
  };

  tiltCards.forEach((card) => {
    const maxTilt = 6;
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      const progress = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      ambientNodes.forEach((node, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const move = progress * 35 * direction;
        node.style.transform = `translate3d(${move}px, ${move * 0.6}px, 0)`;
      });
      applyScrollFloat();
    },
    { passive: true }
  );

  applyScrollFloat();
}
