import { useLayoutEffect, type RefObject } from "react";

/**
 * Scales a fixed-size content block down so it always fits the *visible*
 * viewport — including inside in-app browsers (X, Instagram, …) where
 * `vh`/`dvh` are unreliable. Never upscales (caps at scale 1), so on tall /
 * desktop screens the content keeps its natural size.
 *
 * `transform: scale()` doesn't change layout size, so reading
 * `offsetWidth/offsetHeight` always returns the natural (pre-scale) size —
 * the measurement is stable and won't oscillate.
 */
export function useFitToViewport(contentRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const vv = window.visualViewport;
    const MARGIN = 16; // breathing room so content isn't flush to the edges
    let frame = 0;

    const apply = () => {
      frame = 0;
      const availW = vv?.width ?? window.innerWidth;
      const availH = vv?.height ?? window.innerHeight;

      // Keep the outer container exactly as tall as the visible area.
      document.documentElement.style.setProperty("--app-h", `${availH}px`);

      const cw = el.offsetWidth;
      const ch = el.offsetHeight;
      if (!cw || !ch) return;

      const scale = Math.min(
        1,
        (availW - MARGIN) / cw,
        (availH - MARGIN) / ch,
      );
      el.style.transform = scale < 1 ? `scale(${scale})` : "";
    };

    const recompute = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();

    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    vv?.addEventListener("resize", recompute);
    vv?.addEventListener("scroll", recompute);
    window.addEventListener("resize", recompute);
    window.addEventListener("orientationchange", recompute);
    document.fonts?.ready.then(recompute);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      vv?.removeEventListener("resize", recompute);
      vv?.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
      window.removeEventListener("orientationchange", recompute);
    };
  }, [contentRef]);
}
