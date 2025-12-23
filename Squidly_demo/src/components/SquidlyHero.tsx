import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useMotionValue } from "framer-motion";
import { ChevronRight, Captions, ArrowLeft, ArrowRight, RefreshCcw, Lock, Star, CircleUser, Globe } from "lucide-react";
import bg from "../Photo/bg.jpg";
import GlassMenu from "./GlassMenu";

/* ===== Brand ===== */
const BRAND = "#7A3BFF";

/* ===== Backdrop：柔光极光 + 轻粒子 ===== */
const SilkyBackdrop = ({ spot }: { spot: { x: number; y: number } }) => (
    <>
        <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 50% 0%, #FAF9FF 0%, #F4ECFF 42%, #FFFFFF 100%)" }} />
        <div className="absolute inset-0 pointer-events-none transition-[background] duration-300" style={{ background: `radial-gradient(220px 220px at ${spot.x}% ${spot.y}%, rgba(122,59,255,0.10), transparent 60%)` }} />
        <motion.div
            aria-hidden
            className="absolute -inset-24 blur-3xl opacity-50"
            style={{ background: "conic-gradient(from 0deg at 70% 30%, rgba(164,124,255,.22), transparent 35%, rgba(122,59,255,.18) 55%, transparent 75%, rgba(164,124,255,.22))" }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        />
        {[...Array(22)].map((_, i) => (
            <motion.span
                key={i}
                className="absolute rounded-full"
                style={{ width: 6, height: 6, left: `${(i * 37) % 100}%`, top: `${(i * 19) % 100}%`, background: "rgba(122,59,255,.10)" }}
                animate={{ y: [0, -8, 0], opacity: [0.15, 0.55, 0.15] }}
                transition={{ duration: 6 + (i % 5), delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
            />
        ))}
    </>
);



const RiverFillTitle = ({
                            lines = ["Video Calls", "For", "Every Voice"],
                            fontMax = 300,         // 只改这个就能把字体变大
                            lineStepPx = 250,      // 行距固定像素，不随字号变化
                            topPad = 40,
                            bottomPad = 120,
                            speed = 9,             // 灌满时长（秒），一次后停
                        }: {
    lines?: string[];
    fontMax?: number;
    lineStepPx?: number;
    topPad?: number;
    bottomPad?: number;
    speed?: number;
}) => {
    const prefers = useReducedMotion();
    const viewW = 1600;
    const viewH = Math.ceil(topPad + fontMax + (lines.length - 1) * lineStepPx + bottomPad);
    const fontSize = `clamp(64px, 20vw, ${fontMax}px)`;
    const yFor = (i: number) => topPad + fontMax + i * lineStepPx;

    const gradientId = "purpleGrad";
    const maskId = "riverMask_once";

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${viewW} ${viewH}`} width="100%" height="auto" aria-label={lines.join(" ")}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"  stopColor="#5B2EEA" />
                        <stop offset="45%" stopColor="#7A3BFF" />
                        <stop offset="95%" stopColor="#A78BFA" />
                    </linearGradient>

                    {/* 白显黑隐遮罩：底部矩形上升 + 顶端波面；播放一次后停住 */}
                    <mask id={maskId} maskUnits="userSpaceOnUse">
                        <rect x="-120" width={viewW + 240} y={prefers ? 0 : viewH} height={viewH} fill="#fff">
                            {!prefers && (
                                <animate attributeName="y" from={viewH} to={0} dur={`${speed}s`} repeatCount="1" fill="freeze" />
                            )}
                        </rect>
                        <g transform={`translate(0 ${viewH - 120})`}>
                            <path
                                d={`M -160 0
                    C -120 -28, -80 28, -40 0
                    S 40 -28, 80 0
                    S 160 28, 200 0
                    S 280 -28, 320 0
                    S 400 28, 440 0
                    S 520 -28, 560 0
                    S 640 28, 680 0
                    S 760 -28, 800 0
                    S 880 28, 920 0
                    S 1000 -28, 1040 0
                    S 1120 28, 1160 0
                    S 1240 -28, 1280 0
                    S 1360 28, 1400 0
                    L 1400 140 L -160 140 Z`}
                                fill="#fff" opacity="0.85"
                            >
                                {!prefers && (
                                    <animateTransform attributeName="transform" type="translate" from="-120 0" to="0 0" dur={`${speed}s`} repeatCount="1" fill="freeze" />
                                )}
                            </path>
                        </g>
                    </mask>
                </defs>

                {/* 灰色兜底字 */}
                <g fill="#CBD5E1">
                    {lines.map((t, i) => (
                        <text key={`g-${i}`} x="0" y={yFor(i)} style={{ fontWeight: 800, fontSize, letterSpacing: "-.02em" }}>
                            {t}
                        </text>
                    ))}
                </g>
                {/* 紫色渐变字（被遮罩灌入一次） */}
                <g fill={`url(#${gradientId})`} mask={`url(#${maskId})`}>
                    {lines.map((t, i) => (
                        <text key={`p-${i}`} x="0" y={yFor(i)} style={{ fontWeight: 800, fontSize, letterSpacing: "-.02em" }}>
                            {t}
                        </text>
                    ))}
                </g>
            </svg>
        </div>
    );
};
/* 短描述：逐词上浮（stagger） */
const ShortDescription = () => {
    const words = "Built to make communication extraordinarily inclusive, Squidly is the best way to make accessible video calls.".split(" ");
    return (
        <p className="mt-3 text-[clamp(15px,1.3vw,18px)] text-slate-700/95 max-w-md">
            {words.map((w, i) => (
                <motion.span
                    key={i}
                    className="inline-block mr-1"
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 + i * 0.035 }}
                >
                    {w}
                </motion.span>
            ))}
        </p>
    );
};

/* Standout Points：轻浮动 + 悬停弹跳 */
const StandoutPoints = () => {
    const points = [
        { icon: "🗣️", text: "Live captions" },
        { icon: "👆", text: "Large tap-targets" },
        { icon: "👀", text: "Gaze-friendly" },
    ] as const;

    return (
        <ul role="list" className="mt-4 flex flex-wrap gap-2 max-w-sm">
            {points.map((p, i) => (
                <motion.li
                    key={p.text}
                    className="inline-flex items-center gap-2 rounded-full border bg-white/90 px-3 py-1.5 text-sm text-slate-800"
                    style={{ borderColor: "rgba(122,59,255,0.28)", boxShadow: "0 8px 22px rgba(122,59,255,0.10)" }}
                    animate={{ y: [0, i % 2 ? 2 : -2, 0] }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span aria-hidden className="text-base">{p.icon}</span>
                    <span>{p.text}</span>
                </motion.li>
            ))}
        </ul>
    );
};

/* 霓虹 CTA（指针追随光斑） */

/** PrimeCTA：高质感/可达性良好的主按钮 */
export function PrimeCTA({
                             href = "#",
                             children = "Book a 15-min Demo",
                             loading = false,
                         }: {
    href?: string;
    children?: React.ReactNode;
    loading?: boolean;
}) {
    const prefers = useReducedMotion();
    const mx = useMotionValue(50), my = useMotionValue(50);

    const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
    };

    return (
        <motion.a
            href={href}
            onMouseMove={onMove}
            onMouseLeave={() => { mx.set(50); my.set(50); }}
            whileHover={prefers ? {} : { scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            aria-busy={loading}
            className="group relative inline-flex items-center justify-center
                 rounded-2xl px-6 min-h-[56px] text-[17px] font-semibold text-white
                 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50
                 select-none"
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* 背景渐变（主层） */}
            <span
                className="absolute inset-0 rounded-2xl"
                style={{
                    background:
                        "linear-gradient(140deg, #5B2EEA 0%, #7A3BFF 40%, #4F46E5 85%)",
                    boxShadow: "0 18px 42px rgba(122,59,255,.35)",
                }}
                aria-hidden
            />

            {/* 指针跟随的高光（柔和，不影响可读性） */}
            <motion.span
                className="absolute inset-0 rounded-2xl mix-blend-screen"
                style={{
                    background: `radial-gradient(220px 220px at ${mx.get()}% ${my.get()}%,
                      rgba(255,255,255,.35), rgba(255,255,255,0) 60%)`,
                }}
                animate={false}
                aria-hidden
            />

            {/* 轮廓 + 玻璃薄膜（让边缘更干净） */}
            <span
                className="absolute inset-0 rounded-2xl ring-1"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.35)", borderColor: "rgba(255,255,255,.22)" }}
                aria-hidden
            />

            {/* 文案 + 图标 */}
            <span className="relative z-10 flex items-center gap-2">
        {children}
                {!loading && (
                    <motion.span
                        initial={{ x: 0 }}
                        whileHover={prefers ? {} : { x: 4 }}
                        className="grid h-5 w-5 place-items-center"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </motion.span>
                )}
                {loading && (
                    <span
                        className="relative h-5 w-5"
                        aria-label="loading"
                    >
            <span className="absolute inset-0 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
          </span>
                )}
      </span>
        </motion.a>
    );
}
/* 左栏（标题 + 短描述 + 亮点 + 主CTA） */
const LeftPanel = () => (
    <div className="flex flex-col justify-center max-w-xl">
        <RiverFillTitle fontMax={300} lineStepPx={250} speed={9} />
        <ShortDescription />
        <StandoutPoints />
        <div className="mt-7">
            <PrimeCTA href="#demo">Get start for free</PrimeCTA>        </div>
    </div>
);

/* ===== 打字字幕（用于 Speak 卡片） ===== */
const CaptionPreview = () => {
    const [t, setT] = useState("");
    const text = "…that's great — keep going!";
    const prefers = useReducedMotion();
    useEffect(() => {
        if (prefers) { setT(text); return; }
        let i = 0;
        const id = setInterval(() => { setT(text.slice(0, i++)); if (i > text.length) clearInterval(id); }, 40);
        return () => clearInterval(id);
    }, [prefers]);
    return (
        <div className="mt-3 flex items-center gap-2 rounded-full bg-black/85 px-3 py-1 text-xs font-medium text-white w-max">
            <Captions className="h-3.5 w-3.5" /> <span>{t}</span><span className="animate-pulse">▍</span>
        </div>
    );
};

/* ===== 浏览器地址栏（置于屏幕内） ===== */
const BrowserUrlBar = ({ url = "squidly.com.au/#home-page" }: { url?: string }) => {
    return (
        <div className="px-4 pb-2">
            <div className="flex items-center gap-2 rounded-full bg-slate-50/70 border px-2.5 py-1.5"
                 style={{ borderColor: "rgba(122,59,255,0.16)", boxShadow: "0 6px 20px rgba(122,59,255,0.08)" }}>
                <div className="flex items-center gap-1.5 text-slate-500">
                    <button aria-label="Back" className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/70"><ArrowLeft className="h-4 w-4"/></button>
                    <button aria-label="Forward" className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/70"><ArrowRight className="h-4 w-4"/></button>
                    <button aria-label="Refresh" className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/70"><RefreshCcw className="h-4 w-4"/></button>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 rounded-full bg-white/90 border px-3 py-1.5 text-sm text-slate-700 truncate"
                         style={{ borderColor: "rgba(122,59,255,0.20)" }} aria-label="Address bar">
                        <Globe className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                        <span className="truncate">{url}</span>
                        <Lock className="h-4 w-4 shrink-0 text-emerald-600 ml-auto" aria-hidden />
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                    <button aria-label="Bookmark" className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/70"><Star className="h-4 w-4"/></button>
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white/80 border" style={{ borderColor: "rgba(122,59,255,0.16)" }} aria-label="Profile">
                        <CircleUser className="h-4 w-4"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ===== 右：笔记本展示盘（含地址栏 + 四宫格） ===== */
const LaptopShowcase = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mx, setMx] = useState(0);
    const [my, setMy] = useState(0);

    const cards = [
        { key: "Speak", emoji: "🗣️", title: "Speak", desc: "Live captions", bg: "#EEF2FF" },
        { key: "Type",  emoji: "⌨️", title: "Type",  desc: "Quick typing",  bg: "#F1F5FF" },
        { key: "Tap",   emoji: "👆", title: "Tap",   desc: "Big targets",   bg: "#ECFDF5" },
        { key: "Look",  emoji: "👀", title: "Look",  desc: "Gaze friendly", bg: "#FFF7ED" },
    ] as const;

    return (
        <div
            ref={containerRef}
            onPointerMove={(e) => {
                const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setMx(((e.clientX - r.left) / r.width - 0.5) * 26);
                setMy(((e.clientY - r.top) / r.height - 0.5) * 26);
            }}
            onPointerLeave={() => { setMx(0); setMy(0); }}
            className="relative w-full max-w-[620px] mx-auto select-none"
            aria-label="Friendly modes on a laptop screen"
        >
            {/* 底座 */}
            <div className="absolute left-1/2 top-[92%] h-8 w-[86%] -translate-x-1/2 rounded-b-[28px] bg-gradient-to-b from-slate-200/80 to-slate-300/80 blur-[1px] shadow-[0_8px_30px_rgba(0,0,0,0.12)]" />
            <div className="absolute left-1/2 top-[96%] h-12 w-[44%] -translate-x-1/2 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-300/80 shadow-inner" />

            {/* 外框 */}
            <div className="relative rounded-[32px] p-[1px]"
                 style={{ background: "linear-gradient(120deg, rgba(122,59,255,.55), rgba(167,139,250,.35), rgba(122,59,255,.55))" }}>
                <motion.div style={{ rotateX: my/8, rotateY: -mx/8, transformStyle: "preserve-3d" }}
                            className="relative rounded-[32px] bg-white/80 backdrop-blur-2xl shadow-[0_24px_64px_rgba(122,59,255,0.20)] overflow-hidden">
                    {/* 顶栏三色 + 摄像头 */}
                    <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                        <span className="h-3 w-3 rounded-full" style={{ background:"#FF5F56" }} aria-hidden />
                        <span className="h-3 w-3 rounded-full" style={{ background:"#FFBD2E" }} aria-hidden />
                        <span className="h-3 w-3 rounded-full" style={{ background:"#27C93F" }} aria-hidden />
                        <div className="ml-2 text-xs text-slate-500">Friendly Modes</div>
                        <div className="ml-auto h-2 w-2 rounded-full bg-slate-500/60" aria-hidden />
                    </div>

                    {/* 浏览器地址栏 */}
                    <BrowserUrlBar url="squidly.com.au/#home-page" />

                    {/* 屏幕扫光 */}
                    <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-[32px]"
                                 style={{ background: "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 45%, rgba(255,255,255,0) 60%)" }}
                                 animate={{ x: ["-40%","120%"] }} transition={{ duration: 6, repeat: Infinity, ease:"easeInOut" }} />

                    {/* 四宫格 */}
                    <div className="relative p-4 sm:p-5">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {cards.map((c, i) => (
                                <motion.div key={c.key} className="relative rounded-2xl p-4 sm:p-5 border"
                                            style={{ backgroundColor: c.bg, borderColor: "rgba(122,59,255,0.18)", transform: `translateZ(${(i+1)*12}px)` }}
                                            whileHover={{ y: -4 }}>
                                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                                        <span aria-hidden className="text-lg sm:text-xl">{c.emoji}</span>
                                        <span className="sr-only">{c.title}</span>
                                        <span>{c.title}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-slate-600">{c.desc}</div>

                                    {/* Tap 快捷短语 */}
                                    {c.key === "Tap" && (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            {["Yes","No","More","Stop"].map(s => (
                                                <button key={s} className="rounded-xl bg-white/90 px-3 py-1.5 text-sm border hover:translate-y-[-1px] transition"
                                                        style={{ borderColor:"rgba(122,59,255,0.25)", boxShadow:"0 6px 18px rgba(122,59,255,.10)" }}
                                                        aria-label={s}>{s}</button>
                                            ))}
                                        </div>
                                    )}
                                    {/* Speak 字幕 */}
                                    {c.key === "Speak" && <CaptionPreview/>}
                                    {c.key === "Look" && <EyeScan size={20} duration={8.5} />}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 右上角贴纸 */}
            <motion.div className="absolute -top-3 -right-3 rounded-2xl border bg-white/95 px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1"
                        style={{ borderColor:"rgba(122,59,255,0.28)", boxShadow:"0 10px 22px rgba(122,59,255,0.18)" }}
                        animate={{ y: [-2,2,-2] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
                ✨ Friendly Modes
            </motion.div>
        </div>
    );
};

const EyeScan = ({
                     size = 40,
                     points = [
                         { left:"10%", top:"50%" }, // 左
                         { left:"90%", top:"50%" }, // 右
                         { left:"50%", top:"85%" }, // 下
                         { left:"10%", top:"50%" }, // 左
                         { left:"10%", top:"85%" }, // 左下
                         { left:"90%", top:"85%" }, // 右下
                     ],
                     duration = 7.2
                 }:{ size?: number; points?: {left:string; top:string}[]; duration?: number }) => {
    const prefers = useReducedMotion();
    const lefts = points.map(p=>p.left);
    const tops  = points.map(p=>p.top);

    return (
        <motion.span
            aria-hidden
            className="absolute select-none drop-shadow-sm"
            style={{ left: lefts[0], top: tops[0], fontSize: size, transform:"translate(-50%, -50%)" }}
            animate={prefers ? undefined : { left: lefts, top: tops }}
            transition={{ duration, ease:"easeInOut", repeat: Infinity, times:[0,.2,.4,.6,.8,1] }}
        >
            <span>👀</span>
        </motion.span>
    );
};
export default function SquidlyHero_Full() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [spot, setSpot] = useState({ x: 50, y: 40 });
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            setSpot({ x: ((e.clientX - r.left)/r.width)*100, y: ((e.clientY - r.top)/r.height)*100 });
        };
        el.addEventListener("pointermove", onMove);
        return () => el.removeEventListener("pointermove", onMove);
    }, []);

    return (
        <section ref={ref as any} className="relative overflow-hidden">
            <SilkyBackdrop spot={spot} />
            <div className="relative mx-auto max-w-7xl px-6">
                <div className="min-h-[92vh] grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-12 pt-20 pb-16 sm:pt-28">
                    <GlassMenu
                        barBgImage={bg}
                        collapsedMatchImage
                        barHeight={52}
                        collapsedEdgeBleedPx={3}
                    />

                    <LeftPanel />
                    <div className="flex items-center"><LaptopShowcase/></div>
                </div>
            </div>
        </section>
    );
}
