import React, { useEffect, useMemo, useState } from "react";

type GuideCard = {
  id: string;
  title: string;
  active?: boolean;
  modalTitle?: string;
  steps?: string[];
  imageFileName?: string; // 放在 src/Photo/
};

const CARDS: GuideCard[] = [
  {
    id: "scheduled",
    title: "Start a\nScheduled\nMeeting",
    active: true,
    modalTitle: "Start a Scheduled Meeting",
    steps: [
      "Tap the Dashboard icon in the menu bar.",
      "Find your scheduled meeting in Recent Sessions.",
      "Tap the red play button to start the meeting.",
    ],
    // ✅ 改成你 Photo 文件夹里真实存在的文件名（大小写 + 后缀必须一致）
    imageFileName: "start-scheduled-meeting.png",
  },
  
  {
    id: "instant",
    title: "Start an\nInstant\nMeeting",
    modalTitle: "Start an Instant Meeting",
    steps: [
      "Tap Host Meeting in the Console to start an instant meeting.",
    ],
    // ✅ 改成你 Photo 文件夹里真实存在的文件名（大小写 + 后缀必须一致）
    imageFileName: "start-instant-meeting.png",
  },
  
  {
    id: "share-edit",
    title: "Share & Edit\nMeetings",
    modalTitle: "Share & Edit Meetings",
    steps: [
      "Tap the Details icon.",
      "Copy the secure invite link and meeting details.",
      "Add the meeting to your calendar.",
      "Participants simply join by opening the shared meeting link in their web browser — no download or sign-in is required.",
    ],
    imageFileName: "share-edit-meetings.png",
  },
  
  {
    id: "invite",
    title: "Invite when\nin a\nMeeting",
    modalTitle: "Invite when in a Meeting",
    steps: [
      "Tap control in the menu.",
      "Tap the key icon to copy the meeting ID to your clipboard",
    ],
    imageFileName: "Invite-meeting.png",
  },

  {
    id: "aac",
    title: "Create & Edit\nAAC\nGrid Boards",
    modalTitle: "Create & Edit AAC Grid Boards",
    steps: [
      "Tap on the "+" to create a grid board, or copy or edit an existing one  either your own or from the Squidly public library.",
      "Give your board a topic name, grid size and set it to public or private.",
    ],
    imageFileName: "Invite-meeting.png",
  },
  {
    id: "quiz",
    title: "Create & Edit\nQuizzes",
    modalTitle: "Create & Edit Quizzes",
    steps: [
      "Tap on the "+" to create a quiz, or copy or edit an existing one - either your own or from the Squidly public library.",
    ],
    imageFileName: "Create-quiz.png",
  },
  {
    id: "add-site-members",
    title: "Adding site members\nto your team",
    modalTitle: "Adding site members to your team",
    steps: [
      "Tap the Admin Control icon in the menu bar.",
      "Upload a batch of site members using the template csv; or",
      "Add a site member individually and select their status.",
      "Change number of site members and account details in the Billing Portal.",
    ],
    imageFileName: "adding-site-members.png",
  },
  
  {
    id: "personalise-account",
    title: "Personalise\nyour account",
    modalTitle: "Personalise your account",
    steps: [
      "Tap the Profile icon in the menu bar.",
      "Tap on the image icon and upload a display profile.",
      "Add a display name that will appear during sessions.",
      "Upgrade your account to get more features or usage.",
    ],
    imageFileName: "personalise-your-account.png",
  },
  
];

// === Figma tokens ===
const ACTIVE_FILL = "#A586E3";
const INACTIVE_FILL = "#F3EFFB";
const TEXT_DARK = "#111111";
const SHADOW_FIGMA =
  "0px 4px 10px rgba(0,0,0,0.12), 0px 10px 20px rgba(0,0,0,0.08)";

function FigmaCardButton({
  title,
  active,
  onClick,
}: {
  title: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-20 pointer-events-auto flex items-center justify-center text-center font-semibold transition-transform hover:-translate-y-0.5"
      style={{
        width: 218,
        height: 163,
        borderRadius: 20,
        background: active ? ACTIVE_FILL : INACTIVE_FILL,
        color: active ? "#FFFFFF" : TEXT_DARK,
        boxShadow: SHADOW_FIGMA,
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 font-semibold">
            {i + 1}
          </div>
          <p className="text-[22px] font-semibold text-[#0C1240]">
            {s}
          </p>
        </div>
      ))}
    </div>
  );
}

export const ProductUserGuideSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const openCard = useMemo(
    () => CARDS.find((c) => c.id === openId) ?? null,
    [openId]
  );

  const imageSrc = useMemo(() => {
    if (!openCard?.imageFileName) return "";
    try {
      return new URL(`../../Photo/${openCard.imageFileName}`, import.meta.url)
        .href;
    } catch {
      return "";
    }
  }, [openCard]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    if (openId) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <section className="relative w-full overflow-hidden bg-white py-20">
      {/* 底部白色过渡 */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-white/0 z-10" />

      {/* 背景柔光 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-140px] top-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.30),transparent_70%)] blur-3xl" />
        <div className="absolute left-[-220px] bottom-[-220px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.22),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <h2 className="text-6xl font-semibold text-slate-900">User Guide</h2>

        <p className="mt-4 text-2xl font-semibold text-slate-900">
          Console Features For professionals or Hosts
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
          {CARDS.map((c) => (
            <FigmaCardButton
              key={c.id}
              title={c.title}
              active={c.active}
              onClick={() => setOpenId(c.id)}
            />
          ))}
        </div>

        <div className="mt-8">
          <a
            href={`${import.meta.env.BASE_URL}guides/squidly-console-user-guide.pdf`}
            download="Squidly-Console-User-Guide.pdf"
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpenId(null)}
          />
          <div className="relative mx-4 w-full max-w-5xl rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
            <button
              className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white shadow"
              onClick={() => setOpenId(null)}
            >
              ✕
            </button>

            <div className="grid grid-cols-1 gap-10 p-10 md:grid-cols-2">
              <div>
                <h4 className="text-[44px] font-extrabold text-[#0C1240]">
                  {openCard.modalTitle ??
                    openCard.title.replaceAll("\n", " ")}
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

              <div className="flex items-center justify-center">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt=""
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
