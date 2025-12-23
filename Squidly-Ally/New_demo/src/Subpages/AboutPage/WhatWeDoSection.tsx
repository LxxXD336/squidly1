// src/Subpages/AboutPage/WhatWeDoSection.tsx
import React from "react";

const ACCENT = "var(--acc-accent, #8b5cf6)";

const items = [
  {
    title: "Eye Gaze",
    body: "Navigate and communicate using only your eyes.",
  },
  {
    title: "Switch Access",
    body: "Full control through adaptive switches and sensors.",
  },
  {
    title: "AAC Boards",
    body: "Communicate through personalised symbol-based language.",
  },
  {
    title: "Custom Remote Control",
    body: "Allow clinicians or carers to guide interactions seamlessly.",
  },
];

const WhatWeDoSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* 背景柔光（顶光 + 底部彩色雾化） */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
        <div
          className="absolute left-1/2 top-24 h-[620px] w-[1200px] -translate-x-1/2 blur-3xl opacity-90"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 35%, rgba(168,85,247,0.20), rgba(251,191,36,0.18) 40%, rgba(255,255,255,0) 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* 标题 */}
        <h2 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          What We Do
        </h2>
        <p className="mt-4 text-center text-lg md:text-xl font-semibold text-slate-800">
          Advanced accessibility, made practical for everyday life.
        </p>

        {/* 卡片区 */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {items.map((it) => (
            <div
              key={it.title}
              className="
                group rounded-[18px] bg-slate-50
                shadow-[0_6px_16px_rgba(16,24,40,0.06)]
                ring-1 ring-black/5
                px-6 py-6 md:px-7 md:py-7
                transition-transform duration-300 ease-out
                hover:-translate-y-0.5
              "
            >
              <h3
                className="text-lg font-bold leading-6"
                style={{ color: ACCENT }}
              >
                {it.title}
              </h3>
              <p className="mt-2 text-slate-700 leading-7">{it.body}</p>

              {/* 底边柔影（参考图下方那条浅阴影） */}
              <div className="mt-5 h-0.5 w-full bg-gradient-to-r from-transparent via-black/5 to-transparent rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
