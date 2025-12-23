"use client";
import React, { useMemo } from "react";
import { useAcc } from "../AccProvider";
import { SCALE_STEPS, TextScale } from "../state";

// 你要的 3 档：只控制“文字大小”，不做整页 zoom
const PRESETS: { key: "small" | "medium" | "large"; label: string; value: TextScale }[] = [
  { key: "small", label: "Small", value: 100 },
  { key: "medium", label: "Medium", value: 125 },
  { key: "large", label: "Large", value: 150 },
];

function nearestStep(v: number): TextScale {
  let best: TextScale = SCALE_STEPS[0];
  let bestDist = Math.abs(best - v);

  for (const s of SCALE_STEPS) {
    const d = Math.abs(s - v);
    if (d < bestDist) {
      best = s;
      bestDist = d;
    }
  }
  return best;
}


export default function TextControls() {
  const { state, setState } = useAcc();

  const presets = useMemo(() => {
    // 防止 PRESETS 里写了一个不在 SCALE_STEPS 的值
    return PRESETS.map((p) => ({
      ...p,
      value: SCALE_STEPS.includes(p.value) ? p.value : nearestStep(p.value),
    }));
  }, []);

  const setTextScale = (val: TextScale) => {
    setState((s) => ({
      ...s,
      textScale: val,
      // 关键：强制关闭整页缩放，避免“屏幕缩放”的效果
      pageZoom: false,
    }));
  };

  const Item = ({ label, value }: { label: string; value: TextScale }) => {
    const active = state.textScale === value;

    return (
      <button
        type="button"
        onClick={() => setTextScale(value)}
        aria-pressed={active}
        className={`h-11 rounded-2xl text-[12.5px] font-semibold border transition focus:outline-none focus:ring-4 focus:ring-violet-200
          ${
            active
              ? "bg-violet-500 text-white border-violet-500 shadow-[0_6px_14px_rgba(139,92,246,.25)]"
              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
          }`}
        style={{ flex: 1 }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full" role="group" aria-label="Text size adjuster">
      <div className="flex items-center justify-between gap-2">
        {presets.map((p) => (
          <Item key={p.key} label={p.label} value={p.value} />
        ))}
      </div>
    </div>
  );
}
