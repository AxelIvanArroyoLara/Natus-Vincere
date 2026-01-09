/* ------------------------------------------------------------
   Sanity checks (debug)
   - Confirms the main script is running.
   - Confirms whether Lenis is available (loaded from CDN).
------------------------------------------------------------ */
console.log("✅ app.js cargó");
console.log("Lenis existe?", typeof Lenis);

// ============================
// Reveal on scroll (IntersectionObserver)
// ============================
// - Observes all elements with .hidden
// - When an element enters the viewport, we add .show
// - CSS handles the actual animation (opacity/blur/translate)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));

// ============================
// Footer year (dynamic)
// ============================
// - Injects the current year into <span id="year"></span>
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================
// Toast (demo)
// ============================
// - Small temporary notification bubble
// - Triggered by clicks on elements that contain data-toast="..."
// - Auto hides after 1400ms
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.setAttribute("aria-hidden", "false");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.setAttribute("aria-hidden", "true");
  }, 1400);
}

document.addEventListener("click", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  const msg = t.getAttribute("data-toast");
  if (msg) showToast(msg);
});

// ============================
// Quick View modal (carousel item click)
// ============================
// - Uses a modal to show product details when clicking a carousel item
// - The item provides data via data-title, data-price, data-desc, data-img
const qv = document.getElementById("quickView");
const qvImg = document.getElementById("qvImg");
const qvTitle = document.getElementById("qvTitle");
const qvPrice = document.getElementById("qvPrice");
const qvDesc = document.getElementById("qvDesc");

// Opens modal and populates UI fields
function openQuickView({ title, price, desc, img }) {
  if (!qv || !qvImg || !qvTitle || !qvPrice || !qvDesc) return;

  qvTitle.textContent = title || "Producto";
  qvPrice.textContent = price || "";
  qvDesc.textContent = desc || "";
  qvImg.src = img || "";
  qvImg.alt = title || "Producto";

  qv.setAttribute("aria-hidden", "false");

  // Prevent background scroll while modal is open
  document.body.style.overflow = "hidden";
}

// Closes the modal and restores scrolling
function closeQuickView() {
  if (!qv) return;
  qv.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Global click handler:
// - Close modal when clicking any element with [data-close]
// - Prevent “ghost clicks” after dragging the carousel
// - Open modal when clicking a carousel item
document.addEventListener("click", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;

  // Close modal (backdrop, close button, etc.)
  if (t.matches("[data-close]")) {
    closeQuickView();
    return;
  }

  // Block click events immediately after a drag operation
  const stage = t.closest(".carousel-stage");
  if (stage && stage.getAttribute("data-block-click") === "1") {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  // Open Quick View if a carousel item was clicked
  const item = t.closest(".slider .item");
  if (item) {
    openQuickView({
      title: item.dataset.title,
      price: item.dataset.price,
      desc: item.dataset.desc,
      img: item.dataset.img
    });
  }
});

// Close modal via keyboard (Escape)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeQuickView();
});

// ============================
// 3D Carousel: manual control (drag + wheel)
// Keeps autoRun intact (only adds a manual offset via --manual-rotate)
// ============================
// - autoRun animation remains on .slider-wrap in CSS
// - This JS only updates CSS variable --manual-rotate on .slider
// - Dragging pauses autoRun (via .is-dragging on stage)
(function setupCarouselControl() {
  const stage = document.querySelector(".carousel-stage");
  const slider = document.querySelector(".carousel-stage .slider");

  // If carousel doesn’t exist, stop here
  if (!stage || !slider) return;

  let isDragging = false;
  let startX = 0;
  let startAngle = 0;
  let angle = 0;
  let moved = false;

  // Read current manual angle
  const getAngle = () => angle;

  // Write manual angle to CSS variable
  const setAngle = (deg) => {
    angle = deg;
    slider.style.setProperty("--manual-rotate", `${deg}deg`);
  };

  // Start dragging (pointer works for mouse + touch + pen)
  stage.addEventListener("pointerdown", (e) => {
    // If modal is open, don’t drag carousel
    if (qv && qv.getAttribute("aria-hidden") === "false") return;

    isDragging = true;
    moved = false;

    startX = e.clientX;
    startAngle = getAngle();

    stage.classList.add("is-dragging");
    stage.setAttribute("data-block-click", "0");
    stage.setPointerCapture(e.pointerId);
  });

  // During drag: translate pointer movement to rotation degrees
  stage.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;

    // Sensitivity: pixels -> degrees
    const next = startAngle + dx * 0.35;
    setAngle(next);

    // If moved enough, block click afterwards
    if (Math.abs(dx) > 6) {
      moved = true;
      stage.setAttribute("data-block-click", "1");
    }
  });

  // End dragging + restore click behavior after a small delay
  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;

    stage.classList.remove("is-dragging");

    if (moved) {
      setTimeout(() => stage.setAttribute("data-block-click", "0"), 160);
    } else {
      stage.setAttribute("data-block-click", "0");
    }

    try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
  };

  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  // Wheel rotation (fine control)
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();

    const delta = (e.deltaY || e.deltaX) * 0.12;
    setAngle(getAngle() + delta);

    // Temporary "dragging" state for a premium feel
    stage.classList.add("is-dragging");
    clearTimeout(stage._wheelTimer);
    stage._wheelTimer = setTimeout(() => stage.classList.remove("is-dragging"), 220);
  }, { passive: false });

  // Keyboard support when the stage is focused
  stage.tabIndex = 0;
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") setAngle(getAngle() - 6);
    if (e.key === "ArrowRight") setAngle(getAngle() + 6);
  });
})();

// ============================
// Lookbook parallax track (drag) — preserves parallax illusion
// ============================
// - Moves the entire track horizontally with translate(...)
// - Also updates each image’s object-position to create “inner parallax”
const track = document.getElementById("image-track");

if (track) {
  // Start drag: store initial pointer position
  track.addEventListener("pointerdown", (e) => {
    track.dataset.mouseDownAt = String(e.clientX);
    track.setPointerCapture(e.pointerId);
  });

  // End drag: store the final percentage as the new base (prevPercentage)
  track.addEventListener("pointerup", (e) => {
    track.dataset.mouseDownAt = "0";

    if (track.dataset.percentage === undefined) track.dataset.percentage = "0";
    track.dataset.prevPercentage = track.dataset.percentage;

    try { track.releasePointerCapture(e.pointerId); } catch (_) {}
  });

  // Cancel drag: same as ending drag
  track.addEventListener("pointercancel", (e) => {
    track.dataset.mouseDownAt = "0";
    if (track.dataset.percentage === undefined) track.dataset.percentage = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
    try { track.releasePointerCapture(e.pointerId); } catch (_) {}
  });

  // Drag move: convert pointer movement to a percentage translate range [-100..0]
  track.addEventListener("pointermove", (e) => {
    if (track.dataset.mouseDownAt === "0") return;

    const mouseDownAt = parseFloat(track.dataset.mouseDownAt || "0");
    const prevPercentage = parseFloat(track.dataset.prevPercentage || "0");

    const mouseDelta = mouseDownAt - e.clientX;
    const maxDelta = window.innerWidth / 1.2;

    let percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = prevPercentage + percentage;

    // Clamp to prevent infinite scrolling beyond content
    nextPercentage = Math.max(Math.min(nextPercentage, 0), -100);
    track.dataset.percentage = String(nextPercentage);

    // Animate track movement
    track.animate(
      { transform: `translate(${nextPercentage}%, -50%)` },
      { duration: 1200, fill: "forwards" }
    );

    // Animate object-position for parallax illusion
    for (const image of track.getElementsByClassName("image")) {
      image.animate(
        { objectPosition: `${100 + nextPercentage}% 50%` },
        { duration: 1200, fill: "forwards" }
      );
    }
  });

  // Wheel support: scroll wheel also moves the lookbook sideways
  track.addEventListener("wheel", (e) => {
    e.preventDefault();

    const prevPercentage = parseFloat(track.dataset.prevPercentage || "0");
    const delta = Math.sign(e.deltaY || e.deltaX) * 6;

    let nextPercentage = prevPercentage - delta;
    nextPercentage = Math.max(Math.min(nextPercentage, 0), -100);

    track.dataset.percentage = String(nextPercentage);
    track.dataset.prevPercentage = String(nextPercentage);

    track.animate(
      { transform: `translate(${nextPercentage}%, -50%)` },
      { duration: 600, fill: "forwards" }
    );

    for (const image of track.getElementsByClassName("image")) {
      image.animate(
        { objectPosition: `${100 + nextPercentage}% 50%` },
        { duration: 600, fill: "forwards" }
      );
    }
  }, { passive: false });
}

// ============================
// Apple-like inertia scrolling (Lenis)
// ============================
// - Adds smooth scroll with inertia similar to Apple marketing pages
// - If Lenis is not loaded, it returns silently
// - It also disables Lenis wheel capture when interacting with the carousel/lookbook
(function setupAppleLikeScroll() {
  if (typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    // lerp controls “lag / inertia”:
    // lower values = more floaty, higher values = snappier
    lerp: 0.06,
    smoothWheel: true,
    smoothTouch: false,
    syncTouch: true,

    // wheelMultiplier controls scroll speed / weight
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,

    // easing curve for a premium glide feeling
    easing: (t) => 1 - Math.pow(1 - t, 4)
  });

  // Lenis requires a requestAnimationFrame loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth anchor link scrolling (#section)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: -72 });
    });
  });

  // IMPORTANT:
  // Prevent Lenis from hijacking wheel input while user is controlling
  // the 3D carousel or the lookbook parallax viewport.
  const stopWheelZones = [".carousel-stage", ".lookbook-viewport"];

  stopWheelZones.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;

    el.addEventListener("mouseenter", () => lenis.stop());
    el.addEventListener("mouseleave", () => lenis.start());
    el.addEventListener("touchstart", () => lenis.stop(), { passive: true });
    el.addEventListener("touchend", () => lenis.start(), { passive: true });
  });

  // Optional: expose Lenis instance for debugging in DevTools
  window.__lenis = lenis;
})();
