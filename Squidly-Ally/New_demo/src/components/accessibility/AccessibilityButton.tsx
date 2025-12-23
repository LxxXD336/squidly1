"use client";
import React, { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccProvider from "./AccProvider";
import TextControls from "./features/TextControls";
import LinkControls from "./features/LinkControls";
import "./styles/global-acc.css";
import { createPortal } from "react-dom";
import ColorFilterPanel from "./features/ColorFilterPanel";
import ReadAloudControls from "./features/ReadAloudControls";
import CursorSizeControls from "./features/CursorSizeControls";
const AccMagnifierSideTopLeft = React.lazy(() => import("../AccMagnifierUltra"));

const LS_LENS = "acc:inlineMagnifier:enabled";
const LS_LINKS = "acc:emphasize-links";
const LS_CURSOR_ENABLED = "acc:cursor:enabled";
const LS_CURSOR_SIZE = "acc:cursor:size";

function Portal({ children }: { children: React.ReactNode }) {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
}

const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 380, damping: 34 } },
    exit: { x: "100%", transition: { type: "tween", duration: 0.25 } },
};

const InlineFixes = () => (
    <style
        data-acc-ui
        dangerouslySetInnerHTML={{
            __html: `
[data-acc-ui] .acc-allow-overflow { overflow: visible !important; }
[data-acc-ui] .acc-allow-overflow * { overflow: visible !important; }
[data-acc-ui] .acc-right-pad { padding-right: 12px; }
`.trim(),
        }}
    />
);

const Switch = ({
                    checked,
                    onClick,
                    labelledby,
                }: {
    checked: boolean;
    onClick: () => void;
    labelledby?: string;
}) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelledby}
        onClick={onClick}
        className={`relative inline-flex h-[26px] w-[48px] items-center rounded-full transition-colors ${
            checked ? "bg-violet-500" : "bg-slate-300"
        }`}
    >
    <span
        className={`inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[25px]" : "translate-x-[3px]"
        }`}
    />
        <span className="sr-only">toggle</span>
    </button>
);

function Card({
                  title,
                  right,
                  subtitle,
                  children,
              }: {
    title: string;
    right?: React.ReactNode;
    subtitle?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_6px_18px_rgba(15,23,42,0.08)] px-3.5 py-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-[14.5px] font-semibold text-slate-900">{title}</div>
                    {subtitle ? <div className="mt-0.5 text-[12px] text-slate-500">{subtitle}</div> : null}
                </div>
                {right}
            </div>
            {children ? <div className="mt-3">{children}</div> : null}
        </div>
    );
}

type CursorSize = "small" | "medium" | "large";

function CursorSizeGroup({
                             value,
                             onChange,
                         }: {
    value: CursorSize;
    onChange: (v: CursorSize) => void;
}) {
    const Item = ({ v, label }: { v: CursorSize; label: string }) => {
        const active = value === v;
        return (
            <button
                type="button"
                onClick={() => onChange(v)}
                className={`h-10 px-5 rounded-2xl text-[12.5px] font-semibold border transition ${
                    active
                        ? "bg-violet-500 text-white border-violet-500 shadow-[0_6px_14px_rgba(139,92,246,.25)]"
                        : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                }`}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="flex items-center justify-between gap-2">
            <Item v="small" label="Small" />
            <Item v="medium" label="Medium" />
            <Item v="large" label="Large" />
        </div>
    );
}

export default function AccessibilityButton() {
    const [open, setOpen] = useState(false);
    const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);

    const [lensEnabled, setLensEnabled] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        const raw = localStorage.getItem(LS_LENS);
        return raw == null ? true : raw === "true";
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent("acc:inlineMagnifier", { detail: { enabled: lensEnabled } }));
    }, []);

    useEffect(() => {
        const onCustom = (e: Event) => {
            const d = (e as CustomEvent).detail || {};
            if (typeof d.enabled === "boolean") setLensEnabled(d.enabled);
        };
        const onStorage = (e: StorageEvent) => {
            if (e.key === LS_LENS && e.newValue != null) setLensEnabled(e.newValue === "true");
        };
        window.addEventListener("acc:inlineMagnifier", onCustom as EventListener);
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener("acc:inlineMagnifier", onCustom as EventListener);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    const toggleLens = useCallback(() => {
        const next = !lensEnabled;
        setLensEnabled(next);
        try {
            localStorage.setItem(LS_LENS, String(next));
        } catch {}
        window.dispatchEvent(new CustomEvent("acc:inlineMagnifier", { detail: { enabled: next } }));
    }, [lensEnabled]);

    const [linksOn, setLinksOn] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(LS_LINKS) === "1";
    });

    useEffect(() => {
        const apply = (on: boolean) => {
            document.documentElement.setAttribute("data-emphasize-links", on ? "1" : "0");
            setLinksOn(on);
        };
        try {
            apply(localStorage.getItem(LS_LINKS) === "1");
        } catch {}
        const onEvt = (e: Event) => {
            const d = (e as CustomEvent).detail || {};
            apply(!!d.enabled);
        };
        window.addEventListener("acc:emphasize-links", onEvt as EventListener);
        return () => window.removeEventListener("acc:emphasize-links", onEvt as EventListener);
    }, []);

    const toggleLinksEmphasis = useCallback(() => {
        const next = !linksOn;
        try {
            localStorage.setItem(LS_LINKS, next ? "1" : "0");
        } catch {}
        window.dispatchEvent(new CustomEvent("acc:emphasize-links", { detail: { enabled: next } }));
    }, [linksOn]);

    const [cursorEnabled, setCursorEnabled] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        const raw = localStorage.getItem(LS_CURSOR_ENABLED);
        return raw == null ? true : raw === "1";
    });

    const [cursorSize, setCursorSize] = useState<CursorSize>(() => {
        if (typeof window === "undefined") return "small";
        const raw = localStorage.getItem(LS_CURSOR_SIZE) as CursorSize | null;
        return raw === "small" || raw === "medium" || raw === "large" ? raw : "small";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-acc-cursor", cursorEnabled ? "1" : "0");
        window.dispatchEvent(new CustomEvent("acc:cursor", { detail: { enabled: cursorEnabled } }));
        try {
            localStorage.setItem(LS_CURSOR_ENABLED, cursorEnabled ? "1" : "0");
        } catch {}
    }, [cursorEnabled]);

    useEffect(() => {
        document.documentElement.setAttribute("data-acc-cursor-size", cursorSize);
        window.dispatchEvent(new CustomEvent("acc:cursor:size", { detail: { size: cursorSize } }));
        try {
            localStorage.setItem(LS_CURSOR_SIZE, cursorSize);
        } catch {}
    }, [cursorSize]);

    useEffect(() => {
        if (!open) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtnRef.current?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKeyDown);
            triggerBtnRef.current?.focus();
        };
    }, [open]);

    // useEffect(() => {
    //     const onPlay = () => setOpen(false);
    //     window.addEventListener("acc:readaloud:play", onPlay as EventListener);
    //     return () => window.removeEventListener("acc:readaloud:play", onPlay as EventListener);
    // }, []);

    const resetAll = useCallback(() => {
        const lensDefault = true;
        const linksDefault = false;
        const cursorDefault = true;
        const cursorSizeDefault: CursorSize = "small";

        setLensEnabled(lensDefault);
        setCursorEnabled(cursorDefault);
        setCursorSize(cursorSizeDefault);

        try {
            localStorage.removeItem(LS_LENS);
            localStorage.setItem(LS_LINKS, linksDefault ? "1" : "0");
            localStorage.setItem(LS_CURSOR_ENABLED, cursorDefault ? "1" : "0");
            localStorage.setItem(LS_CURSOR_SIZE, cursorSizeDefault);
        } catch {}

        window.dispatchEvent(new CustomEvent("acc:inlineMagnifier", { detail: { enabled: lensDefault } }));
        window.dispatchEvent(new CustomEvent("acc:emphasize-links", { detail: { enabled: linksDefault } }));
        window.dispatchEvent(new CustomEvent("acc:cursor", { detail: { enabled: cursorDefault } }));
        window.dispatchEvent(new CustomEvent("acc:cursor:size", { detail: { size: cursorSizeDefault } }));
        window.dispatchEvent(new CustomEvent("acc:reset", { detail: { scope: "all" } }));
    }, []);

    return (
        <AccProvider>
            <Portal>
                <InlineFixes />

                <Suspense fallback={null}>
                    <AccMagnifierSideTopLeft />
                </Suspense>

                <button
                    ref={triggerBtnRef}
                    type="button"
                    data-acc-ui
                    aria-label="Accessibility options"
                    onClick={() => setOpen(true)}
                    className="fixed z-[10000] bottom-5 right-5 md:bottom-6 md:right-6 rounded-full shadow-lg bg-white backdrop-blur border border-slate-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-300 p-[12px] md:p-[14px] text-violet-700"
                    style={{ fontSize: 14 }}
                >
                    <span aria-hidden className="text-[18px] leading-none"></span>
                </button>

                <div data-acc-ui className="acc-lens-mask fixed inset-0 pointer-events-none z-[9998]" aria-hidden="true" />

                <AnimatePresence>
                    {open && (
                        <>
                            <motion.div
                                role="presentation"
                                tabIndex={-1}
                                className="fixed inset-0 z-[10002] bg-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpen(false)}
                            />

                            <motion.div
                                role="dialog"
                                aria-label="Accessibility settings"
                                aria-modal="true"
                                className="fixed top-0 right-0 h-screen w-[33.333vw] min-w-[360px] max-w-[520px] z-[10003]"
                                variants={drawerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div
                                    data-acc-ui
                                    className="h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl overflow-hidden"
                                >
                                    <div className="flex-1 overflow-hidden p-4 flex justify-center">
                                        <div className="w-full max-w-[392px]">
                                            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-3 relative">
                                                <div className="flex items-center justify-end gap-2 mb-2">
                                                    <button
                                                        type="button"
                                                        onClick={resetAll}
                                                        className="h-8 px-5 rounded-xl bg-violet-500 text-white text-[12.5px] font-semibold shadow-[0_6px_14px_rgba(139,92,246,.25)] hover:bg-violet-600"
                                                    >
                                                        Reset all
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label="Expand panel"
                                                        className="h-8 w-8 rounded-full bg-white border border-slate-200
               flex items-center justify-center
               hover:bg-slate-50
               focus:outline-none focus:ring-4 focus:ring-violet-200"
                                                        onClick={() => {
                                                            window.dispatchEvent(new CustomEvent("acc:panel:expand"));
                                                        }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" className="text-slate-900" aria-hidden>
                                                            <path
                                                                d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="grid gap-2">
                                                    <ColorFilterPanel />

                                                    {/* ✅ 不进 Card，但左右“稍微往里挤一点” */}
                                                    <div className="px-3.5">
                                                        <div className="acc-allow-overflow">
                                                            <ReadAloudControls />
                                                        </div>
                                                    </div>

                                                    <Card
                                                        title="Screen Magnifier"
                                                        subtitle="Text Size Adjuster"
                                                        right={<Switch checked={lensEnabled} onClick={toggleLens} />}
                                                    >
                                                        <div className="acc-allow-overflow">
                                                            <TextControls />
                                                        </div>
                                                    </Card>

                                                    <Card
                                                        title="Cursor"
                                                        subtitle="Cursor size Adjuster"
                                                        right={
                                                            <Switch
                                                                checked={cursorEnabled}
                                                                onClick={() => setCursorEnabled((s) => !s)}
                                                            />
                                                        }
                                                    >
                                                        <CursorSizeControls value={cursorSize} onChange={setCursorSize} />
                                                    </Card>

                                                    <Card
                                                        title="Links"
                                                        subtitle="Underline & highlight links easier for scanning"
                                                        right={<Switch checked={linksOn} onClick={toggleLinksEmphasis} />}
                                                    >
                                                        <div className="hidden">
                                                            <LinkControls variant="icon" />
                                                        </div>
                                                    </Card>

                                                    <button
                                                        type="button"
                                                        onClick={() => window.dispatchEvent(new CustomEvent("acc:save"))}
                                                        className="mt-1 h-10 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white text-[14px] font-semibold shadow-[0_10px_24px_rgba(139,92,246,.28)]"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </Portal>
        </AccProvider>
    );
}
