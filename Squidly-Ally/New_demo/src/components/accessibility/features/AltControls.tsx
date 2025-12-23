"use client";
import React from "react";

export default function AltControls() {
    const [enabled, setEnabled] = React.useState(false);

    React.useEffect(() => {
        const on = localStorage.getItem("acc:alt-tooltips") === "1";
        setEnabled(on);
    }, []);
    React.useEffect(() => {
        localStorage.setItem("acc:alt-tooltips", enabled ? "1" : "0");
        const ev = new CustomEvent("acc:alt-tooltips", { detail: { enabled } });
        window.dispatchEvent(ev);
    }, [enabled]);

    return (
        <div className="acc-card">
            <div className="acc-row">
                <div className="acc-title">Alt tooltip for images</div>
                <button
                    role="switch"
                    aria-checked={enabled}
                    data-on={enabled ? "1" : "0"}
                    className="acc-switch"
                    onClick={() => setEnabled(v => !v)}
                />
            </div>
            <div className="acc-sub">
                Show image <code>alt</code> text as a tooltip; highlight images missing <code>alt</code> with a red dashed outline.
            </div>
        </div>
    );
}
