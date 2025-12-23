import React from "react";
import heroImg from "../../Photo/abouthero.png";

const HeroAbout: React.FC = () => {
  return (
    <section className="relative py-20 lg:py-28 overflow-x-clip">
      {/* 右侧贴边图片（absolute） */}
      <div className="pointer-events-none absolute inset-y-8 lg:inset-y-12 right-0 w-[min(56vw,980px)]">
        <div className="h-full overflow-hidden rounded-l-[80px] xl:rounded-l-[96px] rounded-r-none">
          <img src={heroImg} alt="About page hero" className="block h-full w-full object-cover" />
        </div>
      </div>

      {/* 内容容器：为右侧图片让出空间 */}
      <div className="mx-auto max-w-6xl px-6 lg:px-10 lg:pr-[min(56vw,980px)]">
        {/* 左列定宽，防止被“压缩” */}
        <div className="relative w-full lg:max-w-[52rem] xl:max-w-[56rem] lg:-ml-8 xl:-ml-12 2xl:-ml-16">
          {/* 柔和背景雾化（可保留/删除） */}
          <div
            aria-hidden
            className="absolute -inset-x-16 -top-24 -bottom-24 -z-10 blur-2xl opacity-80"
            style={{
              background:
                "radial-gradient(1200px 600px at 20% 40%, rgba(168,85,247,0.28), rgba(253,186,116,0.22) 35%, rgba(255,255,255,0) 70%)",
            }}
          />

          {/* 标题：第二行固定“every voice to” */}
          <h1
            className="text-balance text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--acc-accent, #7c4dff), #a78bfa, var(--acc-accent, #7c4dff))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              display: "inline-block",
            }}
          >
            Empowering
            <br />
            <span className="whitespace-nowrap">every&nbsp;voice&nbsp;to</span>
            <br />
            be heard.
          </h1>

          {/* 副标题：不设 max-w，行长自然 */}
          <p className="mt-8 text-2xl font-semibold text-slate-900 text-balance">
            Connection without barriers.
          </p>

          {/* 正文：彻底移除宽度上限；稍放大字号、放松行距 */}
          <p className="mt-5 text-[1.0625rem] md:text-lg leading-7 text-slate-600 max-w-none text-balance">
            Video communication designed to support dignity, autonomy, and meaningful interaction
            for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroAbout;
