import React, { useRef, useState } from "react";

/**
 * ImageCompareSection.tsx (full‑bleed, 3 wide columns)
 * – Section stretches edge‑to‑edge (full‑bleed)
 * – Three large cards sit side‑by‑side on desktop
 * – Card size scales with viewport width using aspect‑ratio
 */
export default function ImageCompareSection() {
  return (
    <section className="relative full-bleed bg-white py-16 overflow-x-hidden" aria-label="Feature trio section">
      {/* full‑bleed helper */}
      <style>{`.full-bleed{position:relative;width:100dvw;margin-left:calc(50% - 50dvw);margin-right:calc(50% - 50dvw)}@supports not (width:100dvw){.full-bleed{width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw)}}`}</style>

      <div className="mx-auto w-full px-4 md:px-12 xl:px-20">
        {/* Heading */}
        <h2 className="mb-4 text-center text-3xl md:text-4xl font-semibold text-slate-800">
          Invisible to screen share
        </h2>
        <p className="mx-auto mb-10 max-w-4xl text-center text-slate-600">
          Drag the split slider to compare two states. Sliding left reveals more of the right image.
        </p>

        {/* 3 columns that grow with viewport */}
        <div className="grid grid-cols-12 items-start gap-6 md:gap-8 xl:gap-10">
          <div className="col-span-12 md:col-span-4">
            <ShowcaseCard
              ratio="4/3"
              src="./public/hero-image.png"
              alt="Participants list"
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <CompareSlider
              leftSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop"
              rightSrc="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop"
              leftLabel="Visible to you"
              rightLabel="Invisible to others"
              initial={50}
              ratio="4/3"
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <ShowcaseCard
              ratio="4/3"
              src="./public/hero-card-2-with-cursor.png"
              alt="Floating overlay"
            />
          </div>
        </div>

        {/* Bottom copy */}
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Say Goodbye to Scheduling Headaches
          </h3>
          <p className="mt-2 text-lg text-slate-600">
            Simplify appointments with smart scheduling and seamless connection.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Simple static image card with same chrome as the slider */
function ShowcaseCard({ src, alt = "", ratio = "16/10", className = "" }: { src: string; alt?: string; ratio?: `${number}/${number}` | string; className?: string; }) {
  return (
    <div className={`relative select-none overflow-hidden rounded-3xl bg-slate-100 shadow-md ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10" />
    </div>
  );
}

/** Core draggable slider – images stay fixed; reveal via clip-path */
export function CompareSlider({
  leftSrc,
  rightSrc,
  leftLabel = "Left",
  rightLabel = "Right",
  initial = 50,
  ratio = "16/10",
  className = "",
}: {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  initial?: number; // 0..100
  ratio?: `${number}/${number}` | string; // CSS aspect-ratio value
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(() => clamp(initial));
  const [drag, setDrag] = useState(false);

  function clamp(n: number) { return Math.max(0, Math.min(100, n)); }
  function setFromClientX(clientX: number) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    setPos(clamp((x / r.width) * 100));
  }

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    setDrag(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!drag && (e.buttons & 1) === 0) return;
    setFromClientX(e.clientX);
  };
  const endDrag: React.PointerEventHandler<HTMLDivElement> = () => setDrag(false);

  const rightClip = 100 - pos; // hide this much of the left image on the right side

  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-3xl bg-slate-100 shadow-md touch-none ${className}`}
      style={{ aspectRatio: ratio }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {/* bottom (right) image – fixed */}
      <img src={rightSrc} alt="right" className="absolute inset-0 h-full w-full object-cover" />

      {/* top (left) image – fixed; reveal via clip-path */}
      <img
        src={leftSrc}
        alt="left"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${rightClip}% 0 0)` }}
      />

      {/* labels */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
        {leftLabel}
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow">
        {rightLabel}
      </div>

      {/* divider line */}
      <div className="absolute top-0" style={{ left: `calc(${pos}% - 1px)` }} aria-hidden>
        <div className="h-full w-[2px] bg-white/95 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
      </div>

      {/* draggable handle */}
      <div
        role="slider"
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        className="absolute top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize"
        style={{ left: `${pos}%` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onDoubleClick={() => setPos(50)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPos((p) => clamp(p - 2));
          if (e.key === 'ArrowRight') setPos((p) => clamp(p + 2));
          if (e.key === 'Home') setPos(0);
          if (e.key === 'End') setPos(100);
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700"><path d="M15 18l-6-6 6-6"/></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="-ml-1 text-slate-700"><path d="M9 6l6 6-6 6"/></svg>
        </div>
      </div>

      {/* border ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10" />
    </div>
  );
}
