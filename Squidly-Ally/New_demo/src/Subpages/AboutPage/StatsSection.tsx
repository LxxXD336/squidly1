// src/Subpages/AboutPage/StatsSection.tsx
import React from "react";

const accent = "var(--acc-accent, #8b5cf6)";

const StatsSection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* 外层容器：用于承载卡片下的柔和投影 */}
        <div className="relative">
          {/* 柔和的淡紫投影（不抢眼、离卡片有距离） */}
          <div
            aria-hidden
            className="absolute inset-x-6 md:inset-x-10 -bottom-6 h-16 rounded-[28px] blur-2xl"
            style={{ background: "rgba(139,92,246,0.18)" }}
          />

          {/* 主卡片 */}
          <div className="relative rounded-[24px] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.06)] ring-1 ring-black/5">
            {/* 内阴影描边（更接近参考图的质感） */}
            <div className="absolute inset-0 rounded-[24px] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.9)] pointer-events-none" />

            <div className="grid gap-10 px-8 py-10 md:px-12 md:py-12 lg:grid-cols-3">
              {/* 1 */}
              <div>
                <h3
                  className="text-4xl md:text-5xl font-extrabold tracking-tight"
                  style={{ color: accent }}
                >
                  2.5 Million
                </h3>
                <p
                  className="mt-4 text-xl leading-8"
                  style={{ color: "color-mix(in oklab, " + accent + " 75%, #000 0%)" }}
                >
                  people need one
                  <br /> or more assistive
                  <br /> products
                </p>
              </div>

              {/* 2 */}
              <div>
                <h3
                  className="text-4xl md:text-5xl font-extrabold tracking-tight"
                  style={{ color: accent }}
                >
                  1 Billion
                </h3>
                <p
                  className="mt-4 text-xl leading-8"
                  style={{ color: "color-mix(in oklab, " + accent + " 75%, #000 0%)" }}
                >
                  people globally lack
                  <br /> access to assistive
                  <br /> technology
                </p>
              </div>

              {/* 3 */}
              <div>
                <h3
                  className="text-4xl md:text-5xl font-extrabold tracking-tight"
                  style={{ color: accent }}
                >
                  3%
                </h3>
                <p
                  className="mt-4 text-xl leading-8"
                  style={{ color: "color-mix(in oklab, " + accent + " 75%, #000 0%)" }}
                >
                  of the Internet is
                  <br /> fully accessible
                  <br /> to people with
                  <br /> disabilities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
