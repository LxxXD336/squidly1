// src/Subpages/AboutPage/MissionImpactSection.tsx
import React from "react";

/**
 * 你可以把下面的 URLs 换成本地导入的图片：
 * import img1 from "../../Photo/xxx.png"; 然后用 src={img1}
 */
const DEFAULT_IMG_1 =
  "https://source.unsplash.com/1600x900/?wheelchair,care";
const DEFAULT_IMG_2 =
  "https://source.unsplash.com/1600x900/?rehabilitation,clinic";

type Props = {
  img1?: string;
  img2?: string;
};

const MissionImpactSection: React.FC<Props> = ({
  img1 = DEFAULT_IMG_1,
  img2 = DEFAULT_IMG_2,
}) => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* 顶部柔光 + 底部雾化背景 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
        <div
          className="absolute left-1/2 top-8 h-[900px] w-[1400px] -translate-x-1/2 blur-3xl opacity-90"
          style={{
            background:
              "radial-gradient(60% 55% at 55% 30%, rgba(168,85,247,0.18), rgba(251,191,36,0.16) 38%, rgba(255,255,255,0) 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* 标题 */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Our Mission and Impact
        </h2>

        {/* 行 1：左文右图 */}
        <div className="mt-10 grid gap-8 md:gap-12 md:grid-cols-2 items-center">
          <p className="text-lg leading-7 text-slate-800 max-w-xl">
            Squidly helps people stay connected so they can get more done
            together. Access to communication is a human right, and our mission
            is to remove every barrier that prevents it.
          </p>
          <div className="justify-self-end w-full max-w-[560px]">
            <div className="overflow-hidden rounded-[22px] shadow-[0_16px_48px_rgba(16,24,40,0.18)] ring-1 ring-black/10">
              <img
                src={img1}
                alt="Care at home"
                className="block w-full h-[280px] md:h-[300px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* 行 2：左图右文（交错） */}
        <div className="mt-10 grid gap-8 md:gap-12 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1 w-full max-w-[560px]">
            <div className="overflow-hidden rounded-[22px] shadow-[0_16px_48px_rgba(16,24,40,0.18)] ring-1 ring-black/10">
              <img
                src={img2}
                alt="Clinic or classroom"
                className="block w-full h-[280px] md:h-[300px] object-cover"
              />
            </div>
          </div>
          <p className="order-1 md:order-2 text-lg leading-7 text-slate-800 max-w-xl">
            From the clinic to the classroom, from research institutions to the
            comfort of home, we help users express themselves, collaborate with
            confidence, and build relationships that matter.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionImpactSection;
