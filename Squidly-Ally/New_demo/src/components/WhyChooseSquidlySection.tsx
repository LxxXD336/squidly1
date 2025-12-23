import React, { useState } from "react";
import { motion } from "framer-motion";

// ===== 你的图片资源（保持不变） =====
import imgVoice from "../Photo/why-voice.jpg";
import imgCare from "../Photo/why-care.png";
import imgAI from "../Photo/why-ai.png";

const ITEMS: { title: string; bullets: string[] }[] = [
  {
    title: "Video Calls for Every Voice",
    bullets: [
      "Built to make communication extraordinarily inclusive, Squidly is the best way to make accessible video calls.",
    ],
  },
  {
    title: "Patient Care Meets Simplicity",
    bullets: [
      "Designed alongside clinicians and users, Squidly makes remote sessions effective and accessible.",
    ],
  },
  {
    title: "Frontier Intelligence",
    bullets: [
      "Powered by a mix of purpose-built and frontier AI models, Squidly is smart and fast.",
    ],
  },
];

const MEDIA: React.ReactNode[] = [
  <img key="m0" src={imgVoice} alt="Why choose — item 1" className="block h-full w-full object-cover" />,
  <img key="m1" src={imgCare} alt="Why choose — item 2" className="block h-full w-full object-cover" />,
  <img key="m2" src={imgAI} alt="Why choose — item 3" className="block h-full w-full object-cover" />,
];

// 渐变色仅用于序号/装饰
const ACCENTS = ["from-violet-500 to-fuchsia-500", "from-indigo-500 to-violet-500", "from-emerald-500 to-teal-500"];

/* ───────── 动画 variants（加大位移，改用 spring，保证结尾不“卡”） ───────── */
const springIn = (delay = 0) => ({
  type: "spring",
  stiffness: 140,     // 刚度：越大越“利落”
  damping: 18,        // 阻尼：越小越“弹”，18≈顺滑不抖
  mass: 0.75,
  delay,
});

const fadeDown = {
  initial: { opacity: 0, y: -36 },
  animate: { opacity: 1, y: 0, transition: springIn(0) },
};

const listContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const bulletItem = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: springIn(0) },
};

// 三张卡片：更大振幅（左上/下/右上），并配合轻微缩放
const cardVariant = (i: number) => {
  const base = { opacity: 0, scale: 0.94 };
  if (i === 0) {
    return {
      initial: { ...base, x: -80, y: -48 },
      animate: { opacity: 1, x: 0, y: 0, scale: 1, transition: springIn(0.0) },
    };
  }
  if (i === 1) {
    return {
      initial: { ...base, y: 72 },
      animate: { opacity: 1, x: 0, y: 0, scale: 1, transition: springIn(0.06) },
    };
  }
  return {
    initial: { ...base, x: 80, y: -48 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, transition: springIn(0.12) },
  };
};

/* ─ Circle Toggle Button ─ */
function CircleToggle({
  open,
  onClick,
  className = "",
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Collapse" : "Expand"}
      className={`grid h-10 w-10 place-items-center rounded-full bg-[#1c1f2a] text-white shadow-md transition-all hover:scale-[1.03] active:scale-[0.98] ${className}`}
    >
      <span className="text-xl leading-none">{open ? "–" : "+"}</span>
    </button>
  );
}

/* ─ Feature Card（大幅度+流畅 spring；子项错峰） ─ */
function FeatureCard({
  index,
  title,
  media,
  bullets,
  open,
  onToggle,
  dimmed,
}: {
  index: number;
  title: string;
  media: React.ReactNode;
  bullets: string[];
  open: boolean;
  onToggle: () => void;
  dimmed?: boolean;
}) {
  const variant = cardVariant(index);

  return (
    <motion.article
      aria-expanded={open}
      variants={variant}
      className={[
        // GPU 加速 / 预渲染提示，避免微卡
        "relative rounded-3xl bg-white shadow-[0_18px_46px_rgba(17,24,39,.10)] ring-1 ring-black/5 transform-gpu will-change-transform will-change-opacity",
        "transition-[box-shadow,filter] duration-300",
        open ? "scale-[1.01]" : "scale-[1.0]",
        dimmed ? "opacity-80 blur-[1px]" : "opacity-100 blur-0",
      ].join(" ")}
    >
      <div className="p-5 md:p-6">
        {/* 媒体 */}
        <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
          <div className="relative" style={{ aspectRatio: "4/3" }}>
            <div className="absolute inset-0">{media}</div>
          </div>
        </div>

        {/* 标题 + 序号条 */}
        <div className="mt-5 flex items-center gap-3">
          <span
            className={[
              "grid h-9 w-9 place-items-center rounded-full text-white text-[13px] font-semibold",
              "bg-gradient-to-br",
              ACCENTS[index % ACCENTS.length],
              "shadow-[0_8px_18px_rgba(122,59,255,.15)]",
            ].join(" ")}
          >
            {index + 1}
          </span>
          <h3 className="text-[22px] md:text-[24px] font-extrabold tracking-tight text-slate-900">{title}</h3>
        </div>
        <div className={`mt-2 h-[4px] w-24 rounded-full bg-gradient-to-r ${ACCENTS[index % ACCENTS.length]}`} />

        {/* 可折叠内容：子项错峰淡入 */}
        <motion.div
          variants={listContainer}
          className={`mt-3 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl bg-slate-50/70 p-4 ring-1 ring-black/5">
              <motion.ul className="space-y-3 text-[15px] leading-7 text-slate-700">
                {bullets.map((b, i) => (
                  <motion.li key={i} variants={bulletItem} className="flex items-start gap-2">
                    <span className="mt-[9px] inline-block h-[6px] w-[6px] rounded-full bg-slate-400/80" />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </motion.div>

        <CircleToggle open={open} onClick={onToggle} className="absolute bottom-4 right-4" />
      </div>
    </motion.article>
  );
}

/* ───────── Section：更大幅度 + 顺滑入场 ───────── */
export default function WhyChooseSquidlySection(): JSX.Element {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <motion.section
      className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-20"
      aria-label="Why choose Squidly (Steps layout)"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.35 }} // 到视口 35% 触发一次
    >
      {/* 头部文案：大幅度下移 + spring */}
      <motion.header className="mx-auto max-w-3xl text-center" variants={fadeDown}>
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="text-[#7A5CFF]">Why choose</span> <span className="text-slate-900">Squidly</span>
        </h2>
        <p className="mt-4 text-[16px] leading-7 text-slate-600">
          Designed alongside clinicians and users, Squidly makes remote sessions effective and accessible.
        </p>
      </motion.header>

      {/* 三卡片：更大振幅，从四周“飞入”且全程流畅 */}
      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-start">
        {ITEMS.map((it, idx) => (
          <div key={idx} className="basis-full transition-all duration-300 md:basis-1/3">
            <FeatureCard
              index={idx}
              title={it.title}
              media={MEDIA[idx]}
              bullets={it.bullets}
              open={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
              dimmed={openIdx !== null && openIdx !== idx}
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
