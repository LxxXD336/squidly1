// src/components/accessibility/features/readAloudAPI.ts
const EVT = "acc:readaloud:setrate";
const LS = "acc:readaloud:rate";

/** 读取当前语速（默认 1.0；范围 0.5–3.0） */
export function getReadAloudRate(): number {
    if (typeof window === "undefined") return 1;
    const v = parseFloat(localStorage.getItem(LS) || "1");
    if (Number.isNaN(v)) return 1;
    return Math.min(3, Math.max(0.5, v));
}

/** 设置朗读语速（0.5–3.0），并广播给所有监听组件 */
export function setReadAloudRate(rate: number): void {
    if (typeof window === "undefined") return;
    const r = Math.min(3, Math.max(0.5, rate));
    try { localStorage.setItem(LS, String(r)); } catch {}
    window.dispatchEvent(new CustomEvent(EVT, { detail: { rate: r } }));
}

/** 事件名（如你想手动监听） */
export const READ_ALOUD_RATE_EVENT = EVT;
