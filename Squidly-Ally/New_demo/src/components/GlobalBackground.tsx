export default function GlobalBackground() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
            {/* 1) 顶部大范围柔和紫 */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(120% 90% at 50% 0%, #F6F0FF 0%, #F2EAFE 45%, #FCFAFF 100%)", // 末端用#FCFAFF，避免死白
                }}
            />
            {/* 2) 中部光斑（位置、强度可按需改） */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(900px 520px at 50% 32%, rgba(122,59,255,0.10), transparent 70%)",
                }}
            />
            {/* 3) 新增：底部轻微紫色光晕，让视野底部不显得突白 */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(140% 80% at 50% 100%, rgba(122,59,255,0.06), transparent 60%)",
                }}
            />
        </div>
    );
}
