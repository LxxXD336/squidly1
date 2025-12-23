import React from "react";

export const PrivacySection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white py-24 md:py-28">
    {/* 背景光晕（上下都留白 + 光晕不会溢出到底部） */}
    <div className="pointer-events-none absolute inset-x-0 top-32 bottom-32 flex items-center justify-center">
      <div
        className="
          h-[min(520px,100%)]
          w-[min(900px,100%)]
          rounded-full
          bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.35),_rgba(251,191,36,0.18),_transparent_70%)]
          blur-3xl
        "
      />
    </div>


      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        {/* 标题 */}
        <h2 className="text-4xl font-semibold text-slate-900">
          Privacy Built-in
        </h2>
        <p className="mt-4 max-w-2xl text-base text-slate-700 leading-relaxed">
          Squidly meets strict Australian security and privacy standards,
          protecting every interaction and user session.
        </p>

        {/* 卡片区域 */}
        <div className="mt-16 flex w-full flex-col gap-8 md:flex-row md:justify-center md:gap-10">
          <GlassCard
            title="End-to-End Encryption"
            description="Secure video, audio and communication at every moment."
          />
          <GlassCard
            title="Australian Privacy Compliance"
            description="Fully aligned with Australian privacy regulations for safe, compliant use."
          />
        </div>
      </div>
    </section>
  );
};

const GlassCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div
      className="
      flex flex-col w-full md:w-[420px] min-h-[220px]
      rounded-[32px]
      bg-white/70 
      shadow-[0_8px_40px_rgba(0,0,0,0.12)]
      backdrop-blur-xl
      px-10 py-10
      text-left
      border border-white/50
    "
    >
      <h3 className="text-2xl font-semibold text-slate-900 leading-tight">
        {title}
      </h3>
      <p className="mt-4 text-base text-slate-700 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
