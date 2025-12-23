"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAcc } from "../AccProvider";

const STYLE_ID = "acc-color-filters";

function setGlobalFilterCSS(css: string) {
    if (typeof document === "undefined") return;
    let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!tag) {
        tag = document.createElement("style");
        tag.id = STYLE_ID;
        document.head.appendChild(tag);
    }
    tag.textContent = css;
}

function buildFilterCSS(params: {
    mode: "standard" | "cva" | "hc" | "bw";
    intensity: number;
    hcStyle?: "standard" | "photophobia" | "migraine_soft" | "cvi_high" | "mtbi_boost";
}) {
    const { mode, intensity, hcStyle } = params;

    const reduce = Math.max(0, Math.min(100, intensity)) / 100;
    const sat = 1 - 0.6 * reduce;
    const bri = 1 - 0.08 * reduce;

    let filter = "none";
    let extra = "";

    if (mode === "standard") {
        filter = `saturate(${sat.toFixed(3)}) brightness(${bri.toFixed(3)})`;
    } else if (mode === "cva") {
        const c = 1.05 + 0.1 * reduce;
        filter = `saturate(${sat.toFixed(3)}) brightness(${bri.toFixed(3)}) contrast(${c.toFixed(3)})`;
    } else if (mode === "bw") {
        filter = `grayscale(1) contrast(1.06)`;
    } else if (mode === "hc") {
        switch (hcStyle) {
            case "photophobia":
                filter = `sepia(0.12) hue-rotate(330deg) saturate(0.90) brightness(0.98) contrast(1.08)`;
                break;
            case "migraine_soft":
                filter = `saturate(0.80) brightness(0.93) contrast(1.10)`;
                break;
            case "cvi_high":
                filter = `contrast(1.35) brightness(0.88)`;
                extra = `
html, body { background-color:#0b0b0b !important; color:#f2f2f2 !important; }
a { color:#9adcff !important; }
`;
                break;
            case "mtbi_boost":
                filter = `contrast(1.40) saturate(1.15) sepia(0.08)`;
                break;
            default:
                filter = `contrast(1.30) saturate(1.10) brightness(1.02)`;
                break;
        }
    }

    return `
html { filter: ${filter}; }
${extra}
`.trim();
}

type Mode = "standard" | "cva" | "hc" | "bw";

export default function ColorFilterPanel() {
    const { state, setState } = useAcc();

    const derivedMode: Mode = state.grayscale
        ? "bw"
        : state.highContrast
            ? "hc"
            : state.colorSafe
                ? "cva"
                : "standard";

    const [displayMode, setDisplayMode] = useState<Mode>(derivedMode);

    const intensity = 0;

    useEffect(() => {
        setState((s) => {
            const next = { ...s, colorSafe: false, highContrast: false, grayscale: false };
            if (displayMode === "cva") next.colorSafe = true;
            if (displayMode === "hc") next.highContrast = true;
            if (displayMode === "bw") next.grayscale = true;
            if (displayMode === "hc" && !next.contrastStyle) next.contrastStyle = "standard" as any;
            return next;
        });
    }, [displayMode, setState]);

    useEffect(() => {
        const should: Mode = state.grayscale ? "bw" : state.highContrast ? "hc" : state.colorSafe ? "cva" : "standard";
        if (should !== displayMode) setDisplayMode(should);
    }, [state.grayscale, state.highContrast, state.colorSafe, displayMode]);

    useEffect(() => {
        const css = buildFilterCSS({
            mode: displayMode,
            intensity,
            hcStyle: (state.contrastStyle as any) ?? "standard",
        });
        setGlobalFilterCSS(css);
    }, [displayMode, intensity, state.contrastStyle]);

    const resetColour = useCallback(() => {
        setDisplayMode("standard");
        setState((s) => ({
            ...s,
            colorSafe: false,
            highContrast: false,
            grayscale: false,
            contrastStyle: "standard" as any,
        }));

        const css = buildFilterCSS({ mode: "standard", intensity: 0, hcStyle: "standard" as any });
        setGlobalFilterCSS(css);
    }, [setState]);

    useEffect(() => {
        const onReset = (e: Event) => {
            const d = (e as CustomEvent).detail || {};
            if (d.scope === "all" || d.scope === "colour") resetColour();
        };
        window.addEventListener("acc:reset", onReset as EventListener);
        return () => window.removeEventListener("acc:reset", onReset as EventListener);
    }, [resetColour]);

    const ModeButton = ({ id, label }: { id: Mode; label: string }) => {
        const active = displayMode === id;

        return (
            <button
                type="button"
                onClick={() => setDisplayMode(id)}
                className={`
        w-full h-11 rounded-2xl
        px-2
        flex items-center justify-center
        text-center
        text-[11.5px] font-semibold leading-tight
        transition
        ${active
                    ? "bg-violet-500 text-white shadow-[0_6px_14px_rgba(139,92,246,.28)]"
                    : "bg-white/60 text-slate-900 hover:bg-white"}
      `}
            >
                <span className="block">{label}</span>
            </button>
        );
    };

    return (
        <div data-acc-ui className="grid gap-3">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_6px_18px_rgba(15,23,42,0.08)] px-4 py-3.5">
                <div className="flex items-center justify-between">
                    <div className="text-[15px] font-semibold text-slate-900">Colour & Filters</div>
                    <button
                        type="button"
                        onClick={resetColour}
                        className="h-9 px-5 rounded-xl border-2 border-violet-400 text-[12.5px] font-semibold text-slate-900 bg-white"
                    >

                        Reset
                    </button>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2">
                    <ModeButton id="standard" label="Standard" />
                    <ModeButton id="cva" label="Colour Vision Aid" />
                    <ModeButton id="bw" label="Black & White" />
                    <ModeButton id="hc" label="High Contrast" />
                </div>
            </div>
        </div>
    );
}
