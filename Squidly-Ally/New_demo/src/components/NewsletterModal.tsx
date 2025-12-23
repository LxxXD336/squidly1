// src/components/NewsletterModal.tsx
import React, { useEffect, useRef, useState } from "react";
import brandMark from "../Photo/logo.svg";
import brandWordmark from "../Photo/logo-text.svg";

type Props = {
  delayMs?: number;        // 首次进入后延迟弹出
  coolOffDays?: number;    // 关闭/订阅后冷却天数；想每次刷新都弹 -> 传 0
  storageKey?: string;     // localStorage 键名
};

export default function NewsletterModal({
  delayMs = 600,
  coolOffDays = 0,
  storageKey = "sq_newsletter_dismissed_at",
}: Props) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const firstFocusable = useRef<HTMLInputElement | HTMLButtonElement | null>(null);
  const lastActive = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // 入口：不在冷却期就弹
  useEffect(() => {
    const ts = Number(localStorage.getItem(storageKey) || 0);
    const msSince = Date.now() - ts;
    const withinCoolOff = ts && msSince < coolOffDays * 24 * 60 * 60 * 1000;
    if (!withinCoolOff) {
      timerRef.current = window.setTimeout(() => {
        lastActive.current = document.activeElement as HTMLElement;
        setOpen(true);
        setTimeout(() => firstFocusable.current?.focus(), 50);
      }, delayMs);
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [delayMs, coolOffDays, storageKey]);

  const close = () => {
    setOpen(false);
    localStorage.setItem(storageKey, String(Date.now()));
    lastActive.current?.focus?.();
  };

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 提交（你可替换为实际 API）
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get("email") || "").toString().trim();
    if (!email) return;
    setSubmitted(true);
    localStorage.setItem(storageKey, String(Date.now()));
    setTimeout(close, 1400);
  };

  const onBackdropMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <>
      {/* 站点一致的按钮样式 */}
      <style>{`
        .cta-solid{
          background-image: linear-gradient(180deg, #7C6BFF 0%, #6F57FF 100%);
          color:#fff; border-radius:999px; padding:1rem 1.6rem;
          box-shadow: inset 0 -4px 0 rgba(0,0,0,.15), 0 12px 26px rgba(111,87,255,.32);
          border:2px solid rgba(187,170,255,.55); transition:.15s ease; font-weight:800;
        }
        .cta-solid:hover{ transform: translateY(-1px); filter:saturate(1.06); }
        .cta-solid:active{ transform: translateY(1px) }

        .cta-outline{
          border-radius:999px; padding:1rem 1.6rem; color:#0f172a; background:transparent;
          box-shadow: inset 0 0 0 2px rgba(15,23,42,.85), inset 0 0 0 6px rgba(255,255,255,.95);
          transition:.15s ease; font-weight:800;
        }
        .cta-outline:hover{ background:rgba(15,23,42,.04); transform: translateY(-1px) }
        .cta-outline:active{ transform: translateY(1px) }

        /* 顶部 Logo 动效：图标轻微漂浮，增加存在感 */
        .brand-float{ animation: brand-float 3.6s ease-in-out infinite; transform-origin:50% 50%; }
        @keyframes brand-float{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-4px)} }
      `}</style>

      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nl-title"
          onMouseDown={onBackdropMouseDown}
        >
          {/* 放大 + 纯白 + 更醒目投影 */}
          <div
            className="mx-4 w-full max-w-3xl md:max-w-4xl rounded-3xl bg-white p-10 md:p-12 shadow-[0_22px_60px_rgba(17,24,39,0.16)] ring-1 ring-slate-900/10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* 顶部品牌区：图标 + 文字标 */}
            <div className="mb-6 flex items-center justify-start gap-4 md:gap-5">
              <img src={brandMark} alt="Squidly logo" className="brand-float h-12 w-12 md:h-14 md:w-14" />
              <img src={brandWordmark} alt="Squidly" className="h-8 md:h-9" />
            </div>

            {/* 标题 & 文案（更大更粗） */}
            <h3 id="nl-title" className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 text-center">
              Get product updates & tips
            </h3>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-600 text-center max-w-2xl mx-auto">
              Join our mailing list for release notes, pro shortcuts, and early access invites.
            </p>

            {/* 表单区域 */}
            <form onSubmit={onSubmit} className="mx-auto mt-7 max-w-2xl">
              <label htmlFor="nl-email" className="sr-only">Email</label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  id="nl-email"
                  name="email"
                  ref={firstFocusable as any}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-base text-slate-900 placeholder-slate-400 shadow-inner outline-none focus:border-violet-400"
                />
                <button type="submit" className="cta-solid sm:ml-1">
                  Subscribe
                </button>
              </div>

              {submitted ? (
                <p className="mt-3 text-sm font-semibold text-violet-700 text-center">Thanks! You’re subscribed 🎉</p>
              ) : (
                <p className="mt-3 text-xs text-slate-500 text-center">
                  By subscribing you agree to our{" "}
                  <a href="#privacy" className="font-semibold text-violet-700 hover:text-violet-800 underline underline-offset-2">
                    Privacy Policy
                  </a>.
                </p>
              )}
            </form>

            {/* 操作区 */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button type="button" className="cta-outline" onClick={close}>
                No thanks
              </button>
              <button
                type="button"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
                onClick={close}
                aria-label="Close dialog"
                title="Close (ESC)"
              >
                ESC
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
