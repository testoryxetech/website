import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Elements that fade/slide in as they scroll into view.
const REVEAL_SELECTOR = [
  ".elementor-widget:not(.elementor-widget-spacer):not(.elementor-widget-shortcode)",
  ".career-form-section",
  ".credential",
  ".tech-card",
  ".section-head",
  ".why-us-intro",
  ".why-us-card",
  ".purpose-card",
  ".coverage-globe",
  ".coverage-copy",
].join(",");

function revealVariant(element) {
  if (element.classList.contains("elementor-widget-image") ||
      element.classList.contains("coverage-globe")) return "zoom";
  if (element.classList.contains("elementor-widget-heading") ||
      element.classList.contains("elementor-widget-elementskit-heading")) return "rise";
  const column = element.closest(".elementor-column, .e-con");
  const row = column?.parentElement;
  if (column && row && row.children.length > 1) {
    const index = Array.prototype.indexOf.call(row.children, column);
    if (index === 0) return "left";
    if (index === row.children.length - 1) return "right";
  }
  return "up";
}

// Adds data-reveal to content blocks and flips data-revealed once they enter
// the viewport. Blocks entering together are staggered in DOM order.
export function useScrollReveal(rootRef, deps) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || !("IntersectionObserver" in window)) return undefined;

    const targets = root.querySelectorAll(REVEAL_SELECTOR);
    const observer = new IntersectionObserver((entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          entry.target.style.setProperty("--reveal-delay", `${Math.min(index, 7) * 85}ms`);
          entry.target.dataset.revealed = "true";
          observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });

    targets.forEach((element) => {
      element.dataset.reveal = revealVariant(element);
      observer.observe(element);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useInView({ once = true, rootMargin = "0px 0px -10% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && once) observer.disconnect();
    }, { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return [ref, inView];
}

export function useCountUp(target, active, duration = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    if (prefersReducedMotion()) {
      setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

// Tracks page scroll as a 0..1 ratio plus direction, throttled to animation frames.
export function useScrollState() {
  const [state, setState] = useState({ progress: 0, scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      setState((previous) => ({
        progress: max > 0 ? Math.min(y / max, 1) : 0,
        scrolled: y > 24,
        hidden: y > 320 ? (goingDown ? true : goingUp ? false : previous.hidden) : false,
      }));
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
