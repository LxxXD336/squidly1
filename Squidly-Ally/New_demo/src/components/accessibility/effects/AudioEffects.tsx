"use client";
import { useEffect } from "react";
import { useAcc } from "../AccProvider";

export default function AudioEffects() {
  const { state, speak } = useAcc();

  useEffect(() => {
    if (!state.describeOnHover) return;

    const handler = (el: Element) => {
      const img = el.closest("img, figure, video, [role='img']");
      if (!img) return;
      const alt =
        (img.getAttribute("aria-label") ||
          img.getAttribute("alt") ||
          img.getAttribute("data-desc") ||
          (img.querySelector?.("figcaption")?.textContent || "")).trim();
      if (alt) speak(alt);
    };

    const onEnter = (e: Event) => handler(e.target as Element);
    const onFocus = (e: Event) => handler(e.target as Element);

    document.addEventListener("pointerenter", onEnter, true);
    document.addEventListener("focusin", onFocus);

    return () => {
      document.removeEventListener("pointerenter", onEnter, true);
      document.removeEventListener("focusin", onFocus);
    };
  }, [state.describeOnHover, speak]);

  return null;
}
