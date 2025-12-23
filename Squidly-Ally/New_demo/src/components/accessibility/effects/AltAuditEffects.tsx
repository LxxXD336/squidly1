"use client";
import { useEffect } from "react";
import { useAcc } from "../AccProvider";

export default function AltAuditEffects() {
  const { state } = useAcc();

  useEffect(() => {
    if (!state.altTooltip) return;
    const imgs = Array.from(document.querySelectorAll("img")) as HTMLImageElement[];
    imgs.forEach((img) => {
      if (img.alt && !img.title) img.title = img.alt;
    });
  }, [state.altTooltip]);

  return null;
}
