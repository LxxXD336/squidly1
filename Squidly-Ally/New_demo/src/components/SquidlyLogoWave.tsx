// src/components/SquidlyLogoWave.tsx
import React from "react";

type Props = {
  src: string;               // 你的 logo.svg 路径
  className?: string;        // 尺寸控制 e.g. "w-72"
  tentacleHeightPct?: number; // 触须区域高度占比（40~55比较自然）
  pulseScale?: number;       // 触须呼吸幅度（1.1~1.24）
  wiggleDeg?: number;        // 触须横向摆动角度（1~4deg）
  floatPx?: number;          // 身体上下浮动幅度
  floatMs?: number;          // 身体浮动周期
  breatheMs?: number;        // 触须呼吸周期
  waveScale?: number;        // 噪声位移强度（越大越“软”）
};

export default function SquidlyLogoWave({
  src,
  className = "",
  tentacleHeightPct = 46,
  pulseScale = 1.16,
  wiggleDeg = 2.2,
  floatPx = 8,
  floatMs = 3600,
  breatheMs = 2600,
  waveScale = 8,
}: Props) {
  const topY = 100 - tentacleHeightPct; // 触须区域的上边界（百分比）

  return (
    <div className={`inline-block ${className}`}>
      <style>{`
        /* 整体漂浮（带一点旋转） */
        .sq-float {
          animation: sq-float ${floatMs}ms cubic-bezier(.45,.02,.16,1) infinite;
          transform-origin: 50% 42%;
          filter: drop-shadow(0 12px 24px rgba(111,87,255,.25));
          will-change: transform;
        }
        @keyframes sq-float {
          0%   { transform: translateY(0) rotate(0deg); }
          50%  { transform: translateY(-${floatPx}px) rotate(-0.6deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* 触须呼吸 + 横向扭动（仅对底部区域生效） */
        .sq-tent { transform-origin: 50% 0%; will-change: transform; }
        .sq-tent.l { animation: tentPulse ${breatheMs}ms ease-in-out infinite 0ms,
                              tentWiggle ${breatheMs}ms ease-in-out infinite 0ms; }
        .sq-tent.m { animation: tentPulse ${breatheMs}ms ease-in-out infinite ${breatheMs*0.15}ms,
                              tentWiggle ${breatheMs}ms ease-in-out infinite ${breatheMs*0.15}ms; }
        .sq-tent.r { animation: tentPulse ${breatheMs}ms ease-in-out infinite ${breatheMs*0.30}ms,
                              tentWiggle ${breatheMs}ms ease-in-out infinite ${breatheMs*0.30}ms; }

        @keyframes tentPulse {
          0%,100% { transform: scaleY(1); }
          50%     { transform: scaleY(${pulseScale}); }
        }
        @keyframes tentWiggle {
          0%,100% { transform: skewX(0deg) translateX(0px); }
          50%     { transform: skewX(${wiggleDeg}deg) translateX(1.5px); }
        }

        /* 遮罩：使动画只影响下半部，越靠近末端越明显 */
        .sq-mask-fade { mask: url(#sq-mask-grad); }

        /* 减少动画时尊重系统设置 */
        @media (prefers-reduced-motion: reduce) {
          .sq-float, .sq-tent { animation: none !important; }
        }
      `}</style>

      <svg className="block h-auto w-full" viewBox="0 0 1000 1000" role="img" aria-label="Squidly">
        {/* 噪声位移（让触须更“软”） */}
        <defs>
          <filter id="sq-wave" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.09" numOctaves="2" seed="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="${waveScale}" xChannelSelector="R" yChannelSelector="G"/>
          </filter>

          {/* 只让底部区域参与动画，并且向上渐隐，减少对身体的影响 */}
          <linearGradient id="maskGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="${topY/100}" stopColor="#000" stopOpacity="0"/>
            <stop offset="${(topY+10)/100}" stopColor="#000" stopOpacity="0.2"/>
            <stop offset="1" stopColor="#000" stopOpacity="1"/>
          </linearGradient>
          <mask id="sq-mask-grad">
            <rect x="0" y="0" width="1000" height="1000" fill="url(#maskGrad)"/>
          </mask>

          {/* 三段裁剪（左/中/右） */}
          <clipPath id="clip-left"><rect x="0"   y="${(topY/100)*1000}" width="${0.34*1000}" height="${(tentacleHeightPct/100)*1000}"/></clipPath>
          <clipPath id="clip-mid"><rect  x="${0.33*1000}" y="${(topY/100)*1000}" width="${0.34*1000}" height="${(tentacleHeightPct/100)*1000}"/></clipPath>
          <clipPath id="clip-right"><rect x="${0.66*1000}" y="${(topY/100)*1000}" width="${0.34*1000}" height="${(tentacleHeightPct/100)*1000}"/></clipPath>
        </defs>

        <g className="sq-float">
          {/* 底层整张 logo（当做身体），不做变形 */}
          <image href={src} x="0" y="0" width="1000" height="1000" />

          {/* 左触须：裁剪+遮罩+位移滤镜+两段动画 */}
          <g className="sq-mask-fade">
            <g clipPath="url(#clip-left)" filter="url(#sq-wave)">
              <image href={src} x="0" y="0" width="1000" height="1000" className="sq-tent l" />
            </g>
            {/* 中触须 */}
            <g clipPath="url(#clip-mid)" filter="url(#sq-wave)">
              <image href={src} x="0" y="0" width="1000" height="1000" className="sq-tent m" />
            </g>
            {/* 右触须 */}
            <g clipPath="url(#clip-right)" filter="url(#sq-wave)">
              <image href={src} x="0" y="0" width="1000" height="1000" className="sq-tent r" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
