"use client";
import React from "react";
import { Volume2, Play, Pause, StopCircle, MousePointer } from "lucide-react";
import { useAcc } from "../AccProvider";

export default function MediaControls() {
  const { state, setState, speak, pauseResumeSpeak, stopSpeak } = useAcc();

  return (
    <section className="rounded-xl border border-slate-300 p-3 bg-white/80">
      <div className="flex items-center gap-2 text-slate-950 font-medium leading-5">
        <Volume2 className="h-[18px] w-[18px] text-violet-700" />
        Read aloud & audio description
      </div>
      <p className="text-[12.5px] text-slate-600 leading-5 mt-1">
      </p>
      <div className="mt-2 flex items-center gap-2">
        <button
          className="px-2.5 py-2 rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
          onClick={() => speak()}
          aria-label="Read selection"
        >
          <Play className="h-[16px] w-[16px]" />
        </button>
        <button
          className="px-2.5 py-2 rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
          onClick={pauseResumeSpeak}
          aria-label="Pause or resume"
        >
          <Pause className="h-[16px] w-[16px]" />
        </button>
        <button
          className="px-2.5 py-2 rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
          onClick={stopSpeak}
          aria-label="Stop reading"
        >
          <StopCircle className="h-[16px] w-[16px]" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <MousePointer className="h-[16px] w-[16px] text-violet-700" />
        <span className="text-slate-950 font-medium">Describe media on hover/focus</span>
        <button
          onClick={() => setState((s)=>({ ...s, describeOnHover: !s.describeOnHover }))}
          role="switch"
          aria-checked={state.describeOnHover}
          className={`ml-auto relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${state.describeOnHover ? "bg-violet-700" : "bg-slate-400"}`}
        >
          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${state.describeOnHover ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
    </section>
  );
}
