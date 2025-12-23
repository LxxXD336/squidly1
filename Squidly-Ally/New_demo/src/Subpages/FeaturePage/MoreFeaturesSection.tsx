import React, { useState } from "react";

type Feature = {
  title: string;
  description: string;
  imageSrc: string;
};

const FEATURES: Feature[] = [
  {
    title: "AI Text-to-Speech",
    description:
      "Natural, clear and personalised voice models give every user a voice.",
    imageSrc: "https://via.placeholder.com/500x300?text=Feature+1",
  },
  {
    title: "Customisable Communication Boards",
    description:
      "Personalise boards, create quizzes and tailor content for immediate, accessible interactions.",
    imageSrc: "https://via.placeholder.com/500x300?text=Feature+2",
  },
  {
    title: "Integrated ACC Tools",
    description:
      "Use built-in symbol boards, quizzes, and tools for guided communication.",
    imageSrc: "https://via.placeholder.com/500x300?text=Feature+3",
  },
  {
    title: "Smart Session Reports",
    description:
      "Automated session summaries and visual insights showing progress and engagement.",
    imageSrc: "https://via.placeholder.com/500x300?text=Feature+4",
  },
  {
    title: "Simplified Navigation Layout",
    description:
      "Streamlined navigation designed to reduce cognitive load and keep focus on communication.",
    imageSrc: "https://via.placeholder.com/500x300?text=Feature+5",
  },
];

export const MoreFeaturesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section className="w-full bg-white py-24">
      <h2 className="mb-16 text-center text-4xl font-bold text-slate-900">
        More Features to Explore.
      </h2>

      {/* 轮播容器 */}
      <div className="relative mx-auto h-[430px] max-w-full">
        {FEATURES.map((feature, index) => {
          const diff = index - activeIndex;

          // 卡片之间的距离（越大越分散）
          const translateX = diff * 420;

          // 中间卡片放大
          const scale = diff === 0 ? 1.12 : 0.85;

          // 透明度
          const opacity = Math.abs(diff) > 2 ? 0 : diff === 0 ? 1 : 0.7;

          const zIndex = 30 - Math.abs(diff) * 3;

          return (
            <article
              key={feature.title}
              className="
                absolute left-1/2 top-1/2
                flex h-[350px] w-[380px] flex-col
                rounded-3xl bg-white
                p-6 shadow-xl md:h-[380px] md:w-[420px]
                transition-all duration-500 ease-out
              "
              style={{
                transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
              }}
            >
              {/* 图片 */}
              <img
                src={feature.imageSrc}
                alt={feature.title}
                className="mb-4 h-[200px] w-full rounded-2xl object-cover"
              />

              {/* 标题 + 描述 */}
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>

      {/* 圆点导航 */}
      <div className="mt-10 flex justify-center gap-3">
        {FEATURES.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                isActive ? "w-7 bg-slate-900" : "w-3 bg-slate-400/40"
              }`}
            ></button>
          );
        })}
      </div>
    </section>
  );
};
