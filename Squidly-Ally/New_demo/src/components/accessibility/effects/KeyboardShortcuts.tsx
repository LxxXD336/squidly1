"use client";
import { useEffect } from "react";
import { useAcc } from "../AccProvider";

export default function KeyboardShortcuts() {
  const { setScaleRelative, setState, speak } = useAcc();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const alt = e.altKey || e.metaKey;
      if (alt && (k === "=" || k === "+")) {
        e.preventDefault();
        setScaleRelative(1);
      } else if (alt && (k === "-" || k === "_")) {
        e.preventDefault();
        setScaleRelative(-1);
      } else if (alt && k === "m") {
        e.preventDefault();
        setState((s) => ({ ...s, magnifier: !s.magnifier }));
      } else if (alt && k === "r") {
        e.preventDefault();
        speak();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setScaleRelative, setState, speak]);

  return null;
}
