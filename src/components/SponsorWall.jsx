import React from "react";
import Marquee from "react-fast-marquee";
import { SPONSORS } from "../lib/sponsors";

export default function SponsorWall({ marquee = false }) {
    if (marquee) {
        return (
            <div className="border-y border-white/10 bg-zinc-900/50 py-6" data-testid="sponsor-marquee">
                <Marquee gradient gradientColor="#09090b" gradientWidth={80} speed={40} pauseOnHover>
                    {SPONSORS.map((s) => (
                        <SponsorTile key={s.name} sponsor={s} className="mx-3" />
                    ))}
                </Marquee>
            </div>
        );
    }

    return (
        <div data-testid="sponsor-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {SPONSORS.map((s) => (
                <SponsorTile key={s.name} sponsor={s} />
            ))}
        </div>
    );
}

function SponsorTile({ sponsor, className = "" }) {
    const [errored, setErrored] = React.useState(false);
    const isText = sponsor.text || !sponsor.url;
    const hasLink = !!sponsor.href && sponsor.href !== "#";
    const Wrapper = hasLink ? "a" : "div";
    const wrapperProps = hasLink
        ? {
              href: sponsor.href,
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": `Visit ${sponsor.name}`,
              title: `Visit ${sponsor.name}`,
          }
        : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`group relative bg-white border border-zinc-200 hover:border-nzdra-red transition-all overflow-hidden flex items-center justify-center ${
                hasLink ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-nzdra-red" : ""
            } ${className}`}
            style={{ width: 180, height: 100 }}
            data-testid={`sponsor-tile-${sponsor.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
        >
            {!isText && !errored ? (
                <img
                    src={sponsor.url}
                    alt={sponsor.name}
                    loading="lazy"
                    onError={() => setErrored(true)}
                    className="absolute inset-0 w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                />
            ) : (
                <div className="flex flex-col items-center justify-center px-3 text-center w-full h-full">
                    <span className="block h-[2px] w-6 bg-nzdra-red mb-2" />
                    <span
                        className="font-display uppercase tracking-tight text-zinc-900 leading-[1.05] group-hover:text-nzdra-red transition-colors"
                        style={{ fontSize: tileFontSize(sponsor.name) }}
                    >
                        {sponsor.name}
                    </span>
                    <span className="block h-[2px] w-6 bg-nzdra-red mt-2" />
                </div>
            )}
        </Wrapper>
    );
}

function tileFontSize(name) {
    const len = name.length;
    if (len <= 14) return "20px";
    if (len <= 22) return "16px";
    if (len <= 30) return "13px";
    return "11px";
}
