// src/components/StepsSection.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareText,
  MonitorSmartphone,
  Link as LinkIcon,
  UserPlus,
  Mic,
  Video,
  ScreenShare,
  PhoneOff,
  Settings as Cog,
  Volume2,
  Search,
  X,
} from "lucide-react";

// ⬇️ 新增：引入 AuthModal（signin 弹窗）
import AuthModal, { type AuthMode } from "./AuthModal";

// 可选：你自己的图片
import setupImg from "../Photo/Setup.jpg";

// ===== 左侧 Steps 文案 =====
export type StepKey = "setup" | "launch" | "communicate";
const ORDER: Record<StepKey, number> = { setup: 1, launch: 2, communicate: 3 };
const STEP_COPY: Record<StepKey, { title: string; bullets: string[] }> = {
  setup: {
    title: "Setup",
    bullets: [
      "Create an account or sign in",
      "Choose a mode: Eye Gaze / Tool Bar / Schedule",
      "Quick preferences: camera, mic, accessibility",
    ],
  },
  launch: {
    title: "Launch",
    bullets: ["Create a session and get a shareable link", "Invite participants with one tap", "Start the call"],
  },
  communicate: {
    title: "Communicate",
    bullets: ["Use the Tool Bar for quick actions", "Eye Gaze pointer & messaging together", "Natural, smooth collaboration"],
  },
};

// ===== 进场/切换动画 =====
const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const fromLeft = { initial: { opacity: 0, x: -48 }, animate: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const fromRight = { initial: { opacity: 0, x: 48 }, animate: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const listContainer = { initial: {}, animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const listItem = { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } } };
const swapVariant = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.25, ease: "easeIn" } },
};

// ===== 左侧可选步骤列表 =====
type StepItem = { title: string; descs: string[] };

function SelectableSteps({
  steps,
  active,
  onChange,
}: {
  steps: StepItem[];
  active: number;
  onChange: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [highlight, setHighlight] = useState<{ top: number; height: number }>({ top: 0, height: 0 });

  const updateHighlight = (index = active) => {
    const container = containerRef.current;
    const el = itemRefs.current[index];
    if (!container || !el) return;
    const c = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setHighlight({ top: r.top - c.top, height: r.height });
  };

  useEffect(() => {
    updateHighlight(active);
    const onResize = () => updateHighlight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []); // eslint-disable-line

  useEffect(() => {
    updateHighlight(active);
  }, [active, steps.length]); // eslint-disable-line

  return (
    <div ref={containerRef} className="relative flex flex-col gap-6" style={{ isolation: "isolate" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 z-0 rounded-2xl border border-violet-200 bg-violet-50/70 shadow-md transition-all duration-300"
        style={{ top: highlight.top, height: highlight.height }}
      />
      {steps.map((s, i) => {
        const activeItem = i === active;
        return (
          <motion.div
            variants={listItem}
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            role="button"
            tabIndex={0}
            onClick={() => onChange(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(i);
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                onChange(Math.max(0, active - 1));
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                onChange(Math.min(steps.length - 1, active + 1));
              }
            }}
            className={[
              "relative z-10 cursor-pointer rounded-2xl border px-5 py-5 transition-colors md:px-6 md:py-6",
              activeItem ? "border-transparent" : "border-slate-200 bg-white hover:bg-slate-50",
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              <div className="relative mt-1">
                <span
                  className={[
                    "grid h-8 w-8 place-items-center rounded-full text-[12px] font-extrabold text-white shadow ring-2 ring-white transition-colors",
                    activeItem ? "bg-gradient-to-b from-violet-500 to-violet-700" : "bg-gradient-to-b from-violet-400 to-violet-600",
                  ].join(" ")}
                >
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="whitespace-pre-line text-lg font-semibold text-slate-900">{s.title}</h3>
                {s.descs.length > 0 && (
                  <ul className="mt-2 space-y-1 text-[15px] leading-relaxed text-slate-600">
                    {s.descs.map((d, k) => (
                      <li key={k} className="list-disc pl-4 marker:text-violet-500">
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ===== 右侧：不同 Step 的内容 =====
function DeviceFrame({ children, stepNo }: { children: React.ReactNode; stepNo: number }) {
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="relative rounded-[2.1rem] bg-gradient-to-br from-white via-violet-100 to-white p-[1px]">
        <div className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-violet-200">
          <div className="flex h-12 items-center justify-between gap-2 border-b border-violet-200/60 bg-violet-50 px-4">
            <div className="flex items-center gap-2 text-neutral-700">
              <MonitorSmartphone className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium">squidly.com.au/#home-page</span>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
              STEP {stepNo}
            </span>
          </div>
          <div className="relative h-[560px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ScreenLaunch() {
  return (
    <div className="absolute inset-0 p-6">
      <div
        className="absolute inset-0 rounded-[1.75rem]"
        style={{
          background:
            "radial-gradient(60% 55% at 65% 0%, rgba(99,102,241,.18), transparent 60%), radial-gradient(60% 50% at 20% 85%, rgba(168,85,247,.16), transparent 65%)",
        }}
      />
      <div className="relative flex h-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white/90 p-4 ring-1 ring-violet-200">
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <LinkIcon className="h-4 w-4 text-violet-600" />
              Share link
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm ring-1 ring-violet-200">
              <span className="truncate text-neutral-800">https://squidly.com/s/abc-123</span>
              <button className="ml-auto rounded-md bg-white px-2 py-1 text-xs text-violet-700 ring-1 ring-violet-200">Copy</button>
            </div>
          </div>
          <div className="rounded-xl bg-white/90 p-4 ring-1 ring-violet-200">
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <UserPlus className="h-4 w-4 text-violet-600" />
              Invite teammates
            </div>
            <div className="mt-3 flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 ring-2 ring-white/70" />
              ))}
              <button className="ml-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="grid flex-1 place-items-center">
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="group inline-flex items-center gap-4 rounded-[22px] bg-white px-6 py-4 shadow-[0_10px_28px_rgba(0,0,0,.06)] ring-1 ring-black/5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#6F72FF] shadow-[inset_0_-2px_8px_rgba(0,0,0,.08)]" aria-hidden="true">
              <Video className="h-6 w-6 text-white" />
            </span>
            <span className="text-[18px] font-extrabold tracking-wide text-[#2A2F3A]">HOST MEETING</span>
          </motion.button>
        </div>
        <div className="rounded-xl bg-white/90 p-4 ring-1 ring-violet-200">
          <div className="font-medium text-neutral-800">Quick preferences</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Cam", "Mic", "Subtitles"].map((t) => (
              <button key={t} className="rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-700 ring-1 ring-violet-200">
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenCommunicate() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="grid flex-1 grid-cols-1 gap-3 p-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#d9d6ff] to-white ring-1 ring-violet-200">
          <div className="absolute inset-0 grid place-items-center font-medium text-neutral-700/70">Host video</div>
          <div className="absolute bottom-3 left-3 rounded-md bg-white/85 px-2 py-1 text-xs ring-1 ring-violet-200">host</div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#e8f8f2] to-white ring-1 ring-violet-200">
          <div className="absolute inset-0 grid place-items-center font-medium text-neutral-700/70">Participant</div>
          <div className="absolute bottom-3 left-3 rounded-md bg-white/85 px-2 py-1 text-xs ring-1 ring-violet-200">participant</div>
        </div>
      </div>
      <div className="bg-white/85 p-3 ring-1 ring-violet-200 backdrop-blur">
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "camera", Icon: Video },
            { label: "mic", Icon: Mic, active: true },
            { label: "share", Icon: ScreenShare },
            { label: "settings", Icon: Cog },
            { label: "end", Icon: PhoneOff },
          ].map(({ label, Icon, active }) => (
            <button
              key={label}
              className={[
                "flex h-16 w-full flex-col items-center justify-center gap-1 rounded-xl ring-1 text-sm",
                active
                  ? "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white ring-emerald-300/40 shadow-[0_10px_24px_rgba(16,185,129,.25)]"
                  : "bg-white text-neutral-800 ring-violet-200",
              ].join(" ")}
            >
              <Icon className={active ? "h-5 w-5 text-white" : "h-5 w-5 text-violet-600"} />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-24 right-4 flex items-center gap-2">
        <div className="rounded-full bg-violet-100 p-2 ring-1 ring-violet-200">
          <MessageSquareText className="h-4 w-4 text-violet-700" />
        </div>
        <div className="max-w-[240px] rounded-2xl bg-white px-3 py-2 text-sm text-neutral-800 ring-1 ring-violet-200">
          Messages and eye-gaze pointer work together.
        </div>
      </div>
    </div>
  );
}

// ===== 右侧固定面板（随 active 切换） =====
function RightPanel({
  activeKey,
  onClickSignIn,
}: {
  activeKey: StepKey;
  onClickSignIn: () => void;
}) {
  // 中心“主显示区”的内容，随 step 切换
  const Media = () => {
    if (activeKey === "setup") {
      return (
        <motion.div key="setup" variants={swapVariant} initial="initial" animate="animate" exit="exit">
          {/* 这里用静态图；你也可以换成 Setup 的具体 UI */}
          <img src={setupImg} alt="Setup preview" className="block h-full w-full object-cover" />
        </motion.div>
      );
    }
    if (activeKey === "launch") {
      return (
        <motion.div key="launch" variants={swapVariant} initial="initial" animate="animate" exit="exit">
          <DeviceFrame stepNo={ORDER.launch}>
            <ScreenLaunch />
          </DeviceFrame>
        </motion.div>
      );
    }
    return (
      <motion.div key="communicate" variants={swapVariant} initial="initial" animate="animate" exit="exit">
        <DeviceFrame stepNo={ORDER.communicate}>
          <ScreenCommunicate />
        </DeviceFrame>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_46px_rgba(17,24,39,.08)]">
        {/* 顶部条 */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 bg-gradient-to-b from-[#FAFAFF] to-[#F3F1FF] px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-200/80 text-rose-700 ring-1 ring-rose-300">
              <X className="h-3.5 w-3.5" />
            </span>
            <div className="hidden text-sm font-medium text-slate-700 md:block">Board</div>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Search className="h-4 w-4" />
            <Volume2 className="h-4 w-4" />
          </div>
        </div>

        {/* 中心展示区：根据 activeKey 切换 */}
        <div className="px-4 pt-4 md:px-6 md:pt-6">
          <div className="relative overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
            <div className="relative aspect-[16/10] md:aspect-[4/3]">
              <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <Media />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮条：Sign in + Console */}
        <div className="mt-4 flex items-center gap-3 border-t border-slate-200 px-4 py-3 md:px-6 md:py-4">
          <button
            onClick={onClickSignIn}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#6F72FF] px-4 py-2.5 text-sm font-bold text-white shadow-sm ring-1 ring-[#5E61E6] transition hover:brightness-105 active:brightness-95"
          >
            Sign in
          </button>
          <button className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#6F72FF] ring-1 ring-[#CFCBFF] transition hover:bg-[#F8F7FF]">
            Console
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Section（左列表 + 右侧动态面板 + 进场动画） =====
export default function StepsSection(): JSX.Element {
  const order: StepKey[] = ["setup", "launch", "communicate"];
  const [active, setActive] = useState<number>(0);
  const activeKey = order[active];

  // 左列数据
  const steps: StepItem[] = order.map<StepItem>((key) => ({
    title: STEP_COPY[key].title,
    descs: STEP_COPY[key].bullets,
  }));

  // ⬇️ 新增：Auth 弹窗开关 & 模式（默认 signin）
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode] = useState<AuthMode>("signin");
  const openSignIn = () => setAuthOpen(true);

  return (
    <motion.section
      className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-20"
      aria-label="Steps to setup"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.32 }}
    >
      <motion.header className="mx-auto max-w-3xl" variants={fadeUp}>
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#2A2F3A] md:text-5xl">Steps to setup</h2>
      </motion.header>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-10 md:mt-12 md:grid-cols-2 md:gap-12">
        <motion.div variants={fromLeft} className="min-w-0">
          <motion.div variants={listContainer}>
            <SelectableSteps steps={steps} active={active} onChange={setActive} />
          </motion.div>
        </motion.div>

        <motion.div variants={fromRight} className="min-w-0">
          <RightPanel activeKey={activeKey} onClickSignIn={openSignIn} />
        </motion.div>
      </div>

      {/* ⬇️ 掛载 AuthModal（signin） */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode={authMode}
        enableHashTrigger={false}
        onEmailOrPhoneSubmit={(payload) => {
          // TODO: 接你的后端 API
          console.log("Auth submit:", payload);
          // 成功后关闭：
          // setAuthOpen(false);
        }}
        onSocialLogin={(provider, mode) => {
          // TODO: 跳转 OAuth 起点
          console.log("Social login:", provider, mode);
          // window.location.href = `/api/auth/${provider}?mode=${mode}`;
        }}
      />
    </motion.section>
  );
}
