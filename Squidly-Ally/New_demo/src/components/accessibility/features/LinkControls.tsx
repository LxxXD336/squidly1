// src/components/accessibility/features/LinkControls.tsx
"use client";
import React, { useEffect, useState } from "react";

type Props = { variant?: "icon" | "chip" };
const LS_KEY = "acc:emphasize-links";
const EVT = "acc:emphasize-links";

export default function LinkControls({ variant = "icon" }: Props) {
    const [on, setOn] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(LS_KEY) === "1";
    });

    useEffect(() => {
        const h = (e: Event) => {
            const d = (e as CustomEvent).detail || {};
            setOn(!!d.enabled);
        };
        window.addEventListener(EVT, h as EventListener);
        return () => window.removeEventListener(EVT, h as EventListener);
    }, []);

    const toggle = () => {
        const next = !on;
        try { localStorage.setItem(LS_KEY, next ? "1" : "0"); } catch {}
        window.dispatchEvent(new CustomEvent(EVT, { detail: { enabled: next } }));
    };

    if (variant === "icon") {
        return (
            <button
                type="button"
                onClick={toggle}
                aria-pressed={on}
                title={on ? "Turn off link emphasis" : "Emphasize links"}
                className={`h-9 w-9 rounded-full border flex items-center justify-center transition
          ${on ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}
            >
                <span aria-hidden>🔗</span>
            </button>
        );
    }

    // 备用：胶囊按钮
    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={on}
            className={`h-9 px-3 rounded-xl border text-[13px] transition
        ${on ? "border-violet-600 bg-violet-50 text-violet-700"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}
        >
            <span aria-hidden>🔗</span><span className="ml-1">{on ? "On" : "Off"}</span>
        </button>
    );
}
