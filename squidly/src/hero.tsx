// hero.tsx
import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/** ---------- Props ---------- */
export type HeroVideoCallProps = {
  title?: string;
  subtitle?: string;
  laptopContent?: React.ReactNode;
  phoneContent?: React.ReactNode; // iPad content
  className?: string;
};

/** ---------- Device frames (Laptop + iPad) ---------- */
const DeviceFrames: React.FC<{
  laptopContent?: React.ReactNode;
  phoneContent?: React.ReactNode;
  className?: string;
}> = ({ laptopContent, phoneContent, className = "" }) => {
  return (
    <div className={["relative w-full", className].join(" ")}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-[640px]"
        aria-label="Laptop mockup"
      >
        <div
          id="beam-laptop"
          className="relative mx-auto h-[360px] w-[580px] rounded-xl border border-zinc-300/30 bg-zinc-900 shadow-2xl"
        >
          <div className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-zinc-400/60" />
          {laptopContent ?? (
            <img
              src="/hero-image.png"
              alt="Demo app"
              className="absolute inset-[10px] h-[calc(100%-20px)] w-[calc(100%-20px)] rounded-xl object-cover"
            />
          )}
        </div>

        <div className="mx-auto mt-2 h-6 w-[620px] rounded-b-2xl border border-zinc-400/20 bg-zinc-800 shadow-xl">
          <div className="mx-auto mt-1 h-1.5 w-28 rounded-full bg-zinc-600/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="absolute -right-10 bottom-4 h-[320px] w-[240px] rounded-[36px] border border-zinc-300/30 bg-zinc-900 shadow-2xl"
          aria-label="Tablet mockup"
        >
          <div className="absolute left-1/2 top-3 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-zinc-500/70" />
          <div className="absolute right-[-3px] top-16 h-10 w-1 rounded bg-zinc-700/70" />
          <div className="absolute right-[-3px] top-32 h-14 w-1 rounded bg-zinc-700/70" />
          {phoneContent ?? (
            <img
              src="/hero-image.png"
              alt="Demo app"
              className="absolute inset-[14px] h-[calc(100%-28px)] w-[calc(100%-28px)] rounded-[28px] object-cover"
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

/** ---------- Title animation: per-word gradient + stagger ---------- */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const splitWords = (t: string) => t.split(/(\s+)/);

const AnimatedTitle: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const words = splitWords(text);
  return (
    <motion.h1
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={[
        "inline-block", // 让整体更稳
        "text-[clamp(54px,6vw,126px)] font-semibold leading-tight tracking-tight",
        "drop-shadow-[0_6px_24px_rgba(167,139,250,0.35)]",
        className,
      ].join(" ")}
    >
      {words.map((w, i) =>
        w.trim() ? (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(6px)", backgroundPositionX: "120%" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", backgroundPositionX: "50%" }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.12 + i * 0.08 }}
            style={{
              backgroundImage:
                "linear-gradient(90deg,#a78bfa 0%,#60a5fa 25%,#f472b6 50%,#7dd3fc 75%,#a78bfa 100%)",
              backgroundSize: "220% 100%",
              backgroundPositionY: "50%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              willChange: "transform, filter, background-position",
            }}
          >
            {w}
          </motion.span>
        ) : (
          <span key={i}>&nbsp;</span>
        )
      )}
    </motion.h1>
  );
};




/** ---------- Hero ---------- */
export default function HeroVideoCall({
  title = "Video Calls for Every Voice",
  subtitle = "Built to make communication extraordinarily inclusive, Squidly is the best way to make accessible video calls.",
  laptopContent,
  phoneContent,
  className = "",
}: HeroVideoCallProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const deviceWrapRef = useRef<HTMLDivElement>(null);
  // mouse glow
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const cssVars = {
    ["--mx" as any]: `${mouse.x}px`,
    ["--my" as any]: `${mouse.y}px`,
  } as React.CSSProperties;

  // ---- 计算光束的 SVG 路径 ----
  const [beamBox, setBeamBox] = useState<{ w: number; h: number; path: string } | null>(null);

  useLayoutEffect(() => {
    const sec = sectionRef.current!;
    const title = titleRef.current!;
    const anchor = document.getElementById("beam-laptop") as HTMLElement | null;
    if (!sec || !title || !anchor) return;

    const update = () => {
      const secRect   = sec.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const aRect     = anchor.getBoundingClientRect();

      const topW    = Math.min(titleRect.width * 1.10, secRect.width); // 顶边略放大覆盖标题
      const bottomW = aRect.width;                                      // 底边 = 笔记本屏宽
      const originY = Math.round(aRect.top - secRect.top);              // 屏幕上沿（相对 section 顶）
      const titleBottom = titleRect.bottom - secRect.top;
      const beamHeight = Math.max(titleBottom - originY + 320, 580);    // 到标题并多留一点

      // 用 section 宽做 viewBox，居中
      const w  = Math.round(secRect.width);
      const h  = Math.round(beamHeight);
      const cx = w / 2;

      const tlx = cx - topW / 2;
      const trx = cx + topW / 2;
      const blx = cx - bottomW / 2;
      const brx = cx + bottomW / 2;

      const path = `M ${tlx},0 L ${trx},0 L ${brx},${h} L ${blx},${h} Z`;
      setBeamBox({ w, h, path });

      // 同时把需要的 CSS 变量写回（给定位用）
      sec.style.setProperty("--beam-origin-y", `${originY}px`);
      sec.style.setProperty("--beam-height",   `${h}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    ro.observe(title);
    ro.observe(anchor);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={[
        "relative w-full overflow-hidden",
        "min-h-screen min-h-[100svh]",
        "flex flex-col justify-start sm:justify-center",
        "px-6 sm:px-8 lg:px-12",
        "py-10 sm:py-14 lg:py-20",
        className,
      ].join(" ")}
      onMouseMove={handleMove}
      style={{
        ...cssVars,
        // 兜底（还没测量到时，也能看到一束光）
        ["--beam-origin-y" as any]: "420px",
        ["--beam-height"   as any]: "360px",
      }}
    >
      {/* ===== 背景（含鼠标跟随） ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#E9E5FF 0%,#E6E1FF 35%,#E3DCFF 60%,#E9E5FF 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1400px 700px at 50% 10%, rgba(168,85,247,0.36), rgba(168,85,247,0.20) 45%, transparent 75%)," +
              "radial-gradient(1100px 560px at 82% 68%, rgba(99,102,241,0.34), rgba(99,102,241,0.16) 50%, transparent 70%)," +
              "radial-gradient(1100px 560px at 18% 58%, rgba(192,132,252,0.36), rgba(192,132,252,0.16) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-80 mix-blend-screen blur-[28px]"
          style={{
            background:
              "radial-gradient(680px 680px at var(--mx,50%) var(--my,50%), rgba(167,139,250,0.65), rgba(167,139,250,0.30) 42%, transparent 72%)," +
              "repeating-radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(167,139,250,0.38) 0 2px, rgba(167,139,250,0) 2px 16px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\' viewBox=\\'0 0 160 160\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.65\\' numOctaves=\\'2\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'0.5\\'/></svg>')",
            backgroundSize: "auto",
          }}
        />
      </div>

      {/* ============ NEW: SVG Beam（柔和、跟斜边一致的羽化） ============ */}
      {beamBox && (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 z-0"
          style={{
            top: `calc(var(--beam-origin-y) - var(--beam-height))`,
            width: "100%",
            height: `${beamBox.h}px`,
          }}
          viewBox={`0 0 ${beamBox.w} ${beamBox.h}`}
          preserveAspectRatio="none"
        >
{/* ====== defs：顶部淡入渐变 + 遮罩 ====== */}
      <defs>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#000" stopOpacity="0"/>
          <stop offset="8%"   stopColor="#fff" stopOpacity="0.35"/>
          <stop offset="16%"  stopColor="#fff" stopOpacity="0.85"/>
          <stop offset="24%"  stopColor="#fff" stopOpacity="1"/>
          <stop offset="100%" stopColor="#fff" stopOpacity="1"/>
        </linearGradient>

        {/* 覆盖整个 SVG（并给 blur 留边界），注意两个 Units！ */}
        <mask
          id="topFadeMask"
          mask-type="alpha"
          maskUnits="userSpaceOnUse"
          maskContentUnits="objectBoundingBox"
          x={-200}
          y={-200}
          width={beamBox.w + 400}
          height={beamBox.h + 400}
        >
          {/* 0..1 归一化的竖向渐变，顶部透明、下方不透明 */}
          <rect x="0" y="0" width="1" height="1" fill="url(#topFade)" />
        </mask>

        {/* 你的两个滤镜保持不变 */}
        <filter id="blurSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="blurFeather" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="70" />
        </filter>

        <linearGradient id="beamFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(255,255,255,0.95)" />
          <stop offset="68%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>

        <linearGradient id="beamFeather" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(255,255,255,0.55)" />
          <stop offset="55%" stopColor="rgba(214,204,255,0.28)" />
          <stop offset="100%" stopColor="rgba(214,204,255,0.00)" />
        </linearGradient>
      </defs>

      {/* 应用遮罩（两条 path 都要） */}
      <path
        d={beamBox.path}
        fill="url(#beamFeather)"
        filter="url(#blurFeather)"
        mask="url(#topFadeMask)"
      />
      <path
        d={beamBox.path}
        fill="url(#beamFill)"
        filter="url(#blurSoft)"
        mask="url(#topFadeMask)"
      />

        </svg>
      )}
      {/* ============ /SVG Beam ============ */}

      {/* ===== 内容 ===== */}
      <div className="relative z-10 mx-auto max-w-7xl w-full flex flex-col items-center text-center gap-4">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200/60 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:text-zinc-300">
          <span aria-hidden></span>
     
        </div>

        <div ref={titleRef}>
          <AnimatedTitle text={title} />
        </div>

        <p className="mt-2 max-w-2xl text-zinc-700/90 dark:text-zinc-300">
          {subtitle}
        </p>

        {/* devices + four thumbnails */}
        <div ref={deviceWrapRef} className="relative mt-16 lg:mt-24 w-full flex justify-center">
          <DeviceFrames laptopContent={laptopContent} phoneContent={phoneContent} />

        {/* 左上 —— 上移更多 */}
        <motion.img
          src="/quiz-editor-3.png"
          alt="thumb"
          className="hidden lg:block absolute z-20 -left-72 -top-36 h-36 w-[18rem]
                    xl:-left-[30rem] xl:-top-40 xl:h-44 xl:w-[22rem]
                    2xl:-left-[34rem] 2xl:-top-44 2xl:h-52 2xl:w-[26rem]
                    rounded-xl object-cover shadow-2xl cursor-pointer"
          whileHover={{ scale: 1.06, y: -6 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        />

        {/* 右上（方图）—— 上移更多 */}
        <motion.img
          src="/calibration.svg"
          alt="thumb"
          className="hidden lg:block absolute z-20 -right-72 -top-36 h-36 w-36
                    xl:-right-[30rem] xl:-top-40 xl:h-44 xl:w-44
                    2xl:-right-[34rem] 2xl:-top-44 2xl:h-52 2xl:w-52
                    rounded-xl object-cover shadow-2xl cursor-pointer"
          whileHover={{ scale: 1.06, y: -6 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        />

        {/* 左下（横图） */}
        <motion.img
          src="/settings-calibration.svg"
          alt="thumb"
          className="hidden lg:block absolute z-20 -left-72 -bottom-6 h-44 w-[22rem]
                    xl:-left-[30rem] xl:bottom-[-10px] xl:h-52 xl:w-[26rem]
                    2xl:-left-[34rem] 2xl:bottom-[-14px] 2xl:h-60 2xl:w-[30rem]
                    rounded-xl object-cover shadow-2xl cursor-pointer"
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        />

        {/* 右下（横图） */}
        <motion.img
          src="/hero-card-2-with-cursor.png"
          alt="thumb"
          className="hidden lg:block absolute z-20 -right-72 bottom-2 h-44 w-[20rem]
                    xl:-right-[30rem] xl:bottom-[-8px] xl:h-52 xl:w-[24rem]
                    2xl:-right-[34rem] 2xl:bottom-[-12px] 2xl:h-60 2xl:w-[30rem]
                    rounded-xl object-cover shadow-2xl cursor-pointer"
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        />

        </div>

      </div>
    </section>
  );
}
