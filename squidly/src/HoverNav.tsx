// HoverNav.tsx
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HoverNav() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const openNow = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 90);
  };

  const linkBase =
    "rounded px-1.5 md:px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";
  const linkText = "text-zinc-700/90 dark:text-zinc-100";
  // 悬停时给文字一点颜色（渐变）
  const linkHover =
    "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-600 hover:via-fuchsia-500 hover:to-sky-500";

  return (
    <div
      className="fixed top-6 left-6 z-50"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocusCapture={openNow}
      onBlurCapture={closeSoon}
    >
      <div className="relative">
        {/* 放大的 Logo 按钮 */}
        <motion.button
          aria-expanded={open}
          aria-controls="hover-nav"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={[
            "flex h-14 w-14 items-center justify-center rounded-2xl", // ✅ bigger
            "border border-zinc-200/70 bg-white/85 backdrop-blur",
            "shadow-lg hover:shadow-xl",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
            "dark:bg-zinc-900/70 dark:border-white/10",
          ].join(" ")}
        >
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </motion.button>

        {/* 展开的导航条（更长、更高、文字更大） */}
        <AnimatePresence>
          {open && (
            <motion.nav
              id="hover-nav"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 18 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.6 }}
              className="absolute left-16 top-1/2 -translate-y-1/2"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                exit={{ width: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="overflow-hidden"
              >
                <div
                  className={[
                    "flex items-center gap-6 rounded-3xl", // ✅ 更圆润
                    "border border-zinc-200 bg-white/90 px-6 py-3.5 pr-7", // ✅ 更宽更高
                    "min-w-[400px]", // ✅ 看起来更“长”
                    "backdrop-blur-xl shadow-2xl",
                    "dark:bg-zinc-900/85 dark:border-white/10",
                  ].join(" ")}
                >
                  {/* 品牌文字加一点颜色（渐变） */}
                  <span className="hidden sm:inline-block text-[15px] md:text-[16px] font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent pr-1">
                    Squidly
                  </span>

                  <ul className="flex items-center gap-6 text-[15px] md:text-base font-medium">
                    <li>
                      <a href="#features" className={`${linkBase} ${linkText} ${linkHover}`}>
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#pricing" className={`${linkBase} ${linkText} ${linkHover}`}>
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#contact" className={`${linkBase} ${linkText} ${linkHover}`}>
                        Contact&nbsp;Us
                      </a>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
