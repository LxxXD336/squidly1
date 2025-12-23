import React from "react";

export type CursorSize = "small" | "medium" | "large";

export interface CursorSizeControlsProps {
    value: CursorSize;
    onChange: (value: CursorSize) => void;
}

const CursorSizeControls: React.FC<CursorSizeControlsProps> = ({ value, onChange }) => {
    const Item = ({ size, label }: { size: CursorSize; label: string }) => {
        const active = value === size;

        return (
            <button
                type="button"
                onClick={() => onChange(size)}
                aria-pressed={active}
                className={`h-11 rounded-2xl text-[12.5px] font-semibold border transition
          focus:outline-none focus:ring-4 focus:ring-violet-200
          ${
                    active
                        ? "bg-violet-500 text-white border-violet-500 shadow-[0_6px_14px_rgba(139,92,246,.25)]"
                        : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                }`}
                style={{ flex: 1, minWidth: 90 }}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="w-full" role="group" aria-label="Cursor size adjuster">
            <div className="flex items-center justify-between gap-2">
                <Item size="small" label="Small" />
                <Item size="medium" label="Medium" />
                <Item size="large" label="Large" />
            </div>
        </div>
    );
};

export default CursorSizeControls;
