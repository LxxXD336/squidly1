import React from "react";
import featureGrid from "../../Photo/featurehero.png";

export const FeatureHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* 整体白色底 */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white" />

      {/* 右侧大号柔光背景，模拟设计稿的紫色云雾 */}
      <div
        className="
          pointer-events-none
          absolute
          right-[5%]
          top-1/2
          h-[520px]
          w-[520px]
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle_at_40%_40%,rgba(168,85,247,0.65)_0,rgba(168,85,247,0.4)_30%,rgba(252,211,77,0.45)_55%,transparent_75%)]
          blur-3xl
        "
      />
      {/* 底部只加一小段白色，保证自然衔接 */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-16            /* 控制白色区域高度，可改为 h-12 / h-20 */
          bg-gradient-to-b
          from-transparent
          to-white
          -z-0
        "
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center md:py-24">
        {/* 左侧文案 */}
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-500">
            Features
          </p>

          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            Remote eye-gaze calls,
            <br />
            made possible.
          </h1>

          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            Clinically verified, browser-based video calling designed for people
            using eye-gaze, AAC, and switch access — no extra hardware, no extra
            apps.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="inline-flex items-center justify-center rounded-full bg-purple-500 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-purple-500/30 hover:bg-purple-600">
              Sign in
            </button>

            <button className="inline-flex items-center justify-center rounded-full border border-purple-300/80 bg-white/70 px-6 py-2.5 text-sm font-medium text-purple-600 shadow-sm hover:bg-purple-50">
              Watch Demo
            </button>
          </div>
        </div>

        {/* 右侧图片区域 */}
        <div className="relative w-full max-w-md">
          {/* 去掉多余边框，只保留简单卡片，贴合原图感觉 */}
          <div className="rounded-[2.25rem] bg-white/80 p-4 shadow-xl shadow-slate-400/20 backdrop-blur-xl">
            <img
              src={featureGrid}
              alt="Feature tiles"
              className="w-full rounded-2xl shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
