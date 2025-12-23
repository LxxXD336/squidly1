export const SCALE_STEPS = [100, 112, 125, 150, 175, 200, 225, 250] as const;
export type TextScale = typeof SCALE_STEPS[number];

export type ContrastStyle =
  | "standard"
  | "photophobia"
  | "migraine_soft"
  | "cvi_high"
  | "mtbi_boost";

export type AccState = {
  colorSafe: boolean;
  highContrast: boolean;
  contrastStyle: ContrastStyle;
  grayscale: boolean;

  dyslexia: boolean;
  underlineLinks: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  textScale: TextScale;
  pageZoom: boolean;

  magnifier: boolean;
  magScale: number;

  pauseMotion: boolean;
  keyboardAssist: boolean;

  altTooltip: boolean;
  describeOnHover: boolean;
};

export const DEFAULT_STATE: AccState = {
  colorSafe: false,
  highContrast: false,
  contrastStyle: "standard",
  grayscale: false,

  dyslexia: false,
  underlineLinks: false,
  highlightLinks: false,
  readableFont: false,
  textScale: 100,
  pageZoom: false,

  magnifier: false,
  magScale: 1.8,

  pauseMotion: false,
  keyboardAssist: true,

  altTooltip: true,
  describeOnHover: false,
};

const LS_KEY = "squidly:accessibility";

export function loadState(): AccState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}
export function saveState(s: AccState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

export function ensureSkipLink() {
  if (document.getElementById("acc-skip")) return;
  const a = document.createElement("a");
  a.id = "acc-skip";
  a.href = "#main";
  a.textContent = "Skip to content";
  a.setAttribute("data-acc-ui", "");
  Object.assign(a.style, {
    position: "fixed",
    left: "12px",
    top: "12px",
    padding: "10px 14px",
    background: "white",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,.08)",
    transform: "translateY(-140%)",
    transition: "transform .25s ease",
    zIndex: "62",
  } as CSSStyleDeclaration);
  a.addEventListener("focus", () => (a.style.transform = "translateY(0)"));
  a.addEventListener("blur", () => (a.style.transform = "translateY(-140%)"));
  document.body.appendChild(a);
}

export function applyToHtml(s: AccState) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;

  // 记住初始根字号，避免重复叠乘
  const BASE_KEY = "data-acc-base-font";
  let base = Number(html.getAttribute(BASE_KEY));
  if (!base) {
    const computed = parseFloat(getComputedStyle(html).fontSize || "16");
    base = Number.isFinite(computed) && computed > 0 ? computed : 16;
    html.setAttribute(BASE_KEY, String(base));
  }

  // 你的 SCALE_STEPS 如果是百分数（100/112/125...），先换成倍数
  const scalePct = typeof s.textScale === "number" ? s.textScale : 100;
  const scale = scalePct / 100;  // 1, 1.12, 1.25...

  // 1) 用根字号驱动 rem（Tailwind 的 text-* 会随 rem 放大）
  html.style.fontSize = `calc(${base}px * ${scale})`;

  // 2) 写入变量，给“兜底 CSS”用
  html.style.setProperty("--acc-text-scale", String(scale));

  // 3) 某些浏览器对 px 文本也有轻微帮助
  // @ts-ignore
  html.style.textSizeAdjust = `calc(100% * ${scale})`;
  html.style.setProperty("-webkit-text-size-adjust", `calc(100% * ${scale})`);

  // 4) 当缩放 ≠ 1 时才打开“兜底放大”
  if (Math.abs(scale - 1) > 1e-3) {
    html.setAttribute("data-acc-enforce-text", "1");
  } else {
    html.removeAttribute("data-acc-enforce-text");
  }

  const cl = html.classList;

  // Reset zoom classes then apply
  ["100","112","125","150","175","200","225","250"].forEach(k => cl.remove("acc-zoom-"+k));
  cl.add(`acc-zoom-${s.textScale}`);

  // Page zoom (px text too)
  if (s.pageZoom) {
    cl.add("acc-page-zoom");
    html.style.setProperty("--acc-page-zoom", String(s.textScale / 100));
  } else {
    cl.remove("acc-page-zoom");
    html.style.removeProperty("--acc-page-zoom");
  }

  // Typography & links
  cl.toggle("acc-readable-font", s.readableFont);
  cl.toggle("acc-dyslexia", s.dyslexia);
  cl.toggle("acc-underline-links", s.underlineLinks);
  cl.toggle("acc-highlight-links", s.highlightLinks);

  // Magnifier
  cl.toggle("acc-magnifier", s.magnifier);
  html.style.setProperty("--acc-mag-scale", String(s.magScale));
  if (s.magnifier && s.pageZoom) cl.add("acc-magnifier-override");
  else cl.remove("acc-magnifier-override");

  // Keyboard focus + motion
  cl.toggle("acc-focus", s.keyboardAssist);
  cl.toggle("acc-reduce-motion", s.pauseMotion);

  // Alt audit
  cl.toggle("acc-alt-audit", s.altTooltip);

  // Filters
  const filters: string[] = [];
  if (s.colorSafe) filters.push("hue-rotate(18deg) saturate(0.95) contrast(1.05)");
  if (s.highContrast) {
    switch (s.contrastStyle) {
      case "photophobia":
        filters.push("sepia(0.12) hue-rotate(320deg) saturate(1.1) contrast(1.05)");
        break;
      case "migraine_soft":
        filters.push("contrast(0.92) brightness(1.02) saturate(0.95)");
        break;
      case "cvi_high":
        filters.push("invert(1) hue-rotate(180deg) contrast(1.15) saturate(1.1)");
        break;
      case "mtbi_boost":
        filters.push("contrast(1.18) saturate(1.05)");
        break;
      default:
        filters.push("contrast(1.1)");
    }
  }
  if (s.grayscale) filters.push("grayscale(1)");
  if (filters.length) {
    cl.add("acc-filter");
    html.style.setProperty("--acc-filter", filters.join(" "));
  } else {
    cl.remove("acc-filter");
    html.style.removeProperty("--acc-filter");
  }
}
