"use client";
import React from "react";
import { Keyboard } from "lucide-react";
import { useAcc } from "../AccProvider";

export default function KeyboardControls() {
  const { state, setState } = useAcc();
  return (
    <section className="rounded-xl border border-slate-300 p-3 bg-white/80">
      <div className="flex items-center gap-2 text-slate-950 font-medium">
        <Keyboard className="h-[18px] w-[18px] text-violet-700" />
        Keyboard assist
        <button
          onClick={() => setState((s)=>({ ...s, keyboardAssist: !s.keyboardAssist }))}
          role="switch"
          aria-checked={state.keyboardAssist}
          className={`ml-auto relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${state.keyboardAssist ? "bg-violet-700" : "bg-slate-400"}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${state.keyboardAssist ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      <p className="text-[12.5px] text-slate-600 leading-5 mt-1"></p>
    </section>
  );
}
