import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, ExternalLink, ArrowRight, Globe } from "lucide-react";
import { api } from "../lib/api";

const BG = "https://images.unsplash.com/photo-1749952649447-f60858673570?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxyYWNlJTIwdHJhY2slMjBuaWdodHxlbnwwfHx8fDE3NzkwMDU3Mjh8MA&ixlib=rb-4.1.0&q=85";

const BODY_STYLES = {
    NZDRA: { color: "#dc2626", label: "NZDRA" },
    IHRA: { color: "#0ea5e9", label: "IHRA" },
    ANDRA: { color: "#22c55e", label: "ANDRA" },
    NHRA: { color: "#a855f7", label: "NHRA" },
};

const UNSANCTIONED = { color: "#71717a", label: "Unsanctioned" };

export default function Tracks() {
    const loc = useLocation();
    const mode = loc.pathname.startsWith("/dragcentral") ? "dragcentral" : "nzdra";
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        api.get("/tracks")
            .then((r) => setTracks(Array.isArray(r.data) ? r.data : []))
            .catch(() => setTracks([]));
    }, []);

    return mode === "dragcentral" ? <DragCentralView tracks={tracks} /> : <NZDRAView tracks={tracks} />;
}

function DragCentralView({ tracks = [] }) {
    const [bodyFilter, setBodyFilter] = useState("all");

    const byCountry = useMemo(() => {
        const data = Array.isArray(tracks) ? tracks : [];
        const filtered = bodyFilter === "all"
            ? data
            : data.filter((t) =>
                bodyFilter === "unsanctioned"
                    ? (t.sanctioning_bodies || []).length === 0
                    : (t.sanctioning_bodies || []).includes(bodyFilter),
            );
        const groups = {};
        filtered.forEach((t) => {
            const c = t.country || "—";
            groups[c] = groups[c] || [];
            groups[c].push(t);
        });
        return groups;
    }, [tracks, bodyFilter]);

    const allBodies = useMemo(() => {
        const s = new Set();
        (Array.isArray(tracks) ? tracks : []).forEach((t) => (t.sanctioning_bodies || []).forEach((b) => s.add(b)));
        return Array.from(s).sort();
    }, [tracks]);

    return (
        <div data-testid="tracks-page-dragcentral">
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-amber-400 to-nzdra-red" />
                <div className="absolute inset-0">
                    <img src={BG} alt="" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
                </div>
                <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                    <div className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-400 mb-3 flex items-center gap-2">
                        <Globe size={14} /> DragCentral · Global Directory
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">
                        Every Strip,<br />Every Sanction.
                    </h1>
                    <p className="mt-5 text-zinc-300 max-w-3xl leading-relaxed">
                        DragCentral is the neutral, unbiased directory of drag racing venues. NZDRA, IHRA, ANDRA — every governing body gets equal billing.
                        We surface the strip; the racer chooses the sanction.
                    </p>
                </div>
            </section>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
                <div className="flex flex-wrap items-center gap-2 mb-10" data-testid="dc-body-filter">
                    <FilterChip active={bodyFilter === "all"} onClick={() => setBodyFilter("all")} color="#22d3ee" testid="dc-filter-all">All Bodies</FilterChip>
                    {allBodies.map((b) => (
                        <FilterChip
                            key={b}
                            active={bodyFilter === b}
                            onClick={() => setBodyFilter(b)}
                            color={(BODY_STYLES[b] || UNSANCTIONED).color}
                            testid={`dc-filter-${(b || "").toLowerCase()}`}
                        >
                            {b}
                        </FilterChip>
                    ))}
                    <FilterChip active={bodyFilter === "unsanctioned"} onClick={() => setBodyFilter("unsanctioned")} color={UNSANCTIONED.color} testid="dc-filter-unsanctioned">
                        Unsanctioned
                    </FilterChip>
                </div>

                {Object.keys(byCountry).length === 0 && (
                    <div className="text-zinc-500">No strips match this filter.</div>
                )}
                {Object.entries(byCountry).map(([country, list]) => (
                    <section key={country} className="mb-12" data-testid={`dc-country-${(country || "").toLowerCase()}`}>
                        <h2 className="font-display text-2xl uppercase tracking-tight text-white mb-5 flex items-center gap-3">
                            <span>{countryLabel(country)}</span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{list.length} strips</span>
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {list.map((t) => <TrackCard key={t.slug} track={t} neutral />)}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

function NZDRAView({ tracks = [] }) {
    const [showOthers, setShowOthers] = useState(false);
    const data = Array.isArray(tracks) ? tracks : [];
    const members = data.filter((t) => (t.sanctioning_bodies || []).includes("NZDRA"));
    const others = data.filter((t) => !(t.sanctioning_bodies || []).includes("NZDRA"));

    return (
        <div data-testid="tracks-page-nzdra">
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0">
                    <img src={BG} alt="" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
                </div>
                <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-24">
                    <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-3">NZDRA · Sanctioned Venues</div>
                    <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">Member Tracks</h1>
                    <p className="mt-4 text-zinc-300 max-w-2xl">
                        Strips that compete under NZDRA sanction. For the neutral cross-body directory of every NZ strip — including IHRA and unsanctioned venues — open DragCentral.
                    </p>
                    <Link
                        to="/dragcentral/tracks"
                        data-testid="tracks-go-dragcentral"
                        className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-cyan-400 hover:text-cyan-300"
                    >
                        Open in DragCentral · Global Directory <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="nzdra-member-grid">
                    {members.map((t) => <TrackCard key={t.slug} track={t} />)}
                </div>

                {others.length > 0 && (
                    <div className="mt-12" data-testid="nzdra-other-strips">
                        <button
                            onClick={() => setShowOthers(!showOthers)}
                            data-testid="tracks-toggle-others"
                            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white font-mono"
                        >
                            {showOthers ? "−" : "+"} Other NZ strips (non-NZDRA) · {others.length}
                        </button>
                        {showOthers && (
                            <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {others.map((t) => <TrackCard key={t.slug} track={t} compact />)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function TrackCard({ track, compact = false, neutral = false }) {
    const linkInternal = track.tenant_slug ? `/t/${track.tenant_slug}` : null;
    return (
        <div
            className={`bg-zinc-900 border border-zinc-800 hover:border-zinc-600 ${compact ? "p-4" : "p-6"} transition-colors`}
            data-testid={`track-card-${track.slug}`}
        >
            <div className="flex items-start justify-between gap-3">
                <MapPin className="text-zinc-400" size={compact ? 16 : 20} />
                <BodyBadges bodies={track.sanctioning_bodies || []} slug={track.slug} />
            </div>
            <div className={`${compact ? "mt-2 text-xl" : "mt-4 text-3xl"} font-display uppercase tracking-tight text-white`}>
                {track.name}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-500 mt-1">
                {track.region}{neutral && track.country ? ` · ${track.country}` : ""}
            </div>
            {!compact && <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{track.description}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                {linkInternal && (
                    <Link
                        to={linkInternal}
                        data-testid={`track-link-internal-${track.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-700 text-zinc-200 hover:border-white hover:text-white uppercase tracking-widest"
                    >
                        Branded Site <ArrowRight size={12} />
                    </Link>
                )}
                {track.external_url ? (
                    <a
                        href={track.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`track-link-external-${track.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-700 text-zinc-300 hover:border-white hover:text-white uppercase tracking-widest"
                    >
                        Website <ExternalLink size={12} />
                    </a>
                ) : null}
            </div>
        </div>
    );
}

function BodyBadges({ bodies = [], slug }) {
    const data = Array.isArray(bodies) ? bodies : [];
    if (data.length === 0) {
        return (
            <span
                className="px-2 py-0.5 border text-[9px] font-mono uppercase tracking-widest"
                style={{ borderColor: UNSANCTIONED.color, color: UNSANCTIONED.color }}
                data-testid={`track-badge-unsanctioned-${slug}`}
            >
                {UNSANCTIONED.label}
            </span>
        );
    }
    return (
        <div className="flex flex-wrap gap-1 justify-end">
            {data.map((b) => {
                const s = BODY_STYLES[b] || { color: "#a1a1aa", label: b };
                return (
                    <span
                        key={b}
                        className="px-2 py-0.5 border text-[9px] font-mono uppercase tracking-widest"
                        style={{ borderColor: s.color, color: s.color }}
                        data-testid={`track-badge-${(b || "").toLowerCase()}-${slug}`}
                        title={`${b} sanctioned`}
                    >
                        {s.label}
                    </span>
                );
            })}
        </div>
    );
}

function FilterChip({ active, onClick, color, children, testid }) {
    return (
        <button
            onClick={onClick}
            data-testid={testid}
            className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition-colors ${active ? "text-black" : "hover:bg-white/5"}`}
            style={{
                borderColor: color,
                color: active ? "#0a0a0a" : color,
                background: active ? color : "transparent",
            }}
        >
            {children}
        </button>
    );
}

function countryLabel(code) {
    return { NZ: "New Zealand", AU: "Australia" }[code] || code;
}
