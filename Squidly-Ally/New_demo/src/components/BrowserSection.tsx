import { useState } from "react";
import {
    ChevronLeft, ChevronRight, RefreshCcw, Star, Globe, Lock,
    Eye, Settings as SettingsIcon, HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

/* ===================== 颜色与常量 ===================== */
const PURPLE = "#A087DD"; // 指定紫色
type UIMode = "Eye Gaze" | "Settings" | "Quiz";

/* ===================== 样式 ===================== */
function SectionStyles() {
    return (
        <style>{`
/* 整个 Section 背景：黑 → 紫 → 浅紫 → 浅橙 → 白；上下留白自适应 */
.sq-sec {
  position: relative;
  isolation: isolate;
  padding: clamp(84px, 12vw, 140px) 0 clamp(72px, 8vw, 112px);
  background:
    linear-gradient(
      180deg,
      #000000 0%,
      #2B2348 15%,
      #A995EE 38%,
      #E9E3FB 64%,
      #F7E9CC 88%,
      #FFFFFF 100%
    );
}

/* 页面容器 */
.sq-wrap { width: min(1000px, 92vw); margin: 0 auto; }

/* 头部内容容器（标题+副标题+chips 同宽对齐） */
.sq-head { max-width: 960px; }  /* <- 标题与 chips 左右边界一致 */

/* 标题区 */
.sq-title { color: #fff; }
.sq-title h2 {
  font-weight: 300;                 /* 合法的轻字重，保持你现在的纤细风格 */
  letter-spacing: -0.03em;
  line-height: 1.06;
  font-size: clamp(40px, 7vw, 64px);
}
.sq-title p  {
  margin-top: clamp(18px, 2.2vw, 28px);
  color: rgba(255,255,255,.95);
  font-weight: 400;
  font-size: clamp(18px, 2.2vw, 28px);
}

/* 软胶囊 Chip 行 */
.sq-chips {
  display:flex; align-items:center;
  gap: clamp(14px, 2vw, 20px);
  margin-top: clamp(22px, 3vw, 32px);
  flex-wrap: wrap;
}
.sq-chip {
  --ring: rgba(160,135,221,.35);
  display:inline-flex; align-items:center; gap:8px;
  height: 40px; padding: 0 16px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,.22);
  background: transparent; color: rgba(255,255,255,.95);
  font-weight: 600; transition: .18s ease;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18);
}
.sq-chip:hover { background: rgba(255,255,255,.08); }
.sq-chip svg { width:18px; height:18px; }
.sq-chip.is-active {
  background: #fff; color: ${PURPLE};
  border-color: transparent;
  box-shadow:
    0 10px 26px rgba(0,0,0,.18),
    0 0 0 1px rgba(255,255,255,.6) inset,
    0 0 0 6px var(--ring);
}

/* 浏览器壳（与容器左缘对齐） */
.wb-browser{
  width: min(1020px, 92vw);
  height: clamp(400px, 56vw, 600px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 46px rgba(17,24,39,.10), 0 2px 0 rgba(0,0,0,.03);
  position: relative; overflow: hidden;
  margin: clamp(28px, 4vw, 44px) 0 0 0;
}
.wb-top{
  height: 70px; background: linear-gradient(#fff,#FAFBFF);
  border-bottom: 1px solid rgba(17,24,39,.06);
  display:flex; align-items:center; gap:10px; padding:0 14px 0 18px;
}
.wb-traffic{ display:flex; gap:8px; margin-right:8px; }
.wb-dot{ width:12px; height:12px; border-radius:50%; }
.wb-dot.red{ background:#ff5f57; } .wb-dot.yellow{ background:#ffbd2e; } .wb-dot.green{ background:#28c840; }
.wb-btn{ width:30px; height:30px; border:none; background:transparent; border-radius:999px; display:grid; place-items:center; color:#6b7280; transition:.15s; }
.wb-btn:hover{ background:rgba(17,24,39,.06); }

.wb-addr{ flex:1; height:38px; display:flex; align-items:center; gap:10px; background:#fff; border:1px solid rgba(17,24,39,.12);
  border-radius:999px; padding:0 12px; box-shadow: inset 0 -2px 0 rgba(17,24,39,.03); }
.wb-addr input{ flex:1; border:none; outline:none; background:transparent; color:#111827; font-weight:600; font-size:14px; }
.wb-addr input::placeholder{ color:#9ca3af; }

.wb-canvas{ position:absolute; inset:60px 0 0 0; background:#F4F2FE; display:flex; align-items:center; justify-content:center; }

/* 画布内容卡 */
.wb-card{ position:relative; width:100%; height:100%; background: transparent; border:none; isolation:isolate; }
.wb-badge{
  position:absolute; top:18px; left:18px; display:inline-flex; align-items:center; gap:8px;
  height:30px; padding:0 12px; border-radius:999px; background:#ffffffcc; backdrop-filter:saturate(120%) blur(4px);
  border:1px solid rgba(122,59,255,.18); color:#6A4DFF; font-weight:700; font-size:12px; box-shadow:0 6px 18px rgba(122,59,255,.18); z-index:2;
}

/* 工具条模式窗口（视频 + 工具条） */
.tb-window{ position:absolute; inset:16px; border-radius:24px; padding:1px;
  background: linear-gradient(120deg, rgba(122,59,255,.35), rgba(167,139,250,.25), rgba(122,59,255,.35));
  box-shadow: 0 16px 44px rgba(122,59,255,.18); display:flex; }
.tb-inner{ position:relative; border-radius:24px; background:#fff; overflow:hidden; box-shadow: 0 10px 26px rgba(122,59,255,.12);
  display:flex; flex-direction:column; width:100%; height:100%; }
.tb-screen{ flex:1 1 auto; min-height:0; background:#EDEDF4; }
.tb-screen img{ width:100%; height:100%; object-fit:cover; display:block; }

.tb-bar{ background:#2B2F36; color:#fff; border-top:1px solid rgba(255,255,255,0.08); padding:10px; }
.tb-grid{ display:grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 8px; }
.tb-item{ position:relative; height:64px; }
.tb-plate{ position:absolute; inset:0 0 4px 0; bottom:0; height:10px; border-radius:12px; background:#1A1E24; box-shadow: 0 16px 22px rgba(0,0,0,.35), 0 2px 0 rgba(255,255,255,.06) inset; }
.tb-face{ position:relative; z-index:1; width:100%; height:100%; border-radius:14px; border:1px solid rgba(255,255,255,.08);
  box-shadow: 0 10px 16px rgba(0,0,0,.28), 0 0 0 1px rgba(255,255,255,.06) inset, 0 1px 0 rgba(255,255,255,.12) inset;
  background: linear-gradient(180deg, #4A4F58 0%, #2E333A 100%); transition: transform .15s ease, box-shadow .15s ease; }
.tb-face:hover{ transform: translateY(-1px); } .tb-face:active{ transform: translateY(10px); box-shadow: 0 6px 10px rgba(0,0,0,.28); }
.tb-content{ position:relative; z-index:2; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; }
.tb-icon{ display:grid; place-items:center; width:28px; height:28px; border-radius:8px; background:rgba(0,0,0,.2); font-size:14px; }
.tb-label{ font-size:11px; letter-spacing:.02em; opacity:.95; }
.tb-face[data-active="true"]{ outline:2px solid rgba(27,201,142,.35); background: linear-gradient(180deg, #1BC98E 0%, #12A36B 100%); }

@media (max-width: 560px){ .tb-item{ height:56px; } .tb-window{ inset:12px; border-radius:20px; } .tb-inner{ border-radius:20px; } }

/* ===== 视频占位（Eye Gaze） ===== */
.vid-ph{position:absolute;inset:0;display:grid;place-items:center;
  background: linear-gradient(180deg,#0f1116 0%,#1a1f26 100%);
}
.vid-ph-inner{width:min(86%,980px);aspect-ratio:16/9;position:relative;overflow:hidden;
  border-radius:18px;border:1px solid rgba(255,255,255,.08);
  background:linear-gradient(180deg,#0c0f13 0%,#0a0d11 100%);
  box-shadow:0 22px 52px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.08);
}
.vid-ph-play{position:absolute;inset:auto;left:50%;top:50%;
  width:86px;height:86px;border-radius:999px;transform:translate(-50%,-50%);
  background:rgba(255,255,255,.94);display:grid;place-items:center;
  box-shadow:0 16px 36px rgba(0,0,0,.35);
}
.vid-ph-play::after{content:"";display:block;width:0;height:0;
  border-left:26px solid ${PURPLE};border-top:16px solid transparent;border-bottom:16px solid transparent;
  margin-left:6px;
}
.vid-ph-bar{position:absolute;left:0;right:0;bottom:0;height:58px;
  display:flex;align-items:center;gap:12px;padding:0 16px;color:#fff;
  background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.7));
}
.vid-ph-btn{width:34px;height:34px;border-radius:999px;display:grid;place-items:center;
  background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);}
.vid-ph-progress{flex:1;height:6px;border-radius:999px;background:rgba(255,255,255,.25);overflow:hidden}
.vid-ph-progress>span{display:block;width:32%;height:100%;background:${PURPLE};
  box-shadow:0 0 12px rgba(160,135,221,.55);}
.vid-ph-time{font-size:12px;opacity:.92}
`}</style>
    );
}

/* ===================== 工具条（工具按钮演示） ===================== */
function ToolBar() {
    const items = [
        { key: "control", label: "Control", icon: "🎛️" },
        { key: "access",  label: "Access",  icon: "🧑‍🦽" },
        { key: "share",   label: "Share",   icon: "📤" },
        { key: "settings",label: "Settings",icon: "⚙️" },
        { key: "end",     label: "End",     icon: "⛔" },
    ] as const;
    return (
        <div className="tb-bar">
            <div className="tb-grid">
                {items.map(({ key, label, icon }) => (
                    <div key={key} className="tb-item">
                        <span aria-hidden className="tb-plate" />
                        <motion.button
                            type="button"
                            className="tb-face"
                            data-active={key==="access"}
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 10 }}
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        >
                            <div className="tb-content">
                                <span className="tb-icon">{icon}</span>
                                <span className="tb-label">{label}</span>
                            </div>
                        </motion.button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ===================== 浏览器卡（根据模式切换画布内容） ===================== */
function BrowserCard({ mode }: { mode: UIMode }) {
    return (
        <div className="wb-browser">
            <div className="wb-top">
                <div className="wb-traffic"><span className="wb-dot red" /><span className="wb-dot yellow" /><span className="wb-dot green" /></div>
                <button className="wb-btn"><ChevronLeft size={16} /></button>
                <button className="wb-btn"><ChevronRight size={16} /></button>
                <button className="wb-btn"><RefreshCcw size={16} /></button>
                <div className="wb-addr">
                    <Globe size={16} /> <input defaultValue="squidly.com.au/#home-page" readOnly />
                    <Lock size={16} /> <Star size={16} />
                </div>
            </div>

            <div className="wb-canvas">
                <div className="wb-card">
                    {mode === "Eye Gaze" && (
                        <div className="vid-ph" aria-hidden>
                            <div className="vid-ph-inner" role="img" aria-label="Video placeholder">
                                <div className="vid-ph-play" aria-hidden />
                                <div className="vid-ph-bar">
                                    <div className="vid-ph-btn" aria-hidden>▶</div>
                                    <div className="vid-ph-progress"><span /></div>
                                    <div className="vid-ph-time">00:24 / 03:12</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === "Settings" && (
                        <div className="tb-window">
                            <div className="tb-inner">
                                <div className="tb-screen">
                                    <img
                                        src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop"
                                        alt="demo"
                                    />
                                </div>
                                <ToolBar />
                            </div>
                        </div>
                    )}

                    {mode === "Quiz" && (
                        <img
                            alt="demo"
                            src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    )}

                    <span className="wb-badge">
            {mode === "Eye Gaze" ? <Eye size={16}/> : mode === "Settings" ? <SettingsIcon size={16}/> : <HelpCircle size={16}/>}
                        {mode}
          </span>
                </div>
            </div>
        </div>
    );
}

/* ===================== 主 Section（名字保留为 BrowserSection） ===================== */
function BrowserSection() {
    const [mode, setMode] = useState<UIMode>("Settings");

    return (
        <section className="sq-sec">
            <SectionStyles />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: .985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="sq-wrap"
            >
                {/* 头部内容（标题+副标题+chips 同宽对齐） */}
                <div className="sq-head">
                    <div className="sq-title">
                        <h2>AAC, Integrated and Ready-to-Go</h2>
                        <p>Access eye-gaze, switch controls, and more, no extra gear needed.</p>
                    </div>

                    <div className="sq-chips" role="tablist" aria-label="Feature modes">
                        <button
                            role="tab"
                            aria-selected={mode === "Eye Gaze"}
                            onClick={() => setMode("Eye Gaze")}
                            className={`sq-chip ${mode === "Eye Gaze" ? "is-active" : ""}`}
                        >
                            <Eye /> Eye Gaze
                        </button>
                        <button
                            role="tab"
                            aria-selected={mode === "Settings"}
                            onClick={() => setMode("Settings")}
                            className={`sq-chip ${mode === "Settings" ? "is-active" : ""}`}
                        >
                            <SettingsIcon /> Settings
                        </button>
                        <button
                            role="tab"
                            aria-selected={mode === "Quiz"}
                            onClick={() => setMode("Quiz")}
                            className={`sq-chip ${mode === "Quiz" ? "is-active" : ""}`}
                        >
                            <HelpCircle /> Quiz
                        </button>
                    </div>
                </div>

                {/* 浏览器展示卡（与容器左缘对齐） */}
                <BrowserCard mode={mode} />
            </motion.div>
        </section>
    );
}

export default BrowserSection;
export { BrowserSection };
