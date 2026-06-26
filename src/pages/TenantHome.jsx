import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar as CalIcon, MapPin, Trophy, Mail } from "lucide-react";
import { useTenant } from "../lib/tenant";
import { api } from "../lib/api";

export default function TenantHome() {
    const { tenant, loading } = useTenant();
    const [events, setEvents] = useState([]);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!tenant) return;
        const today = new Date().toISOString().slice(0, 10);
        api.get("/events", { params: { track: tenant.track, from_date: today } }).then((r) => setEvents(r.data.slice(0, 6)));
        api.get("/results", { params: { track: tenant.track, limit: 8 } }).then((r) => setResults(r.data));
    }, [tenant]);

    if (loading) return <div className="p-16 text-zinc-400">Loading tenant…</div>;
    if (!tenant) return <div className="p-16 text-zinc-400">Tenant not found.</div>;

    const primary = tenant.brand?.primary_color || "#dc2626";
    const accent = tenant.brand?.accent_color || "#0a0a0a";

    return (
        <div data-testid={`tenant-home-${tenant.slug}`}>
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-x-0 top-0 h-2" style={{ background: primary }} />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, ${primary} 0, ${primary} 2px, transparent 2px, transparent 14px)`,
                    }}
                />
                <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="h-px w-10" style={{ background: primary }} />
                        <span className="font-mono text-xs uppercase tracking-[0.4em]" style={{ color: primary }}>
                            White-label · NZDRA Franchise
                        </span>
                    </motion.div>

                    <div className="flex items-center gap-5 mb-8">
                        {tenant.brand?.logo_url ? (
                            <img src={tenant.brand.logo_url} alt={tenant.name} className="h-16 object-contain" />
                        ) : (
                            <div
                                className="font-display text-4xl md:text-5xl uppercase px-4 py-2 leading-none"
                                style={{ background: primary, color: accent === "#0a0a0a" ? "#0a0a0a" : "#ffffff" }}
                            >
                                {tenant.name.split(" ").map((w) => w[0]).slice(0, 3).join("")}
                            </div>
                        )}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="font-display text-4xl sm:text-5xl lg:text-7xl uppercase tracking-tighter leading-[0.95] text-white"
                        >
                            {tenant.name}
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-lg text-zinc-300 max-w-2xl leading-relaxed"
                    >
                        {tenant.hero_copy}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <Link
                            to={`/t/${tenant.slug}/calendar`}
                            data-testid="tenant-cta-calendar"
                            className="group inline-flex items-center gap-3 px-7 py-4 font-semibold uppercase tracking-wider active:scale-95 transition-all"
                            style={{ background: primary, color: accent === "#0a0a0a" ? "#0a0a0a" : "#ffffff" }}
                        >
                            View Race Calendar
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to={`/t/${tenant.slug}/results`}
                            data-testid="tenant-cta-results"
                            className="inline-flex items-center gap-3 border border-white/30 text-white px-7 py-4 font-semibold uppercase tracking-wider hover:bg-white hover:text-black active:scale-95 transition-all"
                        >
                            Race Results
                        </Link>
                        <Link
                            to="/"
                            data-testid="tenant-back-to-central"
                            className="ml-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-white"
                        >
                            ← NZDRA Central Hub
                        </Link>
                    </motion.div>

                    <div className="mt-12 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        {tenant.tagline}
                    </div>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 grid lg:grid-cols-2 gap-12">
                <div>
                    <div className="flex items-end justify-between mb-6">
                        <h2 className="font-display text-3xl uppercase tracking-tight text-white flex items-center gap-2">
                            <CalIcon size={22} style={{ color: primary }} /> Coming Up
                        </h2>
                        <Link to={`/t/${tenant.slug}/calendar`} className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white">
                            Full calendar →
                        </Link>
                    </div>
                    <div className="space-y-2" data-testid="tenant-upcoming">
                        {events.length === 0 && <div className="text-zinc-500 text-sm">No upcoming events.</div>}
                        {events.map((e) => (
                            <div key={e.id} className="bg-zinc-900 border-l-4 px-5 py-3 flex items-center gap-4" style={{ borderLeftColor: primary }}>
                                <div className="font-display text-2xl text-white uppercase leading-tight min-w-[90px]">
                                    {new Date(e.date).toLocaleDateString("en-NZ", { day: "2-digit", month: "short" }).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="text-white">{e.title}</div>
                                    <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">{e.track}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-end justify-between mb-6">
                        <h2 className="font-display text-3xl uppercase tracking-tight text-white flex items-center gap-2">
                            <Trophy size={22} style={{ color: primary }} /> Latest Times
                        </h2>
                        <Link to={`/t/${tenant.slug}/results`} className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white">
                            All results →
                        </Link>
                    </div>
                    <div className="border border-zinc-800 overflow-x-auto">
                        <table className="w-full text-sm" data-testid="tenant-results-table">
                            <thead className="bg-zinc-900 border-b-2 border-zinc-700">
                                <tr className="text-left">
                                    <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Date</th>
                                    <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400">Driver</th>
                                    <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">ET</th>
                                    <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-right">MPH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length === 0 && (
                                    <tr><td colSpan={4} className="px-3 py-6 text-center text-zinc-500">No results yet.</td></tr>
                                )}
                                {results.map((r, i) => (
                                    <tr key={r.id} className={i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/40"}>
                                        <td className="px-3 py-2 font-mono text-xs text-zinc-400">{r.date}</td>
                                        <td className="px-3 py-2 text-white">{r.driver}</td>
                                        <td className="px-3 py-2 text-right font-mono text-green-400">{r.et.toFixed(3)}</td>
                                        <td className="px-3 py-2 text-right font-mono text-green-400">{r.mph.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="border-t border-white/10" style={{ background: primary }}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3" style={{ color: accent === "#0a0a0a" ? "#0a0a0a" : "#ffffff" }}>
                        <MapPin size={18} />
                        <span className="font-mono uppercase tracking-widest text-sm">{tenant.track}, New Zealand</span>
                    </div>
                    {tenant.contact_email && (
                        <a
                            href={`mailto:${tenant.contact_email}`}
                            data-testid="tenant-contact-email"
                            className="flex items-center gap-2 font-mono uppercase tracking-widest text-sm"
                            style={{ color: accent === "#0a0a0a" ? "#0a0a0a" : "#ffffff" }}
                        >
                            <Mail size={16} /> {tenant.contact_email}
                        </a>
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent === "#0a0a0a" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)" }}>
                        Powered by NZDRA Central · Shared data, your brand
                    </span>
                </div>
            </section>
        </div>
    );
}
