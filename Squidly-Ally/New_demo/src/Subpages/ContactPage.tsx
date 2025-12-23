// src/pages/ContactPage.tsx
import React, { useState } from "react";

type FormState = {
  name: string; email: string; jobTitle: string; users: string; company: string; message: string;
};

const INIT: FormState = { name: "", email: "", jobTitle: "", users: "", company: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INIT);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);
  const [contactMode, setContactMode] = useState<"email" | "phone">("email");
  
  const yellowBlobs = `
    radial-gradient(800px 800px at 16% 70%, rgba(221,193,152,.8) 0, rgba(221,193,152,.6) 28%, transparent 64%),
    radial-gradient(800px 800px at 84% 30%, rgba(221,193,152,.8) 0, rgba(221,193,152,.5) 28%, transparent 64%)
  `;
  const purpleBlob = `
    radial-gradient(720px 2500px at 50% 45%, rgba(135,92,255,.42) 0, rgba(135,92,255,.30) 24%, rgba(135,92,255,.14) 40%, rgba(135,92,255,.06) 55%, transparent 65%)
  `;

  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setSending(true); setSent(null);
    try { await new Promise((r) => setTimeout(r, 800)); setSent("ok"); setForm(INIT); }
    catch { setSent("err"); } finally { setSending(false); }
  }

  return (
    <div className="relative min-h-screen text-slate-900">
      {/* 背景层 */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: yellowBlobs, backgroundColor: "white" }} />
      <div className="absolute inset-0 z-0" style={{ backgroundImage: purpleBlob }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-80 bg-gradient-to-b from-white via-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-56 bg-gradient-to-b from-transparent to-white" />

      {/* 内容 */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <div className="min-h-[82vh] flex items-center py-10 md:py-16">
          <div className="grid w-full md:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-12 md:gap-16 items-start">
            {/* 左侧介绍 */}
            <div className="space-y-6 pt-4">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Contact our team</h1>
              <p className="text-slate-600 leading-relaxed max-w-xl text-lg">
                Together, we can create accessibility for all
              </p>

              {/* Email + Phone */}
              <div className="mt-10 space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M4 6h16v12H4z" stroke="#8b5cf6" strokeWidth="1.6" />
                      <path d="m4 7 8 6 8-6" stroke="#8b5cf6" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-sm text-slate-500">Email</div>
                    <a href="mailto:contact@squidly.com.au" className="font-medium hover:underline text-lg">
                      contact@squidly.com.au
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                    {/* 单色电话图标 */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.18 2 2 0 0 1 4.11 1h2a2 2 0 0 1 2 1.72c.14 1.05.39 2.07.74 3.06a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l2-1.31a2 2 0 0 1 2.11-.45c.99.35 2.01.6 3.06.74A2 2 0 0 1 22 16.92Z" stroke="#8b5cf6" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-sm text-slate-500">Phone</div>
                    <a href="tel:+61406741714" className="font-medium hover:underline text-lg">
                      +61 406 741 714
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧表单卡片 */}
            <div className="relative">
              {/* ① 贴边深阴影（边缘最深） */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-[26px]
                          shadow-[0_0_0_8px_rgba(17,24,39,.22)]
                          blur-[8px] opacity-95"
              />

              {/* ② 外扩柔阴影（过渡到很淡） */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 rounded-[28px]
                          shadow-[0_0_0_22px_rgba(17,24,39,.06)]
                          blur-[18px] opacity-95"
              />

              {/* ③ 底部地影（小、软，别喧宾夺主） */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-6
                          h-[84px] w-[86%] rounded-[999px]
                          bg-[radial-gradient(closest-side,rgba(17,24,39,0.16),rgba(17,24,39,0.08),transparent_72%)]
                          blur-[16px]"
              />
              {/* 渐变细边（1px） */}
              <div className="rounded-[28px] p-[1px] bg-gradient-to-b from-white/60 via-slate-200/60 to-white/20">
                <form
                  onSubmit={onSubmit}
                  className="force-text-scale relative rounded-[26px] bg-white
                             shadow-[0_30px_90px_-35px_rgba(2,6,23,.45),_0_18px_40px_-24px_rgba(2,6,23,.22)]
                             p-6 md:p-8"
                >
                  {/* 内侧高光（细腻的立体感） */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[26px]
                               shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                  />

                  {/* 表单字段 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                    <Field label="Name">
                      <input
                        required
                        placeholder="Jaden Smith"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Job title">
                      <input
                        placeholder="Job title"
                        value={form.jobTitle}
                        onChange={(e) => onChange("jobTitle", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Email" hint="number">
                      <input
                        required
                        type="email"
                        placeholder="Example@gmail"
                        value={form.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Company name">
                      <input
                        placeholder="Company name"
                        value={form.company}
                        onChange={(e) => onChange("company", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Number of users">
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Number"
                        value={form.users}
                        onChange={(e) => onChange("users", e.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <div className="hidden md:block" />

                    <div className="md:col-span-2">
                      <Field label="Message">
                        <textarea
                          placeholder="Type your message"
                          rows={5}
                          value={form.message}
                          onChange={(e) => onChange("message", e.target.value)}
                          className={inputCls + " resize-y h-36"}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-6 relative">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full rounded-full h-12 text-base font-semibold text-white bg-purple-500 hover:bg-purple-500/90 active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </button>

                    {sent === "ok" && (
                      <p className="mt-3 text-sm text-green-600">Message sent. We’ll get back to you soon.</p>
                    )}
                    {sent === "err" && (
                      <p className="mt-3 text-sm text-rose-600">Send failed. Please try again.</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
            {/* —— 表单卡片结束 —— */}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- 小组件 ---------- */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700 mb-1">
        <span>{label}</span>
        {hint && <span className="text-slate-400 text-xs">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

/* 输入框样式 */
const inputCls =
  "w-full h-12 rounded-xl border border-slate-200 bg-slate-50/90 text-base " +
  "placeholder:text-slate-400 px-3 outline-none " +
  "focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-300/60 " +
  "transition";
