import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as IconMenu, X as IconX } from "lucide-react";

export type Link = { label: string; href: string; external?: boolean };
export type Props = {
    logoSrc?: string;
    links?: Link[];
    ctaText?: string;
    ctaHref?: string;
    radius?: number; // kept for backward‑compat (not used in hover‑only mode)
    collapseDelay?: number;
    collapsedSidePct?: number; // 0..49 (bigger = narrower when collapsed)
    brandColor?: string;
    handleLabel?: string; // a11y label for collapsed state
    barHeight?: number; // min height of the glass rail in px
    barBgImage?: string; // background image for the COLLAPSED handle only
    barBgFit?: "cover" | "contain"; // how to fit the image when collapsed
    barBgPosition?: string; // CSS object-position, e.g. "center", "left 50%"
    // NEW behavior controls
    collapsedFillColor?: string | null; // e.g. "#fff" to fill window behind image
    collapsedMatchImage?: boolean; // window width matches scaled image width
};

// -------- Helpers (pure, easily testable) --------
export function clampCollapsedPct(pct: number) {
    return Math.min(49, Math.max(0, Math.round(pct)));
}
export function computeClipInset(pct: number) {
    const v = clampCollapsedPct(pct);
    return `inset(0% ${v}% 0% ${v}% round 16px)`;
}
export function sidePctForFit(
    containerW: number,
    naturalW: number,
    naturalH: number,
    targetH: number
) {
    if (!containerW || !naturalW || !naturalH || !targetH) return 40;
    const scale = targetH / naturalH;
    const scaledW = naturalW * scale;
    const pct = ((containerW - scaledW) / (2 * containerW)) * 100;
    return clampCollapsedPct(pct);
}
export function computeLayers(isCollapsed: boolean, hasImage: boolean) {
    return { showImage: Boolean(isCollapsed && hasImage) };
}

export default function GlassMenu({
                                      logoSrc = "/Photo/logo.jpg",
                                      links = [
                                          { label: "Product", href: "#product" },
                                          { label: "Modes", href: "#modes" },
                                          { label: "Pricing", href: "#pricing" },
                                          { label: "For providers", href: "#providers" },
                                      ],
                                      ctaText = "Get started",
                                      ctaHref = "#start",
                                      collapseDelay = 1200,
                                      collapsedSidePct = 40,
                                      brandColor = "#7A3BFF",
                                      handleLabel = "Menu bar",
                                      barHeight = 56,
                                      barBgImage,
                                      barBgFit = "contain",
                                      barBgPosition = "center",
                                      collapsedFillColor = null,
                                      collapsedMatchImage = false,
                                  }: Props) {
    const [hoverOpen, setHoverOpen] = useState(false);
    const [coarse, setCoarse] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // mobile drawer
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const railRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<number | null>(null);

    // measurement states for "match image" mode
    const [containerW, setContainerW] = useState(0);
    const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
    const [railH, setRailH] = useState<number>(barHeight);

    // Detect coarse pointers (touch) — default to drawer on mobile
    useEffect(() => {
        const m = window.matchMedia("(pointer: coarse)");
        setCoarse(m.matches);
        const onChange = (e: MediaQueryListEvent) => setCoarse(e.matches);
        m.addEventListener?.("change", onChange);
        return () => m.removeEventListener?.("change", onChange);
    }, []);

    // Prevent background scroll when mobile drawer is open
    useEffect(() => {
        if (!menuOpen) return;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prev;
        };
    }, [menuOpen]);

    // measure container width
    useEffect(() => {
        const measure = () => {
            const el = wrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            setContainerW(r.width);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // observe actual rail height so width math matches real pixels
    useEffect(() => {
        const el = railRef.current;
        if (!el || typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(() => {
            const h = el.getBoundingClientRect().height;
            if (h) setRailH(h);
        });
        ro.observe(el);
        // initial read
        const h = el.getBoundingClientRect().height;
        if (h) setRailH(h);
        return () => ro.disconnect();
    }, [barHeight]);

    const clearTimer = () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // Collapse the whole nav after a delay when pointer leaves
    const onLeave = () => {
        if (coarse) return; // on touch, rely on drawer
        clearTimer();
        timerRef.current = window.setTimeout(() => setHoverOpen(false), collapseDelay) as any;
    };

    const clipOpen = `inset(0% 0% 0% 0% round 16px)`;

    // dynamic side percent when matching image size
    const dynSidePct =
        collapsedMatchImage && !hoverOpen && imgNatural && containerW && railH
            ? sidePctForFit(containerW, imgNatural.w, imgNatural.h, railH)
            : collapsedSidePct;

    const sidePct = clampCollapsedPct(dynSidePct);
    const clipClose = computeClipInset(sidePct);
    const isCollapsed = !hoverOpen && !coarse;
    const layers = computeLayers(isCollapsed, Boolean(barBgImage));
    const imgFitClass = barBgFit === "contain" ? "object-contain" : "object-cover";

    // Soft purple gradient for EXPANDED bar (matches your second screenshot)
    const expandedBg =
        "linear-gradient(90deg, rgba(122,59,255,.22) 0%, rgba(167,139,250,.20) 50%, rgba(122,59,255,.22) 100%)";

    return (
        <nav className="fixed inset-x-0 top-[max(env(safe-area-inset-top),1rem)] z-[80]">
            <div className="mx-auto max-w-7xl px-6">
                <div
                    ref={wrapRef}
                    onMouseLeave={onLeave}
                    className="relative"
                    aria-label="Main"
                >
                    {/* Gradient rim (stays visible in both states) */}
                    <motion.span
                        className="absolute -inset-px rounded-2xl pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(140deg, rgba(122,59,255,.35), rgba(167,139,250,.28), rgba(122,59,255,.35))",
                        }}
                        initial={false}
                        animate={{ clipPath: hoverOpen ? clipOpen : clipClose, opacity: 1 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        aria-hidden
                    />

                    {/* Glass rail */}
                    <motion.div
                        ref={railRef}
                        className="relative rounded-2xl backdrop-blur-xl overflow-hidden"
                        style={{
                            background: hoverOpen ? expandedBg : "transparent", // EXPANDED -> purple gradient; COLLAPSED -> transparent
                            WebkitBackgroundClip: "padding-box",
                            backgroundClip: "padding-box",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,.55)", // inner stroke for glass feel
                            minHeight: barHeight,
                        }}
                        initial={false}
                        animate={{ clipPath: hoverOpen ? clipOpen : clipClose }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        onMouseEnter={() => setHoverOpen(true)}
                        onFocusCapture={() => setHoverOpen(true)}
                        aria-label={isCollapsed ? handleLabel : undefined}
                        role="region"
                    >
                        {/* Optional white fill inside the window when COLLAPSED */}
                        {isCollapsed && collapsedFillColor && (
                            <div
                                className="absolute inset-y-0"
                                style={{ left: `${sidePct}%`, right: `${sidePct}%`, background: collapsedFillColor }}
                                aria-hidden
                            />
                        )}

                        {/* Background image layer — ONLY when COLLAPSED */}
                        <AnimatePresence initial={false}>
                            {layers.showImage && (
                                <motion.div
                                    key="collapsed-image-wrapper"
                                    className="pointer-events-none absolute inset-y-0 flex items-center justify-center"
                                    style={{ left: `${sidePct}%`, right: `${sidePct}%` }}
                                    initial={{ opacity: 0.9 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    aria-hidden
                                >
                                    <img
                                        src={barBgImage}
                                        alt=""
                                        className={barBgFit === "contain" ? "h-full w-auto" : "h-full w-full object-cover"}
                                        style={{ objectPosition: barBgPosition }}
                                        onLoad={(e) => {
                                            const img = e.currentTarget;
                                            if (img.naturalWidth && img.naturalHeight) {
                                                setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
                                            }
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Real navbar content (clickable only when expanded) */}
                        <motion.div
                            className="relative px-3 py-2 md:px-4 md:py-2.5"
                            animate={{ opacity: isCollapsed ? 0 : 1, y: isCollapsed ? -2 : 0 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            style={{ pointerEvents: isCollapsed ? "none" : "auto" }}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <a href="#home" className="inline-flex items-center gap-2 font-bold text-slate-900">
                  <span
                      className="grid h-8 w-8 place-items-center rounded-lg"
                      style={{ background: brandColor, boxShadow: "0 8px 20px rgba(122,59,255,.30)" }}
                  >
                    <img src={logoSrc} alt="Logo" className="h-4 w-4 object-contain select-none" />
                  </span>
                                    <span className="hidden sm:block">Squidly</span>
                                </a>

                                <ul className="hidden md:flex items-center gap-6 text-sm text-slate-700">
                                    {links.map((l) => (
                                        <li key={l.label}>
                                            <a
                                                className="transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded"
                                                href={l.href}
                                                target={l.external ? "_blank" : undefined}
                                                rel={l.external ? "noreferrer" : undefined}
                                            >
                                                {l.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={ctaHref}
                                        className="hidden md:inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                                        style={{ backgroundColor: brandColor, boxShadow: "0 10px 28px rgba(122,59,255,.28)" }}
                                    >
                                        {ctaText}
                                    </a>

                                    {/* Mobile burger */}
                                    <button
                                        type="button"
                                        className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-700/90 bg-white/70 backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                                        aria-label="Open menu"
                                        aria-controls="mobile-menu"
                                        aria-expanded={menuOpen}
                                        onClick={() => setMenuOpen(true)}
                                    >
                                        <IconMenu size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="overlay"
                        className="fixed inset-0 z-[90]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
                        <motion.aside
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            className="absolute inset-y-0 right-0 w-[88%] max-w-sm bg-white/80 backdrop-blur-xl shadow-xl"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.28 }}
                        >
                            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                                <a href="#home" className="inline-flex items-center gap-2 font-bold text-slate-900">
                  <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: brandColor }}>
                    <img src={logoSrc} alt="Logo" className="h-4 w-4 object-contain select-none" />
                  </span>
                                    <span>Squidly</span>
                                </a>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700/90 bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                                    aria-label="Close menu"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <IconX size={20} />
                                </button>
                            </div>

                            <nav className="px-4 py-2">
                                <ul className="space-y-1">
                                    {links.map((l) => (
                                        <li key={l.label}>
                                            <a
                                                href={l.href}
                                                onClick={() => setMenuOpen(false)}
                                                className="block rounded-xl px-3 py-3 text-base font-medium text-slate-800/90 hover:bg-white focus:bg-white focus:outline-none"
                                                target={l.external ? "_blank" : undefined}
                                                rel={l.external ? "noreferrer" : undefined}
                                            >
                                                {l.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-2">
                                    <a
                                        href={ctaHref}
                                        onClick={() => setMenuOpen(false)}
                                        className="inline-flex w-full items-center justify-center rounded-xl px-3 py-3 text-base font-semibold text-white"
                                        style={{ backgroundColor: brandColor }}
                                    >
                                        {ctaText}
                                    </a>
                                </div>
                            </nav>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

// -------- Dev self-checks (do not throw in prod) --------
export const __dev_tests__ = (() => {
    try {
        // clamp & format tests
        const r1 = computeClipInset(52); // -> clamp to 49
        const r2 = computeClipInset(0);  // -> 0
        const r3 = computeClipInset(80); // -> 49
        const r4 = computeClipInset(-5); // -> 0
        const C1 = clampCollapsedPct(60) === 49;
        const C2 = clampCollapsedPct(-3) === 0;
        const FMT1 = /^inset\(0% \d+% 0% \d+% round 16px\)$/.test(computeClipInset(12));

        // layer logic
        const L1 = computeLayers(true, true).showImage === true;
        const L2 = computeLayers(true, false).showImage === false;
        const L3 = computeLayers(false, true).showImage === false;

        // side pct computation for matching image width
        const S1 = sidePctForFit(1000, 500, 100, 50); // scaledW=250 -> side=37.5% -> 38
        const S2 = sidePctForFit(800, 2000, 1000, 56); // scaledW=112 -> side~43% -> 43

        return {
            clamp_gt49_to_49: r1.includes("49%"),
            clamp_lt0_to_0: r4.includes("0%"),
            zero_ok: r2.includes("0%"),
            eighty_ok: r3.includes("49%"),
            clamp_numeric_hi: C1,
            clamp_numeric_lo: C2,
            clip_format_ok: FMT1,
            layer_when_collapsed_has_img: L1,
            layer_when_collapsed_no_img: L2,
            layer_when_expanded_has_img: L3,
            sidepct_example_1_is_38: S1 === 38,
            sidepct_example_2_is_43: S2 === 43,
        };
    } catch {
        return {};
    }
})();
