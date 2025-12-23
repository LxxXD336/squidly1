"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AccState, DEFAULT_STATE, loadState, saveState, applyToHtml, ensureSkipLink, TextScale, SCALE_STEPS } from "./state";
import Effects from "./effects";

type AccContextType = {
  state: AccState;
  setState: React.Dispatch<React.SetStateAction<AccState>>;
  setScaleRelative: (delta: 1 | -1) => void;
  setMagScale: (delta: 1 | -1) => void;
  speak: (text?: string) => void;
  pauseResumeSpeak: () => void;
  stopSpeak: () => void;
};

const AccContext = createContext<AccContextType | null>(null);
export const useAcc = () => {
  const ctx = useContext(AccContext);
  if (!ctx) throw new Error("useAcc must be used within <AccProvider />");
  return ctx;
};

export default function AccProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccState>(DEFAULT_STATE);

  useEffect(() => {
    const s = loadState();
    setState(s);
    applyToHtml(s);
    if (s.keyboardAssist) ensureSkipLink();
  }, []);
  useEffect(() => {
    applyToHtml(state);
    saveState(state);
    if (state.keyboardAssist) ensureSkipLink();
  }, [state]);

  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  const speakingRef = useRef(false);
  const speak = (text?: string) => {
    if (!synth) return;
    const sel = window.getSelection?.()?.toString().trim();
    const fallback = (() => {
      const h1 = document.querySelector("main h1, [role='main'] h1, h1, [role='heading']");
      const title = document.title || "";
      return [title, h1?.textContent?.trim()].filter(Boolean).join(". ");
    })();
    const base = text ?? (sel || fallback);
    const t = (base ?? "").trim();
    if (!t) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.rate = 1; u.pitch = 1;
    speakingRef.current = true;
    u.onend = () => (speakingRef.current = false);
    synth.speak(u);
  };
  const pauseResumeSpeak = () => {
    if (!synth || !speakingRef.current) return;
    if (synth.paused) synth.resume(); else synth.pause();
  };
  const stopSpeak = () => { if (!synth) return; synth.cancel(); speakingRef.current = false; };

  const currIdx = useMemo(() => Math.max(0, SCALE_STEPS.indexOf(state.textScale)), [state.textScale]);
  const setScaleRelative = (delta: 1 | -1) => {
    const next = SCALE_STEPS[Math.min(SCALE_STEPS.length - 1, Math.max(0, currIdx + delta))];
    setState((s) => ({ ...s, textScale: next }));
  };
  const setMagScale = (delta: 1 | -1) =>
    setState((s) => {
      let val = +(s.magScale + delta * 0.2).toFixed(2);
      val = Math.max(1.4, Math.min(3, val));
      return { ...s, magScale: val };
    });

  const value = useMemo(
    () => ({ state, setState, setScaleRelative, setMagScale, speak, pauseResumeSpeak, stopSpeak }),
    [state]
  );

  return (
    <AccContext.Provider value={value}>
      <Effects />
      {children}
    </AccContext.Provider>
  );
}
