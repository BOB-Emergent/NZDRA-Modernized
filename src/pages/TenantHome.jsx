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
        api.get("/events", { params: { track: tenant.track, from_date: today } })
            .then((r) => setEvents(Array.isArray(r.data) ? r.data.slice(0, 6) : []))
            .catch(() => setEvents([]));
        api.get("/results", { params: { track: tenant.track, limit: 8 } })
            .then((r) => setResults(Array.isArray(r.data) ? r.data : []))
            .catch(() => setResults([]));
    }, [tenant]);

    if (loading) return <div className="p-16 text-zinc-400">Loading tenant…</div>;
    if (!tenant) return <div className="p-16 text-zinc-400">Tenant not found.</div>;

    const primary = tenant.brand?.primary_color || "#dc2626";
    const accent = tenant.brand?.accent_color || "#0a0a0a";

    return (
        <div data-testid={`tenant-home-${tenant.slug}`}>
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-x-0 top-0 h-2" style={{ background: primary }} />
                <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-4xl sm:text-5xl lg:text-7xl uppercase tracking-tighter text-white"
                    >
                        {tenant.name}
                    </motion.h1>
                    <p className="mt-6 text-lg text-zinc-300 max-w-2xl">{tenant.hero_copy}</p>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 grid lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="font-display text-3xl uppercase tracking-tight text-white mb-6">Coming Up</h2>
                    <div className="space-y-2">
                        {events.map((e) => (
                            <div key={e.id} className="bg-zinc-900 border-l-4 px-5 py-3" style={{ borderLeftColor: primary }}>
                                <div className="text-white">{e.title}</div>
                            </div>
                        ))}
                        {events.length === 0 && <div className="text-zinc-500 text-sm">No upcoming events.</div>}
                    </div>
                </div>
            </section>
        </div>
    );
}
