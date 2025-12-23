"use client";
import { useEffect } from "react";
import { useAcc } from "../AccProvider";

export default function MagnifierEffects() {
  const { state } = useAcc();

  useEffect(() => {
    if (!state.magnifier) return;
    const html = document.documentElement;
    const onMove = (e: PointerEvent) => {
      html.style.setProperty("--acc-mx", `${e.clientX}px`);
      html.style.setProperty("--acc-my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [state.magnifier]);

  return null;
}
