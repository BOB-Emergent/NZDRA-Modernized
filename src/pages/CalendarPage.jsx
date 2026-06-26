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
            .then((r) => setEvents(Array.isArray(r.data) ? r.data : []))
            .catch(() => setEvents([]));
    }, [track]);

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16" data-testid="calendar-page">
            <div className="font-mono text-xs uppercase tracking-[0.4em] mb-3" style={{ color: tenant ? "var(--tenant-primary)" : "#dc2626" }}>
                {tenant ? `${tenant.name} · Season 2025/26` : "2025/26 Season"}
            </div>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">Race Calendar</h1>
            <p className="mt-4 text-zinc-400 max-w-2xl">
                {tenant
                    ? `${tenant.name} race weekends — same central NZDRA data, branded for ${tenant.track}.`
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

            <div className="mt-12 space-y-4" data-testid="calendar-list">
                {events.length === 0 && <div className="py-20 text-center text-zinc-500 border border-zinc-800 border-dashed">No events found for this track.</div>}
                {events.map((e) => (
                    <div key={e.id} className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 text-amber-500 font-mono text-xs uppercase tracking-widest mb-2">
                                <MapPin size={14} /> {e.track}
                            </div>
                            <h3 className="font-display text-3xl uppercase tracking-tight text-white group-hover:text-nzdra-red transition-colors">{e.title}</h3>
                            <p className="mt-2 text-zinc-400 text-sm max-w-xl">{e.description}</p>
                        </div>
                        <div className="text-right">
                            <div className="font-display text-5xl text-white uppercase">{new Date(e.date).toLocaleDateString("en-NZ", { day: "2-digit", month: "short" }).toUpperCase()}</div>
                            <div className="font-mono text-xs text-zinc-500 uppercase tracking-[0.2em] mt-1">{new Date(e.date).getFullYear()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
