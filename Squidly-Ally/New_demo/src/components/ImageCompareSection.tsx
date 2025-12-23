// src/sections/.../ImageCompareSection.tsx
import React, { useRef, useState, useMemo, useEffect } from "react";

// 仍用你的资源
import heroImg from "../Photo/hero-image.png";
import overlayImg from "../Photo/hero-card-2-with-cursor.png";

/* ─ CompareSlider：保持不变 ─ */
type CompareSliderProps = {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  initial?: number;
  ratio?: `${number}/${number}` | string;
  className?: string;
};
function CompareSlider({
  leftSrc,
  rightSrc,
  leftLabel = "Left",
  rightLabel = "Right",
  initial = 50,
  ratio = "16/9",
  className = "",
}: CompareSliderProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<number>(initial);
  const [drag, setDrag] = useState<boolean>(false);
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    setPos(clamp((x / r.width) * 100));
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDrag(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag && (e.buttons & 1) === 0) return;
    setFromClientX(e.clientX);
  };
  const endDrag = () => setDrag(false);

  const rightClip = 100 - pos;
  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-xl bg-slate-100 touch-none ${className}`}
      style={{ aspectRatio: ratio }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <img src={rightSrc} alt="right" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
      <img
        src={leftSrc}
        alt="left"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${rightClip}% 0 0)` }}
      />
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
        {leftLabel}
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
        {rightLabel}
      </div>
      <div className="absolute top-0" style={{ left: `calc(${pos}% - 1px)` }} aria-hidden>
        <div className="h-full w-[2px] bg-white/95 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
      </div>
      <div
        role="slider"
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        className="absolute top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize"
        style={{ left: `${pos}%` }}
        onDoubleClick={() => setPos(50)}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "ArrowLeft") setPos((p) => clamp(p - 2));
          if (e.key === "ArrowRight") setPos((p) => clamp(p + 2));
          if (e.key === "Home") setPos(0);
          if (e.key === "End") setPos(100);
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10">
          <span className="text-2xl leading-none text-slate-700">–</span>
        </div>
      </div>
    </div>
  );
}

/* ─ Section ─ */
type Step = { title: string; caption: string; media: React.ReactNode };

const HIDE_SCROLLBAR_CSS = `
  [data-no-scrollbar]{ scrollbar-width:none; -ms-overflow-style:none; }
  [data-no-scrollbar]::-webkit-scrollbar{ display:none; width:0; height:0; }
`;

export default function ImageCompareSection(): JSX.Element {
  const railRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]); // 每张卡片
  const [index, setIndex] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const [kinetic, setKinetic] = useState<boolean>(false);

  // ★ 新增：动态留白（左右占位）
  const [gutter, setGutter] = useState(0);
  const recalcGutter = () => {
    const rail = railRef.current;
    const first = cardRefs.current[0];
    if (!rail || !first) return;
    const g = Math.max(0, (rail.clientWidth - first.offsetWidth) / 2);
    setGutter(g);
  };
  useEffect(() => {
    recalcGutter();
    const rail = railRef.current;
    const first = cardRefs.current[0];
    // 响应式监听：容器和第一张卡片尺寸变动时重算 gutter
    const ro = (window as any).ResizeObserver ? new ((window as any).ResizeObserver)(() => recalcGutter()) : undefined;
    ro?.observe?.(rail as Element);
    ro?.observe?.(first as Element);
    window.addEventListener("resize", recalcGutter);
    return () => {
      ro?.disconnect?.();
      window.removeEventListener("resize", recalcGutter);
    };
  }, []);

  // 对比图占位
  const leftOptions = useMemo(
    () => [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop",
    ],
    []
  );
  const rightOptions = useMemo(
    () => [
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
    ],
    []
  );
  const [pairIdx, setPairIdx] = useState<number>(0);
  const curLeft = leftOptions[pairIdx % leftOptions.length];
  const curRight = rightOptions[pairIdx % rightOptions.length];

  const STEPS: Step[] = [
    {
      title: "Patient Care Meets Simplicity",
      caption: "Never shows on attendee list. No extra participants.",
      media: <img src={heroImg} alt="participants" className="block h-full w-full object-cover pointer-events-none" />,
    },
    {
      title: "AAC, Integrated and Ready-to-Go",
      caption: "Swipe left for private view; right for public view",
      media: <CompareSlider leftSrc={curLeft} rightSrc={curRight} leftLabel="Left" rightLabel="Right" ratio="16/9" />,
    },
    {
      title: "Say Goodbye to Scheduling Headaches",
      caption: "Quick actions overlay you can move or hide anytime.",
      media: <img src={overlayImg} alt="overlay" className="block h-full w-full object-cover pointer-events-none" />,
    },
  ];

  /* ─── 拖拽/惯性：保持不变 ─── */
  const dragRef = useRef({
    down: false,
    startX: 0,
    startLeft: 0,
    targetLeft: 0,
    lastX: 0,
    lastT: 0,
    vx: 0,
    raf: 0 as number | 0,
    kinetic: false,
  });

  const ensureRAF = () => {
    if (!dragRef.current.raf) dragRef.current.raf = requestAnimationFrame(animate);
  };

  const animate = () => {
    const rail = railRef.current;
    if (!rail) return;
    const now = performance.now();
    const s = dragRef.current;
    const cur = rail.scrollLeft;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);

    if (s.down) {
      rail.scrollLeft = Math.min(max, Math.max(0, s.targetLeft));
      s.raf = requestAnimationFrame(animate);
      return;
    }
    if (s.kinetic) {
      const dt = Math.max(1, now - s.lastT);
      s.lastT = now;
      const next = cur - s.vx * dt;
      rail.scrollLeft = Math.min(max, Math.max(0, next));
      const c = 0.004;
      s.vx *= Math.exp(-c * dt);
      if (Math.abs(s.vx) > 0.02 && rail.scrollLeft > 0 && rail.scrollLeft < max) {
        s.raf = requestAnimationFrame(animate);
      } else {
        s.kinetic = false;
        s.raf = 0;
        setKinetic(false);
      }
      return;
    }
    s.raf = 0;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    if (dragRef.current.raf) cancelAnimationFrame(dragRef.current.raf);
    setDragging(true);
    setKinetic(false);
    const x = e.clientX;
    Object.assign(dragRef.current, {
      down: true,
      startX: x,
      startLeft: rail.scrollLeft,
      targetLeft: rail.scrollLeft,
      lastX: x,
      lastT: performance.now(),
      vx: 0,
      raf: 0,
      kinetic: false,
    });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    ensureRAF();
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const s = dragRef.current;
    if (!rail || !s.down) return;
    e.preventDefault();
    const now = performance.now();
    const dx = e.clientX - s.startX;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    s.targetLeft = Math.min(max, Math.max(0, s.startLeft - dx));
    const instVx = (e.clientX - s.lastX) / Math.max(1, now - s.lastT);
    s.vx = s.vx * 0.7 + instVx * 0.3;
    s.lastX = e.clientX;
    s.lastT = now;
    ensureRAF();
  };
  const onPointerUp = () => {
    const rail = railRef.current;
    const s = dragRef.current;
    if (!rail) return;
    setDragging(false);
    s.down = false;
    const vx = Math.max(-1.6, Math.min(1.6, s.vx));
    if (Math.abs(vx) > 0.05) {
      s.vx = vx;
      s.kinetic = true;
      s.lastT = performance.now();
      setKinetic(true);
      ensureRAF();
    } else {
      setKinetic(false);
    }
  };
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    e.preventDefault();
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.9;
    rail.scrollBy({ left: delta, behavior: "auto" });
  };

  /* ─── 让第 i 张卡片水平居中（修正 padding-left） ─── */
  const centerCard = (i: number) => {
    const rail = railRef.current;
    const card = cardRefs.current[i];
    if (!rail || !card) return;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const padLeft = parseFloat(getComputedStyle(rail).paddingLeft || "0");
    const target = Math.round(card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2 - padLeft);
    const clamped = Math.min(max, Math.max(0, target));
    rail.scrollTo({ left: clamped, behavior: "smooth" });
    setIndex(i);
  };

  // 根据视口中心更新当前 index（拖拽/滚轮时）
  const updateIndexByCenter = () => {
    const rail = railRef.current;
    if (!rail) return;
    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const center = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(center - railCenter);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setIndex(best);
  };
  const onScroll = () => updateIndexByCenter();

  // 初始居中第一张，并计算 gutter
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      recalcGutter();
      centerCard(0);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className="relative w-screen py-16 md:py-20"
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      aria-label="Invisible to screen share"
    >
      <style>{HIDE_SCROLLBAR_CSS}</style>

      <header className="mx-auto max-w-3xl px-6 text-center select-none">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#2A2F3A] md:text-5xl">
          Invisible to screen share
        </h2>
        <p className="mt-3 text-[17px] leading-7 text-slate-600">
          Designed alongside clinicians and users, Squidly makes remote sessions effective and accessible.
        </p>
      </header>

      <div className="relative mt-8 md:mt-10">
        <div
          ref={railRef}
          data-no-scrollbar
          className={[
            "flex gap-6 overflow-x-auto pb-4 px-6 md:px-10 select-none",
            dragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "none",
            scrollBehavior: dragging || kinetic ? "auto" : "smooth",
          }}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
        >
          {/* ★ 左侧占位：让最左也能居中 */}
          <div style={{ flex: "0 0 auto", width: gutter }} />

          {STEPS.map((s, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="flex-none w-[85vw] sm:w-[78vw] md:w-[62vw] lg:w-[48vw] xl:w-[42vw] 2xl:w-[38vw]"
            >
              <div
                className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_46px_rgba(17,24,39,.08)]"
                onClick={(e) => {
                  e.stopPropagation();
                  centerCard(i);
                }}
              >
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
                    <div className="relative aspect-[16/10] md:aspect-[16/9]">
                      <div className="absolute inset-0">{s.media}</div>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-center text-[15px] font-semibold text-slate-800">{s.caption}</p>
                </div>
              </div>
            </div>
          ))}

          {/* ★ 右侧占位：让最右也能居中 */}
          <div style={{ flex: "0 0 auto", width: gutter }} />
        </div>

        {/* 左右箭头：改为用 centerCard 保证居中 */}
        <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 hidden md:block">
          <button
            onClick={() => centerCard(Math.max(0, index - 1))}
            className="pointer-events-auto rounded-full bg-white/95 p-2 shadow ring-1 ring-slate-200 transition hover:bg-white"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
          <button
            onClick={() => centerCard(Math.min(STEPS.length - 1, index + 1))}
            className="pointer-events-auto rounded-full bg-white/95 p-2 shadow ring-1 ring-slate-200 transition hover:bg-white"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 底部胶囊指示条：点击即居中 */}
        <div className="mt-5 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full bg-slate-50 px-5 py-2 shadow-sm ring-1 ring-black/5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => centerCard(i)}
                aria-label={`Go to card ${i + 1}`}
                className="relative h-4 w-8"
                title={`Card ${i + 1}`}
              >
                <span
                  className={[
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all",
                    i === index ? "h-1.5 w-8 bg-slate-400 rounded-full" : "h-3 w-3 bg-slate-400",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
