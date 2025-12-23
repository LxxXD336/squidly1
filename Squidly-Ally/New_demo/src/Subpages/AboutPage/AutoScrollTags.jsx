import React from "react";

/**
 * Auto-scrolling hashtag marquee like the screenshot.
 *
 * Props
 * - items: string[]  (text without the leading '#')
 * - duration: number (seconds per full loop)
 * - direction: 'left' | 'right'
 * - gap: Tailwind gap utility (e.g. 'gap-20')
 * - size: Tailwind font size utilities (e.g. 'text-5xl md:text-7xl')
 * - color: Tailwind color classes (e.g. 'text-neutral-400/80')
 * - weight: Tailwind font weight (e.g. 'font-semibold')
 * - className: extra classes for outer <section>
 */
export default function AutoScrollTags({
                                           items = [
                                               "Engineering",
                                               "Business Development",
                                               "Information technology",
                                               "Product Management",
                                               "Operations",
                                               "Research",
                                           ],
                                           duration = 30,
                                           direction = "left",
                                           gap = "gap-20",
                                           size = "text-5xl md:text-7xl",
                                           color = "text-neutral-400/80",
                                           weight = "font-semibold",
                                           className = "",
                                       }) {
    const row = (hidden) => (
        <ul
            aria-hidden={hidden ? "true" : undefined}
            className={`flex ${gap} items-center whitespace-nowrap pr-16`}
        >
            {items.map((t, i) => (
                <li key={`${hidden ? "b" : "a"}-${i}`} className={`${size} ${weight} ${color}`}>
                    #{t}
                </li>
            ))}
        </ul>
    );

    const reverse = direction === "right" ? "reverse" : "normal";

    return (
        <section className={`relative py-6 sm:py-8 ${className}`} aria-label="Scrolling hashtags">
            {/* Local scoped styles (unique class names prefixed with am-) */}
            <style>{`
        @keyframes am-marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .am-mask { 
          overflow: hidden; position: relative; 
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        .am-track { display: flex; width: max-content; will-change: transform; }
      `}</style>

            <div className="am-mask">
                <div
                    className="am-track"
                    style={{
                        animation: `am-marquee-x ${duration}s linear infinite`,
                        animationDirection: reverse,
                    }}
                >
                    {row(false)}
                    {row(true)}
                </div>
            </div>
        </section>
    );
}
