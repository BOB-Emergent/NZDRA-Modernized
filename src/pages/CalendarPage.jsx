import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useTenant } from "../lib/tenant";
import { Calendar, MapPin } from "lucide-react";

const TRACKS = ["all", "Teretonga", "Masterton", "Meremere", "Tokoroa", "Motueka", "Hamilton"];

export default function CalendarPage() {
    const { tenant } = useTenant();
    const [track, setTrack] = useState(tenant ? tenant.track : "all");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (tenant) setTrack(tenant.track);
    }, [tenant]);

    useEffect(() => {
        api.get("/events", { params: { track: track === "all" ? undefined : track } })
            .then((r) => setEvents(r.data));
    }, [track]);

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16" data-testid="calendar-page">
            <div className="font-mono text-xs uppercase tracking-[0.4em] mb-3" style={{ color: tenant ? "var(--tenant-primary)" : "#dc2626" }}>
                {tenant ? `${tenant.name} \u00b7 Season 2025/26` : "2025/26 Season"}
            </div>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">Race Calendar</h1>
            <p className="mt-4 text-zinc-400 max-w-2xl">
                {tenant
                    ? `${tenant.name} race weekends \u2014 same central NZDRA data, branded for ${tenant.track}.`
                    : "Central calendar shared between NZDRA and DragCentral. Filter by track to see your home strip's race weekends."}
            </p>

            {!tenant && (
                <div className="mt-12 flex flex-wrap gap-2" data-testid="calendar-filters">
                    {TRACKS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTrack(t)}
                            data-testid={`calendar-filter-${t.toLowerCase()}`}
                            className={`px-5 py-2 text-xs uppercase tracking-widest border transition-colors ${
                                track === t
                                    ? "bg-nzdra-red text-white border-nzdra-red"
                                    : "border-zinc-700 text-zinc-400 hover:border-white hover:text-white"
                            }`}
                        >
                            {t === "all" ? "All Tracks" : t}
                        </button>
                    ))}
                </div>
            )}
            {tenant && (
                <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 border" style={{ borderColor: "var(--tenant-primary)", color: "var(--tenant-primary)" }} data-testid="tenant-scope-banner">
                    <MapPin size={14} />
                    <span className="font-mono text-xs uppercase tracking-widest">Scoped to {tenant.track}</span>
                </div>
            )}

            <div className="mt-12 space-y-3" data-testid="calendar-list">
                {events.length === 0 && <div className="text-zinc-500">No events for this filter.</div>}
                {events.map((e) => (
                    <div
                        key={e.id}
                        className="group grid grid-cols-12 gap-4 items-center border border-zinc-800 hover:border-nzdra-red bg-zinc-900/40 px-6 py-5 transition-colors"
                    >
                        <div className="col-span-12 md:col-span-2">
                            <div className="font-display text-3xl text-white uppercase leading-tight">
                                {formatDateRange(e.date, e.end_date)}
                            </div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                                {new Date(e.date).getFullYear()}
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-3 flex items-center gap-2 text-amber-500">
                            <MapPin size={16} />
                            <span className="font-mono text-sm uppercase tracking-widest">{e.track}</span>
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <div className="text-white font-semibold">{e.title}</div>
                            <div className="text-xs text-zinc-500 mt-1">{e.description}</div>
                        </div>
                        <div className="col-span-12 md:col-span-2 flex flex-wrap gap-1 justify-end">
                            {(e.classes || []).slice(0, 2).map((c) => (
                                <span key={c} className="text-[10px] font-mono uppercase tracking-wider border border-zinc-700 text-zinc-400 px-2 py-1">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatDateRange(start, end) {
    const s = new Date(start);
    const sStr = s.toLocaleDateString("en-NZ", { day: "2-digit", month: "short" }).toUpperCase();
    if (!end) return sStr;
    const e = new Date(end);
    const eStr = e.toLocaleDateString("en-NZ", { day: "2-digit", month: "short" }).toUpperCase();
    return `${sStr} \u2013 ${eStr}`;
}
