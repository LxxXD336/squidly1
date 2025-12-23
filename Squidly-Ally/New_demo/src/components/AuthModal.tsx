// src/components/AuthModal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type AuthMode = "signin" | "signup";
type Provider = "google" | "instagram";
type IdentityKind = "email" | "phone";

export type AuthModalProps = {
  isOpen?: boolean;                 // 受控开关（可选）
  defaultOpen?: boolean;            // 非受控初始开
  defaultMode?: AuthMode;           // 初始模式
  onClose?: () => void;             // 关闭回调
  onEmailOrPhoneSubmit?: (p: {
    mode: AuthMode;
    identityKind: IdentityKind;
    email?: string;
    phone?: string;
    password?: string;
    name?: string;                  // signup 时可用
  }) => void;
  onSocialLogin?: (provider: Provider, mode: AuthMode) => void; // 第三方登录回调（自己接 OAuth）
  // 是否允许从 URL #auth 触发（默认 true）
  enableHashTrigger?: boolean;
};

export function AuthLink({
  mode = "signin",
  children,
  className = "",
}: {
  mode?: AuthMode;
  children: React.ReactNode;
  className?: string;
}) {
  const href = `#auth?mode=${mode}`;
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function readHash(): { open: boolean; mode: AuthMode | null } {
  if (typeof window === "undefined") return { open: false, mode: null };
  const h = window.location.hash;
  if (!h.startsWith("#auth")) return { open: false, mode: null };
  const qIndex = h.indexOf("?");
  let mode: AuthMode | null = null;
  if (qIndex >= 0) {
    const sp = new URLSearchParams(h.slice(qIndex + 1));
    const m = sp.get("mode");
    if (m === "signin" || m === "signup") mode = m;
  }
  return { open: true, mode };
}

export default function AuthModal({
  isOpen,
  defaultOpen = false,
  defaultMode = "signin",
  onClose,
  onEmailOrPhoneSubmit,
  onSocialLogin,
  enableHashTrigger = true,
}: AuthModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = typeof isOpen === "boolean";
  const open = controlled ? (isOpen as boolean) : internalOpen;

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [identityKind, setIdentityKind] = useState<IdentityKind>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // —— 由 URL #auth 触发弹窗 —— //
  useEffect(() => {
    if (!enableHashTrigger) return;
    const boot = () => {
      const { open, mode } = readHash();
      if (open) {
        !controlled && setInternalOpen(true);
        if (mode) setMode(mode);
      }
    };
    boot();
    const onHash = () => boot();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [controlled, enableHashTrigger]);

  const close = () => {
    if (!controlled) setInternalOpen(false);
    onClose?.();
    // 若是 hash 触发，关闭时清掉 hash
    if (typeof window !== "undefined" && window.location.hash.startsWith("#auth")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  // a11y: 焦点锁定到弹窗
  const firstFocusable = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => firstFocusable.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  const canSubmit =
    identityKind === "email"
      ? !!email && !!pwd && (mode === "signin" || !!name || true)
      : !!phone && !!pwd && (mode === "signin" || !!name || true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onEmailOrPhoneSubmit?.({
      mode,
      identityKind,
      email: identityKind === "email" ? email.trim() : undefined,
      phone: identityKind === "phone" ? phone.trim() : undefined,
      password: pwd,
      name: mode === "signup" ? name.trim() : undefined,
    });
  };

  // 蒙层 + 模态
  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      className="fixed inset-0 z-[999] flex items-center justify-center"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={close}
      />
      {/* 弹窗 */}
      <div className="relative z-10 w-[92vw] max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
        {/* 头部切换 */}
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            <button
              ref={firstFocusable}
              onClick={() => setMode("signin")}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                mode === "signin" ? "bg-white shadow ring-1 ring-black/10" : "text-slate-600"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                mode === "signup" ? "bg-white shadow ring-1 ring-black/10" : "text-slate-600"
              }`}
            >
              Sign up
            </button>
          </div>
          <button
            onClick={close}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 标题 */}
        <div className="px-6">
          <h2 id="auth-title" className="mt-3 text-2xl font-bold text-slate-900">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "signin"
              ? "Sign in with email/phone, or continue with Google / Instagram."
              : "Sign up using email or phone, or continue with Google / Instagram."}
          </p>
        </div>

        {/* Social 登录 */}
        <div className="px-6 mt-5 flex gap-3">
          <button
            onClick={() => onSocialLogin?.("google", mode)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="" className="h-4 w-4" />
            Continue with Google
          </button>
          <button
            onClick={() => onSocialLogin?.("instagram", mode)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"/></svg>
            Continue with Instagram
          </button>
        </div>

        {/* 分割符 */}
        <div className="px-6 mt-4">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            or use email / phone
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </div>

        {/* 表单 */}
        <form className="px-6 py-5 space-y-3" onSubmit={submit}>
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Alex Smith"
                autoComplete="name"
              />
            </div>
          )}

          {/* identity kind tabs */}
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setIdentityKind("email")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                identityKind === "email" ? "bg-white shadow ring-1 ring-black/10" : "text-slate-600"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setIdentityKind("phone")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                identityKind === "phone" ? "bg-white shadow ring-1 ring-black/10" : "text-slate-600"
              }`}
            >
              Phone
            </button>
          </div>

          {identityKind === "email" ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="you@example.com"
                autoComplete={mode === "signin" ? "email" : "new-email"}
                required
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="+61 4xx xxx xxx"
                autoComplete="tel"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <div className="flex items-stretch gap-2">
              <input
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                placeholder={mode === "signin" ? "Your password" : "Create a password"}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="shrink-0 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-white font-semibold shadow-lg shadow-violet-600/20 disabled:opacity-60"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>

          {mode === "signin" && (
            <div className="text-right text-sm">
              <a href="#reset" className="text-slate-500 hover:text-slate-700 underline-offset-2 hover:underline">
                Forgot password?
              </a>
            </div>
          )}
        </form>

        {/* 底部条款 */}
        <div className="px-6 pb-6">
          <p className="text-xs text-slate-500">
            By continuing you agree to our{" "}
            <a href="/terms" className="underline hover:text-slate-700">Terms</a> and{" "}
            <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
