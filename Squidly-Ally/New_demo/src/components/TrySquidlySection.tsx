import SquidlyLogoWave from "./SquidlyLogoWave";
import squidLogo from "../Photo/logo.svg"; // 路径按你的项目调整

export default function TrySquidlySection() {
  return (
    <section aria-label="Try Squidly" className="py-14 md:py-20">
      <style>{`
        .cta-solid{
          background-image: linear-gradient(180deg, #7C6BFF 0%, #6F57FF 100%);
          color:#fff; border-radius:999px; padding:.95rem 1.6rem;
          box-shadow: inset 0 -4px 0 rgba(0,0,0,.15), 0 10px 22px rgba(111,87,255,.30);
          border:2px solid rgba(187,170,255,.55); transition:.15s ease;
        }
        .cta-solid:hover{ transform: translateY(-1px); filter:saturate(1.05); }
        .cta-solid:active{ transform: translateY(1px) }

        .cta-outline{
          border-radius:999px; padding:.95rem 1.6rem; color:#0f172a; background:transparent;
          box-shadow: inset 0 0 0 2px rgba(15,23,42,.85), inset 0 0 0 6px rgba(255,255,255,.9);
          transition:.15s ease;
        }
        .cta-outline:hover{ background:rgba(15,23,42,.04); transform: translateY(-1px) }
        .cta-outline:active{ transform: translateY(1px) }
      `}</style>

      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
          {/* 左侧：标题 + 按钮 */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Try Squidly Now
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a href="#get-started" className="cta-solid text-lg font-semibold">
                Get started for free
              </a>
              <a href="#schedule" className="cta-outline text-lg font-semibold">
                Schedule a call
              </a>
            </div>
          </div>

          {/* 右侧：你的 logo 做出的“视频同款”动画 */}
          <div className="flex justify-end">
            <SquidlyLogoWave
            src={squidLogo}
            className="w-56 md:w-72 lg:w-80"
            tentacleHeightPct={46} // 提高=触须受影响的范围更高
            pulseScale={1.16}      // 触须呼吸幅度，视频更明显可到 1.2+
            wiggleDeg={2.2}        // 横向扭动角
            floatPx={8}            // 身体上下浮动幅度
            floatMs={3600}         // 漂浮周期
            breatheMs={2600}       // 呼吸周期（和视频节奏接近）
            waveScale={8}          // “软度”，调大更柔
            />
          </div>
        </div>
      </div>
    </section>
  );
}
