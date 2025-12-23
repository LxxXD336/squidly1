import React, { useEffect, useMemo, useState } from "react";

type SessionCard = {
  id: string;
  title: string; // 支持 \n
  modalTitle?: string;
  steps?: string[];
  // 图片文件名（放在 src/Photo/ 下）
  imageFileName?: string;
};

const CARDS: SessionCard[] = [
  {
    id: "start-scheduled",
    title: "Joining a\nSquidly\nMeeting",
    modalTitle: "Start a Scheduled Meeting",
    steps: [
      "Tap the Dashboard icon in the menu bar.",
      "Find your scheduled meeting in Recent Sessions.",
      "Tap the red play button to start the meeting.",
    ],
    
    imageFileName: "start-scheduled-meeting.png",
  },
  {
    id: "start-instant",
    title: "Start an\nInstant\nMeeting",
    modalTitle: "Start an Instant Meeting",
    steps: [
      "Tap Host Meeting in the Console to start an instant meeting.",
    ],
    // 👇 改成你 Photo 文件夹里真实存在的图片名（含后缀）
    imageFileName: "start-instant-meeting.png",
  },
  
  {
    id: "webcam-eyegaze",
    title: "Using Squidly\nWebcam Eye-\nGaze",
    modalTitle: "Using Squidly Webcam Eye-Gaze",
    steps: [
      "Tap access in the menu and select calibrate.",
      "To re/calibrate tap calibrate.",
      "Follow the on-screen prompts on the calibration window and carefully follow the guide with your eyes.",
      "Once a calibration is complete you will receive an accuracy score.",
    ],
    // ✅ 改成你 src/Photo 里真实存在的文件名（含后缀）
    imageFileName: "webcam-eye-gaze.png",
  },
  
  {
    id: "calibration",
    title: "Eye-Gaze\nCalibration",
    modalTitle: "Eye-Gaze Calibration",
    steps: [
      "Tap settings in the menu and navigate to host/participant calibration.",
      "Increase or decrease calibration grid size.",
      "Increase or decrease calibration speed.",
      "Change the calibration guide image.",
    ],
    // ✅ 改成你 Photo 文件夹里的真实文件名（大小写 + 后缀必须一致）
    imageFileName: "eye-gaze-calibration.png",
  },
  

  {
    id: "aac-grid",
    title: "Using the AAC\nGrid",
    modalTitle: "Using the AAC Grid",
    steps: [
      "Tap access in the menu and select AAC.",
      "Interact together using the AAC default board, 'voco chat'.",
      "Search for an AAC board.",
      "Tap speak to say the full sentence and clear the sentence.",
    ],
    // ✅ 改成你 Photo 文件夹中的真实文件名
    imageFileName: "using-aac-grid.png",
  },
  
  {
    id: "quiz-assessment",
    title: "Starting a Quiz\nor\nAssessment",
    modalTitle: "Starting a Quiz or Assessment",
    steps: [
      "Tap share in the menu and select quiz.",
      "Select or search for a quiz and begin the quiz together.",
      "Navigate through quiz questions and answers and tap submit when completed.",
      "Receive a quiz score and download an AI summary report once submitted.",
    ],
    // ✅ 改成你 Photo 文件夹中的真实文件名
    imageFileName: "starting-quiz-assessment.png",
  },
  
  {
    id: "settings",
    title: "Settings",
    modalTitle: "Settings",
    steps: [
      "Tap settings in the menu.",
      "Change both host and participant settings.",
      "Adjust speaker, microphone, and video devices.",
      "Modify text-to-speech language, voice, and speed.",
      "Change cursor style, size, and colour.",
      "Enable or disable eye-gaze control.",
      "Adjust session layout, font style, and colour filters.",
      "Use keyboard shortcuts and volume controls.",
      "Modify calibration size, speed, and guide.",
    ],
    // ✅ 改成 Photo 文件夹里的真实文件名（大小写 + 后缀必须一致）
    imageFileName: "settings.png",
  },
  
  {
    id: "accessible-games",
    title: "Accessible\nGames\nand Tools",
    modalTitle: "Accessible Games and Tools",
    steps: [
      "Tap share in the menu and select apps.",
      "Choose from a growing catalogue of accessible games and tools.",
      "Use games and tools designed to keep clients motivated and engaged in therapy and learning sessions.",
    ],
    // ✅ 改成 Photo 文件夹中的真实文件名
    imageFileName: "accessible-games-tools.png",
  },
  

  {
    id: "access-features",
    title: "Access\nFeatures",
    modalTitle: "Access Features",
    steps: [
      "Integrated eye-gaze access — works with any compatible eye-gaze system set to Windows Control.",
      "Switch scanning — supports multiple switch inputs (keyboard: space/backspace).",
      "Touch access — fully touch-responsive interface for tablets or touch-enabled devices.",
      "Browser-based — runs directly in modern web browsers with no software installation required.",
      "Text-to-speech — converts written text into clear, natural, custom speech outputs.",
      "Keyboard and mouse compatibility — works with standard or adaptive input devices for flexible access.",
      "Adjustable interfaces — customisable visual layouts, colour contrast, languages, and pointer dwell times.",
      "Host navigation control — allows the host to navigate the entire session on behalf of the participant.",
    ],
    // ❌ 不提供 imageFileName → 右侧自动显示占位
  },
  {
    id: "meeting-controls",
    title: "Meeting\nControls",
    modalTitle: "Meeting Controls",
    // ❌ 不给 steps → 左侧显示 “Details coming soon”
    imageFileName: "meeting-controls.png",
  },
  
];

// === Same figma tokens ===
const INACTIVE_FILL = "#F3EFFB";
const TEXT_DARK = "#111111";
const SHADOW_FIGMA =
  "0px 4px 10px rgba(0,0,0,0.12), 0px 10px 20px rgba(0,0,0,0.08)";

  function FigmaCardButton({
    title,
    onClick,
  }: {
    title: string;
    onClick?: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          relative z-20
          pointer-events-auto
          flex items-center justify-center text-center font-semibold
          transition-transform duration-150 ease-out
          hover:-translate-y-0.5
        "
        style={{
          width: 218,
          height: 163,
          borderRadius: 20,
          background: "#F3EFFB",
          color: "#111111",
          boxShadow:
            "0px 4px 10px rgba(0,0,0,0.12), 0px 10px 20px rgba(0,0,0,0.08)",
          border: "2px solid transparent",
        }}
      >
        <span
          style={{
            fontSize: 20,
            lineHeight: "26px",
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </span>
      </button>
    );
  }
  

function StepList({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-7">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 text-base font-semibold text-slate-900">
            {i + 1}
          </div>
          <p className="text-[22px] leading-snug font-semibold text-[#0C1240]">
            {s}
          </p>
        </div>
      ))}
    </div>
  );
}

export const ProductSessionFeaturesSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const openCard = useMemo(
    () => CARDS.find((c) => c.id === openId) ?? null,
    [openId]
  );

  // Vite：从 /src/Photo/ 读取图片（Photo 与 subpage 平行）
  const imageSrc = useMemo(() => {
    if (!openCard?.imageFileName) return "";
    try {
      // ✅ 这里保持不改；你只需要改 imageFileName 为真实文件名
      return new URL(`../../Photo/${openCard.imageFileName}`, import.meta.url)
        .href;
    } catch {
      return "";
    }
  }, [openCard]);

  // ESC 关闭
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    if (openId) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId]);

  return (
    <section className="relative w-full overflow-hidden bg-white pb-20">
      {/* 背景柔光：与上面 section 连贯 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-240px] top-[0%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.24),transparent_70%)] blur-3xl" />
        <div className="absolute right-[-220px] top-[10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <h3 className="text-3xl font-semibold text-slate-900">Session Features</h3>

        <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
          {CARDS.map((c) => (
            <FigmaCardButton
              key={c.id}
              title={c.title}
              onClick={() => setOpenId(c.id)}
            />
          ))}
        </div>

        <div className="mt-8">
          <a
            href={`${import.meta.env.BASE_URL}guides/squidly-session-user-guide.pdf`}
            download="Squidly-Session-User-Guide.pdf"
            className="inline-flex items-center gap-2 text-base font-medium text-slate-900 hover:opacity-80"
          >
            <span className="underline underline-offset-4">
              Download full user guide to view
            </span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {/* Modal */}
      {openCard && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpenId(null)}
            aria-label="Close modal"
          />

          {/* panel */}
          <div className="relative mx-4 w-full max-w-5xl rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
            {/* close */}
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 gap-10 p-10 md:grid-cols-2">
              {/* left text */}
              <div>
                <h4 className="text-[44px] font-extrabold leading-tight text-[#0C1240]">
                  {openCard.modalTitle ?? openCard.title.replaceAll("\n", " ")}
                </h4>

                <div className="mt-10">
                  {openCard.steps?.length ? (
                    <StepList steps={openCard.steps} />
                  ) : (
                    <p className="text-lg text-slate-500">
                      (Details coming soon)
                    </p>
                  )}
                </div>
              </div>

              {/* right image */}
              <div className="flex items-center justify-center">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={openCard.modalTitle ?? "Guide image"}
                    className="max-h-[520px] w-full rounded-2xl object-contain"
                  />
                ) : (
                  <div className="flex h-[420px] w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    Image placeholder
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
