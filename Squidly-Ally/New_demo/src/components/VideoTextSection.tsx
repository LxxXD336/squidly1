import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LayoutGrid } from "lucide-react"; // 随便换其它图标也行
/**
 * VideoTextSection – a hero-like section where one headline line reveals
 * looping video *inside* the letters (masked), while surrounding lines
 * are muted.
 *
 * TailwindCSS recommended. Drop this component anywhere in your page.
 */
function ControlChipCSS() {
  return (
    <style>{`
      :root{ --chip-base:#F3EEFF; --chip-ink:#6A4DFF; }
      .control-chip{
        display:inline-flex; align-items:center; gap:10px;
        padding:14px 20px; min-height:56px;
        border-radius:15px; font-weight:600; font-size:16px;
        color:var(--chip-ink); background-color:var(--chip-base);
        border:.5px solid rgba(106,77,255,.18);
        user-select:none; cursor:pointer; position:relative;
        transition:transform .12s ease, box-shadow .12s ease, border-color .12s ease;
        background-image:
          linear-gradient(to right, rgba(122,59,255,.18), rgba(122,59,255,0)),
          linear-gradient(to bottom, rgba(122,59,255,.18), rgba(122,59,255,0));
        background-position: bottom right, bottom right;
        background-size:100% 100%, 100% 100%; background-repeat:no-repeat;
        box-shadow:
          inset -4px -10px 0 rgba(255,255,255,.65),
          inset -4px -8px 0 rgba(122,59,255,.12),
          0 2px 1px rgba(122,59,255,.12),
          0 6px 18px rgba(122,59,255,.16);
      }
      .control-chip::after{
        content:""; position:absolute; inset:0; border-radius:15px; z-index:-1;
        background-image: linear-gradient(to bottom, rgba(255,255,255,.45), rgba(122,59,255,.14));
        box-shadow: inset 4px 0 0 rgba(255,255,255,.16), inset 4px -8px 0 rgba(122,59,255,.14);
        transition:opacity .12s ease;
      }
      .control-chip svg{ width:20px; height:20px; stroke:var(--chip-ink); }
      .control-chip:active{
        transform: translateY(2px) scale(.98);
        border:.25px solid rgba(106,77,255,.28);
        box-shadow:
          inset -4px -8px 0 rgba(255,255,255,.32),
          inset -4px -6px 0 rgba(122,59,255,.22),
          0 1px 0 rgba(122,59,255,.20),
          0 8px 14px rgba(122,59,255,.18);
      }
    `}</style>
  );
}

export function ControlChipButton({
  href = "#",
  children = "Get for Windows",
  icon = <LayoutGrid />,
  className = "",
}: {
  href?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  const prefers = useReducedMotion();
  return (
    <>
      <ControlChipCSS />
      <motion.a
        href={href}
        className={`control-chip ${className}`}
        whileHover={prefers ? {} : { y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.985 }}
      >
        {icon}
        <span>{children}</span>
      </motion.a>
    </>
  );
}

export default function VideoTextSection() {
  const lines = [
    { text: "Interviews.", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { text: "Sales calls.", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { text: "Homework. Meetings.", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { text: "Really everything.", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  ] as const;

  // 把所有词“拍平”成一个全局序列
  const flat = React.useMemo(() => {
    const out: Array<{ key: string; lineIdx: number; wordIdx: number }> = [];
    lines.forEach((ln, li) => {
      ln.text
        .trim()
        .split(" ")
        .filter(Boolean)
        .forEach((_, wi) => out.push({ key: `${li}-${wi}`, lineIdx: li, wordIdx: wi }));
    });
    return out;
  }, [lines]);

  const [autoIndex, setAutoIndex] = React.useState(0);
  const [hoverKey, setHoverKey] = React.useState<string | null>(null);

  // 当前真正激活的词：hover 优先，否则用自动轮播
  const activeKey = hoverKey ?? flat[autoIndex]?.key ?? "0-0";

  React.useEffect(() => {
    if (hoverKey) return; // hover 时暂停自动轮播
    if (flat.length <= 1) return;

    const id = window.setInterval(() => {
      setAutoIndex((i) => (i + 1) % flat.length);
    }, 3000);

    return () => window.clearInterval(id);
  }, [hoverKey, flat.length]);

  return (
    <section className="relative isolate overflow-hidden" aria-label="Cheat hero with video-filled headline">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24 md:py-28">
        <h1 className="leading-[0.85] tracking-tight">
          {lines.map((ln, li) => (
            <HoverVideoWords
              key={li}
              className={li === 0 ? "mt-0" : "mt-2"}
              text={ln.text}
              src={ln.src}
              scale={1.12}
              // ✅ 关键：由父组件统一控制当前激活词
              activeKey={activeKey}
              lineIdx={li}
              onHoverStart={(k) => setHoverKey(k)}
              onHoverEnd={() => setHoverKey(null)}
              // 可选：hover 离开后从 hover 的词继续播（更顺滑）
              onCommitHoverToAuto={(k) => {
                const idx = flat.findIndex((x) => x.key === k);
                if (idx >= 0) setAutoIndex(idx);
              }}
            />
          ))}
        </h1>
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

export function HoverVideoWords({
  text,
  src,
  className = "",
  scale = 1.04,
  activeKey,
  lineIdx,
  onHoverStart,
  onHoverEnd,
  onCommitHoverToAuto,
}: {
  text: string;
  src: string;
  className?: string;
  scale?: number;

  // ✅ 新增：由父级传入的全局激活 key（例如 "2-1" 表示第3行第2个词）
  activeKey: string;
  lineIdx: number;

  onHoverStart: (key: string) => void;
  onHoverEnd: () => void;

  // 可选：让自动播放离开 hover 后从 hover 的词继续
  onCommitHoverToAuto?: (key: string) => void;
}) {
  const words = text.trim().split(" ").filter(Boolean);

  return (
    <div className={`relative ${className}`}>
      {words.map((w, wi) => {
        const key = `${lineIdx}-${wi}`;
        const active = key === activeKey;

        return (
          <React.Fragment key={key}>
            <HoverableWord
              text={w}
              src={src}
              active={active}
              scale={scale}
              onEnter={() => onHoverStart(key)}
              onLeave={() => {
                onHoverEnd();
                // 想要 hover 离开从 hover 词继续自动播放，就保留这行：
                onCommitHoverToAuto?.(key);
              }}
            />
            {wi < words.length - 1 ? <span>&nbsp;</span> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}


function HoverableWord({
  text,
  src,
  active,
  onEnter,
  onLeave,
  scale = 1.04,
}: {
  text: string;
  src: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  scale?: number;
}) {
  const maskId = useId().replace(/:/g, "");

  return (
    <span
      className="group/word relative inline-block align-baseline transition-[font-size] duration-200"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        ["--base" as any]: "clamp(2.5rem, 9vw, 7.2rem)",
        ["--hover" as any]: String(scale),
        fontSize: active ? "calc(var(--base) * var(--hover))" : "var(--base)",
        transformOrigin: "bottom left",
      }}
    >
      {/* base gray word */}
      <span
        className={[
          "relative z-0 block font-extrabold leading-[0.85] transition-colors duration-200",
          active ? "text-transparent" : "text-slate-400/60",
        ].join(" ")}
      >
        {text}
      </span>

      {/* video overlay：active 时显示（hover 或自动都走 active） */}
      {active && (
        <span className="pointer-events-none absolute inset-0 z-10 opacity-100 transition-opacity duration-200">
          <svg className="block h-full w-full" aria-hidden style={{ fontSize: "1em" }}>
            <defs>
              <mask id={`${maskId}-mask`} maskUnits="userSpaceOnUse">
                <rect width="100%" height="100%" fill="black" />
                <text
                  x="0"
                  y="0.78em"
                  fill="white"
                  fontWeight="900"
                  fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
                >
                  {text}
                </text>
              </mask>
            </defs>
            <foreignObject x="0" y="0" width="100%" height="100%" mask={`url(#${maskId}-mask)`}>
              <div className="h-full w-full">
                <video src={src} autoPlay muted loop playsInline className="h-full w-full object-cover" />
              </div>
            </foreignObject>
          </svg>
        </span>
      )}
    </span>
  );
}

