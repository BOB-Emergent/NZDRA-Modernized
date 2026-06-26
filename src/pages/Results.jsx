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
    const [acting, setActing] = useState(null);  // {result, mode: 'claim'|'dispute'}
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
        }).then((r) => setRows(r.data));
    };

    useEffect(() => { fetch(); }, [track, cls, from, to, status]);

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16" data-testid="results-page">
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-3">The Times</div>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-white">Race Results</h1>

            {/* Filters */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-6 gap-4" data-testid="results-filters">
                <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    disabled={!!tenant}
                    data-testid="results-filter-track"
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none disabled:opacity-60"
                >
                    {TRACKS.map((t) => <option key={t} value={t}>{t === "all" ? "All Tracks" : t}</option>)}
                </select>
                <select
                    value={cls}
                    onChange={(e) => setCls(e.target.value)}
                    data-testid="results-filter-class"
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                >
                    {CLASSES.map((c) => <option key={c} value={c}>{c === "all" ? "All Classes" : c}</option>)}
                </select>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    data-testid="results-filter-status"
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
                    data-testid="results-filter-from"
                    placeholder="From"
                    className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                />
                <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    data-testid="results-filter-to"
                    placeholder="To"
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
                        data-testid="results-search-input"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white pl-10 pr-4 py-3 text-sm focus:border-nzdra-red focus:outline-none"
                    />
                </div>
            </div>

            <div className="mt-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
                {rows.length} results
            </div>

            <div className="mt-6 border border-zinc-800 overflow-x-auto" data-testid="results-table-wrap">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-900 border-b-2 border-zinc-700 sticky top-0">
                        <tr className="text-left">
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Status</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Date</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Track</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Class</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Driver</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Car</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">Pos</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">ET</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">MPH</th>
                            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">Verify</th>
                        </tr>
                    </thead>
                    <tbody data-testid="results-tbody">
                        {rows.map((r, i) => (
                            <tr key={r.id} className={i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/40"}>
                                <td className="px-4 py-3"><PublicStatusBadge status={r.status} /></td>
                                <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{r.date}</td>
                                <td className="px-4 py-3 text-zinc-300">{r.track}</td>
                                <td className="px-4 py-3 text-amber-500 font-mono text-xs uppercase tracking-wider">{r.race_class}</td>
                                <td className="px-4 py-3 text-white font-medium">{r.driver}</td>
                                <td className="px-4 py-3 text-zinc-400">{r.car}</td>
                                <td className="px-4 py-3 text-right font-mono">{r.position}</td>
                                <td className="px-4 py-3 text-right font-mono text-green-400">{r.et.toFixed(3)}</td>
                                <td className="px-4 py-3 text-right font-mono text-green-400">{r.mph.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                    <button
                                        onClick={() => setActing({ result: r, mode: "claim" })}
                                        data-testid={`claim-btn-${r.id}`}
                                        title="Claim this run"
                                        className="inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-widest border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black transition-colors mr-1"
                                    >
                                        <ShieldCheck size={12} /> Claim
                                    </button>
                                    <button
                                        onClick={() => setActing({ result: r, mode: "dispute" })}
                                        data-testid={`dispute-btn-${r.id}`}
                                        title="Dispute this run"
                                        className="inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-widest border border-nzdra-red/50 text-nzdra-red hover:bg-nzdra-red hover:text-white transition-colors"
                                    >
                                        <AlertTriangle size={12} /> Dispute
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr><td colSpan={10} className="px-4 py-8 text-center text-zinc-500">No results.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {acting && (
                <ClaimDisputeModal
                    result={acting.result}
                    mode={acting.mode}
                    onClose={(refresh) => { setActing(null); if (refresh) fetch(); }}
                />
            )}
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
        <span
            data-testid={`status-${status || "pending"}`}
            className={`inline-block px-2 py-0.5 border text-[10px] font-mono uppercase tracking-widest ${styles[status] || styles.pending}`}
        >
            {status || "pending"}
        </span>
    );
}

function ClaimDisputeModal({ result, mode, onClose }) {
    const [name, setName] = useState("");
    const [carNumber, setCarNumber] = useState("");
    const [contact, setContact] = useState("");
    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const isDispute = mode === "dispute";

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            if (isDispute) {
                await api.post(`/results/${result.id}/dispute`, {
                    reason: note, claimant_name: name, contact, car_number: carNumber,
                });
            } else {
                await api.post(`/results/${result.id}/claim`, {
                    car_number: carNumber, claimant_name: name, contact, note,
                });
            }
            setDone(true);
            setTimeout(() => onClose(true), 1100);
        } finally { setBusy(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => onClose(false)} data-testid="claim-dispute-modal">
            <div className="bg-zinc-900 border border-zinc-700 max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display text-xl uppercase tracking-tight text-white flex items-center gap-2">
                        {isDispute ? <AlertTriangle className="text-nzdra-red" size={20} /> : <ShieldCheck className="text-green-400" size={20} />}
                        {isDispute ? "Dispute Run" : "Claim Run"}
                    </h4>
                    <button onClick={() => onClose(false)} className="text-zinc-400 hover:text-white text-2xl leading-none" data-testid="cd-close">×</button>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-3 mb-4 text-xs">
                    <div className="font-mono text-amber-500 uppercase tracking-widest">{result.race_class} · {result.track} · {result.date}</div>
                    <div className="text-white mt-1">{result.driver}{result.car ? ` · ${result.car}` : ""}</div>
                    <div className="font-mono text-green-400 mt-1">ET {result.et.toFixed(3)} · {result.mph.toFixed(2)} MPH</div>
                </div>

                {done ? (
                    <div className="text-center py-6">
                        <div className="text-green-400 font-mono uppercase tracking-widest text-sm">✓ Submitted</div>
                        <div className="text-xs text-zinc-400 mt-2">
                            Your {isDispute ? "dispute" : "claim"} has been recorded. Officials will review shortly.
                        </div>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-3">
                        <p className="text-xs text-zinc-400">
                            {isDispute
                                ? "Tell officials why this run is wrong (lane mix-up, wrong driver, wrong car number, etc.). The run will be flagged for review."
                                : "Confirm this run is yours. Officials will reconcile any conflicts and finalise it in your logbook."}
                        </p>
                        <CdField label="Your name" value={name} onChange={setName} tid="cd-name" required />
                        <CdField label="Car #" value={carNumber} onChange={setCarNumber} tid="cd-cn" />
                        <CdField label="Contact (email or phone)" value={contact} onChange={setContact} tid="cd-contact" />
                        <div>
                            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                                {isDispute ? "What's wrong?" : "Note (optional)"}
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                required={isDispute}
                                rows={3}
                                data-testid="cd-note"
                                className="mt-1 w-full bg-zinc-950 border border-zinc-700 text-white px-3 py-2 text-sm focus:border-nzdra-red focus:outline-none"
                            />
                        </div>
                        <button
                            disabled={busy}
                            type="submit"
                            data-testid="cd-submit"
                            className={`w-full py-2.5 text-sm uppercase tracking-widest font-semibold active:scale-95 transition-all disabled:opacity-50 ${
                                isDispute ? "bg-nzdra-red hover:bg-nzdra-redDark text-white" : "bg-green-500 hover:bg-green-400 text-black"
                            }`}
                        >
                            {busy ? "Sending…" : isDispute ? "Submit Dispute" : "Submit Claim"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function CdField({ label, value, onChange, tid, required }) {
    return (
        <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{label}{required && " *"}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                data-testid={tid}
                className="mt-1 w-full bg-zinc-950 border border-zinc-700 text-white px-3 py-2 text-sm focus:border-nzdra-red focus:outline-none"
            />
        </div>
    );
}
