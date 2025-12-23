// AccMagnifier.tsx
"use client";
import React from "react";
import { createPortal } from "react-dom";

type Variant = "side" | "follow" | "both";

export default function AccInlineMagnifier({
                                               enabled = true,
                                               variant = "both",
                                           }: { enabled?: boolean; variant?: Variant }) {
    const followRef = React.useRef<HTMLDivElement | null>(null);
    const followTextRef = React.useRef<HTMLDivElement | null>(null);
    const sideRef = React.useRef<HTMLDivElement | null>(null);
    const sideTextRef = React.useRef<HTMLDivElement | null>(null);

    // 显隐与初始化
    React.useEffect(() => {
        const f = followRef.current, fb = followTextRef.current;
        const s = sideRef.current, sb = sideTextRef.current;
        if (!f || !s || !fb || !sb) return;

        if (!enabled) {
            f.style.display = "none";
            s.style.display = "none";
            return;
        }

        // 初始可见（便于确认挂载）
        fb.textContent = "Magnifier READY — move your mouse over any text";
        f.style.display = "block"; f.style.opacity = "1";
        f.style.transform = "translate(220px,120px)";

        sb.textContent = "Side box READY — hover text to reposition";
        s.style.display = "block"; s.style.opacity = "1";
        s.style.transform = "translate(220px,220px)";
    }, [enabled]);

    // 跟随模式
    React.useEffect(() => {
        if (!enabled) return;
        const f = followRef.current;
        if (!f) return;
        if (variant === "side") return; // 只显示侧边，不跟随

        const onMove = (ev: MouseEvent) => {
            const W = f.offsetWidth || 520, H = f.offsetHeight || 140, pad = 16;
            const x = Math.max(pad, Math.min(ev.clientX + 24, window.innerWidth - W - pad));
            const y = Math.max(pad, Math.min(ev.clientY + 24, window.innerHeight - H - pad));
            f.style.transform = `translate(${x}px, ${y}px)`;
        };
        document.addEventListener("mousemove", onMove, { passive: true });
        return () => document.removeEventListener("mousemove", onMove);
    }, [enabled, variant]);

    if (typeof window === "undefined") return null;
    return createPortal(
        <>
            <div
                id="acc-inline-follow"
                ref={followRef}
                aria-hidden="true"
                style={{
                    position: "fixed",
                    zIndex: 2147483647,
                    display: "none",
                    width: 520, minHeight: 120, maxHeight: 260,
                    padding: "16px 18px",
                    background: "rgba(18,19,22,.92)", color: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 20px 50px rgba(0,0,0,.35), 0 4px 14px rgba(0,0,0,.25)",
                    opacity: 0, transition: "opacity .12s ease",
                    pointerEvents: "none",
                    contain: "layout paint size",
                }}
            >
                <div
                    ref={followTextRef}
                    style={{
                        fontWeight: 800, lineHeight: 1.2, letterSpacing: ".01em",
                        fontSize: "clamp(18px, 2.2vw, 34px)",
                        maxHeight: 220, overflow: "auto",
                    }}
                />
            </div>

            <div
                id="acc-inline-side"
                ref={sideRef}
                aria-hidden="true"
                style={{
                    position: "fixed",
                    zIndex: 2147483647,
                    display: "none",
                    width: 520, minHeight: 120, maxHeight: 260,
                    padding: "14px 16px",
                    background: "rgba(18,19,22,.92)", color: "#fff",
                    borderRadius: 14,
                    boxShadow: "0 18px 45px rgba(0,0,0,.35), 0 3px 12px rgba(0,0,0,.25)",
                    opacity: 0, transition: "opacity .12s ease",
                    pointerEvents: "none",
                    contain: "layout paint size",
                }}
            >
                <div
                    ref={sideTextRef}
                    style={{
                        fontWeight: 800, lineHeight: 1.2, letterSpacing: ".01em",
                        fontSize: "clamp(20px, 2.6vw, 36px)",
                        maxHeight: 220, overflow: "auto",
                    }}
                />
            </div>
        </>,
        document.body
    );
}
