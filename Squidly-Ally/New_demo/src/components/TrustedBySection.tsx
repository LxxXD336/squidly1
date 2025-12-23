// src/sections/home/TrustedBySection.tsx
import React from "react";

// ⬇️ 把图片放到 src/Photo/partners/ 下（或按你的项目路径替换）
import cpa   from '../Professionals_logos/cpa.png';
import usyd  from '../Professionals_logos/usyd.png';
import arata from '../Professionals_logos/arata.png';
import rmit from '../Professionals_logos/rmit.png';
import atsa  from '../Professionals_logos/atsa.png';

type Logo = {
  src: string;
  alt: string;
  title?: string;
};

const LOGOS: Logo[] = [
  { src: cpa, alt: "Cerebral Palsy Alliance", title: "Cerebral Palsy Alliance" },
  { src: usyd, alt: "The University of Sydney", title: "The University of Sydney" },
  { src: arata, alt: "ARATA", title: "ARATA" },
  { src: rmit, alt: "RMIT University", title: "RMIT University" },
  { src: atsa, alt: "ATSA", title: "ATSA" },
];

export default function TrustedBySection() {
  return (
    <section
      aria-labelledby="trusted-by-heading"
      className="relative w-full py-12 sm:py-14"
    >
      {/* 标题 */}
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2
          id="trusted-by-heading"
          className="text-[22px] font-semibold tracking-tight text-slate-700"
        >
          Trusted By Professionals
        </h2>
      </div>

      {/* LOGO 列表 */}
      <div className="mx-auto mt-7 max-w-6xl px-6">
        <ul
          className="
            grid place-items-center gap-x-10 gap-y-8
            [grid-template-columns:repeat(2,minmax(120px,1fr))]
            sm:[grid-template-columns:repeat(3,minmax(140px,1fr))]
            md:[grid-template-columns:repeat(5,minmax(140px,1fr))]
          "
        >
          {LOGOS.map((item, i) => (
            <li key={i} className="w-full flex items-center justify-center">
              <img
                src={item.src}
                alt={item.alt}
                title={item.title ?? item.alt}
                loading="lazy"
                className="
                  h-8 sm:h-10 md:h-12 lg:h-14
                  w-auto object-contain
                  opacity-70 hover:opacity-100 transition-opacity
                  grayscale hover:grayscale-0
                  drop-shadow-[0_0_1px_rgba(0,0,0,0.15)]
                "
                // 如果某些透明 png 需要反转色可加： dark:invert
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
