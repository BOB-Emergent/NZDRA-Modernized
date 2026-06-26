import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useTenant } from "../lib/tenant";
import { Search, ShieldCheck, AlertTriangle } from "lucide-react";

const TRACKS = ["all", "Teretonga", "Masterton", "Meremere", "Tokoroa", "Motueka", "Hamilton"];
const CLASSES = ["all", "Top Doorslammer", "Super Sedan", "Modified", "Super Street",
                 "Junior Dragster", "Top Bike", "Modified Bike", "Stock/Super Stock",
                 "Competition Eliminator"];

export default function Results() {
    const [track, setTrack] = useState("all");
    const [cls, setCls] = useState("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [rows, setRows] = useState([]);
    const [acting, setActing] = useState(null);
    const tenantHook = useTenant();
    const tenant = tenantHook?.tenant || null;

    useEffect(() => {
        if (tenant) setTrack(tenant.track);
    }, [tenant]);

    const fetch = () => {
        api.get("/results", {
            params: {
                track: track === "all" ? undefined : track,
                race_class: cls === "all" ? undefined : cls,
                from_date: from || undefined,
                to_date: to || undefined,
                q: q || undefined,
                status: status === "all" ? undefined : status,
            },
        }).then((r) => setRows(Array.isArray(r.data) ? r.data : []))
          .catch(() => setRows([]));
    };

    useEffect(() => { fetch(); }, [track, cls, from, to, status]);

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16" data-testid="results-page">
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-3">The Times</div>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">Race Results</h1>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-6 gap-4">
                <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    disabled={!!tenant}
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none disabled:opacity-60"
                >
                    {TRACKS.map((t) => <option key={t} value={t}>{t === "all" ? "All Tracks" : t}</option>)}
                </select>
                <select
                    value={cls}
                    onChange={(e) => setCls(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                >
                    {CLASSES.map((c) => <option key={c} value={c}>{c === "all" ? "All Classes" : c}</option>)}
                </select>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                >
                    <option value="all">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="disputed">Disputed</option>
                </select>
                <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                />
                <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                />
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetch()}
                        placeholder="Search driver…"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white pl-10 pr-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                    />
                </div>
            </div>

            <div className="mt-6 border border-zinc-800 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-900 border-b-2 border-zinc-700 sticky top-0">
                        <tr className="text-left">
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Status</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Date</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Track</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Class</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Driver</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">ET</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">MPH</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={r.id} className={i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/40"}>
                                <td className="px-4 py-3"><PublicStatusBadge status={r.status} /></td>
                                <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{r.date}</td>
                                <td className="px-4 py-3 text-zinc-300">{r.track}</td>
                                <td className="px-4 py-3 text-amber-500 font-mono text-xs uppercase tracking-wider">{r.race_class}</td>
                                <td className="px-4 py-3 text-white font-medium">{r.driver}</td>
                                <td className="px-4 py-3 text-right font-mono text-green-400">{(r.et || 0).toFixed(3)}</td>
                                <td className="px-4 py-3 text-right font-mono text-green-400">{(r.mph || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500">No results.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PublicStatusBadge({ status }) {
    const styles = {
        pending: "bg-amber-500/10 text-amber-400 border-amber-500/40",
        verified: "bg-green-500/10 text-green-400 border-green-500/40",
        disputed: "bg-nzdra-red/10 text-nzdra-red border-nzdra-red/40",
        void: "bg-zinc-700/30 text-zinc-400 border-zinc-700",
    };
    return (
        <span className={`inline-block px-2 py-0.5 border text-[10px] font-mono uppercase tracking-widest ${styles[status] || styles.pending}`}>
            {status || "pending"}
        </span>
    );
}
