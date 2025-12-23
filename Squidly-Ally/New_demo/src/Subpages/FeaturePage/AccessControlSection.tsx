import React, { useRef } from "react";
import eyeGazeImg from "../../Photo/eyegaze.png";

const CARDS = [
  {
    title: "Precise Eye-Gaze Tracking",
    description:
      "Join and control calls using just your eyes — no extra software or hardware required.",
    imageAlt: "Eye gaze tracking",
    imageSrc: eyeGazeImg,
  },
  {
    title: "Zero-Touch Calibration",
    description:
      "Get started instantly with fast, guided calibration that requires no complex setup.",
    imageAlt: "Zero touch calibration",
    imageSrc: eyeGazeImg,
  },
  {
    title: "Switch Access Ready",
    description:
      "Navigate independently using adaptive switch-scanning controls.",
    imageAlt: "Switch access ready",
    imageSrc: eyeGazeImg,
  },
  {
    title: "Enhanced Low-Vision Modes",
    description:
      "Start using Squidly instantly with fast, guided calibration and no complex setup.",
    imageAlt: "Enhanced low vision modes",
    imageSrc: eyeGazeImg,
  },
];

export const AccessControlSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = track.scrollLeft;
    track.classList.add("cursor-grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - startX.current;
    track.scrollLeft = scrollStart.current - dx;
  };

  const stopDragging = () => {
    isDragging.current = false;
    trackRef.current?.classList.remove("cursor-grabbing");
  };

  return (
    <section className="relative w-full bg-white py-36">
      {/* 顶部白色渐变（和上一节自然衔接） */}
      <div
        className="
          pointer-events-none
          absolute top-0 left-0 right-0
          h-36
          bg-gradient-to-b
          from-white
          via-white/80
          to-white/0
          z-0
        "
      />

      {/* 底部白色渐变（和下一节自然衔接） */}
      <div
        className="
          pointer-events-none
          absolute bottom-0 left-0 right-0
          h-24
          bg-gradient-to-t
          from-white
          via-white/80
          to-white/0
          z-0
        "
      />

      <div className="relative z-10">
        <h2 className="mb-28 text-center text-4xl font-semibold text-slate-900">
          Access and Control
        </h2>

        <div
          ref={trackRef}
          className="
            flex cursor-grab gap-10 overflow-x-auto
            px-4 sm:px-10 lg:px-20
            pb-10 select-none
            scrollbar-hide
          "
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={stopDragging}
          onMouseUp={stopDragging}
        >
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="
                flex flex-shrink-0 flex-col
                rounded-3xl bg-[#f7f7f9]
                px-10 pt-12 pb-14
                min-h-[440px]
                shadow-[0_18px_40px_rgba(15,23,42,0.13)]
                min-w-[260px] sm:min-w-[340px] md:min-w-[420px] lg:min-w-[520px]
                transform transition-all duration-300 ease-out
                hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(15,23,42,0.22)]
              "
            >
              <div className="mb-8 flex justify-center">
                <img
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  className="h-[210px] w-full max-w-[380px] rounded-2xl object-cover"
                />
              </div>

              <h3 className="mb-4 text-xl md:text-2xl font-semibold text-slate-900">
                {card.title}
              </h3>

              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                {card.description}
              </p>

              {/* 让底部空间更稳（即使文字少也不会显得塌） */}
              <div className="mt-auto" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
