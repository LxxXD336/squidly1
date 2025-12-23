import React from "react";

/**
 * QuoteBillboard — 大字号“引用宣言”区块（JS 版）。
 * 本次更新：
 * - 使用方圆角样式的双引号字符 “ ”（系统字体会呈现圆角粗块形状）。
 * - 可调节引号位置：leftX/leftY/rightX/rightY 支持数字或 CSS 长度（px/%/rem）。
 * - 自动左右内边距，避免正文与引号重叠；引号层级更高。
 */
export default function QuoteBillboard({
                                           text =
                                           "Squidly opens up a whole new world of communication, learning, and connection for people with complex access needs.",
                                           tint = "#A78BFA",
                                           minTextPx = 22,
                                           maxTextPx = 64,
                                           minQuotePx = 56,
                                           maxQuotePx = 140,
                                           leftChar = "“",
                                           rightChar = "”",
                                           leftX = "0.5rem",
                                           leftY = "0.25rem",
                                           rightX = "0.5rem",
                                           rightY = "0.25rem",
                                           // 原有统一系数
                                           padFactor = 0.7,
                                           // 新增：左右独立系数（优先级高于 padFactor）
                                           padLeftFactor,
                                           padRightFactor,
                                           // 新增：直接覆盖左右 padding（长度字符串，如 '120px' / '10vw' / 'clamp(...)'，优先级最高）
                                           padLeft,
                                           padRight,
                                           className = "",
                                       }) {
    const leftPad =
        padLeft ||
        `clamp(${Math.round(minQuotePx * (padLeftFactor ?? padFactor))}px, 7.5vw, ${Math.round(
            maxQuotePx * (padLeftFactor ?? padFactor)
        )}px)`;
    const rightPad =
        padRight ||
        `clamp(${Math.round(minQuotePx * (padRightFactor ?? padFactor))}px, 7.5vw, ${Math.round(
            maxQuotePx * (padRightFactor ?? padFactor)
        )}px)`;

    const textStyle = {
        color: tint,
        fontSize: `clamp(${minTextPx}px, 5.2vw, ${maxTextPx}px)`,
        fontFamily:
            'SF Pro Rounded, ui-rounded, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        paddingLeft: leftPad,
        paddingRight: rightPad,
    };

    const quoteStyle = {
        color: tint,
        opacity: 0.5,
        fontSize: `clamp(${minQuotePx}px, 10vw, ${maxQuotePx}px)`,
        lineHeight: 1,
        fontWeight: 900,
        fontFamily:
            'SF Pro Rounded, ui-rounded, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    };

    const toOffset = (v) => (typeof v === "number" ? `${v}px` : v);

    return (
        <section className={`relative py-10 sm:py-12 lg:py-16 ${className}`} aria-label="Quote">
            <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
                {/* 开引号（左上，置于上层）*/}
                <span
                    aria-hidden
                    className="pointer-events-none select-none absolute font-black z-10"
                    style={{ ...quoteStyle, left: toOffset(leftX), top: toOffset(leftY) }}
                >
          {leftChar}
        </span>

                {/* 引用正文（居中）*/}
                <blockquote
                    className="relative z-0 text-center font-extrabold tracking-tight leading-tight sm:leading-tight"
                    style={textStyle}
                >
                    {text}
                </blockquote>

                {/* 收引号（右下，置于上层）*/}
                <span
                    aria-hidden
                    className="pointer-events-none select-none absolute font-black z-10"
                    style={{ ...quoteStyle, right: toOffset(rightX), bottom: toOffset(rightY) }}
                >
          {rightChar}
        </span>
            </div>
        </section>
    );
}
