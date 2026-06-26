import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { Navigate } from "react-router-dom";
import { Calendar as CalIcon, Trophy, BookOpen, Newspaper, Users, ClipboardList } from "lucide-react";

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const [tab, setTab] = useState("events");
    const [stats, setStats] = useState({});

    useEffect(() => {
        if (user) api.get("/admin/stats").then((r) => setStats(r.data || {})).catch(() => {});
    }, [user]);

    if (loading) return <div className="p-12 text-zinc-400">Loading…</div>;
    if (!user) return <Navigate to="/login" replace />;

    const tabs = [
        { id: "events", label: "Events", icon: CalIcon, roles: ["nzdra_admin", "local_track_admin"] },
        { id: "results", label: "Results", icon: Trophy, roles: ["nzdra_admin", "track_official"] },
        { id: "verify", label: "Verify Runs", icon: ClipboardList, roles: ["nzdra_admin", "track_official"] },
        { id: "rules", label: "Rules", icon: BookOpen, roles: ["nzdra_admin"] },
        { id: "news", label: "News", icon: Newspaper, roles: ["nzdra_admin"] },
    ].filter((t) => t.roles.includes(user.role));

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12" data-testid="admin-dashboard">
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-nzdra-red mb-3">Command Room</div>
            <div className="flex items-end justify-between flex-wrap gap-4">
                <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tighter text-white">Admin Console</h1>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Logged in as</div>
                    <div className="text-sm text-white font-semibold">{user.name}</div>
                    <div className="font-mono text-[10px] text-amber-500 uppercase tracking-widest">
                        {(user.role || "").replace("_", " ")}{user.track ? ` · ${user.track}` : ""}
                    </div>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: "Events", v: stats.events, i: CalIcon },
                    { label: "Results", v: stats.results, i: Trophy },
                    { label: "Rules", v: stats.rules, i: BookOpen },
                    { label: "News", v: stats.news, i: Newspaper },
                    { label: "Users", v: stats.users, i: Users },
                ].map((s) => (
                    <div key={s.label} className="bg-zinc-900 border border-zinc-800 p-4">
                        <s.i size={16} className="text-nzdra-red" />
                        <div className="mt-2 font-display text-3xl text-white">{s.v ?? "—"}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex gap-1 border-b border-zinc-800">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-5 py-3 text-xs uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                            tab === t.id
                                ? "border-nzdra-red text-white"
                                : "border-transparent text-zinc-400 hover:text-white"
                        }`}
                    >
                        <t.icon size={14} /> {t.label}
                    </button>
                ))}
            </div>

            <div className="mt-8 text-zinc-500">Dashboard modules loading...</div>
        </div>
    );
}
