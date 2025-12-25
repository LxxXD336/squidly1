"use client";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAcc } from "../AccProvider";

type Mode = "standard" | "cva" | "hc" | "bw";

const TARGET_ID = "acc-filter-target";

// 0-100，数值越大效果越明显（这里用于 cva/hc；standard 我改成默认不加滤镜，避免“标准模式也在变色”）
const INTENSITY = 60;

function clamp01FromPercent(p: number) {
    const n = Math.max(0, Math.min(100, p));
    return n / 100;
}

function getFilterTarget(): HTMLElement | null {
    if (typeof document === "undefined") return null;

    const explicit = document.getElementById(TARGET_ID);
    if (explicit) return explicit as HTMLElement;

    const next = document.getElementById("__next");
    if (next) return next as HTMLElement;

    const root = document.getElementById("root");
    if (root) return root as HTMLElement;

    // 兜底：body（确实更容易闪，所以我们后面会尽量“自动切回”到更好的 target）
    return document.body;
}

function buildFilter(mode: Mode, intensity: number, hcStyle?: string) {
    if (mode === "standard") return "none";

    const reduce = clamp01FromPercent(intensity);
    const sat = 1 - 0.6 * reduce;
    const bri = 1 - 0.08 * reduce;

    if (mode === "cva") {
        const c = 1.15 + 0.25 * reduce;
        return `saturate(${sat.toFixed(3)}) brightness(${bri.toFixed(3)}) contrast(${c.toFixed(3)})`;
    }

    if (mode === "bw") {
        return `grayscale(1) contrast(1.08)`;
    }

    // hc
    switch (hcStyle) {
        case "photophobia":
            return `sepia(0.12) hue-rotate(330deg) saturate(0.90) brightness(0.98) contrast(1.12)`;
        case "migraine_soft":
            return `saturate(0.80) brightness(0.93) contrast(1.18)`;
        case "mtbi_boost":
            return `contrast(1.55) saturate(1.20) sepia(0.08)`;
        case "cvi_high":
            return `contrast(1.70) brightness(0.90)`;
        default:
            return `contrast(1.55) saturate(1.15) brightness(1.03)`;
    }
}

export default function ColorFilterPanel() {
    const { state, setState } = useAcc();

    const contrastStyle = (state as any).contrastStyle as
        | "standard"
        | "photophobia"
        | "migraine_soft"
        | "cvi_high"
        | "mtbi_boost"
        | undefined;

    // Provider 状态 -> UI 模式（只作为“外部变更”的同步来源：例如全局 reset）
    const derivedMode: Mode = state.grayscale
        ? "bw"
        : state.highContrast
            ? "hc"
            : state.colorSafe
                ? "cva"
                : "standard";

    const [displayMode, setDisplayMode] = useState<Mode>(derivedMode);

    // 只保留这一条：当外部状态改变时，同步 UI（不会再反向写回，避免双更新闪烁）
    useEffect(() => {
        if (derivedMode !== displayMode) setDisplayMode(derivedMode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [derivedMode]);

    // target 用 ref 保存，避免第一次落到 body 后永远不切回
    const targetRef = useRef<HTMLElement | null>(null);

    const resolveTarget = useCallback(() => {
        const el = getFilterTarget();
        targetRef.current = el;
        return el;
    }, []);

    useLayoutEffect(() => {
        resolveTarget();
    }, [resolveTarget]);

    // 监听 DOM 变化：如果后来出现了 #acc-filter-target，就自动切回去（减少 body 带来的闪）
    useEffect(() => {
        if (typeof document === "undefined") return;

        const mo = new MutationObserver(() => {
            const current = targetRef.current;
            const next = getFilterTarget();
            if (next && next !== current) {
                targetRef.current = next;
            }
        });

        mo.observe(document.documentElement, { childList: true, subtree: true });
        return () => mo.disconnect();
    }, []);

    const lastAppliedRef = useRef<string>("");

    // ✅ 核心：只在 mode/contrastStyle 变化时写 filter；不再绑整个 state；不再写 transform
    useLayoutEffect(() => {
        const el = targetRef.current ?? resolveTarget();
        if (!el) return;

        const filter = buildFilter(displayMode, INTENSITY, contrastStyle);

        if (filter === lastAppliedRef.current) return;
        lastAppliedRef.current = filter;

        if (filter === "none") {
            el.style.filter = "";
            (el.style as any).webkitFilter = "";
            el.style.willChange = "";
            return;
        }

        el.style.filter = filter;
        (el.style as any).webkitFilter = filter;
        el.style.willChange = "filter";
    }, [displayMode, contrastStyle, resolveTarget]);

    // ✅ 单向更新：点击时一次性更新 Provider + UI（不会再 useEffect 反复写回导致闪）
    const applyMode = useCallback(
        (mode: Mode) => {
            setDisplayMode(mode);

            setState((s) => {
                const next: any = { ...s, colorSafe: false, highContrast: false, grayscale: false };

                if (mode === "cva") next.colorSafe = true;
                if (mode === "hc") next.highContrast = true;
                if (mode === "bw") next.grayscale = true;

                if (mode === "hc" && !next.contrastStyle) next.contrastStyle = "standard";
                if (mode === "standard") next.contrastStyle = next.contrastStyle ?? "standard";

                return next;
            });
        },
        [setState]
    );

    const resetColour = useCallback(() => {
        applyMode("standard");
        const el = targetRef.current ?? getFilterTarget();
        if (el) {
            el.style.filter = "";
            (el.style as any).webkitFilter = "";
            el.style.willChange = "";
        }
        lastAppliedRef.current = "none";
    }, [applyMode]);

    // 监听全局 reset（保留你原本逻辑）
    useEffect(() => {
        const onReset = (e: Event) => {
            const d = (e as CustomEvent).detail || {};
            if (d.scope === "all" || d.scope === "colour") resetColour();
        };
        window.addEventListener("acc:reset", onReset as EventListener);
        return () => window.removeEventListener("acc:reset", onReset as EventListener);
    }, [resetColour]);

    // 卸载时清理滤镜
    useEffect(() => {
        return () => {
            const el = getFilterTarget();
            if (!el) return;
            el.style.filter = "";
            (el.style as any).webkitFilter = "";
            el.style.willChange = "";
        };
    }, []);

    const ModeButton = ({ id, label }: { id: Mode; label: string }) => {
        const active = displayMode === id;
        return (
            <button
                type="button"
                onClick={() => applyMode(id)}
                className={`
          w-full h-11 rounded-2xl
          px-2
          flex items-center justify-center
          text-center
          text-[11.5px] font-semibold leading-tight
          transition
          ${
                    active
                        ? "bg-violet-500 text-white shadow-[0_6px_14px_rgba(139,92,246,.28)]"
                        : "bg-white/60 text-slate-900 hover:bg-white"
                }
        `}
            >
                <span className="block">{label}</span>
            </button>
        );
    };

    const targetLabel = useMemo(() => {
        const el = targetRef.current;
        if (!el) return "unresolved";
        if (el.id) return `#${el.id}`;
        if (el === document.body) return "body";
        return el.tagName.toLowerCase();
    }, [displayMode]);

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
