"use client";
import React from "react";
import { Pause } from "lucide-react";
import { useAcc } from "../AccProvider";

export default function MotionControls() {
  const { state, setState } = useAcc();
  return (
    <section className="rounded-xl border border-slate-300 p-3 bg-white/80">
      <div className="flex items-center gap-2 text-slate-950 font-medium">
        <Pause className="h-[18px] w-[18px] text-violet-700" />
        Pause animations
        <button
          onClick={() => setState((s)=>({ ...s, pauseMotion: !s.pauseMotion }))}
          role="switch"
          aria-checked={state.pauseMotion}
          className={`ml-auto relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${state.pauseMotion ? "bg-violet-700" : "bg-slate-400"}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${state.pauseMotion ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      <p className="text-[12.5px] text-slate-600 leading-5 mt-1"></p>
    </section>
  );
}
