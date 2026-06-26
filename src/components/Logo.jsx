import React from "react";

/**
 * NZDRA wordmark logo — bold typography lockup with checkered-flag accent.
 * Preserves the original red/black/white NZDRA brand identity.
 */
export default function Logo({ size = "md", className = "" }) {
    const sizes = {
        sm: { wrapper: "h-10", flag: "h-10 w-3.5", text: "text-2xl", sub: "text-[9px]" },
        md: { wrapper: "h-16", flag: "h-16 w-5", text: "text-4xl", sub: "text-[11px]" },
        lg: { wrapper: "h-20", flag: "h-20 w-6", text: "text-5xl", sub: "text-[13px]" },
    };
    const s = sizes[size];
    return (
        <div className={`flex items-center gap-3 ${s.wrapper} ${className}`} data-testid="nzdra-logo">
            {/* Vertical checkered flag bar */}
            <div className={`${s.flag} relative overflow-hidden border border-white/20`}>
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className={(Math.floor(i / 2) + (i % 2)) % 2 === 0 ? "bg-white" : "bg-black"} />
                    ))}
                </div>
                <div className="absolute inset-y-0 left-0 w-[3px] bg-nzdra-red" />
            </div>
            <div className="leading-none">
                <div className={`font-display ${s.text} tracking-tight text-white`}>
                    NZ<span className="text-nzdra-red">DRA</span>
                </div>
                <div className={`font-mono ${s.sub} uppercase tracking-[0.25em] text-zinc-500 mt-0.5`}>
                    Drag Racing Assoc.
                </div>
            </div>
        </div>
    );
}
