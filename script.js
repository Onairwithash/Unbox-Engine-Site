const revealElements = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const ambientNodes = document.querySelectorAll(".ambient");
const scrollFloatNodes = document.querySelectorAll(".scroll-float-inner");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const BOOK_DEMO_CONFIG = {
  formEndpoint: "https://formspree.io/f/REPLACE_WITH_FORMSPREE_ID",
  schedulerUrl:
    "https://calendly.com/REPLACE_WITH_YOUR_LINK/30min?hide_event_type_details=1&hide_gdpr_banner=1",
};

const hasConfiguredValue = (value, placeholderToken) =>
  Boolean(value) && !value.includes(placeholderToken);

const setFormStatus = (statusNode, message, state) => {
  if (!statusNode) {
    return;
  }

  statusNode.textContent = message;
  if (state) {
    statusNode.dataset.state = state;
  } else {
    delete statusNode.dataset.state;
  }
};

const initDemoForms = () => {
  const forms = document.querySelectorAll("[data-demo-form]");
  const hasFormEndpoint = hasConfiguredValue(
    BOOK_DEMO_CONFIG.formEndpoint,
    "REPLACE_WITH_FORMSPREE_ID"
  );

  forms.forEach((form) => {
    const statusNode = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');

    if (hasFormEndpoint) {
      form.action = BOOK_DEMO_CONFIG.formEndpoint;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!hasFormEndpoint) {
        setFormStatus(
          statusNode,
          "Form endpoint is not configured. Update BOOK_DEMO_CONFIG.formEndpoint in script.js.",
          "error"
        );
        return;
      }

      const originalButtonText = submitButton ? submitButton.textContent : "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }
      setFormStatus(statusNode, "", "");

      try {
        const response = await fetch(BOOK_DEMO_CONFIG.formEndpoint, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          const message =
            payload?.errors?.[0]?.message || "Unable to submit right now. Please try again.";
          throw new Error(message);
        }

        form.reset();
        setFormStatus(
          statusNode,
          "Thanks. We received your request and will reach out shortly.",
          "success"
        );
      } catch (error) {
        setFormStatus(statusNode, error.message, "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  });
};

const initSchedulerEmbeds = () => {
  const hasSchedulerUrl = hasConfiguredValue(
    BOOK_DEMO_CONFIG.schedulerUrl,
    "REPLACE_WITH_YOUR_LINK"
  );
  const schedulerShells = document.querySelectorAll("[data-scheduler-shell]");
  const schedulerFrames = document.querySelectorAll("[data-scheduler-frame]");
  const schedulerLinks = document.querySelectorAll("[data-scheduler-link]");

  schedulerShells.forEach((shell) => {
    if (hasSchedulerUrl) {
      shell.classList.add("is-ready");
    } else {
      shell.classList.remove("is-ready");
    }
  });

  schedulerFrames.forEach((frame) => {
    if (hasSchedulerUrl) {
      frame.src = BOOK_DEMO_CONFIG.schedulerUrl;
    } else {
      frame.removeAttribute("src");
    }
  });

  schedulerLinks.forEach((link) => {
    if (hasSchedulerUrl) {
      link.href = BOOK_DEMO_CONFIG.schedulerUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open Scheduler in New Tab";
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.textContent = "Schedule by Email";
    }
  });
};

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

initDemoForms();
initSchedulerEmbeds();
