import React, { useId } from "react";

/**
 * VideoTextSection – a hero-like section where one headline line reveals
 * looping video *inside* the letters (masked), while surrounding lines
 * are muted.
 *
 * TailwindCSS recommended. Drop this component anywhere in your page.
 */
export default function VideoTextSection() {
  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      aria-label="Cheat hero with video-filled headline"
    >
      {/* soft vignette */}
      

      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24 md:py-28">
        <p className="mb-6 text-xl sm:text-2xl font-medium tracking-tight text-slate-800">
          It’s time to cheat
        </p>

        <h1 className="leading-[0.85] tracking-tight">
          {/* line 1 (muted) */}
          <HoverVideoWords className="mt-0" text="Interviews." src="https://www.w3schools.com/html/mov_bbb.mp4" scale={1.12} />

          {/* line 2 (video-masked) */}
          <HoverVideoWords className="mt-2" text="Sales calls." src="https://www.w3schools.com/html/mov_bbb.mp4" scale={1.12} />

          {/* line 3 (muted) */}
          <HoverVideoWords className="mt-2" text="Homework. Meetings." src="https://www.w3schools.com/html/mov_bbb.mp4" scale={1.12} />

          {/* line 4 (muted) */}
          <HoverVideoWords className="mt-2" text="Really everything." src="https://www.w3schools.com/html/mov_bbb.mp4" scale={1.12} />
        </h1>

        {/* CTA (optional) */}
        <div className="mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-900/20 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:shadow md:text-base"
          >
            <span className="i-[windows]" aria-hidden /> Get for Windows
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * VideoMaskedText – renders a full-width line of text with video showing
 * through the glyphs using an SVG <mask> + <foreignObject> technique.
 *
 * Works in modern Chromium/Firefox/Safari. The text scales responsively to
 * the container’s width.
 */
export function VideoMaskedText({
  text,
  src,
  className = "",
}: {
  text: string;
  src: string; // mp4/webm
  className?: string;
}) {
  const maskId = useId().replace(/:/g, ""); // avoid colons in SSR ids

  return (
    <div className={`relative ${className}`}>
      <svg
        className="block h-auto w-full"
        viewBox="0 0 1600 300"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden
      >
        <defs>
          {/* The mask is white where the video should be visible */}
          <mask id={`${maskId}-mask`} maskUnits="userSpaceOnUse">
            <rect width="1600" height="300" fill="black" />
            <text
              x="0"
              y="78%" /* baseline tweak so letters sit nicely */
              fill="white"
              fontSize="240"
              fontWeight="900"
              fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
              lengthAdjust="spacingAndGlyphs"
              textLength="1540"
            >
              {text}
            </text>
          </mask>
        </defs>

        {/* The <foreignObject> allows us to place regular HTML <video> */}
        <foreignObject x="0" y="0" width="1600" height="300" mask={`url(#${maskId}-mask)`}>
          <div className="h-full w-full">
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </foreignObject>
      </svg>

      {/* A subtle shadow to make the video glyphs pop on bright backgrounds */}
      <div className="pointer-events-none absolute inset-0 opacity-20 [filter:drop-shadow(0_8px_16px_rgba(0,0,0,0.5))]" aria-hidden />
    </div>
  );
}


/**
 * HoverVideoWords – make every word reveal the video and slightly scale up
 * on hover. Use it for any line of text.
 */
export function HoverVideoWords({ text, src, className = "", scale = 1.04 }: { text: string; src: string; className?: string; scale?: number; }) {
  const words = text.trim().split(' ');
  return (
    <div className={`relative ${className}`}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <HoverWord text={w} src={src} scale={scale} />
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </React.Fragment>
      ))}
    </div>
  );
}

function HoverWord({ text, src, scale = 1.04 }: { text: string; src: string; scale?: number; }) {
  const maskId = useId().replace(/:/g, "");
  return (
    <span className="group/word relative inline-block align-baseline transition-[font-size] duration-200 [--scale:1] hover:[--scale:var(--hover)]" style={{ ['--base' as any]: 'clamp(2.5rem, 9vw, 7.2rem)', ['--hover' as any]: String(scale), fontSize: 'calc(var(--base) * var(--scale))', transformOrigin: 'bottom left' }}>
      {/* base gray word */}
      <span className="relative z-0 block font-extrabold leading-[0.85] text-slate-400/60 transition-colors duration-200 group-hover/word:text-transparent">{text}</span>
      {/* video overlay */}
      <span className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-200 group-hover/word:opacity-100">
        <svg className="block h-full w-full" aria-hidden style={{ fontSize: '1em' }}>
          <defs>
            <mask id={`${maskId}-mask`} maskUnits="userSpaceOnUse">
              <rect width="100%" height="100%" fill="black" />
              <text x="0" y="0.78em" fill="white" fontWeight="900" fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial">{text}</text>
            </mask>
          </defs>
          <foreignObject x="0" y="0" width="100%" height="100%" mask={`url(#${maskId}-mask)`}>
            <div className="h-full w-full">
              <video src={src} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            </div>
          </foreignObject>
        </svg>
      </span>
    </span>
  );
}
