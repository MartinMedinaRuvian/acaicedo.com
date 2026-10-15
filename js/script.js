document.addEventListener("DOMContentLoaded", () => {

  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuBackdrop = document.querySelector(".menu-backdrop");
  const menuLinks = document.querySelectorAll(".mobile-menu a");
  const cursor = document.querySelector(".cursor");
  const testimonials = document.querySelectorAll(".testimonial");
  const dotsContainer = document.querySelector(".testimonial-dots");

  // ---------------- header scroll state ----------------

  window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

      header.classList.add("scrolled");

    } else {

      header.classList.remove("scrolled");

    }

  });

  // ---------------- mobile menu ----------------

  function closeMobileMenu() {

    mobileMenu.classList.remove("active");
    menuToggle.classList.remove("active");

    if (menuBackdrop) menuBackdrop.classList.remove("active");

    document.body.classList.remove("menu-open");

  }

  function toggleMobileMenu() {

    const isOpening = !mobileMenu.classList.contains("active");

    mobileMenu.classList.toggle("active", isOpening);
    menuToggle.classList.toggle("active", isOpening);

    if (menuBackdrop) menuBackdrop.classList.toggle("active", isOpening);

    document.body.classList.toggle("menu-open", isOpening);

  }

  if (menuToggle) {

    menuToggle.addEventListener("click", toggleMobileMenu);

  }

  if (menuBackdrop) {

    menuBackdrop.addEventListener("click", closeMobileMenu);

  }

  menuLinks.forEach(link => {

    link.addEventListener("click", closeMobileMenu);

  });

  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {

      closeMobileMenu();

    }

  });

  // ---------------- smooth anchor scroll ----------------

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

      const target = this.getAttribute("href");

      if (target === "#" || target.length < 2) return;

      const element = document.querySelector(target);

      if (element) {

        e.preventDefault();

        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: "smooth"
        });

      }

    });

  });

  // ---------------- custom cursor ----------------

  if (cursor && window.innerWidth > 768) {

    const hoverSelector = "a,button,.bento-card,.testimonial,.hero-image-main img";
    let lastX = 0;
    let lastY = 0;

    function updateCursorHoverState(x, y) {

      const target = document.elementFromPoint(x, y);
      const isHovering = !!(target && target.closest(hoverSelector));

      cursor.style.transform = isHovering
        ? "translate(-50%,-50%) scale(2)"
        : "translate(-50%,-50%) scale(1)";

    }

    document.addEventListener("mousemove", (e) => {

      lastX = e.clientX;
      lastY = e.clientY;

      cursor.style.left = lastX + "px";
      cursor.style.top = lastY + "px";

      updateCursorHoverState(lastX, lastY);

    });

    window.addEventListener("scroll", () => {

      updateCursorHoverState(lastX, lastY);

    }, { passive: true });

  }

  // ---------------- scroll reveal ----------------

  const revealElements = document.querySelectorAll(
    ".hero-content,.hero-visual,.manifesto-content,.manifesto-signature,.about-image,.about-content,.services-header,.bento-card,.timeline-item,.results-text,.results-stats,.testimonial-slider,.cta-box,.contact-layout"
  );

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("revealed");

      }

    });

  }, {
    threshold: .15
  });

  revealElements.forEach((element, index) => {

    element.classList.add("reveal");

    if (element.classList.contains("bento-card")) {

      element.style.transitionDelay = `${(index % 5) * 70}ms`;

    }

    observer.observe(element);

  });

  // ---------------- testimonial slider ----------------

  let currentSlide = 0;
  let slideTimer = null;

  function showTestimonial(index) {

    testimonials.forEach((item, i) => {

      item.classList.toggle("active", i === index);

    });

    if (dotsContainer) {

      dotsContainer.querySelectorAll("button").forEach((dot, i) => {

        dot.classList.toggle("active", i === index);

      });

    }

  }

  function nextSlide() {

    currentSlide = (currentSlide + 1) % testimonials.length;
    showTestimonial(currentSlide);

  }

  function startAutoplay() {

    slideTimer = setInterval(nextSlide, 5000);

  }

  if (testimonials.length > 0) {

    if (dotsContainer) {

      testimonials.forEach((_, i) => {

        const dot = document.createElement("button");
        dot.setAttribute("aria-label", `Ver testimonio ${i + 1}`);

        dot.addEventListener("click", () => {

          currentSlide = i;
          showTestimonial(currentSlide);
          clearInterval(slideTimer);
          startAutoplay();

        });

        dotsContainer.appendChild(dot);

      });

    }

    showTestimonial(0);
    startAutoplay();

  }

  // ---------------- contact form ----------------

  const form = document.querySelector(".contact-form");

  if (form) {

    form.addEventListener("submit", (e) => {

      e.preventDefault();

      const fields = form.querySelectorAll("input,textarea");

      let valid = true;

      fields.forEach(field => {

        if (field.hasAttribute("required") && field.value.trim() === "") {

          field.style.borderColor = "#dc2626";
          valid = false;

        } else {

          field.style.borderColor = "";

        }

      });

      if (valid) {

        const button = form.querySelector("button");

        button.textContent = "Mensaje enviado ✓";
        button.disabled = true;

        setTimeout(() => {

          button.textContent = "Enviar mensaje";
          button.disabled = false;
          form.reset();

        }, 3000);

      }

    });

  }

  // ---------------- hero parallax ----------------

  const parallaxImage = document.querySelector(".hero-image-main");

  if (parallaxImage && window.innerWidth > 1024) {

    window.addEventListener("scroll", () => {

      const offset = window.pageYOffset;

      parallaxImage.style.transform =
        `translateY(${offset * 0.06}px)`;

    });

  }

});