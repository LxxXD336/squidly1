// src/Subpages/AboutPage/WhoWeSupportSection.tsx
import React from "react";
import deviceImg from "../../Photo/hero-image.png";

type SupportCard = {
  iconName: "aging" | "cognitive" | "disability";
  title: string;
  body: string;
  className?: string;
};

const DefaultCards: [SupportCard, SupportCard, SupportCard] = [
  {
    iconName: "cognitive",
    title: "Individuals with cognitive decline",
    body: "Tools that simplify interaction to maintain independence.",
    className: "left-6 -bottom-10 md:left-14 md:-bottom-6 lg:left-20 lg:-bottom-2",
  },
  {
    iconName: "aging",
    title: "Aging populations",
    body: "Intuitive controls that help people stay connected with ease.",
    className: "right-2 -top-12 md:right-8 md:-top-8 lg:right-14 lg:-top-12",
  },
  {
    iconName: "disability",
    title: "People with disabilities",
    body: "Support for motor, speech, and communication challenges.",
    className: "right-4 -bottom-20 md:right-12 md:-bottom-12 lg:right-20 lg:-bottom-16",
  },
];

// —— 单色 SVG 图标（currentColor 为黑色，不受主题色影响）
const MonoIcon: React.FC<{ name: SupportCard["iconName"]; className?: string }> = ({ name, className = "h-6 w-6 text-black/90" }) => {
  switch (name) {
    case "aging":
      // 站立老人（拐杖）
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
          <path d="M8 21l2.5-6.5m1.5-4.5l-2 5m0 0 5 2m-3-7 3-2a3 3 0 0 1 4 1.5L21 12" />
          <path d="M19 12v8" />
        </svg>
      );
    case "cognitive":
      // 大脑
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 9a3 3 0 1 1 0-6 3 3 0 0 1 3 3" />
          <path d="M16 9a3 3 0 1 0 0-6 3 3 0 0 0-3 3" />
          <path d="M5 12a4 4 0 0 0 4 4h2v4" />
          <path d="M19 12a4 4 0 0 1-4 4h-2" />
        </svg>
      );
    case "disability":
      // 轮椅
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="8" cy="19" r="3" />
          <path d="M8 16V8a3 3 0 0 1 6 0v4h4" />
          <path d="M14 12l2 7" />
        </svg>
      );
  }
};

// —— 玻璃气泡卡片
const Card: React.FC<SupportCard> = ({ iconName, title, body, className }) => (
  <div
    className={[
      "absolute z-30", className || "",
      // 玻璃：半透明白 + 强烈模糊 + 白色描边 + 软阴影 + 大圆角
      "rounded-[20px] bg-white/30 backdrop-blur-xl",
      "ring-1 ring-white/60 shadow-[0_12px_28px_rgba(16,24,40,0.22)]",
      "px-5 py-4 md:px-6 md:py-5 w-[320px] max-w-[80vw]"
    ].join(" ")}
  >
    {/* 光泽高光（上边缘内发光） */}
    <div className="pointer-events-none absolute inset-0 rounded-[20px] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.65)]" />
    {/* 轻量环境投影 */}
    <div className="pointer-events-none absolute -bottom-3 left-6 right-6 h-4 rounded-full bg-black/10 blur-md" />

    <div className="relative flex items-start gap-3">
      <div className="shrink-0 h-9 w-9 grid place-items-center rounded-full bg-white/60 ring-1 ring-white/70">
        <MonoIcon name={iconName} />
      </div>
      <div>
        <div className="font-semibold text-slate-900 leading-snug">{title}</div>
        <div className="mt-1 text-sm text-slate-700 leading-snug">{body}</div>
      </div>
    </div>
  </div>
);


const WhoWeSupportSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      {/* 顶部柔光 */}
      <div className="pointer-events-none absolute -top-24 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent" />

      {/* 紫色横条：更厚、满屏宽 */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[320px] md:h-[600px] lg:h-[300px] z-0">
        <div className="absolute inset-0 bg-[var(--acc-accent,#8b5cf6)] opacity-90" />
      </div>

      {/* 左侧标题：在横条上垂直居中、靠左 */}
      <div className="pointer-events-none absolute inset-y-0 left-40 z-10 flex items-center pl-6 md:pl-12 lg:pl-20">
        <h2 className="text-white/95 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-left drop-shadow-sm">
          <span className="block">Who we</span>
          <span className="block">support</span>
        </h2>
      </div>

      {/* 中央内容：笔记本 + 气泡卡片（整体向右偏移一点） */}
      <div className="relative z-20 mx-auto max-w-6xl px-6">
        <div className="relative mx-auto max-w-5xl lg:translate-x-32 xl:translate-x-40">
          {/* 笔记本外框 */}
          <div className="relative mx-auto bg-neutral-900 rounded-[28px] shadow-[0_16px_48px_rgba(16,24,40,0.28)] ring-1 ring-black/20 p-2 md:p-3">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3 w-16 rounded-full bg-black/40" />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-black/70 shadow-[0_0_0_2px_rgba(255,255,255,0.15)_inset]" />
            <div className="overflow-hidden rounded-[20px] bg-black">
              <img src={deviceImg} alt="App on device" className="block w-full h-auto object-cover" />
            </div>
          </div>
          {/* 底座 */}
          <div className="mx-auto w-[72%] h-4 md:h-5 rounded-b-[18px] bg-gradient-to-b from-neutral-300 to-neutral-500 shadow-[0_10px_30px_rgba(16,24,40,0.22)] ring-1 ring-black/10" />
          <div className="mx-auto mt-1 h-2 w-[78%] rounded-full bg-black/10 blur-sm" />

          {/* 三张漂浮卡片（位置相对设备容器） */}
          {DefaultCards.map((c, i) => (
            <Card key={i} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeSupportSection;
